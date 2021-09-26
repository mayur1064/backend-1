var express = require('express')
var router = express()
var moment = require('moment')
const connection = require('../config/db')
current_date = new Date().toJSON().slice(0, 10)
// Get All Tasks
router.get('/done/:gi', (req, res, next) => {
    var gi = req.params.gi;
    var std1;
    var dud1;
    var du1;
    var st1;
    var tasks = [];
    var sql = "select * from week_status where group_id=?";
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
                    var sql1 = "Select T.*,p.FullName from project_task T join persons p on p.Person_id=T.Alloted_To where T.Group_id=? AND T.Status='Done' AND Due_Date between ? AND ?"
                    connection.query(sql1, [gi, st1, du1], (err, task, fields) => {
                        if (err) {
                            
                            console.log(err);
                        }
                        else {
                            if (task.length > 0) {
                               
                                tasks[0] = true
                                tasks[1] = task
                                res.send(tasks)
                            }
                            else {
                                var sql12 = "Select T.*,p.FullName from project_task T join persons p on p.Person_id=T.Alloted_To where T.Group_id=? AND  T.Status='Done' AND Due_Date between ? AND ?"
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
                                        res.send(tasks)
                                    }
                                });

                            }

                        }
                    });
                }
                
    });
})
router.post('/done', (req, res, next) => {

    var SN = req.body.SerialName;

    var sql = "update project_task Set Status='Done',Approved_Date=? where Task_id=?"
    connection.query(sql, [current_date, SN], (err, task) => {
        if (err) {
            res.send(err);
            console.log(err);
        }
        else {
            res.send('Task Added!').status(200)
        }
    });


})





module.exports = router
