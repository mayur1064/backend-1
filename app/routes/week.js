var express = require('express')
var router = express()
const connection = require('../config/db')
current_date = new Date().toJSON().slice(0, 10)
var moment = require('moment')
const { end } = require('../config/db')

router.get('/addformweek/:gi', (req, res, next) => {
    var gi=req.params.gi;
    var sql = "Select * from project_group where Group_id=?"
    connection.query(sql,[gi] ,(err, task, fields) => {
        if (err) {
            console.log(err);
        }
        else {
            task.forEach(element => {
                var total = element.initial_Time + element.Design_Time + element.Devlopment_Time + element.Testing_Time + element.Deployment_Time;
                let j = 1; 
                const startdate = new Date(element.startDate);
                const enddate = new Date(element.startDate);

                while (moment(startdate).format('dddd') != 'Monday'){
                    startdate.setDate(startdate.getDate() + 1);
                    enddate.setDate(enddate.getDate() + 1);
                }
                enddate.setDate(enddate.getDate() + 6);
                for (let i = 0; i < total; i++) {
                    var sql = "INSERT INTO week_status(week,No_of_tasks,Group_id,status,start_date,due_date) VALUES (?,?,?,?,?,?)";
                    connection.query(sql, [j, 0,gi, 2, startdate, enddate], (err, task) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                    j = j + 1;
                    startdate.setDate(startdate.getDate() + 7);
                    enddate.setDate(enddate.getDate() + 7);
                }
            })
            console.log("week called");
            res.send("Week Addition Done")
        }   
    });
})
router.get('/week/:gi', (req, res) => {
    var gi = req.params.gi;
    var sql = "select w.week as name,w.No_of_tasks as value from week_status w where w.Group_id=?";
    connection.query(sql, [gi], (err, week) => {
        if (err) {
            res.status(400).json({
                error: err
            });
            console.log(err);
        }
        else {
            res.send(week);
        }
    })
})
router.post('/week/:gi', (req, res, next) => {
    var gi = req.params.gi;
    var due_date = req.body.DueDate;
    var sql1 = "select * from week_status where Group_id=?";
    var th = 0;

    connection.query(sql1, [gi], (err, week) => {
        if (err) {
            console.log(err);
        }
        else {

        }
        for (let j = 0; j < week.length; j++) {
            const std = new Date(week[j].start_date);
            const dud = new Date(week[j].due_date);
            const stdate = moment(std).format('YYYYMMDD')
            const enddate = moment(dud).format('YYYYMMDD')
            const tdtd = moment(due_date).format('YYYYMMDD')
            if (tdtd >= stdate && tdtd <= enddate) {

                th = week[j].No_of_tasks + 1;
                id = week[j].week_status_id;
                var sql23 = "update week_status set No_of_tasks=? where week_status_id=?"
                connection.query(sql23, [th, id], (err, week) => {
                    if (err) {
                        console.log(err);
                    }
                    else {

                    }
                });
            }



        }

    });
});
router.put('/week/:gi', (req, res, next) => {

    var groupid = req.params.gi
    var std1;
    var dud1;
    var SN;
    var std;
    var dud;
    var lag = 0;
    var led = 0;
    var ont = 0;
    var Status;
    var sql = "select * from week_status where Group_id=?";
    connection.query(sql, [groupid], (err, week) => {
        if (err) {
            console.log(err);

        }
        else {
            for (let j = 0; j < week.length; j++) {
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
        var sql1 = "select * from project_task where Due_Date between ? AND ?"
        connection.query(sql1, [std1, dud1], (err, task) => {
            if (err) {
                console.log(err);
            }
            else {
                for (let i = 0; i < task.length; i++) {
                    if (task[i].Task_status == 1) {
                        lag = lag + 1;
                    }
                    else if (task[i].Task_status == 3) {
                        led = led + 1;
                    }
                    else {
                        ont = ont + 1;
                    }
                }

                if (led == 0) {
                    if (Number(task.length) * 0.03 >= lag) {
                        Status = 1;
                    }
                    else if (lag > led) {
                        Status = 1;
                    }
                    else {
                        Status = 2;
                    }
                }
                else if (lag == led) {
                    Status = 2;
                }

                else if (led > lag) {
                    Status = 3;
                }
                else if (lag < led) {
                    Status = 1;
                }

                else {
                    Status = 3;
                }
            }

            var sql2 = "update week_status set status=? where week_status_id= ?";
            connection.query(sql2, [Status, SN], (err, task) => {
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
    });
});
module.exports = router