var express = require('express')
var router = express()
current_date = new Date().toJSON().slice(0, 10)
const connection = require('../config/db')  
router.get('/deletes/:gi', (req, res, next) => {
    var gi = req.params.gi;
    var sql = "Select * from project_task where Group_id=? AND Status='Deleted'"
    connection.query(sql, [gi], (err, task, fields) => {
        if (err) {
            res.status(400).json({
                status: 'error',
                error: err,
            });
        }
        else {
            res.send(task);
        }
    });
})

router.post('/deletes', (req, res, next) => {
    var SN = req.body.SerialName;
    var dd = req.body.DueDate;
    var sql = "update project_task set Status='None',Start_date=?,Due_Date=? where Task_id= ?";
    connection.query(sql, [current_date, dd, SN], (err, task) => {
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


