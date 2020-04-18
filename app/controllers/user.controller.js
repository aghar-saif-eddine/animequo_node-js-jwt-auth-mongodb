const { authJwt } = require("../middlewares"); 
var Quote =require("../models/quote.model");
var Category =require("../models/category.model");
var issue_proposition=require("../models/issue_proposition");
var user =require("../models/user.model");
var Role =require("../models/role.model");
var Bookmark=require("../models/bookmark.model");


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
    title: req.body.title.toLowerCase(),
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



exports.getallCategory =(req,res)=>{

  Category.find()
  .then(category=>{
    res.json(category);
  }).catch(err=>{
      res.status(500).send({message:err.message || "OPS some error  occurred while retrieving"});  
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


};




exports.deleteCategory = (req, res) => {
//#1 finding the req.params.categoryId in list of category
Category.findById(req.params.categoryId)
    .then(category_and_delete1=>{
      if (!category_and_delete1){
        return res.status(404).send({
          message:"Category not found with id "+req.params.categoryId
        });
      }



        //Else Delete the Category from the Quotes
        Quote.updateMany(
          { $pull : { "categorys" : { $in:[req.params.categoryId] }}})
          //{"categorys": { $elemMatch:{ $in: [category_and_delete1._id]}}})
            .then(search_match=>{
            if (!search_match){ return res.status(404).send({message:"not found"}); }



                      //#2 deleting from the category list 
                        //0==>fetch the list of category and if not equl to req.params.categoryId add into new array (for ..) 
                        //1==>set the new upadte wiht new array (the same work like updateQuote )
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
                                message: "Category not found with id " + req.params.categoryId
                            });                
                        }

                        return res.status(500).send({
                          message: "Could not delete Category with id " + req.params.categoryId
                          });

                        });
                      //#2 deleting from the category list

        
          //(RESPONSE) Else Delete the Category from the Quotes              
          res.status(200).send(search_match);
            
          }).catch(err=>{
            return res.status(201).send({message:err});
          });
          //Else Delete the Category from the Quotes



      });
      //#1 finding the req.params.categoryId in list of category


//END
};



exports.updateCategory =(req,res)=>{
  //Cheking if the body is not empty :
  if ((!req.body.title)||(!req.body.description)){
    return res.status(400).send({message:"Check your info can not be empty !"});
  }
  Category.findByIdAndUpdate(req.params.categoryId,{
    title:req.body.title.toLowerCase(),
    description:req.body.description
  }
  ,{new:true})
  .then(category_updated=>{
    if (!category_updated){
      return res.status(404).send({message:"Category not found wuth this id"+req.params.categoryId});
    }
      return res.status(400).send(category_updated)
  }).catch(err => {
    if(err.kind === 'ObjectId') {
        return res.status(404).send({
            message: "Category not found with id " + req.params.categoryId
        });                
    }
    return res.status(500).send({
        message: "Error updating Category with id " + req.params.categoryId
    });
});

};




exports.SearchQuoteByCategory =(req,res)=>{
  Category.findOne(
    {
     title:req.params.categoryTitle.toLowerCase()
    },
    (err, category) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      //You need to Fetch Use the === admin TIPS in authJwt 
      Quote.find({categorys:{ $in :category._id}})
      .then(match_search=>{
        if (!match_search){
          res.status(404).json({message:"error we can not finding Quotes with this category id"});
          return;
        }

        return res.status(200).send(match_search);
      
    }
  ).catch(err=>{
    
    return res.status(404).json({message:err.message});
    
  });
 
  });


};



exports.SearchQuoteByAuthor=(req,res)=>{
    Quote.find({author:{ $in :req.params.author}},
      (err,search_res)=>{
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      return res.status(200).send(search_res);
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



exports.updateQuotes =(req,res)=>{

//0==> checking if the req.body empty :
if ((!req.body.quote)||(!req.body.author)||(req.body.categorys.length==0)){
  return res.status(400).send({message:"you pass empty fields"});
}


//2==> convert all the item of req.body.categorys into lowercase :
lower_categorys= String(req.body.categorys).toLowerCase().split(",");
req.body.categorys=lower_categorys;
//console.log(req.body.categorys);

//1==> changing the title of req.body.categorys into the there ids in the categorys models :
//3==> checking if the any item in req.body.categorys are repeat
if (req.body.categorys) {

  Category.find(
    {
      title: { $in: req.body.categorys}
    },
    (err, categorys) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      let categorys_names=categorys.map(category => category._id);
      //console.log(categorys_names);

        //4==> set the $changing:
        Quote.updateOne({_id:req.params.quoteId},
          {$set: 
            {
            "categorys":categorys_names,
            "quote":req.body.quote,
            "author":req.body.author
            }
          }
        ).then(upade_quote=>{
          if (!upade_quote){
            res.status(404).send({message:"error we can not founding this id "});
          }
          res.status(200).send(upade_quote);
        }).catch(err=>{
          res.status(201).send({message:"error "+err.message});
        });


    }
  );
} else{
  res.json({success: false, msg: 'Save Quote failed.' });
}

};


exports.addIssuePropostion=(req,res,next)=>{

  const newIssueprop =new  issue_proposition({
    submittype:req.body.type,
    description:req.body.description,
    contributor: req.userId
  });


  newIssueprop.save()
  .then(data =>{
      res.json({success: true, msg: 'Successful add new Issue Propsition submit !'+data});
    
  }).catch(err =>{
      //res.status(500).send({message: err.message || "Save quote failed."});
      res.json({success: false, msg: 'adding new  Issue Proposition failed !'+ err.message });
    
  });


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
        if (!data){
          res.status(404).send({message:"This submit not found with this id "+req.params.constructioId});
        }
        res.status(200).send({message:"This submit has Deleted successfully ! "})
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
  //get the id of user role: 
  Role.findOne(
    {
     name:"user"
    },
    (err, roles) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      user.find({roles:{ $in :roles._id}})
      .then(list_user=>{
        if (!list_user){
          res.status(404).json({message:"error we can not finding this user id"});
          return;
        }

        return res.status(200).send(list_user);
      
    }
  );
 
  });

};




exports.getalladmin=(req,res)=>{
  //getting all users not the Admin
  //get the id of user role: 
  Role.findOne(
    {
     name:"admin"
    },
    (err, roles) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      user.find({roles:{ $in :roles._id}})
      .then(list_user=>{
        if (!list_user){
          res.status(404).json({message:"error we can not finding this user id"});
          return;
        }

        return res.status(200).send(list_user);
      
    }
  );
 
  });

};



exports.getallmoderator=(req,res)=>{
  //getting all users not the Admin
  //get the id of user role: 
  Role.findOne(
    {
     name:"moderator"
    },
    (err, roles) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      user.find({roles:{ $in :roles._id}})
      .then(list_user=>{
        if (!list_user){
          res.status(404).json({message:"error we can not finding this user id"});
          return;
        }

        return res.status(200).send(list_user);
      
    }
  );
 
  });

};


exports.adduserBookmark=(req,res)=>{
//add new quote to the bookmark list of this current user:
const bookmark=new Bookmark({
  owner:req.userId,
  title:"Bookmark "+req.userId
})
  bookmark.save().then(data=>{
    if (!data){
      res.status(404).send({message:"Error in saving quote into bookmaek list "});
    }
      Bookmark.findByIdAndUpdate(
        data._id,
        {  $push : { "bookmarks" :req.params.quoteId}}
        ).then(add_bookmark=>{
          if(!add_bookmark)
          {res.status(404).send({message:"Error in saving new id quote in bookmak"});}
          
          res.status(200).send({message:"succesfuly added new quote to Your Bookmark List"})
        })

  }).catch(err=>{
    res.status(201).send({message:"Error "+err.message})
  })
};



exports.deleteuserBookmark=(req,res)=>{
  //deleting item (quote from the list of bookmark)
//delete quote to the bookmark list of this current user:

};







exports.getuserBookmark=(req,res)=>{
//get the list quote to the bookmark list of this current user:
Bookmark.find({"owner":req.userId}).then(m_bookamrk=>{
  if (!m_bookamrk){
    res.status(404).send({message:"Error Bookmark List not Found !"})
  }
  res.status(200).send(m_bookamrk);
}).catch(err=>{
  res.status(201).send({message:"Error in getting my bookmark "+err});

})
};

















/*
exports.gettallUserRoles=(req,res)=>{
  //getting all users not the Admin 
  Quote.findById(req.params.quoteId)
  .then(list_user=>{
    if (!list_user){
      res.status(404).json({message:"error we can not finding this user id"});
      return;
    }
    //return res.status(200).send(list_user.categorys);
    //maybe we can set list_user.categorys inside array make change in that new array and then set again the new array into the old one and then set the nex update :
    update_quote=list_user.categorys
    for (i=0;i<update_quote.length;i++){
      console.log(update_quote[i]);
        
    }
  });
 };
 */
 
 