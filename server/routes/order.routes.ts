import express from "express";
import db from "../ultils/database";
import { Request, Response } from "express";
import mysql from "mysql2";
import { getDate } from "../helpers/index.";
import { pagination } from "../middlewares/order.middlewares";

const router = express.Router();

router.get("/", pagination, async (req: Request, res: Response) => {
  try {
    let data = await db.execute(
      `
    SELECT u.users_id, o.order_id, o.order_name, o.status, o.email, o.phone, o.address, p.product_id, od.number as quantity, p.name, p.price, p.sale, p.img
    FROM users as u
    INNER JOIN \`order\` as o ON u.users_id = o.user_id
    INNER JOIN order_detail as od ON od.order_id = o.order_id
    INNER JOIN product as p ON p.product_id = od.product_id
    `
    );
    let rows = data[0];
    let result2 = await db.execute(`SELECT COUNT(*) as count from \`order\``);
    let rows2: any = result2[0];
    res.json({
      messenge: "GET ALL",
      rows,
      length: rows2[0].count,
    });
  } catch (error) {
    res.json({
      mesage: error,
    });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  let { id } = req.params;
  try {
    let sql = `SELECT od.order_id, od.email, od.order_name, od.phone, od.address, od.province, od.district, od.ward, o.number, p.product_id, p.number, p.name, p.price, p.sale as stock, p.price, p.sale 
            FROM ?? as o 
            INNER JOIN ?? as od 
            ON o.order_id = od.order_id 
            INNER JOIN ?? as p 
            ON o.product_id = p.product_id
            WHERE o.order_id = ? `;
    let inserted = ["order_detail", "order", "product", id];
    sql = mysql.format(sql, inserted);
    let result = await db.execute(sql);
    let rowOrders = result[0];
    console.log(rowOrders);
    res.json({
      rowOrders,
      messenge: "GET ALL ORDERS",
    });
  } catch (error) {
    res.json({
      error,
    });
  }
});

router.post("/", async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    let {
      user_id,
      name,
      email,
      phone,
      address,
      province,
      district,
      ward,
      cart,
    } = req.body;
    let sql = mysql.format(
      `INSERT INTO ?? (order_name, user_id, created_at, status, email, phone, address, province, district, ward) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        "order",
        name,
        user_id,
        getDate(),
        "Chờ xác nhận",
        email,
        phone,
        address,
        province,
        district,
        ward,
      ]
    );
    let result: any = await db.execute(sql);
    console.log(result);
    let orderDetailSql = `INSERT INTO order_detail (product_id, order_id, number) VALUES `;
    let inserted: any = [];

    cart.forEach((e: any) => {
      orderDetailSql += `(?, ?, ?) ,`;
      inserted.push(e.product_id);
      inserted.push(result[0].insertId);
      inserted.push(e.clickNumber);
    });
    let sqlQuery = orderDetailSql.slice(0, -1);
    sqlQuery = mysql.format(sqlQuery, inserted);
    let result2 = await db.execute(sqlQuery);
    console.log(result2[0]);
    res.json({
      messenge: "Đặt hàng thành công",
      orderId: result[0].insertId,
    });
  } catch (error) {
    res.json({
      error,
    });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  let { id } = req.params;
  let { status } = req.body;

  try {
    let updateOrder = await db.execute(
      `UPDATE \`order\` SET status = ? WHERE order_id = ?`,
      [status, id]
    );
    res.json({
      message: "Update product success",
    });
  } catch (error) {
    res.json({
      messenge: "Update not success",
    });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await db.execute("DELETE FROM \`order\` WHERE order_id = ?", [id]);
    let data = await db.execute("SELECT * FROM \`order\`");
    let rows = data[0];
    let result2 = await db.execute(`SELECT COUNT(*) as count from \`order\``);
    let rows2: any = result2[0];

    res.json({
      message: "Đã delete order thành công",
      rows,
      length: rows2[0].count,
    });
  } catch (error) {
    res.json({
      message: "Delete not success",
    });
  }
});

export default router;
