var express = require('express')
var router = express()
current_date = new Date().toJSON().slice(0, 10)
const connection = require('../config/db')
router.get('/ftrproject/:ftrno/:gi', (req, res, next) => {
    var ftrno = req.params.ftrno;
    var gi =req.params.gi;
    var sql = "Select f.Submit_Date,f.Approved_date from ftr_project_group f where f.group_id=? and f.ftr_master_id=?"
    connection.query(sql, [gi,ftrno], (err,Project, fields) => {
        if (err) {
            res.send('error: ' + err)
            console.log(err);
        }
        else {
           res.json(Project);
        }
    });
})

router.post('/ftrproject', (req, res, next) => {
    var gi=req.body.groupid;
    var ftrno=req.body.ftrno;
    var sql = "Insert into ftr_project_group(group_id,ftr_master_id,Submit_Date) values(?,?,?)"
    connection.query(sql, [gi,ftrno,current_date], (err, task) => {
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

})

router.put('/ftrproject', (req, res, next) => {
    var gi=req.body.groupid;
    var ftrmasterno=req.body.ftrmasterno;
    var remark = req.body.remark;
    var reviewerid=req.body.reviewid;
    var tr = true;
    var sql = "update ftr_project_group set isreviewdone=?,reviewer_id=?,review=?,Approved_date=? where group_id=? and ftr_master_id=?"
    connection.query(sql, [tr, reviewerid, remark,current_date,gi,ftrmasterno], (err, task) => {
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

})
module.exports = router