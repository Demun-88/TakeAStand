require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const organizerRoutes = require('./routes/organizer');
const userRoutes = require('./routes/user');
const cookies = require('cookie-parser');


app.use(cookies());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));



app.use((req,res,next) => {
<<<<<<< HEAD
    res.setHeader("Access-Control-Allow-Origin", 'http://localhost:3000');
    res.setHeader("Access-Control-Allow-Methods", 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
    res.setHeader("Access-Control-Allow-Headers", 'Content-Type,Origin,X-Requested-With,Content-Length,cookie');
    res.setHeader("Access-control-Allow-Credentials", 'true');
=======
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
>>>>>>> dfca3b8810cec0bea67e234f1b686966e1486831
    next();
})





app.use('/organizer',organizerRoutes);
app.use('/user',userRoutes);


app.use((error,req,res,next) => {
    console.log(error);
    const message = error.message;
    error.statusCode = error.statusCode || 500;
    res.status(500).json({
        error: {
            message: message,
            statusCode: 500
        }
    })
});


mongoose.connect(process.env.MONGO_URL)
.then(() => {
    app.listen(process.env.PORT,() => {console.log("Server is running")});
})
.catch(err => {
    console.log(err);
})
