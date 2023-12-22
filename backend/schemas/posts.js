const mongoose = require('mongoose');

// User Schema
const UserSchema = new mongoose.Schema({
    userID:String,
    moNumber:Number,
    name:String,
    dob:Date,
    gender:String,
    password:String,
    adhar:String,
    email:String,
    keyhash:String,
  })

// Post Schema
const postSchema = new mongoose.Schema({
  content: [
    {
      text: String,
      likes: Number,
      commentOn: Date,
      comment: [
        {
          commentUser: String,
          commentText: String
        }
      ]
    }
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});




module.exports = { UserSchema, postSchema };
