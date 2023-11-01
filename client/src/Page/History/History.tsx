import { useEffect, useState } from "react";
import Header from "../../component/header/Header";
import Footer from "../../component/footer/Footer";
import { useNavigate } from "react-router-dom";
import "./History.css";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { formatCurrency } from "../../helpers";
import Swal from "sweetalert2";

interface IUser {
  name: string;
  email: string;
  password: string;
  role: number;
  status: number;
  user_id: number;
}

function History() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Lấy  user trên local
  const user = JSON.parse(localStorage.getItem("user") as any);
  const userId = user[0].users_id;

  const [categories, setCategories] = useState([]);
  const [order, setOrder] = useState([]);

  const navigate = useNavigate();

  // Lấy categories
  const fetchCategories = async () => {
    await axios
      .get(`http://localhost:3000/api/v1/categories/${userId}`)
      .then((res) => {
        setCategories(res.data.rows);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Xem chi tiết order
  const handleView = async (e: any) => {
    await axios
      .get(`http://localhost:3000/api/v1/order-details/${e}`)
      .then((res) => {
        setOrder(res.data.rows);
      })
      .catch((err) => console.log(err));
  };
  const quantityByProductId: any = {};

  order.forEach((product: any) => {
    const productId = product.product_id;
    const quantity = product.quantity;

    if (quantityByProductId[productId]) {
      quantityByProductId[productId] += quantity;
    } else {
      quantityByProductId[productId] = quantity;
    }
  });

  const aggregatedOrder = Object.keys(quantityByProductId).map(
    (productId: any) => {
      const matchingProduct: any = order.find(
        (item: any) => item.product_id === parseInt(productId)
      );
      return {
        product_id: parseInt(productId),
        name: matchingProduct.name,
        price: matchingProduct.price,
        sale: matchingProduct.sale,
        img: matchingProduct.img,
        quantity: quantityByProductId[productId],
      };
    }
  );

  // console.log(categories);

  // Log out
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    navigate("/login");
  };

  // Đăng xuất nếu user bị khóa
  const [userLock, setUserLock] = useState<IUser[]>([]);

  // Lấy user và lock user nếu đang đăng nhập
  const fetchUser = async () => {
    let userLogin = JSON.parse((localStorage.getItem("user") as any) ?? "");
    let userId = userLogin[0].users_id;
    // console.log(userId);

    await axios
      .get(`http://localhost:3000/api/v1/users/${userId}`)
      .then((res) => {
        setUserLock(res.data);
        console.log(res.data[0].status);

        if (res.data[0].status === 1) {
          Swal.fire("User Locked", "Tài khoản của bạn đã bị khóa", "warning");
          localStorage.removeItem("token");
          localStorage.removeItem("cart");
          localStorage.removeItem("user");
          navigate("/login");
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      <Header />
      <div>
        <h1 className="titles">Lịch sử mua hàng</h1>
        <div className="cart-tongg">
          <div className="carttt">
            {categories.length > 0 ? (
              categories.map((e: any, i) => (
                <div className="cart1" key={i}>
                  <div className="cart-combo">
                    <table className="table">
                      <thead>
                        <tr className="table-light">
                          <th scope="col" style={{ width: "120px" }}>
                            Name
                          </th>
                          <th scope="col">Trạng thái</th>
                          <th scope="col">Địa chỉ</th>
                          <th scope="col"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{e.order_name}</td>
                          <td>
                            <button className="btn btn-info">{e.status}</button>
                          </td>
                          <td>{e.address}</td>
                          <td onClick={() => handleView(e.order_id)}>
                            <button className="btn-detail" onClick={handleShow}>
                              Chi tiết
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            ) : (
              <p className="  ">Chưa có sản phẩm trong giỏ hàng</p>
            )}
          </div>
          {/* <!-- Modal --> */}
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Chi tiết mua hàng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="cart1">
                <div className="cart-combo1">
                  <table className="table">
                    <thead>
                      <tr className="table-light">
                        <th scope="col">Name</th>
                        <th scope="col" rowSpan={3}>
                          Price
                        </th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Image</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aggregatedOrder.map((product, i) => (
                        <tr key={i}>
                          <td>{product.name}</td>
                          <td>
                            {formatCurrency(product.price * (1 - product.sale))}
                          </td>
                          <td>{product.quantity}</td>
                          <td>
                            <img
                              style={{ width: "70px", height: "70px" }}
                              src={product.img}
                              alt=""
                            />
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td>Total</td>

                        <td rowSpan={2}>
                          {formatCurrency(
                            aggregatedOrder.reduce(
                              (total, product) =>
                                total +
                                product.price *
                                  (1 - product.sale) *
                                  product.quantity,
                              0
                            )
                          )}
                        </td>
                        <td></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Modal.Body>
          </Modal>

          <div className="cart2">
            <img
              src="https://static.kfcvietnam.com.vn/images/web/profile-circle.png?v=5.0"
              alt=""
            />
            <h4>Xin chào</h4>
            <div className="logoutt">
              <button>
                <u onClick={handleLogout}>Đăng xuất</u>
              </button>
            </div>
            <ul className="list">
              <li>Đơn hàng đã đặt</li>
              <li>Đơn hàng yêu thích</li>
              <li>Địa chỉ của bạn</li>
              <li>Chi tiết tài khoản</li>
              <li>Đặt lại mật khẩu</li>
              <li>Xóa tài khoản</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default History;
