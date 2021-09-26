var express = require('express')
var router = express()
current_date = new Date().toJSON().slice(0, 10)
const connection = require('../config/db')
const util = require('util');
const utils = require('./utils');
const query = util.promisify(connection.query).bind(connection);
// Get All Tasks'
router.get('/hod/:clg/:dep', (req, res, next) => {
    var cllg = req.params.clg;
    var depa = req.params.dep;
    var sql = "select g.Group_id,(select count(Group_id)from project_group g1 where g1.College_id=? and g1.Department_id=?)as clg,(select count(Group_id)from project_group g2 where g2.Status_id='1' and g2.College_id=? and g2.Department_id=? ) as lag,(select count(Group_id)from project_group g3 where g3.Status_id=2 and g3.College_id=? and g3.Department_id=?) as ont,(select count(Group_id)from project_group g4 where g4.Status_id=3 and g4.College_id=? and g4.Department_id=?) as led,(select College_Name from college where College_id=? ) as collage,(select Department_Name from department where Department_id=?) as department from project_group g where g.College_id=? and g.Department_id=?"
    connection.query(sql, [cllg, depa, cllg, depa, cllg, depa, cllg, depa, cllg, depa,cllg, depa], (err, task, fields) => {
        if (err) {
            res.status(400).json({
                status: 'error',
                error: err,
            });
            console.log(err);
        }
        else {
            res.send(task)
        }

    });
})
router.get('/hodg/:clg/:dep', (req, res, next) => {
    var cllg = req.params.clg;
    var depa = req.params.dep;
    var sql = "select a.* ,b1.FullName, b2.FullName as guide2,c1.College_Name as clg,s1.Status_Name as Status ,dd1.Department_Name,d1.Domain_Name as dom1,d2.Domain_Name as dom2,d3.Domain_Name as dom3,d4.Domain_Name as dom4,pt.Project_Type_Name as TpOfProject,Co.Company_name from project_group a Join department dd1 on dd1.Department_id=a.Department_id  JOIN persons b1 on b1.Person_id=(select person_id from instructor where Instructor_id=a.Instructor_id1) Join persons b2 on b2.Person_id =(select person_id from instructor where Instructor_id=a.Instructor_id2) Join college c1 on c1.College_id=a.College_id Join project_domain d1 on d1.Domain_id=a.Domain_Pref_1 Join project_domain d2 on d2.Domain_id=a.Domain_Pref_2 Join project_domain d3 on d3.Domain_id=a.Domain_Pref_3 Join project_domain d4 on d4.Domain_id=a.final_domain Join status s1 on s1.Status_id=a.Status_id join project_type pt on pt.Project_Type_id=a.Project_Type_id join Company Co on Co.Company_id=(select Company_id from industryproject where industry_project_id=a.industry_project_id)  where a.Department_id=?"
    connection.query(sql, [depa], (err, task, fields) => {
        if (err) {
            res.status(400).json({
                status: 'error',
                error: err,
            });
            console.log(err);
        }
        else {
            res.send(task)
        }

    });
})
router.get('/hodgroups/:clg/:dep', (req, res, next) => {
    var clgs = req.params.clg;
    var dips = req.params.dep;
    var sql = "Select count(*) as total from persons where college=? and department=? and roleId=1"
    connection.query(sql, [clgs,dips], (err, groups, fields) => {
        if (err) {
            res.status(400).json({
                status: 'error',
                error: err,
            });
            console.log(err);
        }
        else {
            res.send(groups)
        }

    });
})
router.get('/hodstudnets/:clg/:dep', (req, res, next) => {
    var clgs = req.params.clg;  
    var dips = req.params.dep;
    var sql = "Select p.FullName as StudentName,g1.Group_Name,g2.Group_title,g3.Project_Type_id,g4.Status_id,g5.industry_project_id,p1.FullName as Guide from persons p Join project_group g1 on g1.Group_id=p.group_id Join project_group g2 on g2.Group_id=p.group_id Join project_group g3 on g3.Group_id=p.group_id Join project_group g4 on g4.Group_id=p.group_id Join project_group g5 on g5.Group_id=p.group_id  Join project_group g6 on g6.Group_id=p.group_id Join person p1 on p1.Person_Id=(select g.Instructor_id1 from project_group g where g.Group_id=p.group_id) where p.college=? and p.department=? and p.roleId=1"
    connection.query(sql, [clgs,dips], (err, students, fields) => {
        if (err) {
            res.status(400).json({
                status: 'error',
                error: err,
            });
            console.log(err);
        }
        else {
            res.send(students)
        }

    });
});


router.post('/hod/delete/:grpid',async(req,res)=>{
    //onsole.log("OK")
    //console.log(req.params.grpname);
    var delQ = `DELETE FROM project_group  WHERE Group_id = '${req.params.grpid}'; `;
    console.log(delQ);
    var deleted = await query(delQ);
    var delper = `DELETE FROM  persons WHERE Person_id IN (SELECT Person_id FROM learner WHERE Learner_id IN (SELECT Learner_id FROM learner_project_reg WHERE Group_id = '${req.params.grpid}' ));`;
    var deleted = await query(delper);
    var delper = `DELETE FROM  user_roles WHERE Person_id IN (SELECT Person_id FROM learner WHERE Learner_id IN (SELECT Learner_id FROM learner_project_reg WHERE Group_id = '${req.params.grpid}' ));`;
    var deleted = await query(delper);
    //var personidsQ = `SELECT Person_id FROM learner WHERE Learner_id IN (SELECT Learner_id FROM learner_project_reg WHERE Group_id = '${req.params.grpid}' );`
    //let personids = await query(personidsQ);
    var dellerner = `DELETE FROM learner WHERE Learner_id IN (SELECT Learner_id FROM learner_project_reg WHERE Group_id = '${req.params.grpid}' );`
    var deleted = await query(dellerner);
    var delfromlerreg = `DELETE FROM learner_project_reg WHERE Group_id = '${req.params.grpid}' ; `;
    var deleted = await query(delfromlerreg);
    

    
});


router.get('/domain/:dep',async(req,res)=>{
    var getdomQ = `SELECT * FROM project_domain WHERE Department_id = ${req.params.dep} ;`;
    var fireQ = await query(getdomQ);
    res.send(fireQ)
})
 

router.put('/updategrp',async(request, response)=>{  
   const { final_domain, Member, Group_Name, instructor1, instructor2 } = request.body;
   //console.log(final_domain+Group_Name+instructor1+instructor2)

   var UpdateQ = `UPDATE project_group SET final_domain = ${final_domain} , Instructor_id1 = ${instructor1}, Instructor_id2 = ${instructor2} WHERE Group_Name = '${Group_Name}' ; `;
   var fireQ = await query(UpdateQ);
   response.send("success")
   //response.send(utils.createResponse(fireQ));


})





module.exports = router