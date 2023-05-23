import { Router } from 'express';
import UserController from '../controllers/userController';
import ChatController from '../controllers/chatController';
import passport from 'passport';
import { UserWithId } from '../db/models/User';

const router = Router();
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
        verified: req.user?.verified,
    };
    res.send(userToSend);
});
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
router.post('/api/login/password', function (req, res, next) {
    passport.authenticate('local', async function (err: any, user: UserWithId, info: any) {
        if (err) {
            return next(err);
        }
        if (!user) {
            //If passport could not authenticate user, 'user' variable is empty
            const userFailedLoginAttempt = await UserController.getUserByEmail(req.body.username);
            if (!userFailedLoginAttempt) {
                return res.sendStatus(401);
            }
            UserController.updateUser(userFailedLoginAttempt.id, {
                lastFailedLogin: {
                    timestamp: new Date().toISOString(),
                    ip: req.socket.remoteAddress ?? '',
                    userAgent: req.headers['user-agent'] ?? '',
                },
            });
            return res.sendStatus(401);
        }

        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            UserController.updateUser(user._id.toString(), {
                lastLogin: {
                    timestamp: new Date().toISOString(),
                    ip: req.socket.remoteAddress ?? '',
                },
            });
            return res.send(user);
        });
    })(req, res, next);
});
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
