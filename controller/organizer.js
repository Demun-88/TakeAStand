const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const Organizer = require("../model/organizer")
const Question = require("../model/question");
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

exports.postSignup = (req,res,next) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        const error = new Error('Validation Error');
        error.statusCode = 422;
        next(error);
    }
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
    const confPassword = req.body.confirmPassword;
    if(password !== confPassword) {
        const error = new Error('Validation Error(confirm password)');
        error.statusCode = 422;
        next(error);
    }
    Organizer.findOne({email:email})
    .then(oldUser => {
        if(oldUser) {
            const error = new Error('User already found');
            error.statusCode = 401;
            next(error);
            return res.status(401).json({
                error: "user already exists"
            })
        }
        return bcrypt.hash(password,12);
    })
    .then(hashedPassword => {
        const newOrganizer = new Organizer({
            name: name,
            email: email,
            phone: phone,
            password: hashedPassword
        });
        return newOrganizer.save();
    })
    .then(newOrganizer => {
        const token = jwt.sign({
            id:newOrganizer._id.toString(),
            email: newOrganizer.email
        },process.env.SECRET_KEY,{
            expiresIn: '1h'
        })
        res.cookie('jwtToken', token,{
            expiresIn:new Date(Date.now()+2*3600000),
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });
        res.status(200).json({
            token,
            id: newOrganizer._id.toString(),
            name: newOrganizer.name,
            email: newOrganizer.email,
            phone: newOrganizer.phone
        });
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.postLogin = (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;
    Organizer.findOne({email: email})
    .then( organizer => {
        if(!organizer) {
            const error = new Error('User does not exists');
            error.statusCode = 404;
            next(error);
        }
        const userPassword = organizer.password;
        loaded_user = organizer;
        return bcrypt.compare(password,userPassword)
    })
    .then( isEqual => {
        if(!isEqual) {
            const error = new Error('Authorization failed');
            error.statusCode = 401;
            next(error);
        }
        const token = jwt.sign({
            id:loaded_user._id.toString(),
            email: loaded_user.email
        },process.env.SECRET_KEY,{
            expiresIn: '1h'
        })
        
        res.cookie('jwtToken', token,{
            expiresIn:new Date(Date.now()+2*3600000),
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });
        res.status(200).json({
            token,
            id: loaded_user._id.toString(),
            name: loaded_user.name,
            email: loaded_user.email,
            phone: loaded_user.phone
        });
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.getLogout = (req,res,next) => {
    if(!req.isAuth) {
        const error = new Error("Authentication failed");
        error.statusCode = 401;
        return next(error);
    }
    res.clearCookie('jwtToken');
    res.status(200).json({
        message: 'Logged out'
    })
}

exports.updateAccount = (req,res,next) => {
    if(!req.isAuth) {
        const error = new Error("Authentication failed");
        error.statusCode = 401;
        return next(error);
    }
    const userId = new ObjectId(req.id);
    const name = req.body.name;
    const phone = req.body.phone;
    Organizer.findById(userId)
    .then(user => {
        if(!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            return next(error);
        }
        user.name = name;
        user.phone = phone;
        return user.save();
    })
    .then(updatedUser => {
        res.status(201).json({
            id:updatedUser._id.toString(),
            name:updatedUser.name,
            email:updatedUser.email,
            phone:updatedUser.phone
        })
    })
    .catch(error => {
        next(error);
    })
}

exports.deleteAccount = (req,res,next) => {
    if(!req.isAuth) {
        const error = new Error("Authentication failed");
        error.statusCode = 401;
        return next(error);
    }
    const userId = new ObjectId(req.id);
    Organizer.findByIdAndDelete(userId)
    .then(user => {
        if(!user) {
            const error = new Error("Error while deleting account");
            error.statusCode = 409;
            return next(error);
        }
        console.log(user);
        res.status(200).json({
            message:"Deleted"
        });
    })
    .catch(err => {
        next(err);
    })
}

exports.getQuestion = (req,res,next) => {
    if(!req.isAuth) {
        const error = new Error("Authentication failed");
        error.statusCode = 401;
        next(error);
    }
    const userId = new ObjectId(req.id);
    Organizer.findById(userId).populate('questions')
    .then( user => {
        if(!user) {
            const error = new Error('User does not exists');
            error.statusCode = 404;
            next(error);
        }
        res.status(200).json({
            questions:user.questions
        });
    })
    .catch(err => {
        next(err);
    })
}

exports.addQuestion = (req,res,next) => {
    if(!req.isAuth) {
        const error = new Error("Authentication failed");
        error.statusCode = 401;
        next(error);
    }
    const description = req.body.description;
    const optionOne = req.body.optionOne;
    const optionTwo = req.body.optionTwo;
    const userId = new ObjectId(req.id);
    Organizer.findById(userId)
    .then( user => {
        if(!user) {
            const error = new Error('User does not exists');
            error.statusCode = 404;
            next(error);
        }
        loaded_user = user;
        const newQuestion = Question({
            description: description,
            optionOne: {
                statement: optionOne,
                count:0
            },
            optionTwo: {
                statement: optionTwo,
                count:0
            }
        });
        return newQuestion.save();
    })
    .then( savedQuestion => {
        loaded_question = savedQuestion;
        loaded_user.questions.push(savedQuestion._id);
        return loaded_user.save();
    })
    .then((updatedUser) => {
        res.status(200).json({
            question:loaded_question
        });
    })
    .catch(err => {
        next(err);
    })
}

exports.updateQuestion = (req,res,next) => {
    if(!req.isAuth) {
        const error = new Error('Authentication failed');
        error.statusCode = 404;
        return next(error);
    }
    const description = req.body.description;
    const optionOne = req.body.optionOne;
    const optionTwo = req.body.optionTwo;
    const QuestionId = new ObjectId(req.body.id);
    const userId = new ObjectId(req.id);
    Question.findById(QuestionId)
    .then(question => {
        if(!question) {
            const error = new Error("Question not found");
            error.statusCode = 404;
            return next(error);
        }
        question.description = description;
        question.optionOne.statement = optionOne;
        question.optionTwo.statement = optionTwo;
        question.optionOne.count = 0;
        question.optionTwo.count = 0;
        return question.save();
    })
    .then(updatedQuestion => {
        return Organizer.findById(userId).populate('questions')
    })
    .then(updatedOrganizer => {
        res.status(201).json({
            id: updatedOrganizer._id.toString(),
            email: updatedOrganizer.email,
            name: updatedOrganizer.name,
            questions: updatedOrganizer.questions
        })
    })
    .catch(err => {
        next(err);
    })

}

exports.deleteQuestion = (req,res,next) => {
    if(!req.isAuth) {
        const error = new Error('Authentication failed');
        error.statusCode = 404;
        return next(error);
    }
    const userId = new ObjectId(req.id);
    const questionId = new ObjectId(req.body.id);
    Question.findByIdAndDelete(questionId)
    .then(question => {
        loaded_question = question;
        return Organizer.findById(userId)
    })
    .then(user => {
        const index = user.questions.indexOf(questionId);
        if(index > -1) {
            user.questions.splice(index,1);
        }
        return user.save();
    })
    .then(updatedUser => {
        res.status(200).json({
            id:updatedUser._id.toString(),
            email:updatedUser.email,
            phone:updatedUser.phone,
            question:loaded_question
        })
    })
    .catch(err => {
        next(err);
    })
}
