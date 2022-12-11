// Configs Zone

const configs = {
    database: {
        postgreSQL: {
            user: 'postgres',
            host: '127.0.0.1',
            database: 'sbtvc_dormitory_system_test_database',
            password: 'Non_912108',
            port: 5432,
            // connectionString: string, 
            // ssl: any, 
            // types: any, 
            // statement_timeout: number, 
            // query_timeout: number, 
            // application_name: string, 
            // connectionTimeoutMillis: number,
            // idle_in_transaction_session_timeout: number
        },
        table_Name: 'login_ip',
        column_Name: 'expire_date',
    },
    loop_every: 10, // minute
}


const { Client } = require("pg");

const connection = new Client(configs.database.postgreSQL);

const connect = async () =>{
    connection.connect((err) => {
        if (err) {
        console.log(`[Database] PostgreSQL : Cannot connect to database ERROR : ${err}`);
        } else {
        console.log("[Database] PostgreSQL : Connected");
        }
    });
}

const query = async ({sql,option}) =>{
    return new Promise(async(resolve, reject) =>{
        // no  sql
        if(typeof sql === "undefined"){
            throw new Error('Please specify SQL command');
        }
        else if(typeof sql === "undefined" && typeof option === "object"){
            throw new Error('Please specify SQL command');
        }

        // sql ok
        if(typeof sql === "string"){
            await connection.query(sql,(err, result) =>{
                if(!err){
                    resolve({
                        error: err,
                        result: result,
                    });
                }
                else {
                    console.error(err)
                }
            });
        }
        else if(typeof sql === "string" && typeof option === "object"){
            await connection.query(sql, option, (err, result) =>{
                if(!err){
                    resolve({
                        error: err,
                        result: result,
                    });
                }
                else {
                    console.error(err)
                }
            });
        }
    });
}


(async() =>{
    await connect();
    
    setInterval(async() =>{
        // รับข้อมูลจาก database
        const getData = await query({
            sql: `SELECT * FROM ${configs.database.table_Name}`,
        });
        // เชคถ้าไม่มี error เเละ มีผลลัพท์
        if(!getData.error && getData.result){
            // เชคถ้ามีข้อมูล
            if(getData.result.rows.length !== 0){
                // เเยกข้อมูล
                await getData.result.rows.forEach(async(data) =>{
                    const getDate = new Date().getTime() // วันเวลาตอนนี้เบบตัวเลข
                    // ถ้าเวาลที่บันทึกมีค่าน้อยกว่าเวลาตอนนี้ ให้ทำการลบข้อมูลการบันทึกการล็อกอินออก
                    if(data.expire_date <= getDate){
                        await query({
                            sql: `DELETE FROM ${configs.database.table_Name} WHERE ${configs.database.column_Name}='${data.expire_date}'`,
                        }).then(() =>{
                            console.log(`[Alert]-[${get_date()}] Removed Data => Username: ${data.username}, IP: ${data.ip}`);
                        });
                    }
                    else {
                        // หากยังไม่พบข้อมูลที่จะต้องลบ
                        console.log(`[Log]-[${get_date()}] There is currently no data to be deleted`);
                    }
                });
            }
            else {
                // หากไม่มีข้อมูล
                console.log(`[Log]-[${get_date()}] Data not found!`);
            }
        } 
    }, configs.loop_every * 60000);
})();






const get_date = () =>{
    let date_ob = new Date();
    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);
    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    // current year
    let year = date_ob.getFullYear();
    // current hours
    let hours = date_ob.getHours();
    // current minutes
    let minutes = date_ob.getMinutes();
    // current seconds
    let seconds = date_ob.getSeconds();
    // prints date & time in YYYY-MM-DD HH:MM:SS format
    return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds
}