var express = require('express')
var router = express()

const connection = require('../config/db')
router.get('/ftranswer/:ftrno/:gi', (req, res, next) => {
    var ftrno = req.params.ftrno;
    var gi =req.params.gi;
    var sql = "Select fqg.*,fq.question_text from ftr_question_ftr_group fqg INNER join ftr_questions fq on  fqg.ftr_question_id=fq.ftr_questions_id where fqg.ftr_master_id=? and fqg.ftr_project_group_id=?"
    connection.query(sql, [ftrno,gi], (err, task, fields) => {
        if (err) {
            res.send('error: ' + err)
            console.log(err);
        }
        else {

            res.json(task);

        }
    });
})

router.post('/ftranswer', (req, res, next) => {
    var ftr = req.body.ftr;
    var gi = req.body.groupid;
    var count = req.body.cout;
    let j = 1;
    var errr = [];
    var flag = 0
    for (let i = 0; i < count; i++) {
        var sql = "INSERT INTO ftr_question_ftr_group(ftr_question_id,ftr_project_group_id,ftr_master_id,Answer) VALUES (?,?,?,?)";
        connection.query(sql, [ftr[i].ftr_questions_id, gi, ftr[i].ftr_master_id, ftr[i].Answer], (err, task) => {
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

router.put('/ftranswer', (req, res, next) => {

    var ftr = req.body.ftr;
    var gi = req.body.groupid;
    let j = 1;
    var errr = [];
    var flag = 0;

    for (let i = 0; i <ftr.length; i++) {
        var sql = "update ftr_question_ftr_group set Answer=? where ftr_ques_gro_id ";
        connection.query(sql, [ftr[i].Answer , ftr[i].ftr_ques_gro_id], (err, task) => {
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