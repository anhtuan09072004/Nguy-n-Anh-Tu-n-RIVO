import { useEffect, useState } from "react";
import hoaDonApi from "../../api/hoaDonApi";
import hoaDonChiTietApi from "../../api/hoaDonChiTietApi";
import HoaDonTable from "./components/HoaDonTable";
import StepProgress from "./components/StepProgress";

export default function HoaDonPage() {
  const [hoaDons, setHoaDons] = useState([]);
  const [selectedHoaDon, setSelectedHoaDon] = useState(null);
  const [chiTietList, setChiTietList] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await hoaDonApi.getAll();
    setHoaDons(res.data || []);
  };

  // =========================
  // ✅ MAP ENUM → STEP
  // =========================
  const mapTrangThaiToStep = (trangThai) => {
    switch (trangThai) {
      case "CHO_XAC_NHAN": return 1;
      case "DA_XAC_NHAN": return 2;
      case "DANG_GIAO": return 3;
      case "HOAN_THANH": return 4;
      case "DA_HUY": return 5;
      default: return 1;
    }
  };

  // =========================
  // ✅ FORMAT TEXT
  // =========================
  const formatTrangThai = (tt) => {
    switch (tt) {
      case "CHO_XAC_NHAN": return "Chờ xác nhận";
      case "DA_XAC_NHAN": return "Đã xác nhận";
      case "DANG_GIAO": return "Đang giao";
      case "HOAN_THANH": return "Hoàn thành";
      case "DA_HUY": return "Đã hủy";
      default: return tt;
    }
  };

  const formatHinhThuc = (type) => {
    switch (type) {
      case "ONLINE": return "Giao hàng";
      case "OFFLINE": return "Tại quầy";
      default: return "Không xác định"; // 🔥 xử lý NULL
    }
  };

  // =========================
  // 🔥 CLICK XEM
  // =========================
    const goDetail = async (hoaDon) => {
      const resHoaDon = await hoaDonApi.getById(hoaDon.id);
      const resChiTiet = await hoaDonChiTietApi.getByHoaDon(hoaDon.id);

      const trangThaiString = resHoaDon.data.trangThai; // đảm bảo là string
      setSelectedHoaDon(resHoaDon.data);
      setChiTietList(resChiTiet.data || []);
      setCurrentStep(mapTrangThaiToStep(trangThaiString));

      setTimeout(() => {
        document.getElementById("detail")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    };
  // =========================
  // ✅ UPDATE TRẠNG THÁI
  // =========================
  const updateTrangThai = async (id, trangThai) => {
    await hoaDonApi.updateTrangThai(id, trangThai);

    if (selectedHoaDon?.id === id) {
      setCurrentStep(mapTrangThaiToStep(trangThai));
      setSelectedHoaDon({ ...selectedHoaDon, trangThai }); // string
    }

    fetchData();
  };

  // =========================
  // 💰 TIỀN
  // =========================
  const tongTien = selectedHoaDon?.tongTien || 0;
  const giamGia = selectedHoaDon?.giamGia || 0;
  const thanhTien = selectedHoaDon?.thanhTien || 0;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Quản lý hóa đơn</h1>

      {/* STEP */}
      <StepProgress status={selectedHoaDon?.trangThai} />

      {/* TABLE */}
      <HoaDonTable
       data={hoaDons
        .filter(
          (hd) =>
            hd?.hinhThucMua && // 🔥 bỏ NULL
            hd?.trangThai      // 🔥 bỏ NULL
        )
        .filter(
          (hd) =>
            !(hd.hinhThucMua === "OFFLINE" &&
              hd.trangThai === "CHO_XAC_NHAN")
        )
      }
        onUpdate={updateTrangThai}
        onView={goDetail}
        selectedId={selectedHoaDon?.id}
      />

      {/* DETAIL */}
      {selectedHoaDon && (
        <div
          id="detail"
          className="mt-6 bg-white p-5 rounded-xl shadow border"
        >
          <h2 className="text-lg font-semibold mb-4">
            Hóa đơn #{selectedHoaDon.id}
          </h2>

          {/* INFO */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <p><b>Khách:</b> {selectedHoaDon.tenKhachHang}</p>
            <p><b>SĐT:</b> {selectedHoaDon.soDienThoai}</p>
            <p>
              <b>Hình thức:</b> {formatHinhThuc(selectedHoaDon.hinhThucMua)}
            </p>

            <p>
              <b>Trạng thái:</b> {formatTrangThai(selectedHoaDon.trangThai)}
            </p>

            {/* 👉 nếu ONLINE thì hiện địa chỉ */}
            {selectedHoaDon?.hinhThucMua === "ONLINE" && (
              <p className="col-span-2">
                <b>Địa chỉ:</b> {selectedHoaDon.diaChi}
              </p>
            )}
          </div>

          {/* LIST PRODUCT */}
          <table className="w-full border rounded">
            <thead className="bg-gray-100 text-center">
              <tr>
                <th className="p-2">Ảnh</th>
                <th className="p-2">Tên</th>
                <th className="p-2">Giá</th>
                <th className="p-2">SL</th>
                <th className="p-2">Thành tiền</th>
              </tr>
            </thead>

            <tbody>
              {chiTietList.map((item) => (
                <tr key={item.id} className="text-center border-t">
                  <td>
                    <img
                      src={item.image}
                      className="w-14 h-14 object-cover mx-auto"
                    />
                  </td>

                  <td>{item.tenSanPham}</td>
                  <td>{item.gia?.toLocaleString()}đ</td>
                  <td>{item.soLuong}</td>
                  <td>
                    {(item.gia * item.soLuong)?.toLocaleString()}đ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 💰 TỔNG TIỀN */}
          <div className="mt-4 flex flex-col items-end gap-1 text-right">
            <p>
              <b>Tổng tiền:</b> {tongTien.toLocaleString()} đ
            </p>

            <p className="text-red-500">
              <b>Giảm giá:</b> -{giamGia.toLocaleString()} đ
            </p>

            <p className="text-lg font-bold text-green-600">
              Thành tiền: {thanhTien.toLocaleString()} đ
            </p>
          </div>
        </div>
      )}
    </div>
  );
}