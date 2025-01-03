import express from 'express';
import mysql from './database.js';
const router = express.Router();

router.post('/', async (req, res) => {
    const { email, pass} = req.body;
    if (!email || !pass) {
        return res.status(400).json({ error: 'email and password are required.' });
    }

    const user_info = await mysql.promise().query(`select user_id,user_type,password from users where email = ?`,email);
  
    if(!user_info[0][0]){
        return res.status(401).json({ error: 'Incorrect email and password' });
    }

    if(pass !== user_info[0][0].password){
        return res.status(401).json({ error: 'Incorrect password' });
    }
    console.log(user_info);
    req.session.user_id = user_info[0][0].user_id;
    req.session.user_type = user_info[0][0].user_type;
    req.session.email = email;
    res.status(201).json({success: "Successfuly Login"});
});


router.get('/logout', (req, res)=>{
   req.session.destroy(err =>{
    if(err){
        console.log("somethig wrong logout");
        res.json({err: "somethig wrong logout"});
        return;
    }
    console.log("success logout");
    res.json({sucess: "success logout"});
   })
})

export default router;