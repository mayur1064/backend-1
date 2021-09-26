const e = require('express')
var express = require('express')
var router = express()
current_date = new Date().toJSON().slice(0, 10)
const connection = require('../config/db')
router.get('/pds/:gi', (req, res, next) => {
    var gi = req.params.gi;
    var sql = "select a.* ,pt.Project_Type_Name as type,C.Company_name as company,b1.FullName,b2.Mobile,b3.email, b4.FullName as guide2,b5.Mobile as guide2Mobile,b6.email as guide2email,c1.College_Name as clg,dd1.Department_Name,d1.Domain_Name as dom1,d2.Domain_Name as dom2,d3.Domain_Name as dom3,d4.Domain_Name as dom4 from project_group a Join department dd1 on dd1.Department_id=a.Department_id  JOIN persons b1 on b1.Person_id=(select ins.Person_id from instructor ins where ins.Instructor_id=a.Instructor_id1) JOIN persons b2 on b2.Person_id=(select ins.Person_id from instructor ins where ins.Instructor_id=a.Instructor_id1) JOIN persons b3 on b3.Person_id=(select ins.Person_id from instructor ins where ins.Instructor_id=a.Instructor_id1) Join persons b4 on b4.Person_id =(select ins.Person_id from instructor ins where ins.Instructor_id=a.Instructor_id2) Join persons b5 on b5.Person_id =(select ins.Person_id from instructor ins where ins.Instructor_id=a.Instructor_id2) Join persons b6 on b6.Person_id =(select ins.Person_id from instructor ins where ins.Instructor_id=a.Instructor_id2) Join college c1 on c1.College_id=a.College_id Join project_domain d1 on d1.Domain_id=a.Domain_Pref_1 Join project_domain d2 on d2.Domain_id=a.Domain_Pref_2 Join project_domain d3 on d3.Domain_id=a.Domain_Pref_3 Join project_type pt on pt.Project_Type_id=a.Project_Type_id Join company C on C.Company_id=(select ip.Company_id from industryproject ip where ip.industry_project_id=a.industry_project_id) Join project_domain d4 on d4.Domain_id=a.final_domain where a.Group_id=?"
    connection.query(sql, [gi], (err, task, fields) => {
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
router.post('/startingformpd/:gi', (req, res, next) => {
    var gi = req.params.gi;
    var proti = req.body.projecttitle;
    var obj = req.body.objectives;
    var sco = req.body.scopes;
    var plaph = req.body.planing;
    var desiph = req.body.design;
    var devlph = req.body.devlopment;
    var tesph = req.body.testing;
    var deplph = req.body.deployment;
    var sql = "Update project_group set Group_title=?,Objective=?,Scope=?,initial_Time=?,Design_Time=?,Devlopment_Time=?,Testing_Time=?,Deployment_Time=?,startDate=? where Group_id=?"
    connection.query(sql, [proti, obj, sco, plaph, desiph, devlph, tesph, deplph, current_date, gi], (err, task, fields) => {
        if (err) {
            res.status(400).json({
                status: 'error',
                error: err,
            });
            console.log(err);
        }
        else {

            res.send("Updated Successfully")

        }

    });
})

router.get('/std/:gi', (req, res, next) => {
    var gi = req.params.gi;
    var allstudnet = [];
    let k = 0;
    let flag = 0;
    let errr = []
    var sql1 = "select lpr.Learner_id from learner_project_reg lpr where lpr.Group_id=?"
    connection.query(sql1, [gi], (err, person, fields) => {
        if (err) {
            errr[0] = err;
            console.log(err);
            flag = 1;
            return;
        }
        else {
            for (let i = 0, j = 1; i < person.length; i++, j++) {
                var sql = "Select * from persons p where p.Person_id=(select l.Person_id from learner l where l.learner_id=?) and (p.roleId=1 or p.roleId=2)"
                connection.query(sql, [person[i].Learner_id], (err, task, fields) => {
                    if (err) {
                        errr[j] = err
                        flag = 1;
                        console.log(err);
                    }
                    else {
                        
                        allstudnet[k++] = task
                        while (Number(k) == Number(person.length)) {
                            if (flag == 1) {
                                res.send(errr);
                            }
                            else {
                                res.send(allstudnet);
                            }
                            return;
                        }
                    }

                });
            }
        }

    });
})

router.get('/profile/:gi', (req, res, next) => {
    var gi = req.params.gi;
    var sql = "Select g.Group_title,g.Group_Name,P.FullName as FaultyGuide ,P1.FullName as IndustryFaultyGuide , P1.Mobile as IndustryFaultyGuideMo ,pt.Project_Type_Name as type, d.Department_Name,c.College_Name , cp.Company_name , cp.Company_id from project_group g Join department d on d.Department_id=g.Department_id Join project_type pt on pt.Project_Type_id=g.Project_Type_id Join college c on c.College_id=g.College_id Join persons P on P.Person_id=(select ins.Person_id from instructor ins where ins.Instructor_id=g.Instructor_id1) Join persons P1 on P1.Person_id=(select ins.Person_id from instructor ins where ins.Instructor_id=g.Instructor_id_industry) JOIN company cp on cp.Company_id = (SELECT indus.Company_id FROM industryproject indus WHERE indus.industry_project_id = g.industry_project_id) where g.Group_id=?"
    connection.query(sql, [gi], (err, profile, fields) => {
        if (err) {  
            res.status(400).json({
                status: 'error',
                error: err,
            });
            console.log(err);
        }
        else {
            res.send(profile)
        }

    });
})




router.get('/getstartdate/:gi', (req, res, next) => {
    var gi = req.params.gi;
    var sql = "select g.*,(select f.FullName from persons f where f.Person_id=(select ins.Person_id from instructor ins where ins.instructor_id=(select gr.Instructor_id1 from project_group gr where gr.Group_id=(select lrp.Group_id from learner_project_reg lrp where lrp.Learner_id=(select le.Learner_id from learner le where le.Person_id=?))))) as FullName from project_group g where g.Group_id=(select lr.Group_id from learner_project_reg lr where lr.Learner_id=(select l.Learner_id  from learner l where l.Person_id=?))"
    connection.query(sql, [gi, gi], (err, person, fields) => { 
        if (err) {
            res.status(400).json({
                status: 'error',
                error: err,
            });
            console.log(err);
        }
        else {
            res.send(person)
        }

    });
})



router.get('/college', (req, res, next) => {
    var sql = "Select * from college"
    connection.query(sql, (err, task, fields) => {
        if (err) {
            res.status(400).json({
                status: 'error',
                error: err,
            });
        }
        else {
            res.send(task)
        }

    });
});
router.get('/groups/:gi', (req, res, next) => {
    var gid = req.params.gi
    var groupleader = [];
    var kk=1;
    var sql = "Select Group_id,Group_Name,startDate,(select p6.FullName from persons p6 where p6.roleId=3 and p6.Person_id=(select ins.Person_id from instructor ins where ins.Instructor_id=(select gp.Instructor_id1 from project_group gp where gp.Group_id=? limit 1))) as Guidename from project_group where Group_id=?"
    connection.query(sql, [gid, gid], (err, group, fields) => {
        if (err) {
            res.send(err)
            console.log(err);
        }
        else {
           // console.log(group);
            groupleader[0] = group;
            var sql2 = "select lpr.Learner_id from learner_project_reg lpr where lpr.Group_id=?"
            connection.query(sql2, [gid], (err, learner) => {
                if (err) {
                    res.send(err)
                    console.log(err);
                }
                else {
                    console.log(learner);
                    console.log("leaner"+learner.length);
                    for (let k = 0; k < learner.length; k++) {
                        
                        sql3 = "select l.Person_id from learner l where l.learner_id=?"
                        connection.query(sql3, [learner[k].Learner_id], (err, person) => {
                            if (err) {
                                res.send(err)
                                console.log(err);
                            }
                            else {
                               
                                for (let l = 0; l < person.length; l++) { 
                                    console.log(person[l].Person_id);
                                    var sql4 = "select p.FullName as leadername,p.Mobile as leadermobile, p.email as leaderemail from persons p where p.Person_id=? and p.roleId=1"
                                    connection.query(sql4, [person[l].Person_id], (err, leader) => {
                                        if (err) {
                                            res.send(err);
                                            console.log(err);
                                        }
                                        else {
                                           
                                            
                                            while (Number(kk) <= Number(person.length)+1){
                                            console.log("k "+kk);
                                            if (leader[0]) {
                                                groupleader[kk++] = leader;
                                               // res.send(groupleader)

                                            }
                                             if(Number(kk) == Number(person.length)+1){
                                               // groupleader[0]=group
                                                console.log(groupleader);
                                                res.send(groupleader)
                                            }
                                        }
                                        }
                                    });
                                }
                            }
                        })
                    }
                }
            })
        }
    })
})



router.get('/department/:clg', (req, res, next) => {
    var clgs = req.params.clg;
    var sql = "Select * from department where College_id=?"
    connection.query(sql, [clgs], (err, task, fields) => {
        if (err) {
            res.status(400).json({
                status: 'error',
                error: err,
            });
        }
        else {
            res.send(task)
        }

    });
})

module.exports = router