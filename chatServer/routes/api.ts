import { Router } from 'express';
import UserController from '../controllers/userController';
import ChatController from '../controllers/chatController';
import { loggedIn, login, logout, sendUser } from '../authentication';

const router = Router();
router.get('/', (_req, res) => {
    res.send('Hello, World!');
});

router.get('/api/user', loggedIn, sendUser);
router.post('/api/login/password', login);
router.post('/api/logout', logout);

router.get('/api/email', UserController.emailToken);
router.post('/api/getUsers', UserController.getUsers);
router.post('/api/getUserNick', UserController.getUserNick);
router.post('/api/createAccount', UserController.createUser);
router.post('/api/changeAccountNick', UserController.changeUserNick);
router.post('/api/findChat', ChatController.findChat);
router.post('/api/findGroupChat', ChatController.findGroupChat);
router.post('/api/getMessages', ChatController.getMessages);
router.post('/api/createChat', ChatController.createChat);
router.post('/api/getUserAccountInfo', UserController.getUserAccountInfo);
router.post('/api/resetPassword', UserController.resetPassword);
router.post('/api/sendVerifyEmailAgain', UserController.sendVerifyEmailAgain);

export = router;
