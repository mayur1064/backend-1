var express = require('express')
var router = express()
const connection = require('../config/db')
current_date = new Date().toJSON().slice(0, 10)
var moment = require('moment')
// Get All Tasks'
router.get('/doing/:gi', (req, res, next) => {
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

                    var sql1 = "Select T.*,p.FullName from project_task T join persons p on p.Person_id=T.Alloted_To where T.Group_id=? AND (T.Status='Doings' OR T.Status='Waiting') AND T.Due_Date between ? AND ?"
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
                                var sql12 = "Select T.*,p.FullName from project_task T join persons p on p.Person_id=T.Alloted_To where T.Group_id=? AND (T.Status='Doings' OR T.Status='Waiting') AND T.Due_Date between ? AND ?"
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
                                        tasks[2]=std1
                                        tasks[3]
                                        res.send(tasks)
                                    }
                                });

                            }

                        }
                    });
                }
              
    });
})
router.get('/reject/:gi', (req, res, next) => {
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

                    var sql1 = "Select T.*,p.FullName from project_task T join persons p on p.Person_id=T.Alloted_To where T.Group_id=? AND T.Status='Reject' AND Due_Date between ? AND ?"
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
                                var sql1 = "Select T.*,p.FullName from project_task T join persons p on p.Person_id=T.Alloted_To where T.Group_id=? AND  T.Status='Rejected' AND Due_Date between ? AND ?"
                                connection.query(sql1, [gi, std1, dud1], (err, tass, fields) => {
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



router.post('/doing/:gi', (req, res, next) => {
    var SN = req.body.SerialName;
 
    var sql = "update project_task Set Status='Doings',Start_date=? where Task_id=? "
    connection.query(sql, [current_date, SN], (err, task) => {
        if (err) {
            res.send('error:' + err)
            console.log(err);
        }
        else {
            res.send('Task Added!')
        }
    })

})



router.put('/doing', (req, res, next) => {
    var SN = req.body.SerialName;
    var re = req.body.Reason;
    var ndd = req.body.Due_date;
    var sql = "select * from project_task where Task_id= ?";
    connection.query(sql, [SN], (err, reject) => {
        if (err) {
            res.send('error:' + err)
            console.log(err);
        }
        else {

    var tr=reject[0].Rejected_count+1;
    var sql = "update project_task set Status='Rejected', Reason=?, Due_Date=?,Rejected_count=? where Task_id= ?";
    connection.query(sql, [re, ndd,tr, SN], (err, task) => {
        if (err) {
            res.send('error:' + err)
            console.log(err);
        }
        else {
            res.send('Task Deleted')
        }
    })
}
    });
})

router.get('/rejectedtask/:id',(req,res,next)=>{
    var id =req.params.id;
    let i=0;
    let rejected=[];
    var k=0;
    var sql = "select g.* from project_group g where g.Instructor_id1=(select Instructor_id from instructor where Person_id=?) "
    connection.query(sql,[id],(err,groups)=>{
        if(err){
            res.send(err)
            console.log(err);
        }
        else{
            for(i=0;i<groups.length;i++){
              
            var sql1 = "Select count(t.Task_id) as id from project_task t where t.group_id=? and t.Rejected_count > 0"
            connection.query(sql1,[groups[i].group_id],(err,counts)=>{
                if(err)
                {
                    res.send(err);
                    console.log(err);
                }
                else{              
                    rejected[k]=counts;
                    k=k+1;
                    while(Number(k) == Number(groups.length))
                    {
                        res.send(rejected); 
                        return;
                    }
                }
            })
        }
    }
   
    })

})

module.exports = router
