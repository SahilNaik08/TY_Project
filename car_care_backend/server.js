import express from 'express'
import cors from 'cors'
import { connectDB } from './config/database.js'; 
import adminRouter from './routes/adminRoute.js';


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

app.get('/', (req, res) => {
  res.send("Express API working fine")
})

app.listen(port, () => console.log("Server started",port))