const express = require('express');
const router = express.Router();
const { query } = require('../database/postgreSQL/connect.js');
const { get_ip } = require('../utils/get_Ip.js');

router.get('/dorm/home', async(req, res) =>{
    const checkIP = await query({
        sql: `SELECT * FROM login_ip WHERE ip='${await get_ip(req)}'`,
    });

    if(checkIP.rows.length == 0){
        res.redirect("/dorm/login");
    }
    else {
        res.render("index",{
            title: "HOME",
        });
    }
});
module.exports= router;