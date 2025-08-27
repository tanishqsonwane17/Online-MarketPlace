require('dotenv').config()
const app = require('./app')
const dbConnection = require('./db/db')
dbConnection()
app.listen(3000, () => {
    console.log('Server is running on port 3000')
})