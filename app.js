require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const organizerRoutes = require('./routes/organizer');
const userRoutes = require('./routes/user');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
})



app.use('/organizer',organizerRoutes);
app.use('/user',userRoutes);


app.use((error,req,res,next) => {
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
    app.listen(process.env.PORT || 8000,() => {console.log("Server is running")});
})
.catch(err => {
    console.log(err);
})