import { Request, Response } from "express";
import db from "../ultils/database";


export const findAllUser = async (req:Request, res:Response) => {
  try {
    let data = await db.execute("SELECT * FROM users");
    let [row] = data;
    res.json({
      status: "success",
      users: row,
    });
  } catch (error) {
    res.json({
      messenge: "K thấy user",
    });
  }
};



export const findOneUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await db.execute("SELECT * FROM users WHERE users_id = ?", [id]);
    const rowProduct = data[0];

    if (!rowProduct) {
      res.json({
        message: `User with id = ${id} does not exist`,
      });
    } else {
      res.json(rowProduct);
    }
  } catch (error) {
    res.json({
      message: "User not found",
    });
  }
};



export const create = async (req:Request, res:Response) => {
  try {
    let { name, email, password, role } = req.body;
    console.log("controll", name, email, password, role);
    let data = await db.execute(
      "INSERT INTO users (name, email, password, role ) VALUES (?, ?, ?, 0)",
      [name, email, password, role]
    );

    console.log(data);
    res.json({
      messenge: "Create user success",
      // cart,
    });
  } catch (error) {
    res.json({
      message: "Create user error",
    });
  }
};


export const update = async (req:Request, res:Response) => {
  let { id } = req.params;
  let { status } = req.body;
  try {
    let updateUser = await db.execute(`SELECT * FROM users `);
    let rowUser:any = updateUser[0];
    console.log(rowUser);
    if (rowUser === 0) {
      res.json({
        message: `Users với id = ${id} k tồn tại`,
      });
    } else {
      await db.execute(`UPDATE users SET status = ? WHERE users_id = ?`, [
        status,
        id,
      ]);
      res.json({
        rowUser,
        message: "Update user success",
      });
    }
  } catch (error) {
    res.json({
      messenge: "Update not success",
    });
  }
};


export const remove = async (req:Request, res:Response) => {
  const { id } = req.params;
  try {
    await db.execute("DELETE FROM users WHERE users_id = ?", [id]);
    let data = await db.execute("SELECT * FROM users");
    console.log(data);
    res.json({
      message: "Đã delete thành công",
      products: data[0],
    });
  } catch (error) {
    res.json({
      message: "Delete not success",
    });
  }
};

