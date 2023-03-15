import { Router } from "express";
import UserController from '../controllers/userController'
const router = Router();
import passport = require("passport");

router.get("/", (req, res) => {
  res.send("Hello, World!");
  console.log("JEst komunikacja");
});

router.get('/api', UserController.createUser);
router.get('/api/user', loggedIn, function (req, res, next) {
    console.log('Api/user/ req.user: ', req.user)
    res.send(req.user);
});

router.post(
    '/api/login/password',
    passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
     (req, res) => {
        console.log(req.body)
        console.log('Login Success', req.user)
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
    console.log("Funkcja LoggedIN wykonuje się.... req.user: ", req.user)
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

export = router;
