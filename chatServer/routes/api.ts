import { Router } from 'express';
import UserController from '../controllers/userController';
import ChatController from '../controllers/chatController';
const router = Router();
import passport = require('passport');

router.get('/', (req, res) => {
    res.send('Hello, World!');
    console.log('JEst komunikacja');
});

router.get('/api/createUser', UserController.createUser);
router.get('/api/user', loggedIn, function (req: any, res, next) {
    const userToSend = {
        _id: req.user?._id,
        nick: req.user?.nick,
        email: req.user?.email,
    };
    res.send(userToSend);
});
router.post('/api/getUsers', UserController.getUsers);
router.post('/api/getUserNick', UserController.getUserNick);
router.post('/api/createAccount', UserController.createUser);
router.post('/api/changeAccountNick', UserController.changeUserNick);
router.post('/api/findChat', ChatController.findChat);
router.post('/api/findGroupChat', ChatController.findGroupChat);
router.post('/api/getMessages', ChatController.getMessages);
router.post('/api/createChat', ChatController.createChat);
router.post(
    '/api/login/password',
    passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
    (req, res) => {
        res.sendStatus(200);
    }
);
router.post('/api/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.sendStatus(200);
    });
});

function loggedIn(req: any, res: any, next: any) {
    if (req.user) {
        req.session.user = req.user;
        next();
    } else {
        res.sendStatus(401);
    }
}

export = router;
