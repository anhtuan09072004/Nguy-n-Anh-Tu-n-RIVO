import { useEffect, useState } from "react";
import kichCoApi from "../../api/kichCoApi";

function SizePage() {
  const [data, setData] = useState([]);
  const [ten, setTen] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ===== FETCH DATA =====
  const fetchData = async () => {
    try {
      const res = await kichCoApi.getAll();
      setData(res || []);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ===== HANDLE ERROR =====
  const handleError = (error) => {
    console.error("FULL ERROR:", error);

    if (error.response) {
      console.log("STATUS:", error.response.status);
      console.log("DATA:", error.response.data);
    } else {
      console.log("NO RESPONSE");
    }

    setErrorMsg(error.response?.data?.message || "Có lỗi xảy ra");
  };

  // ===== VALIDATE SIZE =====
  const isValidSize = () => {
    const validSizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"];
    return validSizes.includes(ten.trim().toUpperCase());
  };

  // ===== CHECK TRÙNG =====
  const isDuplicateName = () => {
    const input = ten.trim().toUpperCase();

    return data.some((item) => {
      if (editingId && item.id === editingId) return false;
      return item.ten?.toUpperCase() === input;
    });
  };

  // ===== CREATE / UPDATE =====
  const handleSubmit = async () => {
    if (loading) return;

    setErrorMsg("");

    if (!ten.trim()) {
      setErrorMsg("Vui lòng nhập tên size!");
      return;
    }

    if (!isValidSize()) {
      setErrorMsg("Size không hợp lệ. Chỉ nhập: XS, S, M, L, XL, XXL, 3XL, 4XL, 5XL");
      return;
    }

    if (isDuplicateName()) {
      alert("Tên size đã tồn tại!");
      return;
    }

    const isEdit = !!editingId;

    const confirmed = window.confirm(
      isEdit
        ? "Bạn có chắc muốn cập nhật size này?"
        : "Bạn có chắc muốn thêm size này?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const sizeValue = ten.trim().toUpperCase();

      if (isEdit) {
        await kichCoApi.update(editingId, { ten: sizeValue });
        alert("Cập nhật size thành công");
      } else {
        await kichCoApi.create({ ten: sizeValue });
        alert("Thêm size thành công");
      }

      setTen("");
      setEditingId(null);
      await fetchData();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // ===== EDIT =====
  const handleEdit = (item) => {
    setTen(item.ten);
    setEditingId(item.id);
    setErrorMsg("");
  };

  const handleCancel = () => {
    setTen("");
    setEditingId(null);
    setErrorMsg("");
  };

  return (
    <div className="container">
      <h2>Quản lý size</h2>

      {/* ===== FORM ===== */}
      <div className="form">
        <input
          value={ten}
          onChange={(e) => {
            setTen(e.target.value.toUpperCase());
            setErrorMsg("");
          }}
          placeholder="Nhập size (XS, S, M, L, XL...)"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={editingId ? "btn-update" : "btn-add"}
        >
          {loading
            ? "Đang xử lý..."
            : editingId
            ? "Cập nhật"
            : "Thêm"}
        </button>

        {editingId && (
          <button onClick={handleCancel} className="btn-cancel">
            Huỷ
          </button>
        )}
      </div>

      {/* ===== ERROR ===== */}
      {errorMsg && <p className="error">{errorMsg}</p>}

      {/* ===== TABLE ===== */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="4" className="empty">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.ten}</td>

                <td>
                  {item.daXoa ? (
                    <span className="status-inactive">Ngừng hoạt động</span>
                  ) : (
                    <span className="status-active">Hoạt động</span>
                  )}
                </td>

                <td>
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(item)}
                  >
                    Sửa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SizePage;