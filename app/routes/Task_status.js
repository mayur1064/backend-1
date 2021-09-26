var express = require('express')
var router = express()
current_date = new Date()
const connection = require('../config/db')
var moment = require('moment')
const e = require('express')
// Get All Tasks'
router.get('/task_status', (req, res, next) => {
    var sql = "Select * from project_task"
    var error = [];
    var flag = 0;
    connection.query(sql, (err, task, fields) => {
        if (err) {
            error[0] = err;
            console.log(err);
        }
        else {
            flag = 1;
        }
        let j = 1;

        for (let i = 0; i < task.length; i++) {
            var Status;
            var td = new Date(current_date);
            var tdd = moment(td).format("YYYYMMDD");
            var dt = new Date(task[i].Due_Date);
            var dtt = moment(dt).format("YYYYMMDD");
            if (!task[i].Approved_Date) {
                if (dtt < tdd) {
                    Status = 1;

                }
                else {
                    Status = 2;

                }

                var sql = "update project_task set Task_status =? where Task_id=?";
                connection.query(sql, [Status, task[i].id], (err, task) => {
                    if (err) {
                        error[j] = err;
                        console.log(err);
                    }
                    else {
                        flag = 1;
                    }
                })
                j = j + 1;
            }
        }
        if (flag == 0) {
            res.status(400).json({
                status: 'error',
                error: err,
            });
        }
        else {
            res.status(200).json('update successful');
        }

    });
})


router.post('/task_status', (req, res, next) => {
    var SN = req.body.SerialName;
    var errors = [];
    var Status;
    var sql = "select * from project_task where Task_id=? ";
    connection.query(sql, [SN], (err, task) => {
        if (err) {

            errors[0] = err;
        }
        else {
            flag = 1;
        }
        console.log(task);
        var dt = new Date(task[0].Due_Date);
        var dtt = moment(dt).format("YYYYMMDD");
        var at = new Date(current_date);
        var att = moment(at).format("YYYYMMDD");
        if (att > dtt) {

            Status = 1;
        }
        else if (att < dtt) {

            Status = 3;
        }
        else {

            Status = 2;
        }

        var sql2 = "update project_task set Task_status =? where Task_id=?";
        connection.query(sql2, [Status, SN], (err, task) => {
            if (err) {
                errors[1] = err;
                console.log(err);
            }
            else {
                flag = 1;
            }
            if (flag == 0) {
                res.status(400).json({
                    error: errors
                })
            }
            else {
                res.status(200).json("done")
            }
        })
    })
})



// Update Task
router.put('/task', (req, res, next) => {
    var sql = "update project_task set Status='Deleted', Delete_Date=? where Task_id= ?";
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
