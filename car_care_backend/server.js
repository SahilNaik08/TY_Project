const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
const adminRouter = require('./routes/adminRoute');
const centerRouter = require('./routes/servCenterRoute');
const upload = require('./middlewares/multer'); 
const path = require("path");
const userRouter = require('./routes/userRoute');



// app config
const app = express()

const port = process.env.PORT || 3000

connectDB();


// midlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use
app.use(cors())

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());
app.use('/uploads', express.static('uploads'));

// api endpoints

app.use('/api/admin',adminRouter)
app.use('/api/service-center',centerRouter)
app.use('/api/user',userRouter)
app.use('/test', (req,res)=>{
console.log('receiving')
})
app.get('/', (req, res) => {
  res.send("Express API working fine")
})

app.listen(port, () => console.log("Server started",port))