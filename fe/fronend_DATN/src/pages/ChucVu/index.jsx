import { useEffect, useState } from "react";
import mauSacApi from "../../api/chucVuApi";
import "./ChucVuPage.css";

function ChucVuPage() {
  const [data, setData] = useState([]);
  const [ten, setTen] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ===== FETCH DATA =====
  const fetchData = async () => {
    try {
      const res = await mauSacApi.getAll();
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

  // ===== CHECK TRÙNG (FRONTEND) =====
  const isDuplicateName = () => {
    const input = ten.trim().toLowerCase();

    return data.some((item) => {
      // khi update thì bỏ qua chính nó
      if (editingId && item.id === editingId) return false;

      return item.ten?.toLowerCase() === input;
    });
  };

  // ===== CREATE / UPDATE =====
  const handleSubmit = async () => {
    if (loading) return;

    setErrorMsg("");

    if (!ten.trim()) {
      setErrorMsg("Vui lòng nhập tên !");
      return;
    }

    // 🔥 CHECK TRÙNG FRONTEND
    if (isDuplicateName()) {
      alert("Tên  đã tồn tại!");
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        await mauSacApi.update(editingId, { ten: ten.trim() });
      } else {
        await mauSacApi.create({ ten: ten.trim() });
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
      <h2>Quản lý Chuc vu</h2>

      {/* ===== FORM ===== */}
      <div className="form">
        <input
          value={ten}
          onChange={(e) => {
            setTen(e.target.value);
            setErrorMsg("");
          }}
          placeholder="Nhập tên chuc vu..."
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
                    <span className="status-inactive">
                      Ngừng hoạt động
                    </span>
                  ) : (
                    <span className="status-active">
                      Hoạt động
                    </span>
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

export default ChucVuPage;