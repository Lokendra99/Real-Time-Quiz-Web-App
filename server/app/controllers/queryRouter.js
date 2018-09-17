var express = require('express');
var route = express.Router();
var mongoose = require('mongoose');
var user=require('../models/User');
var User = mongoose.model('User');
var Question = mongoose.model('Question');
var Test = mongoose.model('Test');
var Answer=mongoose.model('Answer');
var socketIO=require('socket.io');


module.exports.controller=function(app,server){

var responseGenerator = require('./../../libs/responsegenerator');
var validator = require('./../../middleware/validate');

var uniqid = require('uniqid');


var io=socketIO(server);



 io.on('connection',function(socket){
   var countdown = 10;
   var totalTime=10;

   console.log('connection of socket.io on server side');

   socket.on('startTimer',function(time){

  var myVar=setInterval(function() {
       if(countdown===0){
        stopFuncn();
       }
       else{
         socket.emit('timer', { countdown: countdown });
         countdown--;
       }
     }, 1000);

     stopFuncn=function(){
       socket.emit('stopTimer',{countdown:countdown});
       clearInterval(myVar);
     }
   });

   socket.on('timeTakenToAnswerEachQuestion',function(){
     socket.emit('timeRecordedForEachQuestion',{timeTaken:totalTime-countdown});
     totalTime=countdown;
   })

  });



//for tests
route.post('/createTest',function(req,respond){
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
            console.log(result);
            respond.send(result);
          }
        })
    })
})

route.get('/viewAllTests',function(req,res){
  Test.find({},{title:1},function(err,result){
    if(err)console.log(result);
    else{
      console.log(result);
      var response = responseGenerator.generate(true , result , 200, null );
			res.send(response);
    }
  })
})
route.get('/viewTestByDifficulty/:difficultyLevel',function(req,res){
  console.log('difficultyLevel recieved '+ req.params.difficultyLevel);
  Test.find({difficulty:req.params.difficultyLevel},{title:1},function(err,result){
    if(err)console.log(err);
    else{
      var response = responseGenerator.generate(true , result , 200, null );
			res.send(response);
    }
  })
})

route.get('/viewTest/:testId',function(req,res){
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


route.post('/updateTest/:testId',function(req,res){
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

route.get('/deleteTest/:testId',function(req,res){
  Test.remove({_id:req.params.testId},function(err,result){
    if(err)console.log(result);
    else{
      console.log(result);
      res.send(result);

    }
  })
})

//for Questions
route.post('/question',function(req,res){

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

route.get('/viewAllQuestions/:category',function(req,res){
  Question.find({category:req.params.category},function(err,result){
    if(err)console.log(result);
    else{
      console.log(result);
    }
  })
})
route.get('/viewQuestion/:questionId',function(req,res){
  Question.find({_id:req.params.questionId},function(err,result){
    if(err)console.log(result);
    else{
      console.log(result);
    }
  })
})
route.post('/updateQuestion/:questionId',function(req,res){
  var update=req.body;
  Question.findOneAndUpdate({_id:req.params.questionId},update,function(err,result){
    if(err)console.log(result);
    else{
      console.log(result);
    }
  })
})
route.get('/deleteQuestion/:questionId',function(req,res){
  Question.remove({_id:req.params.questionId},function(err,result){
    if(err)console.log(result);
    else{
      console.log(result);
    }
  })
})
//for answers
route.post('/answer/:questionId',function(req,res){

  var answer=new Answer({
    _id:uniqid(),
    questionId:req.body.questionId,
    correctOption:req.body.correctOption,
  })

  answer.save(function(err,result){
    if(err){
      console.log(err);
    }
    else{
      console.log(result);
    }
  })
})


route.post('/checkAnswer/:testId',function(req,res){
  //console.log(req.params.testId);
  var questionId=[];
  var correctAnswerArr=req.body;
  //console.log('req body ');
  //console.log(req.body);

  var count=null;

  Test.findOne({_id:req.params.testId},function(err,result){
    if(err){console.log(err);}
    else{
      //console.log(result);
      //console.log(result.questions);
      Answer.find({'questionId':{"$in":result.questions}},{_id:0},function(error,response){
        if(err){console.log(err);}
        else{
          for( var i =0;i<response.length;i++){
            var serverResponse=response[i];
            var userResponse=correctAnswerArr[i];
            if(serverResponse.questionId==userResponse.questionId){
              if(serverResponse.correctOption==userResponse.correctOption){
                count++;
              }
            }
          }
          var finalScore=count/response.length;
          console.log('finalScore '+finalScore);
        }

      })
    }
  })
  //correctAnswerArr.questionId.forEach(function(obj){obj})
   console.log(correctAnswerArr);


console.log('coming');
})
 app.use('/queries',route);
}
