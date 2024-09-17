
module.exports=(sequelize,DataTypes)=>{
    const client=sequelize.define("client",{
        fullname: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          address: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
          },
          email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
              isEmail: true,
            },
          },
          cardNumber: {
            type: DataTypes.INTEGER,
            allowNull: true,
            unique: true,
          },
          CINFront: {
            type: DataTypes.STRING, 
            allowNull: true,
          },
          CINBack: {
            type: DataTypes.STRING, 
            allowNull: true,
          },
          birthday: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          gender: {
            type: DataTypes.STRING,
            allowNull: true,
          }



    })
 return  client
}