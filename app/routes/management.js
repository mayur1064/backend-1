var express = require('express')
var router = express()
const util = require('util');



const connection = require('../config/db')
const query = util.promisify(connection.query).bind(connection);
const { route } = require('./tasks')

router.get('/tablemanagement', (req, res, next) => {
    
    var sql = " select a.* ,b1.FullName,t1.Project_Type_Name as Type,i1.Company_name as company, b2.FullName as guide2,c1.College_Name as clg,s1.Status_Name as Status ,dd1.Department_Name,d1.Domain_Name as dom1,d2.Domain_Name as dom2,d3.Domain_Name as dom3,d4.Domain_Name as dom4 from project_group a Join department dd1 on dd1.Department_id=a.Department_id  JOIN persons b1 on b1.Person_id= (SELECT indus1.Person_id from instructor indus1 WHERE indus1.Instructor_id = a.Instructor_id1 ) Join persons b2 on b2.Person_id = (SELECT indus2.Person_id from instructor indus2 WHERE indus2.Instructor_id = a.Instructor_id2 ) Join college c1 on c1.College_id=a.College_id Join project_domain d1 on d1.Domain_id = a.Domain_Pref_1 Join project_domain d2 on d2.Domain_id=a.Domain_Pref_2 Join project_domain d3 on d3.Domain_id = a.Domain_Pref_3 Join project_domain d4 on d4.Domain_id=a.final_domain Join project_type t1 on t1.Project_Type_id=a.Project_Type_id join company i1 on i1.Company_id= (select Company_id from industryproject ip where ip.industry_project_id=a.industry_project_id) Join status s1 on s1.Status_id=a.Status_id "
    connection.query(sql, (err, tablemanagement, fields) => {
        if (err) {
            res.status(400).json({
                status: 'error',
                error: err,
            });
            console.log(err);
        }
        else {
            res.send(tablemanagement)
        }

    });
})
router.get('/management', (req, res, next) => {
    var sql = "select g.Group_id,(select count(Group_id)from project_group g1 )as clg,(select count(Group_id)from project_group g2 where g2.Status_id='1' ) as lag,(select count(Group_id)from project_group g3 where g3.Status_id=2 ) as ont,(select count(Group_id)from project_group g4 where g4.Status_id=3) as led from project_group g order by Group_Name "
    connection.query(sql,  (err, management, fields) => {
        if (err) {
            res.status(400).json({
                status: 'error',
                error: err,
            });
            console.log(err);
        }
        else {
            res.send(management)
        }

    });
})
router.get('/hometablemanagement', (req, res, next) => {
    var sql = "select g.Group_id,(select count(Group_id)from project_group g1 where g1.Project_Type_id='1' and g1.Status_id=1 and g1.College_id=1 )as vitlagind,(select count(Group_id)from project_group g2 where g2.Project_Type_id='1' and g2.Status_id=2 and g2.College_id=1 )as vitontind,(select count(Group_id)from project_group g3 where g3.Project_Type_id='1' and g3.Status_id=3 and g3.College_id=1 )as vitledind,(select count(Group_id)from project_group g4 where g4.Project_Type_id='2' and g4.Status_id='1' and g4.College_id=1 ) as vitinhlag,(select count(Group_id)from project_group g5 where g5.Project_Type_id='2' and g5.Status_id=2  and g5.College_id=1 ) as vitinhont,(select count(Group_id)from project_group g6 where g6.Project_Type_id='2' and g6.Status_id=3  and g6.College_id=1) as vitinhled,(select count(Group_id)from project_group g7 where g7.Project_Type_id='1' and g7.Status_id=1 and g7.College_id=2 )as viitlagind,(select count(Group_id)from project_group g8 where g8.Project_Type_id='1' and g8.Status_id=2 and g8.College_id=2 )as viitontind,(select count(Group_id)from project_group g9 where g9.Project_Type_id='1' and g9.Status_id=3 and g9.College_id=2 )as viitledind,(select count(Group_id)from project_group g10 where g10.Project_Type_id='2' and g10.Status_id='1'  and g10.College_id=2 ) as viitinhlag,(select count(Group_id)from project_group g11 where g11.Project_Type_id='2' and g11.Status_id=2  and g11.College_id=2 ) as viitinhont,(select count(Group_id)from project_group g12 where g12.Project_Type_id='2' and g12.Status_id=3  and g12.College_id=2) as viitinhled,(select count(Group_id)from project_group g13 where g13.Project_Type_id='1' and g13.Status_id=1 and g13.College_id=3 )as vulagind,(select count(Group_id)from project_group g14 where g14.Project_Type_id='1' and g14.Status_id=2 and g14.College_id=3 )as vuontind,(select count(Group_id)from project_group g15 where g15.Project_Type_id='1' and g15.Status_id=3 and g15.College_id=3 )as vuledind,(select count(Group_id)from project_group g16 where g16.Project_Type_id='2' and g16.Status_id='1'  and g16.College_id=3 ) as vuinhlag,(select count(Group_id)from project_group g17 where g17.Project_Type_id='2' and g17.Status_id=2  and g17.College_id=3 ) as vuinhont,(select count(Group_id) from project_group g18 where g18.Project_Type_id='2' and g18.Status_id=3  and g18.College_id=3) as vuinhled,(select count(Group_id) from project_group g18 where g18.College_id=1) as vit,(select count(Group_id) from project_group g18 where g18.College_id=2) as viit,(select count(Group_id) from project_group g18 where g18.College_id=3) as vu from project_group g order by g.Group_Name"
    connection.query(sql,  (err, hometablemanagement, fields) => {
        if (err) {
            res.status(400).json({
                status: 'error',
                error: err,
            });
            console.log(err);
        }
        else {  
            res.send(hometablemanagement)
        }

    });
})


router.post('/addcmp/:name',async (req,res)=>{
    var addQ = "INSERT INTO `company` (`Company_id`, `Company_name`) VALUES (NULL, ? );";
    var insertion = await query(addQ,[req.params.name]);



})

module.exports = router
