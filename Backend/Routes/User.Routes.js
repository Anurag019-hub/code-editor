import {Router} from 'express';
import { body } from 'express-validator';
import { CreateUserController } from '../Controllers/User.controllers.js';


const UserRoute =  Router();


UserRoute.post('/create',
    body('email').isEmail().withMessage('email must be valid Email ID'),
    body('password').isString().withMessage("Password must a string"),
    body('password').isLength({min:6}).withMessage('Password must be 6 charater long '),
    CreateUserController);



export default UserRoute;
