const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });




  app.get(
    "/api/v1.0/all",
    controller.allAccess
  );



  app.get(
    "/api/v1.0/user",
    [authJwt.verifyToken],
    controller.userBoard
  );




  app.get(
    "/api/v1.0/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );




  app.get(
    "/api/v1.0/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );




  
  //adding the add quote route :
//verifierToken + Admin only 
app.post(
  "/api/v1.0/quotes",
  [authJwt.verifyToken,authJwt.isAdmin],
  controller.addQuotes
);




  //adding the add catgeory route :
//verifierToken + Admin only 
app.post(
  "/api/v1.0/category",
  [authJwt.verifyToken,authJwt.isAdmin],
  controller.addCategory
);





};


