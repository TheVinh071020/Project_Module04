import { useEffect, useState } from "react";
import "./Pay.css";
import Header from "../../component/header/Header";
import Footer from "../../component/footer/Footer";
import { useDispatch } from "react-redux";
import { Outlet, useSearchParams } from "react-router-dom";
import { formatCurrency } from "../../helpers";
import axios from "axios";

function CheckOut() {
  let cart = JSON.parse(localStorage.getItem("cart") as any);

  const [searchParams] = useSearchParams();
  let queryString = searchParams.get("id");

  const [order, setOrder] = useState({});
  const dispatch = useDispatch();

  // Lấy order của user 
  const renderOrder = async () => {
    console.log(queryString);
    await axios
      .get(`http://localhost:3000/api/v1/orders/${queryString}`)
      .then((res) => {
        let data = res.data.rowOrders;
        let fetchOrder = {
          orderId: data[0].order_id,
          orderName: data[0].order_name,
          email: data[0].email,
          phone: data[0].phone,
          address: data[0].address,
          ward: data[0].ward,
          district: data[0].district,
          province: data[0].province,
          products: [],
        } as any
        data.forEach((e: any) => {
          fetchOrder.products.push({
            productId: e.product_id,
            number: e.number,
            stock: e.stock,
            price: e.price,
            sale: e.sale,
          } );
        });
        setOrder({ ...fetchOrder });
        dispatch({
          type: "ORDER_TO_CART",
          payload: fetchOrder.products,
        });
      })
      .catch((err) => console.log(err));
  };

  // console.log(order);

  useEffect(() => {
    if (queryString) {
      renderOrder();
    }
  }, [queryString]);

  return (
    <div>
      <Header />
      <div>
        <div className="cart-tongg">
          <Outlet context={order} />
          <div className="cart1 ">
            <div className="cart22 centered">
              <h4>Tóm tắt đơn hàng</h4>
              <hr />
              <div className="textline">
                {cart.length > 0 &&
                  cart.map((e: any) => (
                    <div style={{ margin: "5px" }}>
                      <b>
                        {e.clickNumber} x {e.name}
                      </b>
                    </div>
                  ))}
                <hr />
                <div className="mony">
                  <span>Tổng đơn hàng</span>
                  <span>
                    {formatCurrency(
                      cart.reduce((pre: any, cur: any) => {
                        return (pre +=
                          cur.price * (1 - cur.sale) * cur.clickNumber);
                      }, 0)
                    )}
                  </span>
                </div>
                <div className="mony1">
                  <span>Tổng thanh toán</span>
                  <span>
                    {formatCurrency(
                      cart.reduce((pre: any, cur: any) => {
                        return (pre +=
                          cur.price * (1 - cur.sale) * cur.clickNumber);
                      }, 0)
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CheckOut;
