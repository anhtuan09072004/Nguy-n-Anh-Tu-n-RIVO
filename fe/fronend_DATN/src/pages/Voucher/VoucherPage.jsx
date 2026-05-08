import { useEffect, useState } from "react";
import "./voucherPage.css";
import voucherApi from "../../api/voucherApi";

function VoucherPage() {
const [data, setData] = useState([]);

const [form, setForm] = useState({
ma: "",
ten: "",
soLuong: "",
phanTramGiam: "",
giaTriToiThieu: "",
giaTriToiDa: "",
trangThai: 1,
ngayBatDau: "",
ngayKetThuc: "",
});

const [editingId, setEditingId] = useState(null);
const [loading, setLoading] = useState(false);
const [errorMsg, setErrorMsg] = useState("");

// ===== FETCH =====
const fetchData = async () => {
try {
const res = await voucherApi.getAll();
setData(res || []);
} catch (error) {
handleError(error);
}
};

useEffect(() => {
fetchData();
}, []);

// ===== ERROR =====
const handleError = (error) => {
if (error.response?.data) {
if (typeof error.response.data === "object") {
const firstError = Object.values(error.response.data)[0];
setErrorMsg(firstError);
} else {
setErrorMsg(error.response.data);
}
} else {
setErrorMsg("Có lỗi xảy ra");
}
};

// ===== INPUT =====
const handleChange = (e) => {
const { name, value } = e.target;
// chặn số âm
if (
  ["soLuong", "phanTramGiam", "giaTriToiThieu", "giaTriToiDa"].includes(name)
) {
  if (value < 0) return;
}

setForm({
  ...form,
  [name]:
    ["soLuong", "phanTramGiam", "giaTriToiThieu", "giaTriToiDa", "trangThai"].includes(name)
      ? value === "" ? "" : Number(value)
      : value,
});

setErrorMsg("");

};

// ===== CHECK TRÙNG =====
const isDuplicate = () => {
return data.some((item) => {
if (editingId && item.id === editingId) return false;

  return (
    item.ten?.toLowerCase() === form.ten.toLowerCase() ||
    item.ma?.toLowerCase() === form.ma.toLowerCase()
  );
});

};

// ===== VALIDATE =====
const validate = () => {
if (!form.ma?.trim() || !form.ten?.trim()) {
setErrorMsg("Vui lòng nhập mã và tên");
return false;
}

if (form.soLuong === "" || form.soLuong === null) {
  setErrorMsg("Nhập số lượng");
  return false;
}

if (!Number.isInteger(form.soLuong) || form.soLuong <= 0) {
  setErrorMsg("Số lượng phải là số nguyên > 0");
  return false;
}

if (form.soLuong > 10000) {
  setErrorMsg("Số lượng tối đa 10000");
  return false;
}

if (form.phanTramGiam === "" || form.phanTramGiam === null) {
  setErrorMsg("Nhập % giảm");
  return false;
}

if (form.phanTramGiam <= 0 || form.phanTramGiam > 50) {
  setErrorMsg("Phần trăm giảm từ 1 - 50");
  return false;
}

if (form.giaTriToiThieu < 0) {
  setErrorMsg("Đơn tối thiểu >= 0");
  return false;
}

if (form.giaTriToiDa < 0) {
  setErrorMsg("Giảm tối đa >= 0");
  return false;
}

if (!form.ngayBatDau || !form.ngayKetThuc) {
  setErrorMsg("Vui lòng chọn ngày");
  return false;
}

const start = new Date(form.ngayBatDau);
const end = new Date(form.ngayKetThuc);
const now = new Date();

if (start >= end) {
  setErrorMsg("Ngày bắt đầu phải trước ngày kết thúc");
  return false;
}

if (start > now) {
  setErrorMsg("Ngày bắt đầu phải <= hiện tại");
  return false;
}

if (end <= now) {
  setErrorMsg("Ngày kết thúc phải > hiện tại");
  return false;
}

if (isDuplicate()) {
  setErrorMsg("Tên hoặc mã đã tồn tại");
  return false;
}

return true;

};

// ===== SUBMIT =====
const handleSubmit = async () => {
if (loading) return;

setErrorMsg("");

if (!validate()) return;

try {
  setLoading(true);

  const payload = {
    ...form,
    giaTriToiDa: form.giaTriToiDa || 0,
    trangThai: form.trangThai ?? 1,
  };

  if (editingId) {
    await voucherApi.update(editingId, payload);
  } else {
    await voucherApi.create(payload);
  }

  resetForm();
  await fetchData();
} catch (error) {
  handleError(error);
} finally {
  setLoading(false);
}

};

// ===== RESET =====
const resetForm = () => {
setForm({
ma: "",
ten: "",
soLuong: "",
phanTramGiam: "",
giaTriToiThieu: "",
giaTriToiDa: "",
trangThai: 1,
ngayBatDau: "",
ngayKetThuc: "",
});
setEditingId(null);
};

// ===== EDIT =====
const handleEdit = (item) => {
setForm({
ma: item.ma,
ten: item.ten,
soLuong: item.soLuong,
phanTramGiam: item.phanTramGiam,
giaTriToiThieu: item.giaTriToiThieu,
giaTriToiDa: item.giaTriToiDa,
trangThai: item.trangThai,
ngayBatDau: item.ngayBatDau?.slice(0, 16),
ngayKetThuc: item.ngayKetThuc?.slice(0, 16),
});

setEditingId(item.id);

};

const formatDate = (date) => {
if (!date) return "";
return date.replace("T", " ");
};

return ( <div className="container"> <h2>Quản lý Voucher</h2>

  <div className="form">
    <input name="ma" value={form.ma} onChange={handleChange} placeholder="Mã" />
    <input name="ten" value={form.ten} onChange={handleChange} placeholder="Tên" />

    <input type="number" min="1" step="1" name="soLuong" value={form.soLuong} onChange={handleChange} placeholder="Số lượng" />
    <input type="number" min="1" max="50" name="phanTramGiam" value={form.phanTramGiam} onChange={handleChange} placeholder="% giảm" />

    <input type="number" min="0" name="giaTriToiThieu" value={form.giaTriToiThieu} onChange={handleChange} placeholder="Đơn tối thiểu" />
    <input type="number" min="0" name="giaTriToiDa" value={form.giaTriToiDa} onChange={handleChange} placeholder="Giảm tối đa" />

    <select name="trangThai" value={form.trangThai} onChange={handleChange}>
      <option value={1}>Hoạt động</option>
      <option value={0}>Ngừng</option>
    </select>

    <input type="datetime-local" name="ngayBatDau" value={form.ngayBatDau} onChange={handleChange} />
    <input type="datetime-local" name="ngayKetThuc" value={form.ngayKetThuc} onChange={handleChange} />

    <button onClick={handleSubmit} disabled={loading}>
      {loading ? "Đang xử lý..." : editingId ? "Cập nhật" : "Thêm"}
    </button>

    {editingId && <button onClick={resetForm}>Huỷ</button>}
  </div>

  {errorMsg && <p className="error">{errorMsg}</p>}

  <table>
    <thead>
      <tr>
        <th>STT</th>
        <th>Mã</th>
        <th>Tên</th>
        <th>Số lượng</th>
        <th>% giảm</th>
        <th>Đơn tối thiểu</th>
        <th>Giảm tối đa</th>
        <th>Bắt đầu</th>
        <th>Kết thúc</th>
        <th>Trạng thái</th>
        <th>Hành động</th>
      </tr>
    </thead>

    <tbody>
      {data.length === 0 ? (
        <tr>
          <td colSpan="11">Không có dữ liệu</td>
        </tr>
      ) : (
        data.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.ma}</td>
            <td>{item.ten}</td>
            <td>{item.soLuong}</td>
            <td>{item.phanTramGiam}%</td>
            <td>{item.giaTriToiThieu}</td>
            <td>{item.giaTriToiDa}</td>
            <td>{formatDate(item.ngayBatDau)}</td>
            <td>{formatDate(item.ngayKetThuc)}</td>
            <td>
              {item.trangThai === 1 ? (
                <span className="status-active">Hoạt động</span>
              ) : (
                <span className="status-inactive">Ngừng</span>
              )}
            </td>
            <td>
              <button onClick={() => handleEdit(item)}>Sửa</button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

);
}

export default VoucherPage;
