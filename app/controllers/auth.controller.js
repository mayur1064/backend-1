const db = require("../models");
const config = require("../config/auth.config");
const Person = db.person;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs"); 

exports.signup = (req, res) => {
  // console.log("BACKEND-AUTHCONTROLLER");
  // console.log(req.body.Mobile);
  // Save User to Database
  Person.create({
    username: req.body.username,
    email: req.body.email,
    FullName:req.body.FullName,
    grno_EmpCode:req.body.grno_EmpCode,
    Mobile:req.body.Mobile,
    college:req.body.college,
    department:req.body.department,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(person => {
      if (req.body.roles == 1){
          person.setRoles([1]).then(() => { 
          res.send({ message: "User was registered successfully!" });
        });
      }
      else if(req.body.roles == 3){
          person.setRoles([3]).then(() => {
          res.send({ message: "Guide was registered successfully!" });
        });

      }

      
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  Person.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(person => {
      if (!person) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        person.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: person.Person_Id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];
      person.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          Person_Id:person.Person_Id,
          username: person.username,
          FullName:person.FullName,
         // group_id:person.group_id,
          Mobile:person.Mobile,
          grno_EmpCode:person.grno_EmpCode,
          email: person.email,
          department:person.department,
          college:person.college,
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};




      /* if (req.body.roles) {
        console.log("THE ROLE IS "+req.body.roles ) 
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          person.setRoles(roles).then(() => {
            res.send({ message: "Guide was registered successfully!" });
          });
        });
      } */