var validator = require('validator');
var Quote =require("../models/quote.model");
var Category =require("../models/category.model");
var issue_proposition=require("../models/issue_proposition");
var user =require("../models/user.model");
var Role =require("../models/role.model");
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
  //console.log("Start Posting new Quote !")
  const newQuote =new  Quote({
    quote:req.body.quote,
    author:req.body.author,
    publisher: req.body.publisher
    //category:req.body.category id Category for one item 

  });


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
    res.json({success: false, msg: 'Save Quote failed.' });
  }


});



exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};











   
};




exports.deleteCategory = (req, res) => {
    //#1 deleting fom the Catgeorys Array from the List of quotes 
  Category.findById(req.params.categoryId)
    .then(category_and_delete1=>{
      if (!category_and_delete1){
        return res.status(404).send({
          message:"Category not found with id "+req.params.categoryId
        });
        }
        //Else Delete the Category from the Quotes
        Quote.find().exec((err, quote)=>{
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          Category.find(
            {
              _id:{ $in: Quote.categorys}
            },
            (err, categorys) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
      
              for (let i = 0; i < categorys.length; i++) {
                if (categorys[i].name === req.params.categoryId) {
                 console.log("We find the Catgeory that well be deleted !")
                  return;
                }
              }
      
              res.status(403).send({ message: "Require Admin Role!" });
              return;
            }
          );
        });

      });



    //#2 deleting from the category list 
      //chek if the Id of category passing in parmas if exicte :
    Category.findByIdAndRemove(req.params.categoryId)
    .then(category_and_delete2 =>{
        if (!category_and_delete2){
            return res.status(404).send({
              message:"Category not found with id "+req.params.categoryId
            });

        }
        //Else Delete the Category
        res.send({message: "Category deleted successfully!"});
    }).catch(err =>{
      if(err.kind === 'ObjectId' || err.name === 'NotFound') {
        return res.status(404).send({
            message: "Category not found with id " + req.params.taskId
        });                
    }

    return res.status(500).send({
      message: "Could not delete Category with id " + req.params.taskId
      });

    });

};



exports.currentUser =(req,res,next) => {
  res.status(200).send({message:req.userId})
};




exports.getallQuotes =(req,res) =>{  
  Quote.find()
    .then(quotes=>{
      res.json(quotes);
    }).catch(err=>{
        res.status(500).send({message:err.message || "OPS some error  occurred while retrieving"});  
    });
};



exports.getoneQuotes =(req,res) =>{
  Quote.findById(req.params.quoteId)
    .then(quote=>{
      if (!quote){
        res.status(404).send({message:"Quote not found with this id "+req.params.quoteId});
      }
      //Else 
      res.status(200).send(quote);

    }).catch(err=>{
      if(err.kind === 'ObjectId') {
        return res.status(404).send({
            message: "OPS Quote not found with this id " + req.params.quoteId
        });                
    
      }
      return res.status(500).send({message: "Error retrieving Quote with this id " + req.params.quoteId});
    });

};



exports.deleteQuotes=(req,res) =>{
  Quote.findByIdAndRemove(req.params.quoteId)
    .then(quote=>{
      if (!quote){
        res.status(404).send({message:"Quote not found wuth this id "+req.params.quoteId});
      }
      res.status(200).send({message:"This Quote has Deleted successfully ! "+quote._id})
    }).catch(err=>{
          if(err.kind === 'ObjectId' || err.name === 'NotFound') {f
            return res.status(404).send({
                message: "Quote not found with id " + req.params.quoteId
            });                
       
          }
        return res.status(500).send({message: "Could not delete task with id " + req.params.quoteId});
    });
};



exports.addIssuePropostion=(req,res,next)=>{

  const newIssueprop =new  issue_proposition({
    submittype:req.body.type,
    description:req.body.description,
    contributor: req.userId
  });


  newIssueprop.save()
  .then(data =>{
      res.json({success: true, msg: 'Successful add new Issue/Propsition submit !'+data});
    
  }).catch(err =>{
      //res.status(500).send({message: err.message || "Save quote failed."});
      res.json({success: false, msg: 'adding new  Issue,Proposition failed !'+ err.message });
    
  });


  res.json({success:false,msg:'Adding new Issue,Proposition failed'})
  next();

  



};



exports.getallIssuePropostion=(req,res) =>{
//getting all the IssueProposition:
issue_proposition.find()
  .then(data=>{
    res.json(data)
  }).catch(err=>{
    res.status(500).send({message:err.message || "OPS somr error occureend while geeting Issues "});
  });

};



exports.deleteIssuePropostion=(req,res)=>{
  issue_proposition.findByIdAndRemove(req.params.constructioId)
    .then(data=>{
        if (data){
          res.status(404).send({message:"This submit not found with this id "+req.params.constructioId});
        }
        res.status(200).send({message:"This submit has Deleted successfully ! "+issue_proposition._id })
    }).catch(err=>{
      if(err.kind === 'ObjectId' || err.name === 'NotFound') {f
        return res.status(404).send({
            message: "submit not found with id " + req.params.taskId
        });                
   
      }
    return res.status(500).send({message: "Could not delete task with id " + req.params.taskId});
});
};



exports.getallusers=(req,res)=>{
  //getting all users not the Admin 
  user.find()
    .then(list_user=>{
      if (!list_user){
        res.status(404).json({message:"error we can not finding this user id"});
        return;
      }

      for (let i=0;i<list_user.length ; i++){
        //console.log(list_user[i].roles)
        roles_list=list_user[i].roles;
        for (let j=0;j<roles_list.length;j++){
          console.log(roles_list[j]);
        }
        
      }

    });
};

exports.gettallUserRoles=(req,res)=>{
 //getting all users not the Admin 
 user.find()
 .then(list_user=>{
   if (!list_user){
     res.status(404).json({message:"error we can not finding this user id"});
     return;
   }

   for (let i=0;i<list_user.length ; i++){
     //console.log(list_user[i].roles)
     roles_list=list_user[i].roles;
     for (let j=0;j<roles_list.length;j++){
       console.log(roles_list[j]);
     }
     
   }

 });
};
