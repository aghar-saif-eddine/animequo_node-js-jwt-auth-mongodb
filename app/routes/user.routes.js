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


app.get("/api/v1.0/category",
[authJwt.verifyToken],
controller.getallCategory
);


//fixing some issue here :
app.delete("/api/v1.0/category/:categoryId",
[authJwt.verifyToken,authJwt.isAdmin],
controller.deleteCategory
);

app.put("/api/v1.0/category/:categoryId",
[authJwt.verifyToken,authJwt.isAdmin],
controller.updateCategory
);


app.get("/api/v1.0/currentuser",
[authJwt.verifyToken],
controller.currentUser);



app.get("/api/v1.0/quotes",
[authJwt.verifyToken],
controller.getallQuotes);


app.get("/api/v1.0/quotes/:quoteId",
[authJwt.verifyToken],
controller.getoneQuotes);


app.delete("/api/v1.0/quotes/:quoteId",
[authJwt.verifyToken,authJwt.isAdmin],
controller.deleteQuotes);


app.put("/api/v1.0/quotes/:quoteId",
[authJwt.verifyToken,authJwt.isAdmin],
controller.updateQuotes)


app.post("/api/v1.0/construction",
[authJwt.verifyToken],
controller.addIssuePropostion);


app.get("/api/v1.0/construction",
[authJwt.verifyToken,authJwt.isAdmin],
controller.getallIssuePropostion);


app.delete("/api/v1.0/construction/:constructioId",
[authJwt.verifyToken,authJwt.isAdmin],
controller.deleteIssuePropostion);


app.get("/api/v1.0/users",
[authJwt.verifyToken,authJwt.isAdmin,authJwt.isModerator],
controller.getallusers);


app.get("/api/v1.0/admin",
[authJwt.verifyToken,authJwt.isAdmin],
controller.getalladmin);


app.get("/api/v1.0/modirator",
[authJwt.verifyToken,authJwt.isAdmin],
controller.getallmoderator);


app.get("/api/v1.0/search/quotes/category/:categoryTitle",
[authJwt.verifyToken],
controller.SearchQuoteByCategory);


app.post("/api/v1.0/user/bookmark/:quoteId",
[authJwt.verifyToken,authJwt.isUser],
controller.adduserBookmark);


app.get("/api/v1.0/user/bookmark",
[authJwt.verifyToken,authJwt.isAdmin],
controller.getuserBookmark);


app.delete("/api/v1.0/user/bookmark/:quoteId",
[authJwt.verifyToken,authJwt.isUser],
controller.deleteuserBookmark);



/*
app.get("/api/v1.0/search/quote/author/:author",
[authJwt.verifyToken],
controller.SearchQuoteByAuthor
);
*/




};

