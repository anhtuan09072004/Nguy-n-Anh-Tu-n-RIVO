import { useEffect, useState } from "react";
import profileApi from "../../api/profileApi";
import diaChiApi from "../../api/diaChiApi";
import addressData from "../../vietnamAddress.json";
import "./TaiKhoan.css";

export default function TaiKhoan() {
  const [form, setForm] = useState({
    ten: "",
    email: "",
    soDienThoai: "",
    gioiTinh: "",
    ngaySinh: "",
  });

  const emptyAddress = {
    ten: "",
    soDienThoai: "",
    tinhThanh: "",
    quanHuyen: "",
    phuongXa: "",
    diaChiCuThe: "",
  };

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [loading, setLoading] = useState(true);

  // ================= LOAD =================
  const loadAddresses = async () => {
    const data = await diaChiApi.getMyAddresses();
    setAddresses(data || []);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const pf = await profileApi.getMyProfile();

        setForm({
          ten: pf.ten || "",
          email: pf.email || "",
          soDienThoai: pf.soDienThoai || "",
          gioiTinh: pf.gioiTinh || "",
          ngaySinh: pf.ngaySinh || "",
        });

        await loadAddresses();
      } catch (err) {
        console.error(err);
        alert("Lỗi load dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ================= VALIDATE PROFILE =================
  const validateProfile = () => {
    if (!form.ten.trim()) {
      alert("Vui lòng nhập họ tên");
      return false;
    }

    if (!form.email.trim()) {
      alert("Vui lòng nhập email");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert("Email không hợp lệ");
      return false;
    }

    if (!form.soDienThoai.trim()) {
      alert("Vui lòng nhập số điện thoại");
      return false;
    }

    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    if (!phoneRegex.test(form.soDienThoai)) {
      alert("Số điện thoại không hợp lệ");
      return false;
    }

    return true;
  };

  // ================= PROFILE =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateProfile()) return;

    try {
      await profileApi.updateMyProfile(form);
      alert("Cập nhật thành công");
    } catch (err) {
      alert("Lỗi cập nhật");
    }
  };

  // ================= ADDRESS =================
  const handleSelectAddress = (addr) => {
    setSelectedAddress({ ...addr });

    const province = addressData.find((p) => p.name === addr.tinhThanh);
    const districtList = province?.districts || [];
    setDistricts(districtList);

    const district = districtList.find((d) => d.name === addr.quanHuyen);
    setWards(district?.wards || []);
  };

  const handleAddressChange = (e) => {
    if (!selectedAddress) return;

    setSelectedAddress({
      ...selectedAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddNew = () => {
    setSelectedAddress({ ...emptyAddress });
    setDistricts([]);
    setWards([]);
  };

  const validateAddress = () => {
    if (!selectedAddress.ten?.trim()) {
      alert("Vui lòng nhập họ tên người nhận");
      return false;
    }

    if (!selectedAddress.soDienThoai?.trim()) {
      alert("Vui lòng nhập số điện thoại");
      return false;
    }

    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    if (!phoneRegex.test(selectedAddress.soDienThoai)) {
      alert("Số điện thoại người nhận không hợp lệ");
      return false;
    }

    if (!selectedAddress.tinhThanh) {
      alert("Vui lòng chọn tỉnh / thành");
      return false;
    }

    if (!selectedAddress.quanHuyen) {
      alert("Vui lòng chọn quận / huyện");
      return false;
    }

    if (!selectedAddress.phuongXa) {
      alert("Vui lòng chọn phường / xã");
      return false;
    }

    if (!selectedAddress.diaChiCuThe?.trim()) {
      alert("Vui lòng nhập địa chỉ cụ thể");
      return false;
    }

    return true;
  };

  const handleSaveAddress = async () => {
    if (!selectedAddress) return;
    if (!validateAddress()) return;

    try {
      if (selectedAddress.id) {
        await diaChiApi.updateAddress(selectedAddress.id, selectedAddress);
      } else {
        await diaChiApi.createAddress(selectedAddress);
      }

      alert("Lưu địa chỉ thành công");

      await loadAddresses();
      setSelectedAddress(null);
      setDistricts([]);
      setWards([]);
    } catch (err) {
      console.error(err);
      alert("Lỗi lưu địa chỉ");
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Xóa địa chỉ này?")) return;

    try {
      await diaChiApi.deleteAddress(id);
      await loadAddresses();

      if (selectedAddress?.id === id) {
        setSelectedAddress(null);
      }
    } catch (err) {
      alert("Lỗi xóa địa chỉ");
    }
  };

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="profile-container">
      <h2>Tài khoản của tôi</h2>

      <div className="profile-layout">
        <div className="profile-left full-width">
          {/* PROFILE */}
          <form onSubmit={handleSubmit} className="profile-form">
            <input
              name="ten"
              placeholder="Họ tên"
              value={form.ten}
              onChange={handleChange}
            />

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />

            <input
              name="soDienThoai"
              placeholder="Số điện thoại"
              value={form.soDienThoai}
              onChange={handleChange}
            />

            <select
              name="gioiTinh"
              value={form.gioiTinh}
              onChange={handleChange}
            >
              <option value="">-- Chọn giới tính --</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>

            <input
              type="date"
              name="ngaySinh"
              value={form.ngaySinh || ""}
              onChange={handleChange}
            />

            <button type="submit" className="btn-save">
              Lưu thông tin
            </button>
          </form>

          {/* ADDRESS */}
          <div className="address-container">
            {/* LEFT */}
            <div className="address-list">
              <h3>Địa chỉ của tôi</h3>

              <button className="btn-add" onClick={handleAddNew}>
                + Thêm địa chỉ
              </button>

              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`address-card ${
                    selectedAddress?.id === addr.id ? "active" : ""
                  }`}
                  onClick={() => handleSelectAddress(addr)}
                >
                  <b>{addr.ten}</b>
                  <p>{addr.soDienThoai}</p>
                  <small>
                    {addr.diaChiCuThe}, {addr.phuongXa}, {addr.quanHuyen},{" "}
                    {addr.tinhThanh}
                  </small>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAddress(addr.id);
                    }}
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>

            {/* RIGHT */}
            <div className="address-form">
              <h3>
                {selectedAddress
                  ? selectedAddress.id
                    ? "Chỉnh sửa địa chỉ"
                    : "Thêm địa chỉ mới"
                  : "Chọn địa chỉ để chỉnh sửa"}
              </h3>

              {selectedAddress && (
                <div className="address-fields">
                  <div className="form-group">
                    <label>Họ tên</label>
                    <input
                      name="ten"
                      value={selectedAddress.ten}
                      onChange={handleAddressChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Số điện thoại</label>
                    <input
                      name="soDienThoai"
                      value={selectedAddress.soDienThoai}
                      onChange={handleAddressChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Tỉnh / Thành phố</label>
                    <select
                      value={selectedAddress.tinhThanh}
                      onChange={(e) => {
                        const province = addressData.find(
                          (p) => p.name === e.target.value
                        );

                        setSelectedAddress({
                          ...selectedAddress,
                          tinhThanh: e.target.value,
                          quanHuyen: "",
                          phuongXa: "",
                        });

                        setDistricts(province?.districts || []);
                        setWards([]);
                      }}
                    >
                      <option value="">Chọn tỉnh</option>
                      {addressData.map((p) => (
                        <option key={p.code} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Quận / Huyện</label>
                    <select
                      value={selectedAddress.quanHuyen}
                      disabled={!selectedAddress.tinhThanh}
                      onChange={(e) => {
                        const district = districts.find(
                          (d) => d.name === e.target.value
                        );

                        setSelectedAddress({
                          ...selectedAddress,
                          quanHuyen: e.target.value,
                          phuongXa: "",
                        });

                        setWards(district?.wards || []);
                      }}
                    >
                      <option value="">Chọn quận</option>
                      {districts.map((d) => (
                        <option key={d.code} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Phường / Xã</label>
                    <select
                      value={selectedAddress.phuongXa}
                      disabled={!selectedAddress.quanHuyen}
                      onChange={(e) =>
                        setSelectedAddress({
                          ...selectedAddress,
                          phuongXa: e.target.value,
                        })
                      }
                    >
                      <option value="">Chọn phường</option>
                      {wards.map((w) => (
                        <option key={w.code} value={w.name}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group full">
                    <label>Địa chỉ cụ thể</label>
                    <input
                      name="diaChiCuThe"
                      value={selectedAddress.diaChiCuThe}
                      onChange={handleAddressChange}
                    />
                  </div>

                  <button type="button" onClick={handleSaveAddress}>
                    Lưu địa chỉ
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}