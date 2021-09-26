const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

var {sendMail}= require('./app/routes/email')
var tasks = require('./app/routes/tasks')
var deletes = require('./app/routes/delete')
var doings = require('./app/routes/doings')
var submits = require('./app/routes/submits')
var dones = require('./app/routes/dones')
var ftrmaster = require('./app/routes/ftrmaster')
var ftranswer = require('./app/routes/ftranswer')
var ftrquestions = require('./app/routes/ftrquestions')
var pds = require('./app/routes/pd')
var datas = require('./app/routes/director')
var week = require('./app/routes/week')
var task_st = require('./app/routes/Task_status')
var hod = require('./app/routes/hod')
var guide = require('./app/routes/guide')
var management = require('./app/routes/management')
var ftrproject = require('./app/routes/ftrproject')
var cron = require('node-cron');
var tempRes = require('./app/routes/tempregister')
const app = express();

// parse requests of content-type - application/json
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT');
  next();
  });
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
cors(origins = "*", allowedHeaders = "*")
//CrossOrigin(
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
const db = require("./app/models");
const Role = db.role;
db.sequelize.sync({force: false}).then(() => {
  console.log('Drop and Resync Db');
  //initial();
})
app.use('/api', tasks)
app.use('/api', deletes)
app.use('/api', doings)
app.use('/api', submits)
app.use('/api', dones) 
app.use('/api', ftrmaster) 
app.use('/api', ftranswer) 
app.use('/api', ftrquestions) 
app.use('/api', pds) 
app.use('/api', datas) 
app.use('/api', week) 
app.use('/api', hod) 
app.use('/api', task_st) 
app.use('/api', guide) 
app.use('/api', management)
app.use('/api', ftrproject)
app.use('/api', tempRes)

function initial() {
  Role.create({
    id: 1,
    name: "Leader"
  });
  
  Role.create({
    id: 2,
    name: "Member"
  });
 
  Role.create({
    id: 3,
    name: "Guide"
  });

  Role.create({
    id: 4,
    name: "Hod"
  });

  Role.create({
    id: 5,
    name: "Director"
  });

  Role.create({
    id: 6,
    name: "Management"
  });

  Role.create({
    id: 7,
    name: "Coordinator"
  });
}

db.sequelize.sync();
/*var corsOptions = {
  origin: "http://localhost:8081",
  allowedHeaders: "*"
};*/

//app.use(cors(corsOptions));

cron.schedule('33 22 * * * ', () => {
   
    var sql1 = "select * from project_task"
    connection.query(sql1, (err, task) => {
        if (err) {
            console.log(err);
        }
        else {
            task.forEach(element => {
                 var submitDate= new Date(element.Submitted_Date);
                   if(element.Submitted_Date){
                 var date1 = moment(submitDate).format('YYYYMMDD')
                 var date2 = moment(current_date).format('YYYYMMDD')
                 var diff = Number(date2)- Number(date1);
                 console.log(diff);

                 if(Number(diff)>2 && Number(diff)<4 )
                 {
                     console.log("in IF");
                     var sql = "select p.* from persons p where Person_id = (select g.Instructor_id1 from project_group g where g.Group_id=(select Group_id from project_task where id=?))"
                     connection.query(sql, [element.id], (err, datas) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            var email = datas[0].email;
                            var fullname = datas[0].FullName;
                            var taskname = element.Task_Name;
                            sendMail(`Approve Task `, `Hello ${fullname},You not Aprove or Reject the task,named ${taskname}. Please Do Action on that Particular task As soon As Possible `,email);
                            console.log("email sent");
                        }
                    });
                 }
                 else if(Number(diff)>3){
                     console.log(diff);
                     var sql2="select p.*,p1.Fullname as fulname,g2.Group_Name,g2.Group_title from persons p join persons p1 on p1.Person_id=(select g.Instructor_id1 from project_group g where g.Group_id=(select t.Group_id from project_task t where t.id=?)) join project_group g2 on g2.Group_id=(select t1.Group_id from project_task t1 where t1.id=?) where p.department = (select g10.Department_id from project_group g10 where g10.Group_id=(select t3.Group_id from project_task t3 where t3.id=?)) and p.roleId=3"
                     connection.query(sql2, [element.id,element.id,element.id], (err, hoddatas) => {
                        if (err) {
                            console.log(err);
                        }
                        else{
                            console.log(hoddatas[0]);
                            var hodemail = hoddatas[0].email;
                            var Hodname = hoddatas[0].FullName;
                            var guide = hoddatas[0].fulname;
                            var taskname = element.Task_Name;
                            var groupname=hoddatas[0].Group_Name;
                            var grouptitle=hoddatas[0].Group_title;
                            sendMail(`Approve Task `, `Hello ${Hodname} sir,One Project named ${groupname} :- ${grouptitle} from Our Department is Stuck due to Guide ${guide} is Not Active since last 3 days. they not take action on project_task named ${taskname}. Please Look into it`,hodemail);
                            console.log("Hod Email sent");
                        }
                    });
                 } 
                }
            });
            
        }

});
});
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to authentication application." });
});
const PORT = process.env.PORT || 10027;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});