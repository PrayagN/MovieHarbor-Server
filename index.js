require("dotenv").config();
const mongoose =  require("mongoose");
mongoose.set('strictQuery',false)
const CORS = require("cors");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");



const dbConnect = require("./config/config");
const userRoute = require("./routes/userRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");
dbConnect();

// Middleware
app.use(cookieParser());
app.use(CORS())
app.use(express.json())
//
app.get('/',(req,res)=>{
    res.send("APi is running...")
});

app.use('/api/users',userRoute)

// error handling middleware
app.use(errorHandler)
// Start the server
const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
