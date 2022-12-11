const express = require('express');
const router = express.Router();
const { query } = require('../database/postgreSQL/connect.js');
const { connection } = require("../database/postgreSQL/connect.js")
const bodyParser = require('body-parser');
const urlencoded = bodyParser.urlencoded({ extended: true });
const { get_ip } = require("../utils/get_Ip.js");
const { get_date } = require("../utils/get_Date.js");


router.get('/dorm/logout', async(req, res) =>{
    await query({
        sql: `DELETE FROM login_ip WHERE ip='${await get_ip(req)}'`,
    });
    setTimeout(() => res.redirect("/dorm/login"), 2 * 1000);
});
module.exports= router;