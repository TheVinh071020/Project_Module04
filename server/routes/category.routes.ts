import express from "express";
import db from "../ultils/database";
import { Request, Response } from "express";

const router = express.Router();


router.get("/", async (req:Request, res:Response) => {
  try {
    let result = await db.execute("SELECT * FROM category");
    let rows = result[0];
    res.json({
      messenge: "GET ALL",
      rows,
    });
  } catch (error) {
    res.json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    let { id } = req.params;
    console.log(id);
    let data = await db.execute(`SELECT * FROM \`order\`  WHERE user_id=?;`, [
      id,
    ]);
    let rows = data[0];
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
