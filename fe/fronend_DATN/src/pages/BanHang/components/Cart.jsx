export default function Cart({
  activeHoaDon,
  updateQty,
  removeItem
}) {
  const items = activeHoaDon?.hoaDonChiTiets || [];
   console.log("items:", items);
      return (
      <div className="cart">
        <h3>🧾 Hóa đơn</h3>

        {items.map(item => (
          <div key={item.id} className="cart-item flex gap-3 items-center">

            <img
              src={item.hinhAnh || "https://via.placeholder.com/150"}
              alt=""
              className="w-14 h-14 object-cover rounded"
            />
            {/* 🔥 THÔNG TIN */}
            <div className="flex-1">
              <div className="font-semibold">
                {item.tenSanPham}
              </div>

              {/* 🔥 THUỘC TÍNH */}
              <div className="text-sm text-gray-500">
                {item.mauSac} - {item.kichCo}
              </div>
              <div className="text-xs text-gray-500">
                Tồn kho: {item.soLuongTon}
              </div>

              {/* 🔥 SỐ LƯỢNG */}
              <div className="flex items-center gap-2 mt-1">
                <button onClick={() => updateQty(item, item.soLuong - 1)}>-</button>
                <span>{item.soLuong}</span>
                <button onClick={() => updateQty(item, item.soLuong + 1)}>+</button>
              </div>
            </div>

            {/* 🔥 GIÁ */}
            <div className="text-right">
              <div>
                {(item.gia * item.soLuong).toLocaleString()} đ
              </div>

              <button onClick={() => removeItem(item.id)}>❌</button>
            </div>

          </div>
        ))}
      </div>
    );
}