var express = require('express');
var queryRouter = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Question = mongoose.model('Question');
var Test = mongoose.model('Test');


var responseGenerator = require('./../../libs/responsegenerator');
var validator = require('./../../middleware/validate');

var uniqid = require('uniqid');




//for tests
queryRouter.post('/createTest',function(req,res){
  var newTest=new Test({
    _id:uniqid(),
    title:req.body.title,
    testDescription:req.body.testDescription,
    timelimit:req.body.timelimit,
    difficulty:req.body.difficulty
  })
    var questionIdArray=[];
    Question.aggregate([
      {$match:{category:'verbal',difficulty:req.body.difficulty}},
      {$sample:{size:2}},
      {$project:{_id:1}}
    ],function(req,res){

        res.forEach(function(val){
          questionIdArray.push(val._id);
        })
        console.log(questionIdArray);
    })
    Question.aggregate([
      {$match:{category:'logical',difficulty:req.body.difficulty}},
      {$sample:{size:2}},
      {$project:{_id:1}}
    ],function(req,res){

        res.forEach(function(val){
          questionIdArray.push(val._id);
        })
        console.log(questionIdArray);
    })
    Question.aggregate([
      {$match:{category:'quants',difficulty:req.body.difficulty}},
      {$sample:{size:2}},
      {$project:{_id:1}}
    ],function(req,res){

        res.forEach(function(val){
          questionIdArray.push(val._id);
        })
        console.log(questionIdArray);
        newTest.questions=questionIdArray;
        newTest.save(function(err,result){
          if(err){console.log(err);}
          else{
            console.log('saved');
            console.log(result);}
        })
    })
})

queryRouter.get('/viewAllTests',function(req,res){
  Test.find({},function(err,result){
    if(err)console.log(result);
    else{
      console.log(result);
      var response = responseGenerator.generate(true , result , 200, null );
			res.send(response);
    }
  })
})
queryRouter.get('/viewTestByCategory/:category',function(req,res){
  console.log('category recieved '+ req.params.category);
  Test.find({category:req.params.category},{title:1},function(err,result){
    if(err)console.log(err);
    else{
      var response = responseGenerator.generate(true , result , 200, null );
			res.send(response);
    }
  })
})

queryRouter.get('/viewTest/:testId',function(req,res){
  Test.findOne({_id:req.params.testId},function(err,result){
    if(err)console.log(result);
    else{
      Question.find({'_id':{"$in":result.questions}},{question:1,options:1},function(err,questions){
        if(err)console.log('err'+err);
        else{
          console.log(questions);
          result.questions=[];
          result.questions=questions;
          console.log(result);
          var response = responseGenerator.generate(true , result , 200, null );
          res.send(response);
        }
      })
      console.log(result);
    }
  })
})


queryRouter.post('/updateTest/:testId',function(req,res){
  req.body.questions=req.body.questions.split(",");
  var update=req.body;

  Test.findOneAndUpdate({_id:req.params.testId},update,function(err,result){
    if(err)console.log(result);
    else{


       //check if it can be done through mongodb query
       var response = responseGenerator.generate(true , result , 200, null );
       res.send(response);
    }
  })
})

queryRouter.get('/deleteTest/:testId',function(req,res){
  Test.remove({_id:req.params.testId},function(err,result){
    if(err)console.log(result);
    else{
      console.log(result);
    }
  })
})

//for Questions
queryRouter.post('/question',function(req,res){

  var question=new Question({
    _id:uniqid(),
    question:req.body.question,
    category:req.body.category,
    difficulty:req.body.difficulty
  })
  var options=req.body.options
  options=options.split(",");

  question.options=options;
  question.save(function(err,result){
    if(err){
      console.log(err);
    }
    else{
      console.log(result);
    }
  })
})

queryRouter.get('/viewAllQuestions/:category',function(req,res){
  Question.find({category:req.params.category},function(err,result){
    if(err)console.log(result);
    else{
      console.log(result);
    }
  })
})
queryRouter.get('/viewQuestion/:questionId',function(req,res){
  Question.find({_id:req.params.questionId},function(err,result){
    if(err)console.log(result);
    else{
      console.log(result);
    }
  })
})
queryRouter.post('/updateQuestion/:questionId',function(req,res){
  var update=req.body;
  Question.findOneAndUpdate({_id:req.params.questionId},update,function(err,result){
    if(err)console.log(result);
    else{
      console.log(result);
    }
  })
})
queryRouter.get('/deleteQuestion/:questionId',function(req,res){
  Question.remove({_id:req.params.questionId},function(err,result){
    if(err)console.log(result);
    else{
      console.log(result);
    }
  })
})
module.exports=queryRouter;
