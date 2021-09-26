const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const Person = db.person;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};


isStudent= (req, res, next) => {
  Person.findByPk(req.userId).then(person => {
    person.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "Leader" || roles[i].name === "Member") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Student Role!"
      });
    });
  });
};


isHod = (req, res, next) => {
  Person.findByPk(req.userId).then(person => {
    person.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "hod") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Hod Role!"
      });
      return;
    });
  });
};

isDirector= (req, res, next) => {
  Person.findByPk(req.userId).then(person => {
    person.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "director") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Director Role!"
      });
    });
  });
};

isManagement= (req, res, next) => {
  Person.findByPk(req.userId).then(person => {
    person.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "management") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Management Role!"
      });
    });
  });
};

isCoordinator= (req, res, next) => {
  Person.findByPk(req.userId).then(person => {
    person.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "coordinator") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Coordinator Role!"
      });
    });
  });
};

isGuide = (req, res, next) => {
  Person.findByPk(req.userId).then(person => {
    person.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "guide") {
          next();
          return;
        }

       /* if (roles[i].name === "admin") {
          next();
          return;
        }*/
      }

      res.status(403).send({
        message: "Require Guide Role!"
      });
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isStudent: isStudent,
  isGuide: isGuide,
  isHod: isHod,
  isDirector: isDirector,
  isManagement: isManagement,
  isCoordinator: isCoordinator
};
module.exports = authJwt;