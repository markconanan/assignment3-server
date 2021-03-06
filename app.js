// dependencies
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const session = require('express-session')
require('dotenv').config()

const {
  initializePassport,
  passportSession
} = require('./middleware/auth')

const app = express()
//this connections is for testing
// run the test one by one example...
//npm test activities.test.js
// const dbConn = 'mongodb://localhost/assignment-3-test'

//this connection is for development
// const dbConn = 'mongodb://localhost/assignment-3'
//this connection is for production
const dbConn = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ds257564.mlab.com:57564/assignment-3`



// parse json
app.use(express.json())
app.use(express.urlencoded({
  extended: false
}))
app.use(cookieParser())


app.use(initializePassport)
app.use(passportSession)
// app.use(aclAuthorize)
app.use(cors())
app.use(session({
  secret: "these are not the droids you're looking for",
}))

// mongoose
mongoose.connect(dbConn, (err) => {
  if (err) {
    console.log('Error connecting to database', err)
  } else {
    console.log('Connected to database!')
  }
})

// Use defined routes
app.use('/auth', require('./routes/auth'))
// app.use('/admin', require('./routes/admin'))
app.use('/programs', require('./routes/programs'))
app.use('/activities', require('./routes/activities'))
app.use('/units', require('./routes/units'))
app.use('/users', require('./routes/users'))
app.use('/agelevels', require('./routes/ageLevels'))

app.get('/', (req, res) => {
  res.status(200).send('Bookmark server')
})

const port = process.env.PORT || 3001

const server = app.listen(port, () => console.log(`Listening on port ${port}`))
module.exports = server