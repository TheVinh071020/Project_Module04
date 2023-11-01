
import mysql2, { Pool, PoolOptions } from "mysql2";


const databaseConfig: PoolOptions = {
  database: "project_module3",
  host: "localhost",
  user: "root",
  password: "07102000",
  port: 3306,
};

const database: Pool = mysql2.createPool(databaseConfig);


export default database.promise();
