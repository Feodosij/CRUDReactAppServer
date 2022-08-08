import {Sequelize} from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Card = db.define('heroes',{
    name: DataTypes.STRING,
    real_name: DataTypes.STRING,
    origin_description: DataTypes.STRING,
    superpowers: DataTypes.STRING,
    catch_phrase: DataTypes.STRING,
    image: DataTypes.STRING,
    url: DataTypes.STRING
},{
    freezeTableName: true
});

export default Card;

(async()=>{
    await db.sync();
})();