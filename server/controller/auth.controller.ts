import { Request, Response } from "express";

import {signupService, signinService} from "../services/auth.service";


export const signup = async (req:Request, res:Response) => {
  let { name, email, password, role, status } = req.body;
  console.log("auth", name, email, password, role, status);
  try {
    await signupService(name, email, password, 0, 0);
    res.json({
      status: 200,
      message: " Sign  up successfully",
    });
  } catch (error:any) {
    res.json({ message: error.message });
  }
};


export const signin = async (req:Request, res:Response) => {
  let { email, password } = req.body;
  console.log("auth",email, password);
  
  try {
    let result = await signinService(email, password);
    res.json({
      result,
      messenge: "Sign in success",
    });
  } catch (error) {
    res.json({
      error,
    });
  }
};
