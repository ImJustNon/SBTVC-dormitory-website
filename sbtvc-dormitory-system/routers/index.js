const express = require('express');
const router = express.Router();

router.get('/dorm', (req, res) =>{
    res.redirect("/dorm/home");
});
module.exports= router;