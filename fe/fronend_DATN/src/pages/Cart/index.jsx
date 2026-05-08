import { useEffect, useState } from "react";
import sanPhamApi from "../../api/sanPhamApi";

export default function Cart() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    sanPhamApi.getAll().then(setProducts);
  }, []);

  const addToCart = (sp) => {
    const exist = cart.find((i) => i.id === sp.id);
    if (exist) {
      setCart(
        cart.map((i) =>
          i.id === sp.id ? { ...i, soLuong: i.soLuong + 1 } : i
        )
      );
    } else {
      setCart([...cart, { ...sp, soLuong: 1 }]);
    }
  };

  const total = cart.reduce((s, i) => s + i.gia * i.soLuong, 0);

  return (
    <div className="grid grid-cols-3 gap-6">
      
      {/* Products */}
      <div className="col-span-2">
        <h2 className="text-xl font-bold mb-4">Sản phẩm</h2>

        <div className="grid grid-cols-3 gap-4">
          {products.map((sp) => (
            <div
              key={sp.id}
              className="bg-white rounded-2xl shadow p-4 hover:shadow-xl transition"
            >
              <h3 className="font-semibold">{sp.ten}</h3>
              <p className="text-red-500 font-bold">{sp.gia} đ</p>

              <button
                onClick={() => addToCart(sp)}
                className="mt-3 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              >
                Thêm
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cart */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-xl font-bold mb-4">Giỏ hàng</h2>

        <div className="space-y-2">
          {cart.map((item) => (
            <div className="flex justify-between">
              <span>{item.ten}</span>
              <span>x{item.soLuong}</span>
            </div>
          ))}
        </div>

        <hr className="my-4" />

        <h3 className="text-lg font-bold">Tổng: {total} đ</h3>

        <button className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">
          Thanh toán
        </button>
      </div>
    </div>
  );
}