import bcrypt from "bcrypt";
import {findOneByEmail,create} from "./users.service";
import jwt from "jsonwebtoken";

export const signupService = (name:any, email:any, password:any, role:any, status:any) => {
  console.log("signupService", name, email, password, role, status);
  let salt = bcrypt.genSaltSync(10);

  let hashPassword = bcrypt.hashSync(password, salt);

  return create(name, email, hashPassword, 0, 0);
};

export const signinService = async (email:any, password:any) => {
  console.log("signinService",email, password);
  try {
    let findUser = await findOneByEmail(email);
    let [rows]:any = findUser;
    console.log([rows]);
    if (rows.length === 0) {
      return {
        status: 404,
        message: "User not founda",
      };
    } else {
      // Lấy ra bản ghi user đã tìm thấy
      let hashPassword = rows[0].password;

      // So sánh MK mã hoá và MK được gửi lên
      let compare = bcrypt.compareSync(password, hashPassword);

      if (!compare) {
        return {
          status: 404,
          message: "Password is incorrect",
        };
      } else {
        let access_token = jwt.sign(
          {
            data: { id: rows[0].id, email: rows[0].email },
          },
          process.env.TOKEN_SECRET as string,
          { expiresIn: 1200 * 1200 }
        );
        return {
          status: 200,
          rows: rows,
          info: {
            name: rows[0].name,
            users_id: rows[0].users_id,
            access_token,
            role: rows[0].role,
          },
          message: "Sign in successfully",
        };
      }
    }
  } catch (error:any) {
    return error;
  }
};
