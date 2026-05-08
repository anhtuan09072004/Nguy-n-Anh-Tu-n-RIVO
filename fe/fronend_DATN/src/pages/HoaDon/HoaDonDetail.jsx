import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function HoaDonDetail() {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [hoaDon, setHoaDon] = useState(null);

  useEffect(() => {
    fetchDetail();
  }, [id]);

    const fetchDetail = async () => {
      // gọi song song
      const [resItems, resHoaDon] = await Promise.all([
        axios.get(`http://localhost:8080/api/hoa-don-chi-tiet/hoa-don/${id}`),
        axios.get(`http://localhost:8080/api/hoa-don/${id}`),
      ]);

      setItems(resItems.data);
      setHoaDon(resHoaDon.data);
    };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">
        Chi tiết hóa đơn #{id}
      </h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>Ảnh</th>
            <th>Sản phẩm</th>
            <th>Size</th>
            <th>Màu</th>
            <th>Số lượng</th>
            <th>Giá</th>
            <th>Thành tiền</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="text-center border-t">
              <td>
                <img
                  src={item.image}
                  className="w-16 h-16 object-cover mx-auto"
                />
              </td>
              <td>{item.tenSanPham}</td>
              <td>{item.tenSize}</td>
              <td>{item.tenMauSac}</td>
              <td>{item.soLuong}</td>
              <td>{item.gia?.toLocaleString()}đ</td>
              <td>{item.thanhTien?.toLocaleString()}đ</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}