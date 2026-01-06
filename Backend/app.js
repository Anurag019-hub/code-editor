import express from 'express';
import morgan from'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import UserRoute from './Routes/User.Routes.js';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());


app.use('/user',UserRoute);

export default app;




