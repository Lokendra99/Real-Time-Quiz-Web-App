//creating user schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//bcrypt-nodejs for hashing password
var bcrypt = require('bcrypt-nodejs');

//Schema for user
var userSchema = new Schema({
    username : {type: String , required: true, default:"" },
    email : {type: String, required: true , default:"",unique:true },
    password: {type: String  ,default:""},
    passwordResetToken:{type: String  ,default:""},
    passwordResetExpires:{type: String  ,default:""},
    google:{type:String},
    facebook:{type:String},
    testGiven:[{
      testId:{type: String , required: true, default:"" },
      Score:{type: Number, required: true},
      timeTaken:{type: Number, required: true}
    }]
});


var questionSchema=new Schema({
  _id:{type: String , required: true, default:"" },
  question:{type: String , required: true, default:"" },
  options:[],
  category:{type: String , required: true, default:"" },
  difficulty:{type: String , required: true, default:"" },
  answer:{type: Number , required: true, default:"" }
})

var testSchema=new Schema({
  _id:{type: String , required: true, default:"" },
  title:{type: String , required: true, default:"" },
  testDescription:[],
  questions:[],
  timelimit:{type: Number, required: true},
  difficulty:{type: String , required: true, default:"" },
  totalScore:{type: Number, required: true},
  testTakenByUser:[]
})

var answerSchema=new Schema({
  _id:{type: String , required: true, default:"" },
  userId:{type: String , required: true, default:"" },
  questionId:{type: String , required: true, default:"" },
  testId:{type: String , required: true, default:"" },
  correctOption:{type: String, required: true},
  userOption:{type: String, required: true},
  timeTakenByEach:{type: Number, required: true}
})

var performanceSchema = new Schema({

        userId:                 {type: String , required: true, default:"" },
        testsAttempted:         [
          {
            testId:               {type: String , required: true, default:"" },
            score:                { type: Number, default: 0 },
            timeTaken:            { type: Number, default: 0 },
            totalCorrectAnswers:  { type: Number, default: 0 },
            totalWrongAnswers:    { type: Number, default: 0 }
          }
        ]


});



//method to generate hashed password
userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password , bcrypt.genSaltSync(8) ,null);
};
//method to compare hashed password and password entered by user
userSchema.methods.compareHash = function(password){
    return bcrypt.compareSync(password , this.password);
};

//model for userschema
mongoose.model('User' , userSchema);
mongoose.model('Question' , questionSchema);
mongoose.model('Test' , testSchema);
mongoose.model('Answer',answerSchema);
mongoose.model('PerformanceModel',performanceSchema);
