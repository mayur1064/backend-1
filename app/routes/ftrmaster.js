var express = require('express')
var router = express()
var {sendMail} = require('./email');
const connection = require('../config/db')

router.get('/ftrmaster/:clg/:dep', (req, res, next) => {
    var gi = req.params.clg;
    var dep = req.params.dep;
    var sql = "Select * from ftrmaster where College_id=? and Department_id=? "
    connection.query(sql, [gi, dep], (err, task, fields) => {
        if (err) {
            res.send('error: ' + err)
            console.log(err);
        }
        else {
            res.json(task);
        }
    });
})
router.get('/ftrproject/:clg/:dep/:fm', (req, res, next) => {
    var gi = req.params.fm;
    var clg = req.params.clg;
    var dep = req.params.dep;
    var sql = "Select fp.*,p.FullName,g.Group_Name,count(*) as submited from ftr_project_group fp Join persons p on p.Person_id=fp.reviewer_id Join project_group g on g.Group_id=fp.group_id  where fp.ftr_master_id = ?"
    connection.query(sql, [gi], (err, project, fields) => {
        if (err) {
            res.send('error: ' + err)
            console.log(err);
        }
        else {
            var sql = "Select count(*)as total from project_group where College_id=? and Department_id=?"
            connection.query(sql, [clg, dep], (err, group, fields) => {
                if (err) {
                    res.send('error: ' + err)
                    console.log(err);
                }
                else {
                    var count = [];
                    var ppc = [];
                    count[0] = Number(group[0].total);
                    count[1] = Number(project[0].submited);
                    count[2] = Number(group[0].total) - Number(project[0].submited)
                    ppc[0] = count;
                    ppc[1] = project;
                    res.json(ppc)
                }
            });
        }
    });
})
router.post('/ftrmaster', (req, res, next) => {
    var ftrn = req.body.FTRS;
    var sem = req.body.semester;
    var clg = req.body.college;
    var dep = req.body.department;
    var ay = req.body.ay;
    var sql = "INSERT INTO ftrmaster(ftr_number,ftr_name,ay,sem,College_id,Department_id,No_of_Questions) VALUES (?,?,?,?,?,?,?)";
    connection.query(sql, [ftrn[0], ftrn[1], ay, sem, clg, dep, ftrn[3]], (err, task) => {
        if (err) {
            res.send('error:' + err)
            console.log(err);
        }
        else {
            res.send('Insertion Successful')
        }
    });

})

router.post('/ftrmasters', (req, res, next) => {
    var dt = req.body.date;
    
    console.log(dt);
    var ftrsno = req.body.ft;
    var sql = "update ftrmaster set Due_date=? where ftr_master_id=?";
    connection.query(sql, [dt, ftrsno], (err, task) => {
        if (err) {
            res.send('error: ' + err)
            console.log(err);
        }
        else {
            res.send("Insertion Done");
        }
    });
})

router.post('/ftremail',(req,res,next)=>{
  var dt = req.body.dep;
  var sql = "select * from persons where department=? and roleId=1 and roleId=2"
  connection.query(sql,[dt],(err,person)=>{
      if(err){
      res.send("error:" +err)
      console.log(err);
      }
      else{
          person.forEach(element => {
            sendMail(`FTR Enabled`, `Hi FTR is Enbled.please Fill FTR `,element.email);
            console.log("email sent");
          });
         
      }
  })

})

module.exports = router