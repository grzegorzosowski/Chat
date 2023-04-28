import UserList from '../../components/UserList/UserList'
import ChatWindow from '../../components/ChatWindow/ChatWindow'
import ChatOption from '../../components/ChatOption/ChatOption'
import MessageBox from '../../components/MessageBox/MessageBox'
import styles from '../../styles/Home.module.css'
import { useIsMobile } from '../../features/useIsMobile'
import MobileView from '../../components/MobileView/MobileView'

export default function ChatPage() {
    const isMobile = useIsMobile();
    return (
        isMobile
            ? <MobileView />
            : <div className={styles.parent}>
                <div className={styles.div1} ><UserList></UserList> </div>
                <div className={styles.div2}><ChatWindow></ChatWindow></div>
                <div className={styles.div3}><ChatOption></ChatOption></div>
                <div className={[styles.div4, styles.border].join(' ')}><MessageBox></MessageBox></div>
            </div>
    )
}
