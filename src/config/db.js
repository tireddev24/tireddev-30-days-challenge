const {Client} = require('pg')

const con = new Client({
    user: 'postgres',
    host:'localhost',
    password: 'tireddev25',
    database: '30-days-code',
    port:5432,
})

const connectDb = async () => {

    await con.connect().then(() => console.log(`Connected to ${con.host}`))
    
    return
}


module.exports = connectDb