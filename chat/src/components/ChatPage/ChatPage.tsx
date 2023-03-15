import React from 'react'
import UserList from '../../components/UserList/UserList'
import ChatWindow from '../../components/ChatWindow/ChatWindow'
import ChatOption from '../../components/ChatOption/ChatOption'
import MessageBox from '../../components/MessageBox/MessageBox'
import styles from '../../styles/Home.module.css'

export default function ChatPage() {
    return (
        <div className={styles.parent}>
            <div className={[styles.div1, styles.border].join(' ')} ><UserList></UserList> </div>
            <div className={[styles.div2, styles.border].join(' ')}><ChatWindow></ChatWindow></div>
            <div className={[styles.div3, styles.border].join(' ')}><ChatOption></ChatOption></div>
            <div className={[styles.div4, styles.border].join(' ')}><MessageBox></MessageBox></div>
        </div>
    )
}
