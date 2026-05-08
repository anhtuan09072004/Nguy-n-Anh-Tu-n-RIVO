import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import sanPhamApi from "../../api/sanPhamApi";
import tayAoApi from "../../api/tayAoApi";
import thuongHieuApi from "../../api/thuongHieuApi";
import coAoApi from "../../api/coAoApi";
import chatLieuApi from "../../api/chatLieuApi";
import xuatXuApi from "../../api/xuatXuApi";
import "./SanPhamPage.css";

function SanPhamPage() {
  const [data, setData] = useState([]);

  const [tayAoList, setTayAoList] = useState([]);
  const [thuongHieuList, setThuongHieuList] = useState([]);
  const [coAoList, setCoAoList] = useState([]);
  const [chatLieuList, setChatLieuList] = useState([]);
  const [xuatXuList, setXuatXuList] = useState([]);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    ten: "",
    ma: "",
    moTa: "",
    tayAoId: "",
    thuongHieuId: "",
    coAoId: "",
    chatLieuId: "",
    xuatXuId: ""
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // ===== FETCH =====
  const fetchData = async () => {
    try {
      const res = await sanPhamApi.getAll();
      setData(res || []);
    } catch (err) {
      handleError(err);
    }
  };

  const fetchSelectData = async () => {
    try {
      setTayAoList(await tayAoApi.getAll());
      setThuongHieuList(await thuongHieuApi.getAll());
      setCoAoList(await coAoApi.getAll());
      setChatLieuList(await chatLieuApi.getAll());
      setXuatXuList(await xuatXuApi.getAll());
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchSelectData();
  }, []);

  // ===== ERROR =====
  const handleError = (error) => {
    setErrorMsg(error.response?.data?.message || "Có lỗi xảy ra");
  };

  // ===== CHANGE =====
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrorMsg("");
  };

  // ===== VALIDATE =====
  const validate = () => {
    if (!form.ten.trim()) return "Tên không được để trống";
    if (!form.ma.trim()) return "Mã không được để trống";

      // 🔥 CHECK TRÙNG MÃ
  const isDuplicate = data.some(item => {
    const currentMa = (item.ma || item.maSanPham || "").toLowerCase();
    const inputMa = form.ma.trim().toLowerCase();

    // nếu đang edit thì bỏ qua chính nó
    if (editingId && item.id === editingId) return false;

    return currentMa === inputMa;
  });

  if (isDuplicate) return "Mã sản phẩm đã tồn tại";
    if (!form.tayAoId) return "Chọn tay áo";
    if (!form.thuongHieuId) return "Chọn thương hiệu";
    if (!form.coAoId) return "Chọn cổ áo";
    if (!form.chatLieuId) return "Chọn chất liệu";
    if (!form.xuatXuId) return "Chọn xuất xứ";
    return null;
  };

  

  // ===== SUBMIT =====
  const handleSubmit = async () => {
    if (loading) return;

    const errMsg = validate();
    if (errMsg) {
      setErrorMsg(errMsg);
      return;
    }

    const isEdit = !!editingId;

    const confirmed = window.confirm(
      isEdit
        ? "Bạn có chắc muốn cập nhật sản phẩm này?"
        : "Bạn có chắc muốn thêm sản phẩm này?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const payload = {
        ...form,
        tayAoId: Number(form.tayAoId),
        thuongHieuId: Number(form.thuongHieuId),
        coAoId: Number(form.coAoId),
        chatLieuId: Number(form.chatLieuId),
        xuatXuId: Number(form.xuatXuId)
      };

      if (isEdit) {
        await sanPhamApi.update(editingId, payload);
        alert("Cập nhật sản phẩm thành công");
      } else {
        await sanPhamApi.create(payload);
        alert("Thêm sản phẩm thành công");
      }

      resetForm();
      fetchData();
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      ten: "",
      ma: "",
      moTa: "",
      tayAoId: "",
      thuongHieuId: "",
      coAoId: "",
      chatLieuId: "",
      xuatXuId: ""
    });
    setEditingId(null);
  };

  // ===== EDIT =====
  const handleEdit = (item) => {
    setForm({
      ten: item.ten || "",
      ma: item.ma || item.maSanPham || "",
      moTa: item.moTa || "",
      tayAoId: item.tayAo?.id || item.tayAoId || "",
      thuongHieuId: item.thuongHieu?.id || item.thuongHieuId || "",
      coAoId: item.coAo?.id || item.coAoId || "",
      chatLieuId: item.chatLieu?.id || item.chatLieuId || "",
      xuatXuId: item.xuatXu?.id || item.xuatXuId || ""
    });
    setEditingId(item.id);
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString("vi-VN");
  };
  const filteredData = data.filter(item =>
    item.ten?.toLowerCase().includes(keyword.toLowerCase()) ||
    (item.ma || item.maSanPham || "").toLowerCase().includes(keyword.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  return (
    <div className="sanpham-page">
      <div className="container">
        <h2>Quản lý sản phẩm</h2>

        {/* ===== FORM ===== */}
        <div className="form">
          <input name="ten" value={form.ten} onChange={handleChange} placeholder="Tên" />
          <input name="ma" value={form.ma} onChange={handleChange} placeholder="Mã" />
          <input name="moTa" value={form.moTa} onChange={handleChange} placeholder="Mô tả" />

          <select name="tayAoId" value={form.tayAoId} onChange={handleChange}>
            <option value="">-- Tay áo --</option>
            {tayAoList.map(i => (
              <option key={i.id} value={i.id}>{i.ten}</option>
            ))}
          </select>

          <select name="thuongHieuId" value={form.thuongHieuId} onChange={handleChange}>
            <option value="">-- Thương hiệu --</option>
            {thuongHieuList.map(i => (
              <option key={i.id} value={i.id}>{i.ten}</option>
            ))}
          </select>

          <select name="coAoId" value={form.coAoId} onChange={handleChange}>
            <option value="">-- Cổ áo --</option>
            {coAoList.map(i => (
              <option key={i.id} value={i.id}>{i.ten}</option>
            ))}
          </select>

          <select name="chatLieuId" value={form.chatLieuId} onChange={handleChange}>
            <option value="">-- Chất liệu --</option>
            {chatLieuList.map(i => (
              <option key={i.id} value={i.id}>{i.ten}</option>
            ))}
          </select>

          <select name="xuatXuId" value={form.xuatXuId} onChange={handleChange}>
            <option value="">-- Xuất xứ --</option>
            {xuatXuList.map(i => (
              <option key={i.id} value={i.id}>{i.ten}</option>
            ))}
          </select>

          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Đang xử lý..." : editingId ? "Cập nhật" : "Thêm"}
          </button>

          {editingId && (
            <button onClick={resetForm}>Huỷ</button>
          )}
        </div>

        {errorMsg && <p className="error">{errorMsg}</p>}

        {/* ===== TABLE ===== */}
        <div style={{ margin: "10px 0" }}>
          <input
            placeholder="Tìm theo tên hoặc mã sản phẩm..."
            value={keyword}
           onChange={(e) => {
              setKeyword(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: "8px",
              width: "300px",
              border: "1px solid #ccc",
              borderRadius: "6px"
            }}
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên</th>
              <th>Mã</th>
              <th>Mô tả</th>
              <th>Tay áo</th>
              <th>Thương hiệu</th>
              <th>Cổ áo</th>
              <th>Chất liệu</th>
              <th>Xuất xứ</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr><td colSpan="12">Không có dữ liệu</td></tr>
            ) : (
            // paginatedData.map(item => (
              paginatedData.map((item, index) => (
                <tr key={item.id}>
                  {/* <td>{item.id}</td> */}
                  <td>{startIndex + index + 1}</td>
                  <td>{item.ten}</td>
                  <td>{item.ma || item.maSanPham}</td>
                  <td>{item.moTa}</td>

                  <td>{item.tayAo?.ten}</td>
                  <td>{item.thuongHieu?.ten}</td>
                  <td>{item.coAo?.ten}</td>
                  <td>{item.chatLieu?.ten}</td>
                  <td>{item.xuatXu?.ten}</td>

                  <td>{item.daXoa ? "Ngừng" : "Hoạt động"}</td>
                  <td>{formatDate(item.taoLuc)}</td>

                  <td>
                    <button onClick={() => handleEdit(item)}>Sửa</button>
                    <button
                      onClick={() => navigate(`/san-pham/${item.id}/chi-tiet`)}
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div style={{ marginTop: "10px", display: "flex", gap: "5px" }}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              style={{
                fontWeight: currentPage === i + 1 ? "bold" : "normal"
              }}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default SanPhamPage;