var validator=require('validator');
var Quote =require("../models/quote.model");
var Category =require("../models/category.model");

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



exports.addCategory =(req,res)=>{


  //cheking if the titleof the Category exicte or not :
  category_ex=Category.findOne({title:req.body.title});
  if (!category_ex) return res.status(443).json({"message":"email is alerdy existe !"});

  console.log(req.body);
  var newCategory= new Category({
    title: req.body.title,
    description:req.body.description
  });

  newCategory.save()
  .then(data =>{
      //res.send({ message: 'Successful created new quote.' +data});
      res.json({success: true, msg: 'Successful created new Category !'});
      console.log("Successful created nw Catgeory !")


  }).catch(err =>{
      //res.status(500).send({message: err.message || "Save quote failed."});
      res.json({success: false, msg: 'Save Category failed !'+ err.message });
      console.log("Save Category failed !")
  });

  


};







exports.addQuotes = (req,res)=>{
  //make sure to check if the quote is alerdy exicte :
  console.log("Start Posting new Quote !")
  const newQuote =new  Quote({
    quote:req.body.quote,
    author:req.body.author,
    publisher: req.body.publisher
    //category:req.body.category id Category for one item 

  });



//CHANGING THIS PART//
/*
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
  */
//END HERE//


newQuote.save((err, newQuote) => {
  if (err) {
    res.status(500).send({ message: err });
    return;
  }

  if (req.body.categorys) {
    Category.find(
      {
        title: { $in: req.body.categorys }
      },
      (err, categorys) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        newQuote.categorys = categorys.map(category => category._id);
        newQuote.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "new Quote has added successfully !" });
        });
      }
    );
  } else{
    res.json({success: false, msg: 'Save quote failed.' });
  }


});












   
};




