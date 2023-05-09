import UserList from './UserList'
import ChatWindow from './ChatWindow'
import ChatOption from './ChatOption'
import MessageBox from './MessageBox'
import styles from '../styles/Home.module.css'
import { useIsMobile } from '../features/useIsMobile'
import MobileView from './MobileView/MobileView'

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
