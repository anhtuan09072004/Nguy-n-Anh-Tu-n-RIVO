import TrangThaiBadge from "./TrangThaiBadge";

export default function HoaDonRow({ hd, onUpdate, onView, selected }) {
  return (
    <tr
      className={`border-t text-center cursor-pointer ${
        selected ? "bg-blue-50" : "hover:bg-gray-50"
      }`}
    >
      <td className="p-2">{hd.id}</td>

      <td className="p-2">{hd.tenKhachHang}</td>

      <td className="p-2">{hd.soDienThoai || "-"}</td>

      {/* ✅ FIX HÌNH THỨC */}
      <td className="p-2">
        {hd.hinhThucMua === "ONLINE" ? (
          <span className="text-blue-600 font-semibold">Giao hàng</span>
        ) : hd.hinhThucMua === "OFFLINE" ? (
          <span className="text-green-600 font-semibold">Tại quầy</span>
        ) : (
          <span className="text-gray-400">Không xác định</span>
        )}
      </td>

      <td className="p-2">
        {hd.tongTien?.toLocaleString()}đ
      </td>

      {/* ✅ STATUS */}
      <td className="p-2">
        <TrangThaiBadge status={hd.trangThai} />
      </td>

      {/* ✅ FIX DROPDOWN ENUM */}
      <td className="p-2">
        <select
          value={hd.trangThai || ""}
          onChange={(e) => onUpdate(hd.id, e.target.value)}
          className="border p-1 rounded"
        >
          <option value="CHO_XAC_NHAN">Chờ xác nhận</option>
          <option value="DA_XAC_NHAN">Đã xác nhận</option>
          <option value="DANG_GIAO">Đang giao</option>
          <option value="HOAN_THANH">Hoàn thành</option>
          <option value="DA_HUY">Đã hủy</option>
        </select>
      </td>

      <td className="p-2">
        <button
          onClick={() => onView(hd)}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Xem
        </button>
      </td>
    </tr>
  );
}