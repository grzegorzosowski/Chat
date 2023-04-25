# Chat application based on WebSocket and Redux

Hi, I'm Grzegorz,
I made this app to learn and practice Redux toolkit and WebSocket protocol.

## Project description

Project was made as small chat app for internal use.
Website has only two pages: login page and chat page.

### ⚆ Login page

<ul>
  <li> Sign in form</li>
  <li> Sign up modal</li>
</ul>

### ⚆ Chat page

<ul>
  <li>Users list - logged user can see list of every users of this app and list of group chats where occurs as member</li>
  <li>Message textarea - after chosing user by click on them, logged user can write message inside this area and send it by press Enter</li>
  <li>Messages window - when chat has been activated by clicking on user/group name, messages are displayed in this area</li>
  <li>Options list - currently contains two options: creating new group chat and changing nick of logged user</li>
</ul>

## To run project

1. Clone repository
2. Go to project directory:
   1. Setup project using command `npm install`
3. Run app using command `npm start`. Project will be available on `http://localhost:3000/`

To see every feature of website,  you should create at least 3 users. First account is yours, second account to single chat and third account to create group chat.
