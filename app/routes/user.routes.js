const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get(
    "/api/test/Leader",
    [authJwt.verifyToken, authJwt.isStudent],
    controller.studentBoard
  );

  app.get(
    "/api/test/Member",
    [authJwt.verifyToken, authJwt.isStudent],
    controller.studentBoard
  );

  app.get(
    "/api/test/guide",
    [authJwt.verifyToken, authJwt.isGuide],
    controller.guideBoard
  );


  app.get(
    "/api/test/hod",
    [authJwt.verifyToken, authJwt.isHod],
    controller.hodBoard
  );

  app.get(
    "/api/test/director",
    [authJwt.verifyToken, authJwt.isDirector],
    controller.directorBoard
  );

  app.get(
    "/api/test/management",
    [authJwt.verifyToken, authJwt.isManagement],
    controller.managementBoard
  );

  app.get(
    "/api/test/coordinator",
    [authJwt.verifyToken, authJwt.isCoordinator],
    controller.coordinatorBoard
  );

};