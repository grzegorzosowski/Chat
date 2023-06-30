import Box from '@mui/material/Box';
import GroupChat from './GroupChat';
import User from './User'
import Link from '@mui/material/Link';
import { useEffect, useState } from 'react'
import { useUser } from '../UserProvider';
import { useAppDispatch } from '../hooks';
import { setActiveChat, setGettingChat } from '../features/chats/chatsSlice';
import { useFindChatQuery, useGetMessagesQuery, useFindGroupChatQuery, useGetUsersQuery } from '../features/api/apiSlice';
import { putMessages } from '../features/messages/messagesSlice';
import { Tooltip, Typography } from '@mui/material';
import { FOOTER_HEIGHT } from './Footer';
import { useIsMobile } from '../features/useIsMobile';
import { webSocket } from '../webSocketConfig';

type User = {
  _id: string;
  nick: string;
}

type GroupChat = {
  _id: string;
  chatName: string;
  members: string[];
  membersNick: string[];
}

type ServerMessage = {
  type: string;
  content: Array<string>;
};

export default function UserList(): JSX.Element {
  const user = useUser();
  const ws = webSocket;
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();
  const [users, setUsers] = useState<User[]>([]);
  const [groupChats, setGroupChats] = useState<GroupChat[]>([]);
  const [usersFetched, setUsersFetched] = useState<boolean>(false);
  const [serverData, setServerData] = useState<Array<string> | null>(null);
  const [userLink, setUserLink] = useState<User | null>(null)
  const [groupChatId, setGroupChatId] = useState<string | undefined>(undefined)

  const { data: chatData, error: chatError, isFetching: chatIsLoading } = useFindChatQuery({ id1: user?._id, id2: userLink?._id, nick1: user?.nick, nick2: userLink?.nick }, {
    skip: user == null || userLink == null,
  });
  const { data: messagesData, isFetching: messagesDataIsLoading } = useGetMessagesQuery({ chatID: chatData?._id }, {
    skip: chatData == null,
  });
  const { data: groupChatData, error: groupChatError, isLoading: groupChatIsLoading } = useFindGroupChatQuery({ groupChatID: groupChatId }, {
    skip: user == null || groupChatId == undefined,
  })
  const { data: groupMessagesData, isFetching: groupMessagesDataIsLoading } = useGetMessagesQuery({ chatID: groupChatId }, {
    skip: groupChatData == undefined || groupChatId == null
  });
  const { data: userListData, } = useGetUsersQuery();

  useEffect(() => {
    const getUsers = () => {
      if (userListData) {
        setGroupChats(userListData.groupChats);
        setUsers(userListData.users)
      }
    }

    ws.addEventListener('open', function () {
      ws.send(JSON.stringify('getUsers'))
    });

    if (userListData) {
      if (!usersFetched) {
        getUsers();
        setUsersFetched(true);
      }
    }
  }, [userListData]);

  useEffect(() => {
    if (groupChatId != null && groupChatData && !groupChatIsLoading && !groupChatError && !groupMessagesDataIsLoading) {
      if (groupChatData) {
        const newChat = {
          chatID: groupChatData._id,
          members: groupChatData.members,
          chatName: groupChatData.chatName,
        };
        dispatch(setActiveChat(newChat));
        if (groupMessagesData) {
          dispatch(putMessages(groupMessagesData));
          dispatch(setGettingChat(false));
        }
      }
    }
  }, [groupChatId, groupChatData, groupChatIsLoading, groupChatError, groupMessagesData, groupMessagesDataIsLoading]);

  useEffect(() => {
    if (userLink != null && chatData && !chatIsLoading && !messagesDataIsLoading && !chatError) {
      const newChat = {
        chatID: chatData._id,
        members: chatData.members,
        chatName: chatData.chatName,
      };
      dispatch(setActiveChat(newChat));
      if (messagesData) {
        dispatch(putMessages(messagesData));
        dispatch(setGettingChat(false));
      }
    }
  }, [chatData, chatError, chatIsLoading, messagesData, userLink, messagesDataIsLoading]);

  useEffect(() => {
    const onMessage = (event: MessageEvent<Blob>) => {
      const reader = new FileReader();
      reader.onload = () => {
        const data = reader.result as string;
        const serverData = JSON.parse(data) as ServerMessage
        if (serverData.type === 'loggedUsers') {
          setServerData(serverData.content);
        }
      }
      reader.readAsText(event.data)
    }
    ws.addEventListener('message', onMessage);

    return () => {
      ws.removeEventListener('message', onMessage)
    };
  }, [serverData])


  const userHandleClick = (userLink: User) => {
    setGroupChatId(undefined);
    setUserLink(userLink)
    dispatch(setGettingChat(true));
  }

  const groupChatHandleClick = (groupChat: GroupChat) => {
    setUserLink(null);
    setGroupChatId(groupChat._id)
    dispatch(setGettingChat(true))
  }

  return (
    <Box sx={(theme) => ({
      display: 'flex',
      flexDirection: 'column',
      minHeight: 'inherit',
      height: `calc(100% - ${FOOTER_HEIGHT}px - 20px)`,
      backgroundColor: theme.palette.mode === 'dark' ? theme.palette.secondary.dark : theme.palette.divider,
      padding: '10px',
      borderRadius: isMobile ? '10px' : '0 10px 10px 0',
    })}>
      <Typography variant='body1'>USERS</Typography>
      {users && users.map((user: User) => <Link key={user._id} onClick={() => userHandleClick(user)} underline='none' sx={{ '&:hover': { cursor: 'pointer' } }}>
        <User key={user.nick} user={user} isLogged={serverData?.includes(user._id)}></User>
      </Link>)}
      {groupChats.length > 0 && <Typography variant='body1' gutterBottom>GROUPS</Typography>}
      {groupChats && groupChats.map((groupChat: GroupChat) => <Tooltip key={groupChat._id} title={'Hint'}>
        <Link key={groupChat._id} onClick={() => groupChatHandleClick(groupChat)} underline='none' sx={{ '&:hover': { cursor: 'pointer' } }}>
          <GroupChat groupChat={groupChat} ></GroupChat></Link>
      </Tooltip>)}
    </Box>
  )
}
