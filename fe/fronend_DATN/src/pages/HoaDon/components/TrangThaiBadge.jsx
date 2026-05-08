export default function TrangThaiBadge({ status }) {
  const map = {
    CHO_XAC_NHAN: { text: "Chờ xác nhận", color: "bg-gray-400" },
    DA_XAC_NHAN: { text: "Đã xác nhận", color: "bg-blue-500" },
    DANG_GIAO: { text: "Đang giao", color: "bg-yellow-500" },
    HOAN_THANH: { text: "Hoàn thành", color: "bg-green-500" },
    DA_HUY: { text: "Đã hủy", color: "bg-red-500" },
  };

  const item = map[status] || {
    text: "Không xác định",
    color: "bg-gray-300",
  };

  return (
    <span className={`text-white px-2 py-1 rounded text-sm ${item.color}`}>
      {item.text}
    </span>
  );
}