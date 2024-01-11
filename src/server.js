const database = require('./database/sqlite')
const express  = require('express')
const app      = express()

database()

const PORT = 3333

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))