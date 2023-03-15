import express from 'express';

const routerAuth = express.Router();

routerAuth.get('/login', function (req, res, next) {console.log("Redirect to /login")});
 
export = routerAuth;
