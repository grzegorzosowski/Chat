import { useEffect, useState } from 'react'
import { useUser } from '../../UserProvider';
import { Box, Link, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { UserDto, useGetUserAccountInfoQuery, useSendVerifyEmailAgainMutation } from '../../features/api/apiSlice';
import LoadingCircle from '../LoadingCircle';
import { useIsMobile } from '../../features/useIsMobile';
import { isValidEmailAddress } from '../lib/isValidEmailAddress';

type LoginInfo = {
    lastLogin: {
        timestamp: string,
        ip: string,
    },
    lastFailedLogin: {
        timestamp: string,
        ip: string,
        userAgent: string
    }
}


type TableData = {
    describe: string,
    data: string | undefined
}

export default function ProfileInfo() {
    const user = useUser();
    const isUser = !!user;
    const isMobile = useIsMobile();
    const [loginInfo, setLoginInfo] = useState<LoginInfo>()
    //const [getUserAccInfo] = useGetUserAccountInfoQuery()
    // useEffect(() => {
    //     const fetchData = async () => {
    //         if (!user) {
    //             console.log('asd')
    //         } else {
    //             await getUserAccInfo({ userID: user._id })
    //                 .unwrap()
    //                 .then((res: LoginInfo) => {
    //                     console.log("Odpowiedź: ", res)
    //                     setLoginInfo(res);
    //                 })
    //                 .catch((err) => {
    //                     console.log(err)
    //                 })
    //         }
    //     }
    //     void fetchData();
    // }, [])

    const createData = (describe: string, data: string | undefined) => {
        return {
            describe,
            data
        }
    }

    const rows = [
        createData('Your email: ', user?.email),
        createData('Your nick: ', user?.nick),
        createData('Last login date: ', loginInfo?.lastLogin?.timestamp),
        createData('Last login IP: ', loginInfo?.lastLogin?.ip),
        createData('Last failed login date: ', loginInfo?.lastFailedLogin?.timestamp),
        createData('Last failed login IP: ', loginInfo?.lastFailedLogin?.ip),
        createData('Last failed login UserAgent: ', loginInfo?.lastFailedLogin?.userAgent),
    ]

    return (
        <Box>
            {loginInfo !== undefined
                ? <Box>
                    <InfoTable rows={rows} isVerified={user?.verified} isMobile={isMobile} />
                    {(!user?.verified && isUser) && <VerifyAgainButton userId={user._id} />}
                </Box>
                : <LoadingCircle />
            }

        </Box>
    )
}


const Verified = () => {
    return (
        <Typography variant='subtitle2' sx={{ color: 'green', ml: '20px' }}>VERIFIED</Typography>
    )
}

const NotVerified = () => {
    return (
        <Typography variant='subtitle2' sx={{ color: 'red', ml: '20px' }}>NOT VERIFIED</Typography>
    )
}

const InfoTable = ({ rows, isVerified, isMobile }: { rows: Array<TableData>, isVerified: boolean | undefined, isMobile: boolean }) => {
    return (
        <TableContainer component={Paper} >
            <Table>
                <TableBody>
                    {rows.map((item, index) => (
                        <TableRow key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell sx={{ width: isMobile ? '100px' : '200px' }}>{item.describe}</TableCell>
                            <TableCell ><Box sx={{ display: 'flex' }}>{item.data}{isValidEmailAddress(item?.data) && (isVerified ? <Verified /> : <NotVerified />)}</Box></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

const VerifyAgainButton = ({ userId }: { userId: string }) => {
    const [sendVerifyEmailAgain] = useSendVerifyEmailAgainMutation()
    const handleClick = () => {
        void sendVerifyEmailAgain({ userID: userId })

    }


    return (
        <Box sx={{
            p: '20px',
        }}>
            <Link
                onClick={handleClick}
                sx={{
                    cursor: 'pointer',
                }}
            >
                Send verify email again
            </Link>
        </Box>
    )
}



