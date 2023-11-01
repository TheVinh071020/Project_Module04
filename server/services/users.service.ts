import db from "../ultils/database";
export const findAll = () => {
  return db.execute("SELECT * FROM users");
};

export const findOne = (id:number) => {
  return db.execute("SELECT * FROM users WHERE users_id = ?", [id]);
};

export const findOneByEmail = (email:string) => {
  return db.execute("SELECT * FROM users WHERE email = ?", [email]);
};

export const create = (name:any, email:any, password:any, role:any, status:any) => {
  return db.execute(
    "INSERT INTO users(name, email, password, role, status) VALUES(?, ?, ?, ?, ?)",
    [name, email, password, role, status]
  );
};
export const remove = (id:number) => {
  return db.execute("DELETE FROM users WHERE users_id = ?", [id]);
};
