const express = require('express')
const app = express()
const port = 3000
const host = '192.168.36.46'

// cors
const cors = require('cors')
app.use(cors())

// application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

const userRouter = require('./router/user')
app.use('/api', userRouter)

app.listen(port, host, () => {
  console.log('api server running at http://')
})
