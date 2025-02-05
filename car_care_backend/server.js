const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
const adminRouter = require('./routes/adminRoute');
const centerRouter = require('./routes/servCenterRoute');



// app config
const app = express()

const port = process.env.PORT || 3000

connectDB();


// midlewares
app.use(express.json())
app.use(cors())



// api endpoints

app.use('/api/admin',adminRouter)
// localhost:3000/api/admin/add-service-center

app.use('/api/service-center',centerRouter)

app.get('/', (req, res) => {
  res.send("Express API working fine")
})

app.listen(port, () => console.log("Server started",port))