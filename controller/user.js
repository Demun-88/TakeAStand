const Organizer = require('../model/organizer');
const Question = require('../model/question');
const { ObjectId } = require('mongoose');

exports.getPolls = (req,res,next) => {
    Organizer.find().populate('questions')
    .then(result => {
        const totResult = [];
        result.forEach(data => {
            totResult.push({
                id:data._id.toString(),
                name:data.name,
                email:data.email,
                phone:data.phone,
                questions:data.questions
            })
        })
        res.status(200).json({
            data: totResult
        })
    })
    .catch( err => {
        next(err);
    })
}

exports.postQuestion = (req,res,next) => {
    const choice = req.body.choice;
    const choiceArr = choice.split(',');
    const updateVal = [];
    choiceArr.forEach(choice => {
        if(choice === '0') {
            updateVal.push({
                optionOneCount:1,
                optionTwoCount:0
            })
        }
        else {
            updateVal.push({
                optionOneCount:0,
                optionTwoCount:1
            })
        }
    })
    const useremail = req.body.email;
    Organizer.findOne({email:useremail})
    .then((user) => {
        if(!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            next(error);
        }
        user.questions.forEach(async (question,index) => {
            const qval = await Question.findById(question);
            qval.optionOne.count+=updateVal[index].optionOneCount;
            qval.optionTwo.count+=updateVal[index].optionTwoCount;
            await qval.save();
        })
        res.status(201).json({
            message:"Successfull vote"
        });
    })
    .catch(err => {
        next(err);
    })
}