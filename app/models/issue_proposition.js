const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Define the Quotes Schema here :
const IssuepropositionSchema =new Schema({

submittype:{
    type:String,
    required:true
},
description:{
    type:String,
    required:true
},
contributor:{
    type:String,
    required:true
}


});
module.exports=mongoose.model('Issueproposition',IssuepropositionSchema);
