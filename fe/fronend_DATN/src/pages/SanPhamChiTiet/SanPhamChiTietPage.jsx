import { useParams } from "react-router-dom";
import { useState } from "react";

import sanPhamChiTietApi from "../../api/sanPhamChiTietApi";
import useSanPhamChiTiet from "./useSanPhamChiTiet";
import "./css.css";
function ChiTietSanPhamPage() {
  const { id } = useParams();

  const {
    data,
    kichCoList,
    mauSacList,
    fetchData,
    errorMsg,
    setErrorMsg
  } = useSanPhamChiTiet(id);

  // ================= STATE =================
  const [form, setForm] = useState({
    kichCoId: "",
    mauSacId: "",
    gia: "",
    soLuong: "",
    ma: ""
  });

  const [files, setFiles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const isEditMode = editingId !== null;

  // ================= CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  // ================= VALIDATE =================
  const validate = () => {
    if (!form.kichCoId) return "Chọn kích cỡ";
    if (!form.mauSacId) return "Chọn màu sắc";
    if (!form.gia) return "Nhập giá";
    if (!form.soLuong) return "Nhập số lượng";
     if (form.soLuong === "" || form.soLuong === null) return "Nhập số lượng";
    if (!Number.isInteger(Number(form.soLuong)))
      return "Số lượng phải là số nguyên";
    if (Number(form.soLuong) <= 0)
      return "Số lượng phải > 0";
    if (!form.ma?.trim()) return "Nhập mã";
    return null;
  };

  // ================= CREATE =================
  const handleCreate = async () => {
    if (loading) return;

    const err = validate();
    if (err) return setErrorMsg(err);

    // ✅ CONFIRM
    const ok = window.confirm("Bạn có chắc muốn thêm sản phẩm chi tiết?");
    if (!ok) return;

    setLoading(true);

    try {
      const request = {
        sanPhamId: Number(id),
        kichCoId: Number(form.kichCoId),
        mauSacId: Number(form.mauSacId),
        gia: Number(form.gia),
        soLuong: Number(form.soLuong),
        ma: form.ma
      };

      const formData = new FormData();

      formData.append(
        "request",
        new Blob([JSON.stringify(request)], {
          type: "application/json"
        })
      );

      files.forEach((file) => {
        formData.append("files", file);
      });

      await sanPhamChiTietApi.create(formData);

      alert("Thêm thành công ✅");

      resetForm();
      await fetchData(id);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Thêm thất bại");
    } finally {
      setLoading(false);
    }
  };

  // ================= EDIT =================
  const handleEdit = (item) => {
    setEditingId(item.id);

    setForm({
      kichCoId: item.kichCo?.id || "",
      mauSacId: item.mauSac?.id || "",
      gia: item.gia || "",
      soLuong: item.soLuong || "",
      ma: item.ma || ""
    });

    setFiles([]);
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    if (!editingId) return;

    const err = validate();
    if (err) return setErrorMsg(err);

    // ✅ CONFIRM
    const ok = window.confirm("Bạn có chắc muốn cập nhật?");
    if (!ok) return;

    setLoading(true);

    try {
      const request = {
        sanPhamId: Number(id),
        kichCoId: Number(form.kichCoId),
        mauSacId: Number(form.mauSacId),
        gia: Number(form.gia),
        soLuong: Number(form.soLuong),
        ma: form.ma
      };

      const formData = new FormData();

      formData.append(
        "request",
        new Blob([JSON.stringify(request)], {
          type: "application/json"
        })
      );

      files.forEach((file) => {
        formData.append("files", file);
      });

      await sanPhamChiTietApi.update(editingId, formData);

      alert("Cập nhật thành công ✅");

      resetForm();
      await fetchData(id);
    } catch (err) {
      setErrorMsg("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      kichCoId: "",
      mauSacId: "",
      gia: "",
      soLuong: "",
      ma: ""
    });
    setFiles([]);
    setEditingId(null);
  };

  // ================= RENDER IMAGE =================
  const getImage = (item) => {
    return item.hinhAnhs?.[0]?.ten || null;
  };

  return (
    <div>
      <h2>Quản lý chi tiết sản phẩm</h2>

      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      {/* FORM */}
      <div className="ctsp-form">
        <select name="kichCoId" value={form.kichCoId} onChange={handleChange}>
          <option value="">-- Kích cỡ --</option>
          {kichCoList?.map((i) => (
            <option key={i.id} value={i.id}>
              {i.ten}
            </option>
          ))}
        </select>

        <select name="mauSacId" value={form.mauSacId} onChange={handleChange}>
          <option value="">-- Màu sắc --</option>
          {mauSacList?.map((i) => (
            <option key={i.id} value={i.id}>
              {i.ten}
            </option>
          ))}
        </select>

        <input name="gia" value={form.gia} onChange={handleChange} placeholder="Giá" />
        <input name="soLuong" value={form.soLuong} onChange={handleChange} placeholder="Số lượng" />
        <input name="ma" value={form.ma} onChange={handleChange} placeholder="Mã" />

        {/* FILE */}
        <input type="file" multiple onChange={handleFileChange} />

        {!isEditMode ? (
          <button onClick={handleCreate} disabled={loading}>
            Thêm
          </button>
        ) : (
          <>
            <button onClick={handleUpdate} disabled={loading}>
              Cập nhật
            </button>
            <button onClick={resetForm}>Hủy</button>
          </>
        )}
      </div>

      {/* TABLE */}
      <table border="1" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>STT</th>
            <th>Ảnh</th>
            <th>Kích cỡ</th>
            <th>Màu sắc</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Mã</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
        {data?.map((item, index) => (
            <tr key={item.id}>
            <td>{index + 1}</td>

              <td>
                {getImage(item) ? (
                  <img
                    src={getImage(item)}
                    alt=""
                    style={{ width: 60, height: 60, objectFit: "cover" }}
                  />
                ) : (
                  "No image"
                )}
              </td>

              <td>{item.kichCo?.ten}</td>
              <td>{item.mauSac?.ten}</td>
              <td>{item.gia}</td>
              <td>{item.soLuong}</td>
              <td>{item.ma}</td>

              <td>
                <button onClick={() => handleEdit(item)}>Sửa</button>
                {/* <button onClick={() => handleDelete(item.id)}>Xóa</button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ChiTietSanPhamPage;