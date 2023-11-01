import { findOne } from './../services/users.service';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

export const isAuth = async (req: Request, res: Response, next: any) => {
  
  try {
    let token:any = req.headers.authorization!.split(" ")[1].trim();
    let result:any = jwt.verify(token, process.env.TOKEN_SECRET as any);
    let { id } = result.data;
    let user = await findOne(id);
    if (user) {
      next();
    } else {
      res.json({
        messenge: "UnAuthorized",
      });
    }
  } catch (error: any) {
    res.json({
      error,
    });
  }
};
