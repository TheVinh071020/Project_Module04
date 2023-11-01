import express from "express";
import db from "../ultils/database";
import { Request, Response } from "express";

const router = express.Router();


router.get("/", async (req:Request, res:Response) => {
  try {
    let result = await db.execute(
      `
      SELECT distinct o.order_id , o.user_id, o.order_name, o.status, o.email, o.phone, o.address from order_detail as od 
      JOIN \`order\` as o ON od.order_id = o.order_id
       `
    );
    let rows = result[0];    
    res.json({
      messenge: "GET ALL",
      rows,
    });
  } catch (error) {
    res.json(error);
  }
})


router.post("/add-to-cart", async (req:Request, res:Response) => {
  const { product_id, number } = req.body;
  let data = await db.execute(
    "INSERT INTO order_detail (product_id, number ) VALUES(?, ?)",
    [product_id, number]
  );
  console.log(data);
  res.json({ mesage: "Success add to cart" });
});


router.get("/:id", async (req, res) => {
  try {
    let { id } = req.params;
    console.log(id);
    let data = await db.execute(
      `
  SELECT od.order_detail_id, od.product_id, od.order_id, od.number as quantity, o.status, p.*
  FROM order_detail AS od
  INNER JOIN product AS p ON od.product_id = p.product_id
  INNER JOIN \`order\` AS o ON od.order_id = o.order_id 
  WHERE o.order_id = ?`,
      [id]
    );
    let rows = data[0];
    console.log(rows);
    res.json({
      mesage: "Get one success",
      rows,
    });
  } catch (error) {
    res.json({
      mesage: error,
    });
  }
});

export default router;
