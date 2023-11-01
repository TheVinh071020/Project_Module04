import express from "express";
import db from "../ultils/database";
import { Request, Response } from "express";

import {filterByCategory, pagination} from "../middlewares/product.middlewares";


const router = express.Router();

router.get("/", filterByCategory, pagination, async (req:Request, res:Response) => {
  try {
    let result = await db.execute("SELECT * FROM product");
    let rows = result[0];
    res.status(200).json({
      messenge: "GET ALL",
      rows,
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
});

router.get("/:id", async (req:Request, res:Response) => {
  let { id } = req.params;
  try {
    let result = await db.execute(
      `SELECT p.*, c.description 
      FROM product as p
      inner join category as c
      on p.category_id = c.category_id
      WHERE p.product_id = ?`,
      [id]
    );
    let [rows]: any= result;
    if (rows.length === 0) {
      let result2 = await db.execute(
        `SELECT p.*, c.description
        FROM product as p
        inner join category as c
        on p.category_id = c.category_id
        WHERE p.product_id = ?`,
        [id]
      );
      let [rows2]:any = result2;
      res.status(200).json(rows2[0]);
    } else {
      let sources:any = [];
      let product = rows.reduce((pre:any, cur:any) => {
        sources.push(cur.source);
        return { ...cur, sources: [...sources] };
      }, {});
      //
      delete product.source;
      //
      res.status(200).json(product);
    }
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    let { name, category_id, title, price, number, sale, img } = req.body;
    let data = await db.execute(
      "INSERT INTO product (name, category_id, title, price, number, sale, img) VALUES(?, ?, ?, ?, ?, ?, ?)",
      [name, category_id, title, price, number, sale, img]
    );
    console.log(data);
    res.json({
      messenge: "Create product success",
    });
  } catch (error) {
    res.json({
      error,
      message: "Create product error",
    });
  }
});

router.put("/:id", async (req:Request, res:Response) => {
  let { id } = req.params;
  let { name, title, price, number, sale, category_id, img } = req.body;
  try {
    let updateProduct = await db.execute(
      `SELECT * FROM product WHERE product_id = ?`,
      [id]
    );
    let rowProduct:any = updateProduct[0];
    if (rowProduct === 0) {
      res.json({
        message: `Product với id = ${id} k tồn tại`,
      });
    } else {
      await db.execute(
        `UPDATE product SET name = ?, title =?, price = ?, number = ?,sale = ?,category_id = ?, img = ?  WHERE product_id = ?`,
        [
          name || rowProduct[0].name,
          title || rowProduct[0].title,
          price || rowProduct[0].price,
          number || rowProduct[0].number,
          sale || rowProduct[0].sale,
          category_id || rowProduct[0].category_id,
          img || rowProduct[0].img,
          id,
        ]
      );
      res.json({
        message: "Update product success",
      });
    }
  } catch (error) {
    res.json({
      messenge: "Update not success",
    });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute("DELETE FROM product WHERE product_id = ?", [id]);
    let data = await db.execute("SELECT * FROM product");
    let rows = data[0];
    res.json({
      message: "Đã delete thành công",
      rows,
    });
  } catch (error) {
    res.json({
      message: "Delete not success",
    });
  }
});

export default router;
