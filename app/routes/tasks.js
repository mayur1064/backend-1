var express = require('express')
var router = express()
current_date = new Date().toJSON().slice(0, 10)
const connection = require('../config/db')
var moment = require('moment')
// Get All Tasks'

router.get('/task/:gi', (req, res, next) => {
    var gi = req.params.gi;
    var std1;
    var dud1;
    var du1;
    var st1;
    var boole;
    var tasks = [];
    var sql = "select ws.* from week_status ws where ws.group_id=?";
    connection.query(sql, [gi], (err, week) => {
        if (err) {
            console.log(err);

        }
        else {
            for (let j = 0; j < week.length; j++) {
                if (week[j].week > 1) {
                    std = new Date(week[j].start_date);
                    dud = new Date(week[j].due_date);
                    st = new Date(week[j - 1].start_date);
                    du = new Date(week[j - 1].due_date);
                    const stdate = moment(std).format('YYYYMMDD')
                    const enddate = moment(dud).format('YYYYMMDD')
                    const tdtd = moment(current_date).format('YYYYMMDD')
                    if (tdtd >= stdate && tdtd <= enddate) {
                        SN = week[j].week_status_id;
                        std1 = moment(stdate).format()
                        dud1 = moment(enddate).format()
                        st1 = new Date(st);
                        du1 = new Date(du);

                    }
                }
                else{
                    std = new Date(week[j].start_date);
                    dud = new Date(week[j].due_date);
                    const stdate = moment(std).format('YYYYMMDD')
                    const enddate = moment(dud).format('YYYYMMDD')
                    const tdtd = moment(current_date).format('YYYYMMDD')
                    if (tdtd >= stdate && tdtd <= enddate) {
                        SN = week[j].week_status_id;
                        std1 = moment(stdate).format()
                        dud1 = moment(enddate).format()
                    }

                }
            }
            var sql1 = "Select T.*,p.FullName from project_task T join persons p on p.Person_id=T.Alloted_To where T.Group_id=? AND T.Status='None' AND T.Due_Date between ? AND ?"
            connection.query(sql1, [gi, st1, du1], (err, task, fields) => {
                if (err) {
                    console.log(err);
                }
                else {
                    if (task.length > 0) {
                        tasks[0] = true
                        tasks[1] = task
                        tasks[2] = std1
                        tasks[3] = dud1
                        res.send(tasks)
                    }
                    else {
                        var sql12 = "Select T.*,p.FullName from project_task T join persons p on p.Person_id=T.Alloted_To where T.Group_id=? AND  T.Status='None' AND T.Due_Date between ? AND ?"
                        connection.query(sql12, [gi, std1, dud1], (err, tass, fields) => {
                            if (err) {
                                res.status(400).json({
                                    status: 'error',
                                    error: err,
                                });
                                console.log(err);
                            }
                            else {
                              
                                tasks[0] = false
                                tasks[1] = tass;
                                tasks[2] = std1
                                tasks[3] = dud1
                                res.send(tasks)
                            }
                        });

                    }

                }
            });
             }

    });
})

router.get('/tasks/:gi', (req, res, next) => {
    var gi = req.params.gi;
    var sql = "Select T.*,p.FullName,s.Status_Name from project_task T join persons p on p.Person_id=T.Alloted_To join status s on s.Status_id=T.Task_status where T.Group_id=? "
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

router.get('/profiletask/:pid', (req, res, next) => {
    var pid = req.params.pid;
    var sql = "Select Count(*) as total,(select Count(*) from project_task t1 where t1.Alloted_To=? and t1.Status='Done')as Completed,(select Count(*) from project_task t2 where t2.Alloted_To=? and not t2.Status='Done')as Remaining from project_task t where t.Alloted_To=? "
    connection.query(sql, [pid, pid, pid], (err, task, fields) => {
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

router.post('/task/:gi', (req, res, next) => {
    var gi = req.params.gi;
    const userData = {
        taskname: req.body.taskname,
        allotedTo: req.body.allotedTo,
        DueDate: req.body.DueDate
    }
    var Status = "None";
    if (!userData) {
        res.status(400)
        res.json({
            status: 'error',
            error: 'Bad Data'
        })
    } else {
        var sql = "insert into project_task(Group_id,Task_Name,Alloted_To,Due_Date,Status) value(?,?,?,?,?)"
        connection.query(sql, [gi, userData.taskname, userData.allotedTo, userData.DueDate, Status], (err, task) => {
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
        })
    }
})



// Update Task
router.put('/task', (req, res, next) => {
    var SN = req.body.SerialName;
    var sql = "update project_task set Status='Deleted', Deleted_Date=? where Task_id= ?";
    connection.query(sql, [current_date, SN], (err, task) => {
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


module.exports = router

