const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Define the Quotes Schema here :
const BookmarkSchema =new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    title: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    },
    bookmarks: [{ type: Schema.Types.ObjectId, ref: "Quote" }]

});
module.exports=mongoose.model('Bookmark',BookmarkSchema);
