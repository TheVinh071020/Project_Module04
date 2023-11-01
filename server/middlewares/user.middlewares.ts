import db from "../ultils/database";
import mysql from "mysql2";


export const pagination = async (req:any, res:any, next:any) => {
  let { page_index, page_number } = req.query;
  try {
    if (!page_index || !page_number) {
      next();
    } else {
      let sql = `SELECT * FROM users LIMIT ? OFFSET ?`;
      let inserted = [
        Number(page_number),
        (Number(page_index) - 1) * Number(page_number),
      ];
      sql = mysql.format(sql, inserted);
      let result = await db.execute(sql);
      let result2 = await db.execute("SELECT COUNT(*) as count From users");

      let rows = result[0];
      let rows2:any = result2[0];
      res.status(200).json({
        messenge: "GET ALL",
        data: rows,
        length: rows2[0].count,
      });
    }
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};
