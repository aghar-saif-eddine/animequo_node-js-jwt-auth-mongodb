var validator=require('validator');
var Quote =require("../models/quote.model");
var Category =require("../models/Category.model");

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.addQuotes = (req,res)=>{
  //make sure to check if the quote is alerdy exicte :
  console.log("Start Posting new Quote !")
  var newQuote =new  Quote({
    quote:req.body.quote,
    author:req.body.author,
    publisher: req.body.publisher,
    category:req.body.category //id Category for one item 
  });
  
  newQuote.save()
  .then(data =>{
      //res.send({ message: 'Successful created new quote.' +data});
      mydata=JSON.stringify(data)
      res.json({success: true, msg: 'Successful created new quote.'+
      data.category});
      console.log("Successful created new quote.")


  }).catch(err =>{
      //res.status(500).send({message: err.message || "Save quote failed."});
      res.json({success: false, msg: 'Save quote failed.'+ err.message });
  });

   
};


exports.addCategory =(req,res)=>{


  console.log(req.body);
  var newCategory= new Category({
    title: req.body.title,
    description:req.body.description
  });

/*
  newCategory.save(function(err) {
    if (err) {
      return res.json({success: false, msg: 'Save Category failed.'});
    }
    res.json({success: true, msg: 'Successful created new Category.'+data.});
  });
*/
  
  newCategory.save()
  .then(data =>{
      //res.send({ message: 'Successful created new quote.' +data});
      res.json({success: true, msg: 'Successful created new Category '+ data._id});
      console.log("Successful created new quote.")


  }).catch(err =>{
      //res.status(500).send({message: err.message || "Save quote failed."});
      res.json({success: false, msg: 'Save Category failed.'+ err.message });
  });

   






};
