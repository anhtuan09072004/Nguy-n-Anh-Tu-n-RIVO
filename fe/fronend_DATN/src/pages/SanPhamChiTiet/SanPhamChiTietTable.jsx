import "./css.css";
export default function SanPhamChiTietTable({
  data,
  onEdit,
  onDelete,
  editingId
}) {
  return (
    <table className="ctsp-table">
      <thead>
        <tr>
          <th>ID</th>
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
        {data?.map((item) => {
          const isEditing = editingId === item.id;

          // lấy ảnh (backend có thể trả list hinhAnhs)
          const imageUrl =
            item.hinhAnhs?.[0]?.ten ||
            item.hinhAnh?.ten ||
            null;

          return (
            <tr
              key={
                item.id ??
                `${item.ma}-${item.kichCo?.id}-${item.mauSac?.id}`
              }
              style={{
                background: isEditing ? "#fff3cd" : "transparent"
              }}
            >
                <td>{item.id}</td>

                {/* ẢNH */}
                <td>
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="spct"
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 6
                      }}
                    />
                  ) : (
                    <span style={{ color: "#999" }}>No image</span>
                  )}
                </td>

              <td>{item.kichCo?.ten}</td>
              <td>{item.mauSac?.ten}</td>

              <td>{item.gia?.toLocaleString()}</td>
              <td>{item.soLuong}</td>
              <td>{item.ma}</td>

              <td>
                <button
                  onClick={() => onEdit(item)}
                  disabled={isEditing}
                >
                  {isEditing ? "Đang sửa..." : "Sửa"}
                </button>

                <button onClick={() => onDelete(item.id)}>
                  Xóa
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}