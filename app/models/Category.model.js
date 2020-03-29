const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Define the Quotes Schema here :
const CategorySchema =new Schema({


title:{
    type:String,
    required:true
},
description:{
    type:String,
    required:true
}


});
module.exports=mongoose.model('Category',CategorySchema);
