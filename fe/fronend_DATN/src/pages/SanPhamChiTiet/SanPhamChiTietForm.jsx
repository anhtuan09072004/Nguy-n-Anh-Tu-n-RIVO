export default function SanPhamChiTietForm({
  form,
  onChange,
  onSubmitCreate,
  onSubmitUpdate,
  editingId,
  loading,
  kichCoList,
  mauSacList,
  resetForm,
  errorMsg
}) {

  const isEditMode = editingId != null;

  return (
    <div
      className="ctsp-form"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "350px",
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        background: "#fff"
      }}
    >

      <select
        name="kichCoId"
        value={form.kichCoId}
        onChange={onChange}
        style={{
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      >
        <option value="">-- Kích cỡ --</option>
        {kichCoList.map(i => (
          <option key={i.id} value={String(i.id)}>
            {i.ten}
          </option>
        ))}
      </select>

      <select
        name="mauSacId"
        value={form.mauSacId}
        onChange={onChange}
        style={{
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      >
        <option value="">-- Màu sắc --</option>
        {mauSacList.map(i => (
          <option key={i.id} value={String(i.id)}>
            {i.ten}
          </option>
        ))}
      </select>

      <input
        name="gia"
        value={form.gia}
        onChange={onChange}
        placeholder="Giá"
        style={{
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      />

      <input
        name="soLuong"
        value={form.soLuong}
        onChange={onChange}
        placeholder="Số lượng"
        style={{
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      />

      <input
        name="ma"
        value={form.ma}
        onChange={onChange}
        placeholder="Mã"
        style={{
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      />

      {/* ================= BUTTON GROUP ================= */}

      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>

        <button
          onClick={onSubmitCreate}
          disabled={loading || isEditMode}
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: "none",
            background: isEditMode ? "#ccc" : "#28a745",
            color: "#fff",
            cursor: isEditMode ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Đang xử lý..." : "Thêm"}
        </button>

        <button
          onClick={onSubmitUpdate}
          disabled={loading || !isEditMode}
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: "none",
            background: !isEditMode ? "#ccc" : "#007bff",
            color: "#fff",
            cursor: !isEditMode ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Đang cập nhật..." : "Cập nhật"}
        </button>

        {isEditMode && (
          <button
            onClick={resetForm}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "none",
              background: "#dc3545",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            Huỷ
          </button>
        )}
      </div>

      {errorMsg && (
        <p
          style={{
            color: "red",
            marginTop: "10px",
            fontWeight: "bold"
          }}
        >
          {errorMsg}
        </p>
      )}

    </div>
  );
}