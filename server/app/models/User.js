
//creating user schema

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//bcrypt-nodejs for hashing password
var bcrypt = require('bcrypt-nodejs');

//Schema for user
var userSchema = new Schema({

    name : {type: String , required: true, default:"" },
    email : {type: String, required: true , default:"" },
    mobileNum : {type: Number, required: true},
    pass: {type: String , required: true },
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

//method to generate hashed password
userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password , bcrypt.genSaltSync(8) ,null);
};
//method to compare hashed password and password entered by user
userSchema.methods.compareHash = function(password){
    return bcrypt.compareSync(password , this.pass);
};

//model for userschema
mongoose.model('User' , userSchema);
mongoose.model('Question' , questionSchema);
mongoose.model('Test' , testSchema);
