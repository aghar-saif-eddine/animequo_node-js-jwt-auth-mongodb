const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Define the Quotes Schema here :
const QuotesSchema =new Schema({
    quote:{
        type: String,
        required:true
    },
    author:{
        type: String,
        required:true
    },
    publisher: {
        type: Date,
        required: true,
        default: Date.now
      },
    categorys: [{ type: Schema.Types.ObjectId, ref: "Category" }]

});
module.exports=mongoose.model('Quote',QuotesSchema);
