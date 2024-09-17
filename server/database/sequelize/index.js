const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  "archive",
  "root",
  "root",
  {
    host: "localhost",
    dialect: "mysql",
  }
);
const db={}
db.clients=require('../models/clients/client')(sequelize,DataTypes)
db.user=require('../models/user/user')(sequelize,DataTypes)
db.Archive = require('../models/archive/archive')(sequelize, DataTypes);
db.Sequelize = Sequelize;
db.Sequelize=sequelize
// Define associations
db.clients.hasMany(db.Archive, { foreignKey: 'clientId', as: 'archives' });
db.Archive.belongsTo(db.clients, { foreignKey: 'clientId', as: 'client' });
sequelize.authenticate().then(()=>{
  console.log("good")
}).catch((err)=>{console.log(err,"Unable to connected")})



// sequelize
//   .sync({ force: false }) 
//   .then(async () => {
//     console.log("Database synchronized successfully");
   
//   })
//   .catch((error) => {
//     console.error("Unable to synchronize the database:", error);
//   });


module.exports=db
