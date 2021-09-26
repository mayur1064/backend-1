var express = require('express')
var router = express()

const connection = require('../config/db')
router.get('/ftrquestions/:gi', (req, res, next) => {
    var gi = req.params.gi;
    var sql = "Select * from ftr_questions where ftr_master_id=?"
    connection.query(sql, [gi], (err, task, fields) => {
        if (err) {
            res.send('error: ' + err)
            console.log(err);
        }
        else {
            res.json(task);
        }
    });
})

router.post('/ftrquestions', (req, res, next) => {
    var ques = req.body.Ques;
    var ftrmsno = req.body.ftno;
    var count = req.body.cout;
    let j = 1;
    var errr = [];
    var flag = 0
    for (let i = 0; i < count; i++) {
        var sql = "INSERT INTO ftr_questions(question_number,ftr_master_id,question_text) VALUES (?,?,?)";
        connection.query(sql, [j, ftrmsno, ques[i].question], (err, task) => {
            if (err) {
                errr[i] = err;
                console.log(err);
            }
            else {
                flag = 1;
            }
        });
        j = j + 1;
    }
    if (flag == 0) {
        res.json(errr);
    }
    else {
        res.send("insertion done")
    }
});
module.exports = router