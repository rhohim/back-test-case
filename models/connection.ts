import mysql , {Connection} from "mysql2"

function creatConnection(): Connection {
    const db: Connection = mysql.createConnection({
        host : process.env.HOST as string,
        user : process.env.USERDB as string,
        password : process.env.PASSWORD as string,
        database : process.env.DATABASE as string
    })
    
    db.on('error', function(err: mysql.QueryError) {
        if (err.code=== 'PROTOCOL_CONNECTION_LOST'){
            console.error('Connection lost, reconnecting...')
            handleReconnect()
        } else {
            throw err
        }
    })

    return db 
}

function handleReconnect(): Connection {
    const db = creatConnection()

    setInterval(() => {
        db.query('SELECT 1', (err: mysql.QueryError | null) => {
            if (err) {
                console.error('Keep-alive query failed', err)
                handleReconnect()
            } else {
                console.log('Keep-alive query sent');
            }
        })
    }, 1000 * 60 * 60);

    return db
}

let db: Connection = handleReconnect()

export default db