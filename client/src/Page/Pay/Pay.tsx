import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./Pay.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function Pay() {
  let [name, setName] = useState("");
  let [email, setEmail] = useState("");
  let [phone, setPhone] = useState("");
  let [address, setAddress] = useState("");
  let cart = JSON.parse((localStorage.getItem("cart") as any) || "");

  let [provinces, setProvinces] = useState([]); // Tỉnh/Thành Phố
  let [activeProvince, setActiveProvince] = useState("");

  let [districts, setDistricts] = useState([]); // Quận/Huyện
  let [activeDistrict, setActiveDistrict] = useState("");

  let [wards, setWards] = useState([]); // Phường/Xã
  let [activeWard, setActiveWard] = useState("");

  const navigate = useNavigate();

  let VIETNAM_BASE_API = "https://provinces.open-api.vn/api/?depth=3";

  const fetchProvinces = async () => {
    try {
      let res = await fetch(VIETNAM_BASE_API);
      let data = await res.json();
      setProvinces(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    let clickProvince: any = provinces.find(
      (e: any) => e.name == activeProvince
    );
    console.log(clickProvince);

    if (clickProvince) {
      setDistricts(clickProvince.districts);
      setActiveWard("");
    }
  }, [activeProvince]);

  useEffect(() => {
    let clickDistrict: any = districts.find(
      (e: any) => e.name == activeDistrict
    );
    if (clickDistrict) {
      setWards(clickDistrict.wards);
    }
  }, [activeDistrict]);

  const handleActiveProvince = (e: any) => {
    if (!e.target.value) {
      resetAllProvinces();
    } else {
      setActiveProvince(e.target.value);
    }
  };

  const handleActiveDistrict = (e: any) => {
    if (!e.target.value) {
      resetAllProvinces();
    } else {
      setActiveDistrict(e.target.value);
    }
  };

  const handleActiveWard = (e: any) => {
    if (!e.target.value) {
      resetAllProvinces();
    } else {
      setActiveWard(e.target.value);
    }
  };

  function resetAllProvinces() {
    setActiveProvince("");
    setActiveDistrict("");
    setDistricts([]);
    setActiveWard("");
    setWards([]);
  }

  const user = JSON.parse(localStorage.getItem("user") as any);
  const userId = user[0].users_id;
  // console.log(userId);

  // Sự kiện thanh toán
  const handleCheckOut = async (e: any) => {
    e.preventDefault();
    let order = {
      user_id: userId,
      name,
      email,
      phone,
      address,
      province: activeProvince,
      district: activeDistrict,
      ward: activeWard,
      cart,
    };
    // console.log(order);
    await axios
      .post(`http://localhost:3000/api/v1/orders`, order)
      .then((res) => {
        console.log(res.data);
        Swal.fire("Thành công", res.data.messenge, "success").then(() => {
          navigate(`/checkout/step-2?id=${res.data.orderId}`);
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="carttt">
      <div className="cart">
        <div>
          <b>KFC MANOR HÀ NỘI</b>
        </div>
        <div>Tòa nhà The Manor, Mễ Trì, P.Mỹ Đình 1, TP Hà Nội</div>
      </div>
      <div className="cart">
        <h2>
          <b>THÊM THÔNG TIN CHI TIẾT:</b>
        </h2>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Họ và Tên"
              name="fullName"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="Email"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="text"
              placeholder="Phone Number"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              type="text"
              placeholder="Địa chỉ"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <select
              className="form-select"
              aria-label="Default select example"
              onChange={handleActiveProvince}
              value={activeProvince}
            >
              <option selected value="">
                Tỉnh/Thành
              </option>
              {provinces.length > 0 &&
                provinces.map((e: any) => (
                  <option value={e.name}>{e.name}</option>
                ))}
            </select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <select
              className="form-select"
              aria-label="Default select example"
              onChange={handleActiveDistrict}
              value={activeDistrict}
            >
              <option selected value="">
                Quận/Huyện
              </option>
              {districts.length > 0 &&
                districts.map((e: any) => (
                  <option value={e.name}>{e.name}</option>
                ))}
            </select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <select
              className="form-select"
              aria-label="Default select example"
              onChange={handleActiveWard}
              value={activeWard}
            >
              <option selected value="">
                Phường Xã
              </option>
              {wards.length > 0 &&
                wards.map((e: any) => <option value={e.name}>{e.name}</option>)}
            </select>
          </Form.Group>

          <Button
            onClick={handleCheckOut}
            className="btnbuy"
            variant="danger"
            type="submit"
          >
            Đặt hàng
          </Button>
        </Form>
      </div>
      <div className="cart">
        <h1>
          <b>PHƯƠNG THỨC THANH TOÁN</b>
        </h1>
        <div className="pays">
          <div className="pay">
            Thanh toán bằng ATM/Visa/Master và Ví ZaloPay (Miễn phí giao hàng)
          </div>
          <img
            src="https://static.kfcvietnam.com.vn/images/web/ZaloPay_icon.png"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

export default Pay;
