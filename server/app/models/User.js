
//creating user schema

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//bcrypt-nodejs for hashing password
var bcrypt = require('bcrypt-nodejs');

var userAuthenticationSchema = mongoose.Schema({

    local            : {
        email        :{type: String, required: true , unique:true },
        pass         : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        name         : String,
        email        : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});


//Schema for user
var userSchema = new Schema({

    //name : {type: String , required: true, default:"" },
    email : {type: String, required: true , default:"" },
    //mobileNum : {type: Number, required: true},
    password: {type: String  ,default:""},
    // testGiven:[{
    //   testId:{type: String , required: true, default:"" },
    //   Score:{type: Number, required: true},
    //   timeTaken:{type: Number, required: true}
    // }]
    displayName: {type: String, required: true , default:"" }

});

var GUserSchema = new Schema({

    google:{
      id:{type: String , required: true, default:"" },
      token:{type: String , required: true, default:"" },
      name:{type: String , required: true, default:"" },
      email:{type: String , required: true, default:"" }
    }
});


var questionSchema=new Schema({
  _id:{type: String , required: true, default:"" },
  question:{type: String , required: true, default:"" },
  options:[],
  category:{type: String , required: true, default:"" },
  difficulty:{type: String , required: true, default:"" }
})

var testSchema=new Schema({
  _id:{type: String , required: true, default:"" },
  title:{type: String , required: true, default:"" },
  testDescription:{type: String , required: true, default:"" },
  questions:[],
  timelimit:{type: Number, required: true},
  difficulty:{type: String , required: true, default:"" }
})

var answerSchema=new Schema({
  _id:{type: String , required: true, default:"" },
  questionId:{type: String , required: true, default:"" },
  correctOption:{type: Number, required: true}
})

// //method to generate hashed password
// userAuthenticationSchema.methods.generateHash = function(password){
//     return bcrypt.hashSync(password , bcrypt.genSaltSync(8) ,null);
// };
// //method to compare hashed password and password entered by user
// userAuthenticationSchema.methods.compareHash = function(password){
//     return bcrypt.compareSync(password , this.pass);
// };

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
mongoose.model('GUser',GUserSchema);

mongoose.model('UserAuthentication',userAuthenticationSchema);
