const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  //creating new user
  app.post(
    "/api/v1.0/auth/signup",    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  //user login 
  app.post("/api/v1.0/auth/signin",
  controller.signin);



   //user reset password user :
   app.post("/api/v1.0/auth/forgotpassword",
   controller.forgotpassword);

   //in thsi route we need just to verif :
   //req.body.code == User.passwordcode ( seach using email that pass with req.session.email )
   app.get("/api/v1.0/auth/recoverypassword",
   controller.recoverypassword);

   

   //in this route we need to work with 2 case 
   app.post("/api/v1.0/auth/changepassword",
   controller.changepassword);

   app.post("/api/v1.0/auth/logout",
   controller.logout);


};


 