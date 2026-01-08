import { Router } from 'express';
import { body } from 'express-validator';
import { CreateUserController,LoginUserController,ProfileController } from '../Controllers/User.controllers.js';
import { authUserMiddleware } from '../Middleware/Auth.middleware.js';


const UserRoute = Router();


UserRoute.post('/create',
    body('email').isEmail().withMessage('email must be valid Email ID'),
    body('password').isString().withMessage("Password must a string"),
    body('password').isLength({ min: 6 }).withMessage('Password must be 6 charater long '),
    CreateUserController
);

UserRoute.post('/login',
    body('email').isEmail().withMessage('email must be valid Email ID'),
    body('password').isString().withMessage("Password must a string"),
    LoginUserController
);


UserRoute.get('/profile',
    authUserMiddleware,
    ProfileController
)



export default UserRoute;
