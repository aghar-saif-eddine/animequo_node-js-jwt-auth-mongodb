const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
var Bookmark=require("../models/bookmark.model");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var random_number = require('random-number');
var nodemailer = require('nodemailer');
var session = require('express-session');


exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  if ((req.body.roles.length)===1){  
  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            const bookmark=new Bookmark({
              owner:user._id,
              title:"Bookmark "+user._id
            })
              bookmark.save().then(data=>{
                if (!data){
                  res.status(404).send({message:"Error in saving quote into bookmaek list "});
                }
  
                          
            }).catch(errr=>{
              res.status(201).send({message:"Error 1-2"+errr.message});
            });

            
            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });

}else{
  res.status(500).send({message:"error check your roles !"})
}

};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token
      });
    });
};




exports.forgotpassword=  (req,res,next)=>{

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user:'chiheb.benjamaa@isimg.tn',
      pass: 'Az22873620'
    },
    tls: {
      rejectUnauthorized: false
  }
  });

 
  //adding reset password here :
  
      //set the passwordreset field into genrate random number and set into it with crpped :
      var options = {
        min:  1000
      , max:  2000
      , integer: true
      }
      const send_mail=random_number(options);
      //const hash_mail= bcrypt.hash(send_mail, 10).toString();
    

      //send the send_mail to the User using his Email :
      var mailOptions = {
        from : 'chiheb.benjamaa@isimg.tn',
        to :  req.body.email,
        subject : 'AnimeQuo : Password Recovery',
        text : 'To reset your password, enter this verification code when asked: '+ send_mail
      }
      transporter.sendMail(mailOptions,function(error,info){
        if (error){
          //console.log(error)
          res.status(201).send({messsage:'We have Error in Sending Code into your email!'+error.message});
        }
        else{
          //console.log('Email sent '+info.response);
          //res.redirect('/api/v1.0/auth/recoverypassword');
          //res.status(200).send({messsage:'We  Send verification code into your email!'});
          next();  
        }
      });

      

      //hash this radom  number and sett into passwordreset :
      User.updateOne({"email":req.body.email},
        {$set: 
          {"passwordreset":send_mail}
        })
          .then(data=>{
            if (!data){
               res.status(404).send({message:"User not found with this Id !"});
            } 

            res.status(200).send({messsage:'We  Send verification code into your email!'});
            req.session.email=req.body.email;
            //console.log(req.session.email);
            

          }).catch(err=>{
            res.status(201).send({message:"Error "+err.message})
          });


     
};



exports.recoverypassword=(req,res)=>{
console.log(req.session.email);
if (!req.body.code)
  res.status(201).send({message:"you passe empty code !"});
  //check if the email that stor in the seesion find in thr database :
  User.findOne({"email":req.session.email})
    .then(user=>{
      if (!user){
        res.status(404).send({message:"User not found with email !"});
      }
      //check if the code that use passe if correct or not :
      /*
      var CodePassIsValid = bcrypt.compareSync(
        req.body.code.toString(),
        user.passwordreset
      );
      */
     var CodePassIsValid=(req.body.code===user.passwordreset)
    // result == true
    req.session.email=null;
      if (!CodePassIsValid){
        //req.session.code=false;
        //reset the passordreset to null ;
        return res.status(401).send({message: "Invalid Code !"});
        
      }
      //in this case the code is valide but we 
      //req.user thgat store the id of current user we uset in the getcurrent user 
      req.user=null;
      res.status(200).send({message:" You can change your password"});
    }).catch(err=>{
      res.status(201).send({message:"Error " +err});
    });


};



exports.changepassword=(req,res)=>{

  var ValidPass=(req.body.password===req.body.confirmepass);
 
   //change the password in the case of forgot password 
   if ((!req.body.password)||(!req.body.confirmepass)||(!ValidPass))
   res.status(201).send({message:"Check that we entre password"});
   bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      const hash_password = hash;
 
 //CASE 1 forgot password and we get the code from the session and 
  if ((req.user===null)&& (req.session.email!=null))
    {
   
    User.findOneAndUpdate({email:req.email},
      {
        $set : {"password":hash_password}
      }
      )
      .then(data1=>{
        if (!data1){
          res.status(404).send({message:"User not found !"});
        }
        res.status(200).send({message:"Your password has been successfully changed "});
        req.session.destroy();
      }).catch(err=>{
          res.status(201).send({message:"Error "+err});
      });

    }

//CASE 2 : the the user login and he weent to chnage hes password :
  else if ((req.user!=null)&&(req.session.email==null)){
      
      User.findByIdAndUpdate(req.user,
      {
        $set : {"password":hash_password}
      }).then(data2=>{
          if (!data2){
            res.status(404).send({message:"User not found !"});
          }
          res.status(200).send({message:"Your password has been successfully changed "});  
      }).catch(error=>{
        res.status(201).send({message:"Error "+error});
      });

    }
    
    
 //end hash password 
  });
});
   


};



exports.logout=(req,res)=>{
  //set the req.user into null 
  //set the x-access-token into null  OR 
  //dispore the token he pass in header :
  req.user=null;
  req.session.destroy();


}