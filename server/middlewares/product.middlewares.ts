import db from "../ultils/database";
import mysql from "mysql2";
import { Request, Response } from "express";

export const filterByCategory = async (req:Request, res:Response, next:any) => {
  const { category, page_index, page_number } = req.query;
  try {
    if (typeof category == "undefined") {
      next();
    } else {
      let sql = `
      SELECT p.product_id, p.name, p.number, p.title, p.price, p.sale, p.img, c.name as description_name, c.description 
      FROM product as p
      INNER JOIN category as c
      ON p.category_id = c.category_id
      WHERE c.name = ? ${!page_number ? "" : "LIMIT ?"} ${
        !page_number ? "" : "OFFSET ?"
      }
      `;
      let inserted = [
        category,
        Number(page_number),
        Number(+(page_index as any)  - 1) * Number(page_number) || 0,
      ];
      sql = mysql.format(sql, inserted);
      let result = await db.execute(sql);
      let result2 = await db.execute(
        `
      SELECT COUNT(*) as count FROM product as p INNER JOIN category as c 
      ON p.category_id = c.category_id 
      WHERE c.name = ?
      `,
        [category]
      );
      
      let rows = result[0];
      let rows2: any = result2[0];
      res.status(200).json({
        messenge: "GET ALL",
        data: rows,
        length: rows2[0]!.count,
      });
    }
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

export const pagination = async (req:Request, res:Response, next:any) => {
  let { page_index, page_number } = req.query;
  try {
    if (!page_index || !page_number) {
      next();
    } else {
      let sql = `SELECT p.*, c.description FROM product AS p INNER JOIN category AS c ON c.category_id = p.category_id LIMIT ? OFFSET ?`;
      let inserted = [
        Number(page_number),
        (Number(page_index) - 1) * Number(page_number),
      ];
      sql = mysql.format(sql, inserted);
      let result = await db.execute(sql);
      let result2 = await db.execute("SELECT COUNT(*) as count From product");
      
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
