const express = require('express');
const router = express.Router();
const { query } = require('../database/postgreSQL/connect.js');
const { connection } = require("../database/postgreSQL/connect.js")
const bodyParser = require('body-parser');
const urlencoded = bodyParser.urlencoded({ extended: true });
const { get_ip } = require("../utils/get_Ip.js");
const { get_date } = require("../utils/get_Date.js");

router.get('/dorm/login', async(req, res) =>{
    //ถ้ามีประวัติการล็อกอิน ให้เข้า Home ได้เลย
    const checkIP = await query({
        sql: `SELECT * FROM login_ip WHERE ip='${await get_ip(req)}'`,
    });
    if(checkIP.rows.length !== 0){
        return res.redirect("/dorm/home");
    }
    else {
        // ถ้าไม่มีให้ไปหน้า login
        res.render("login",{
            title: "Login Page",
            loginError: null,
        });
    }
});


router.post('/dorm/login', urlencoded, async(req, res) =>{
    const { username, password } = req.body ?? {};

    const getUserData = await query({
        sql: `SELECT * FROM student_users WHERE username='${username}'`,
    });
    // เช็ค username
    if(getUserData.rows == 0){
        res.render('login',{
            title: "Login Page",
            loginError: "โปรดใส่ Username ให้ถูกต้องด้วยน่ะ",
        });
    } // ถ้ามี username อยู่จริง
    else {
        // เช็ค password
        if(getUserData.rows[0].userpassword === password){
            // ผ่าน
            await query({
                sql: `INSERT INTO login_ip(ip,username,expire_date) VALUES('${await get_ip(req)}','${username}','${new Date().setDate(new Date().getDate() + 1)}')`,
            });
            setTimeout(() => res.redirect("/dorm/home"), 2 * 1000);
        }
        else{// password ไม่ตรง
            res.render('login',{
                title: "Login Page",
                loginError: "โปรดใส่ Password ให้ถูกต้องด้วยน่ะ",
            });
        }
    }
});

module.exports= router;