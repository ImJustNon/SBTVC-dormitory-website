const express = require('express');
const router = express.Router();
const { query } = require('../database/postgreSQL/connect.js');
const { get_ip } = require('../utils/get_Ip.js');
const bodyParser = require('body-parser');
const urlencoded = bodyParser.urlencoded({ 
    limit: '50mb',
    extended: true,
});


router.get('/dorm/entry-leave-system', async(req, res) =>{
    // เชคว่าเข้าสู่ระบบยัง
    const checkIP = await query({
        sql: `SELECT * FROM login_ip WHERE ip='${await get_ip(req)}'`,
    });
    if(checkIP.rows.length == 0){
        res.redirect("/dorm/login");
    }
    else {
        // ถ้ามีการจดจำการใช้งาน
        const check_Auto_Insert_Form_Data = await query({
            sql: `SELECT * FROM auto_insert_form WHERE student_number='${checkIP.rows[0].username}'`,
        });
        const check_form_data = await query({
            sql: `SELECT * FROM entry_leave_system_form_data WHERE student_id='${checkIP.rows[0].username}'`,
        });

        if(check_form_data.rows.length === 0){ // ถ้าไม่มีการส่งฟอร์ม
            if(check_Auto_Insert_Form_Data.rows.length > 0){ //ถ้ามีข้อมูลล่าสุดอยู่เเล้ว
                return res.render("index",{
                    title: "Entry-Leave-System",
                    form_data: {
                        prefix: check_Auto_Insert_Form_Data.rows[0].prefix,
                        student_name: check_Auto_Insert_Form_Data.rows[0].student_name,
                        student_lastname: check_Auto_Insert_Form_Data.rows[0].student_lastname,
                        dorm_number: check_Auto_Insert_Form_Data.rows[0].dorm_number,
                        room_number: check_Auto_Insert_Form_Data.rows[0].room_number,
                        student_phone_number: check_Auto_Insert_Form_Data.rows[0].student_phone_number,
                        reg_type: check_Auto_Insert_Form_Data.rows[0].reg_type,
                        traveled_by: check_Auto_Insert_Form_Data.rows[0].traveled_by,
                        parent_name: check_Auto_Insert_Form_Data.rows[0].parent_name,
                        parent_lastname: check_Auto_Insert_Form_Data.rows[0].parent_lastname,
                        parent_phone_number: check_Auto_Insert_Form_Data.rows[0].parent_phone_number,
                    },
                });
            }
            else { // ถ้าไม่มีข้อมูลล่าสุด
                return res.render("index",{
                    title: "Entry-Leave-System",
                    form_data: null,
                });
            }
        } 
        else { //ถ้ามีการส่งฟอร์มเเล้ว
            return res.render("index",{
                title: "Authorization-Form",
                form_info: {
                    prefix: check_form_data.rows[0].prefix,
                    name: check_form_data.rows[0].student_name,
                    lastname: check_form_data.rows[0].student_lastname,
                    dorm_number: check_form_data.rows[0].dorm_number,
                    room_number: check_form_data.rows[0].room_number,
                    student_phone_number: check_form_data.rows[0].student_phone_number,
                    reg_type: check_form_data.rows[0].reg_type,
                    leave_date: check_form_data.rows[0].leave_date,
                    leave_time: check_form_data.rows[0].leave_time,
                    leave_for: check_form_data.rows[0].leave_for,
                    come_date: check_form_data.rows[0].come_date,
                    come_time: check_form_data.rows[0].come_time,
                    total_leave_date: check_form_data.rows[0].total_leave_date,
                    traveled_by: check_form_data.rows[0].traveled_by,
                    parent_name: check_form_data.rows[0].parent_name,
                    parent_lastname: check_form_data.rows[0].parent_lastname,
                    parent_phone_number: check_form_data.rows[0].parent_phone_number,
                    filename: check_form_data.rows[0].filename,
                    uploadfile: check_form_data.rows[0].uploadfile,
                    timestamp: check_form_data.rows[0].date,
                },
            });
        }
    }
});

router.post('/dorm/entry-leave-system', urlencoded, async(req, res) =>{
    const sended_form_date = new Date().getTime(); // รับ วัน-เวลา ในรูปเเบบตัวเลข
    const get_User_Data = await query({
        sql: `SELECT * FROM login_ip WHERE ip='${await get_ip(req)}'`,
    });
    const { 
        // ข้อมูลนักเรียน
        prefix,
        name,
        lastname,
        dorm_number,
        room_number,
        student_phone_number,
        // ข้อมูลสาขา
        reg_type,
        // ข้อมูลออกหอพัก
        leave_date,
        leave_time,
        leave_for,
        come_date,
        come_time,
        total_leave_date,
        traveled_by,
        // ข้อมูลผู้ปกครอง
        parent_name,
        parent_lastname,
        parent_phone_number,
        // file
        filename,
        uploadfile,
        
    } = req.body ?? {};
   
    const { back_in } = req.body ?? {};  // ตัวเเปรยืนยันกลับเข้าหอเเล้ว (สำหรับหน้่า Authorization Form)

    if(typeof back_in === "undefined"){ // คือไม่พบตัวเเปรยืนยันกลับเข้าหอ
        await query({
            sql: `INSERT INTO entry_leave_system_form_data
(
prefix,
student_name,
student_lastname,
dorm_number,
room_number,
student_phone_number,
reg_type,
leave_date,
leave_time,
leave_for,
come_date,
come_time,
total_leave_date,
traveled_by,
parent_name,
parent_lastname,
parent_phone_number,
uploadfile,
filename,
date,
student_id,
back_in
)
 VALUES
(
'${prefix}',
'${name}',
'${lastname}',
'${dorm_number}',
'${room_number}',
'${student_phone_number}',
'${reg_type}',
'${leave_date}',
'${leave_time}',
'${leave_for}',
'${come_date}',
'${come_time}',
'${total_leave_date}',
'${traveled_by}',
'${parent_name}',
'${parent_lastname}',
'${parent_phone_number}',
'${uploadfile}',
'${filename}',
'${sended_form_date}',
'${get_User_Data.rows[0].username}',
FALSE
)`,
}).then(async() =>{ //============================================================== บันทึกข้อมูลล่าสุดเพื่อใช้ในการกกรอกข้อมูลอัตโนมัติ ==============================================================
    // บันทึกกรอกข้อมูลอัตโนมัติ
    const get_old_form_data = await query({
        sql: `SELECT * FROM auto_insert_form WHERE student_number='${get_User_Data.rows[0].username}'`,
    });
    // ถ้าพบเเบบฟอร์มเก่า
    if(get_old_form_data.rows.length > 0){
        await query({
            sql: `DELETE FROM auto_insert_form WHERE student_number='${get_User_Data.rows[0].username}'`,
        }).then(async() =>{
            await insert_Auto_Insert_Form({
                prefix: prefix,
                name: name,
                lastname: lastname,
                dorm_number: dorm_number,
                room_number: room_number,
                student_phone_number: student_phone_number,
                reg_type: reg_type,
                traveled_by: traveled_by,
                parent_name: parent_name,
                parent_lastname: parent_lastname,
                parent_phone_number: parent_phone_number,
                student_number: get_User_Data.rows[0].username,
                date: sended_form_date,
            })
        });
    }
    else {
        await insert_Auto_Insert_Form({
            prefix: prefix,
            name: name,
            lastname: lastname,
            dorm_number: dorm_number,
            room_number: room_number,
            student_phone_number: student_phone_number,
            reg_type: reg_type,
            traveled_by: traveled_by,
            parent_name: parent_name,
            parent_lastname: parent_lastname,
            parent_phone_number: parent_phone_number,
            student_number: get_User_Data.rows[0].username,
            date: sended_form_date,
        });
    }   
});
}
else { // ถ้าพบค่าตัวเเปรยืนยันกลับเข้าหอ หรือ ไม่เป็น undified
    await query({ 
        sql: `DELETE FROM entry_leave_system_form_data WHERE student_id='${get_User_Data.rows[0].username}'`,
        // sql: `UPDATE entry_leave_system_form_data SET back_in=TRUE WHERE student_id='${get_User_Data.rows[0].username}'`, 
    });
}

    await res.redirect("/dorm/home");
    
});
module.exports = router;


// ฟังชั้น ส่งข้อมูล จำเเบบฟอม
async function insert_Auto_Insert_Form({prefix, name, lastname, dorm_number, room_number, student_phone_number, reg_type, traveled_by, parent_name, parent_lastname, parent_phone_number, student_number, date}){
await query({
        sql: `INSERT INTO auto_insert_form
(
prefix,
student_name,
student_lastname,
dorm_number,
room_number,
student_phone_number,
reg_type,
traveled_by,
parent_name,
parent_lastname,
parent_phone_number,
student_number,
update_date
) 
 VALUES
(
'${prefix}',
'${name}',
'${lastname}',
'${dorm_number}',
'${room_number}',
'${student_phone_number}',
'${reg_type}',
'${traveled_by}',
'${parent_name}',
'${parent_lastname}',
'${parent_phone_number}',
'${student_number}',
'${date}'
)`,
});
}