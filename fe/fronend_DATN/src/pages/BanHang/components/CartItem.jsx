export default function CartItem({ item, onUpdate, onDelete }) {
  return (
    <div className="cart-item">
      <span>{item.tenSanPham}</span>

      <div>
        <button onClick={() => onUpdate(item, item.soLuong - 1)}>-</button>
        <span>{item.soLuong}</span>
        <button onClick={() => onUpdate(item, item.soLuong + 1)}>+</button>
      </div>

      <span>{(item.gia * item.soLuong).toLocaleString()}</span>

      <button onClick={() => onDelete(item.id)}>❌</button>
    </div>
  );
}