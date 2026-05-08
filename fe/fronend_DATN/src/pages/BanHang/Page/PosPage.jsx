import usePOS from "../hooks/usePOS";
import ProductList from "../components/ProductList";
import Cart from "../components/Cart";
import Payment from "../components/Payment";
import OrderTabs from "../components/OrderTabs";
import "../styles/pos.css";

export default function PosPage() {
  const pos = usePOS();

  return (
    <div className="pos">
      {/* BÊN TRÁI */}
      <div className="left">
        {/* 🔥 THÊM ĐOẠN NÀY */}
        <OrderTabs
          hoaDons={pos.hoaDons}
          activeHoaDonId={pos.activeHoaDon?.id}
          switchHoaDon={pos.switchHoaDon}
          createHoaDon={pos.createHoaDon}
        />

        <ProductList onAdd={pos.addToCart} />

        {/* Hiển thị hóa đơn */}
        <Cart {...pos} />
      </div>

      {/* BÊN PHẢI */}
      <div className="right">
      <Payment hoaDon={pos.activeHoaDon} 
         thanhToan={pos.thanhToan}
      />
        
      </div>
    </div>
  );
}