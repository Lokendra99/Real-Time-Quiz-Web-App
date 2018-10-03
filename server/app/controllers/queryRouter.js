var async = require('async');
var express = require('express');
var route = express.Router();
var mongoose = require('mongoose');
var user=require('../models/User');
var User = mongoose.model('User');
var Question = mongoose.model('Question');
var Test = mongoose.model('Test');
var Answer=mongoose.model('Answer');
var socketIO=require('socket.io');
var responseGenerator = require('./../../libs/responsegenerator');
var validator = require('./../../middleware/validate');
var uniqid = require('uniqid');
var PerformanceModel=mongoose.model('PerformanceModel');


module.exports.controller=function(app,server,passport){



var io=socketIO(server);

 io.on('connection',function(socket){
   var countdown = 15;
   var totalTime=15;

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

   socket.on('timeTakenToAnswerEachQuestionAndOtherDetails',function(answerData){
     answerData.timeTakenByEach=totalTime-countdown;
     //async.waterfall()
     Question.findOne({_id:answerData.questionId},function(err,result){
       if(err)console.log(result);
       else{
         console.log(result);

         correctOption=result.answer;
         answerData.correctOption=correctOption;
         console.log('try here');
         console.log(answerData);
         passValues(answerData);
       }
     })

     passValues=function(answerData){

       var newAnswerData=new Answer({
         _id:uniqid(),
         userId:answerData.userId,
         questionId:answerData.questionId,
         testId:answerData.testId,
         correctOption:answerData.correctOption,
         userOption:answerData.userOption,
         timeTakenByEach:answerData.timeTakenByEach
       });
       console.log(newAnswerData);

       newAnswerData.save(function(error,result){
         console.log(result);
         //res.send(result);
       })
     }

     socket.emit('timeRecordedForEachQuestion',{timeTaken:totalTime-countdown});
     totalTime=countdown;
   })

  });

  route.get('/testResult/:userId/:testId',function(req,res){

    var score=0;
    var correctAnswer=0;
    var wrongAnswer=0;
    var timetoCompleteTest=0;

    Answer.aggregate([

      {$match:{userId:req.params.userId,testId:req.params.testId}}

    ],function(request,result){

      console.log('result');
      console.log(result);
      result.forEach(function(val,index,arr){
        console.log('result.timeTakenByEach '+val.timeTakenByEach);
        timetoCompleteTest=timetoCompleteTest+val.timeTakenByEach;
        if(val.correctOption==val.userOption){
          score++;
          correctAnswer++;
        }
        else if(val.correctOption!=val.userOption){
          console.log('wrong answer');
          wrongAnswer++;
        }
      })

      var performanceOfUser=new PerformanceModel({
        userId:req.params.userId,
      })
      var object={testId:req.params.testId,
      score:score,
      totalCorrectAnswers:correctAnswer,
      totalWrongAnswers:wrongAnswer,
      timeTaken:timetoCompleteTest
    }
    var responseToBeSent={
      score:score,
      totalCorrectAnswers:correctAnswer,
      totalWrongAnswers:wrongAnswer,
      timeTaken:timetoCompleteTest
    }
    console.log('object');
    console.log(object);

      performanceOfUser.testsAttempted.push(object)
      performanceOfUser.save(function(error,resultSaved){
        console.log(resultSaved);
      })
      var addTestId=req.params.userId;
      // var updateVal={
      //   testTakenByUser:updateTestId
      // }
      Test.findOne({_id:req.params.testId},function(err,response){
        response.testTakenByUser.push(addTestId);

        Test.findOneAndUpdate({_id:response.id},response,function(err,resultbyHere){
          //console.log(resultByhere);
        })

        // new Test().save(function(err,response){
        //   console.log('response try');
        //   console.log(response);
        // })

        console.log(response);

      })
      res.send(responseGenerator.generate(true , responseToBeSent , 200, null ));



      //console.log('score '+score);
    })
  })



//for tests
route.post('/createTest',function(req,respond){
  var newTest=new Test({
    _id:uniqid(),
    title:req.body.title,
    //testDescription:req.body.testDescription,
    timelimit:req.body.timelimit,
    difficulty:req.body.difficulty,
    totalScore:req.body.totalScore
  })
  var DescriptionArr=req.body.testDescription;
  //DescriptionArr.push(req.body.testDescription);
  //console.log(DescriptionArr);
DescriptionArr=DescriptionArr.split(',');
console.log(DescriptionArr);
    newTest.testDescription=DescriptionArr;

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
    if(err)console.log(err);
    else{
      console.log(result);
      var response = responseGenerator.generate(true , result , 200, null );
			res.send(response);
    }
  })
})
route.get('/overAllPerformanceOfUser/:userId',function(req,res){
  PerformanceModel.find({userId:req.params.userId},function(err,result){
    if(err)console.log(err);
    else{
      console.log(result);
      var response = responseGenerator.generate(true , result , 200, null );
		res.send(response);
    }
  })
})
route.get('/testSpecificPerformanceForAdmin/:userId/:testId',function(req,res){
	 Answer.aggregate([

      {$match:{userId:req.params.userId,testId:req.params.testId}}

    ],function(request,result){
	 })
	res.send(result);
})
	
	
route.get('/viewAllUsers',function(req,res){
  User.find({},{username:1},function(err,result){
    if(err)console.log(err);
    else{
      console.log(result);
      var response = responseGenerator.generate(true , result , 200, null );
			res.send(response);
    }
  })
})
route.get('/viewTestByDifficulty/:difficultyLevel',function(req,res){
  console.log('difficultyLevel recieved '+ req.params.difficultyLevel);
  Test.find({difficulty:req.params.difficultyLevel},{title:1,testTakenByUser:1},function(err,result){
    if(err)console.log(err);
    else{
      var response = responseGenerator.generate(true , result , 200, null );
			res.send(response);
    }
  })
})

route.get('/viewTest/:testId',function(req,res){
  Test.findOne({_id:req.params.testId},function(err,result){
    if(err)console.log(err);
    else{
      Question.find({'_id':{"$in":result.questions}},{question:1,options:1,answer:1},function(err,questions){
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


route.get('/performanceOfUser/:userId',function(req,res){
  PerformanceModel.find({userId:req.params.userId},{testsAttempted:1,_id:0},function(err,userTestsReport){
    res.send(responseGenerator.generate(true , userTestsReport , 200, null ))
  })
})


route.post('/updateTest/:testId',function(req,res){
  var update=req.body;

  Test.findOneAndUpdate({_id:req.params.testId},update,function(err,result){
    if(err)console.log(err);
    else{
       //check if it can be done through mongodb query
       var response = responseGenerator.generate(true , result , 200, null );
       res.send(response);
    }
  })
})

route.get('/deleteTest/:testId',function(req,res){
  Test.remove({_id:req.params.testId},function(err,result){
    if(err)console.log(err);
    else{
      console.log(result);
      res.send(result);

    }
  })
})

//for Questions
route.post('/createQuestion',function(req,res){
<<<<<<< HEAD

=======
>>>>>>> b5981e83bc2a97d4a4a28c1275dc8cabd84f99dc

  var question=new Question({
    _id:uniqid(),
    question:req.body.question,
    category:req.body.category,
    difficulty:req.body.difficulty,
    answer:req.body.answer
  })
  var adminOptions=req.body.adminOptions
  adminOptions=adminOptions.split(",");

  question.options=adminOptions;
  question.save(function(err,result){
    if(err){
      console.log(err);
    }
    else{
      console.log(result);
      res.send(responseGenerator.generate(true , result , 200, null ));
    }
  })
})
route.get('/viewAllQuestionsByAdmin',function(req,res){
  Question.find({},function(err,result){
    if(err)console.log(result);
    else{
      console.log(result);
      res.send(responseGenerator.generate(true , result , 200, null ));
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
route.get('/viewAllQuestionsByAdmin',function(req,res){
  Question.find({},function(err,result){
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
