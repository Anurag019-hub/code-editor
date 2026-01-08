import { Router } from 'express';
import { body } from 'express-validator';
import {
    CreateUserController,
    LoginUserController,
    ProfileController,
    FriendRequestController
} from '../Controllers/User.controllers.js';
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

UserRoute.post('/logout',
    authUserMiddleware,
    LogoutController
)

UserRoute.post("/addfriend",
    authUserMiddleware,
    body('receiverId')
        .isMongoId()
        .withMessage('receiverId must be a valid user id'),
    FriendRequestController
)



export default UserRoute;
