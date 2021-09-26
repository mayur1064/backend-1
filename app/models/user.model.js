module.exports = (sequelize, Sequelize) => {
    const Person = sequelize.define("persons", {
      Person_Id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      //group_id:{
       //   type:Sequelize.INTEGER,
          
      //},
      FullName:{
        type:Sequelize.STRING
      },
      department:{
        type:Sequelize.STRING
      },
      grno_EmpCode:{
        type:Sequelize.STRING
      },
      username:{
        type:Sequelize.STRING
      },
      roleId:{
        type:Sequelize.INTEGER
      },
      usertype_id:{
        type:Sequelize.INTEGER
      },
      college:{
        type:Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      Mobile:{
        type:Sequelize.BIGINT
      },
      password: {
        type: Sequelize.STRING
      }
    });
  
    return Person;
  };