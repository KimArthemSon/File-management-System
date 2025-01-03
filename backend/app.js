import express from 'express';
import register from './Routes/Register.js';
import login from './Routes/login.js';
import mysql from './Routes/database.js';
import session from 'express-session';
import user_info from './Routes/User_info.js';
import cors from 'cors';
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: 'your-secret-key',
    resave: false,            
    saveUninitialized: false, 
    cookie: { secure: false }
}))
app.use('/register', register);
app.use('/login', login);
app.use('/user_info', user_info);

app.listen(5000, ()=> console.log("Server listing"));