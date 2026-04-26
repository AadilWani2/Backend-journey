const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    username : {
        type : String,
        required : [true, "Username is required"],
        unique : [true , "Username already exists"]
    },
    email : {
        type : String,
        required : [true, "Email is required"],
        unique : [true , "Email already exists"]
    },
    password : {
        type : String,
        required : [true, "Password is required"],
        select : false
    }

});

// userSchema.pre("save" , function(next){
//     if(!this.isModified("password")){
//         next();
//     }
//     this.password = bcrypt.hash(this.password, 10);
//     next();
// })
// userSchema.post("save" , function(doc , next){
//     console.log(doc);
//     next();
// })

const userModel = mongoose.model("User" , userSchema);
module.exports = userModel;

