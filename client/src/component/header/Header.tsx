import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Header.css";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

function Header() {
  // Lấy cart trên local
  let cart =
    (localStorage.getItem("cart") &&
      JSON.parse(localStorage.getItem("cart") as any)) ??
    [];

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const token = JSON.parse(localStorage.getItem("token") as any) || {};
  // console.log(user);

  // Lấy token theo user
  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/v1/users/${token.users_id}`)
      .then((res) => {
        setUser(res.data);
        setLoggedIn(true);
      })
      .catch((err: any) => {
        console.log(err);
        setLoggedIn(false);
      });
  }, []);

  // Đăng xuất
  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("cart");

      Swal.fire({
        title: "Đăng xuất sẽ xóa giỏ hàng ",
        text: "Bạn đồng ý chứ!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Đồng ý  !",
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch({ type: "CLEAR_CART" });
          Swal.fire("Đăng xuất!", "Bạn đã đăng xuất.", "success");
          navigate("/login");
        }
      });
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <div>
      <div className="header fixed-top">
        <div className="header1 ">
          <div className="kfc col-7">
            <NavLink to="/">
              <img
                src="https://kfcvn-static.cognizantorderserv.com/images/web/kfc-logo.svg?v=5.0"
                alt=""
              />
            </NavLink>
            <h2>
              <NavLink className="black" to="/shop">
                Thực Đơn
              </NavLink>
            </h2>
            <h2>Khuyến Mãi</h2>
            <h2>Dịch vụ</h2>
            <h2>
              <NavLink to="/history" style={{ color: "black" }}>
                Lịch sử mua hàng
              </NavLink>
            </h2>
          </div>
          <div className="login col-3">
            <NavLink to="/cart">
              <div className="a-href">
                {cart.length > 0 ? (
                  cart.reduce(
                    (pre: any, cur: any) => (pre += cur.clickNumber),
                    0
                  )
                ) : (
                  <div>0</div>
                )}
              </div>
            </NavLink>
            <div className="username">
              {loggedIn ? (
                <div className="username1">
                  <div className="username">
                    <i className="fa-solid fa-user"></i>
                    <p>{token.name}</p>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="username2">
                  <div className="username">
                    <i className="fa-solid fa-user"></i>
                  </div>
                </Link>
              )}
            </div>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0bsBH-w_rE9dIDMcIadk_7W_QMrUTO0TyZqDxKi9t24e_nosOw8MCpy_9YuXUmu7ff4I&usqp=CAU"
              alt=""
              onClick={handleLogout}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
