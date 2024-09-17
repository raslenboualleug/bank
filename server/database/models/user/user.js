

module.exports=(sequelize,DataTypes)=>{
    const user=sequelize.define("user",{
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, 
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'admin',
      }
    });
 return  user
}