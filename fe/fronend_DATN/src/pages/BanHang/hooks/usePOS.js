import { useEffect, useState } from "react";
import posApi from "../../../api/posApi";

export default function usePOS() {
  const [hoaDons, setHoaDons] = useState([]);
  const [activeHoaDon, setActiveHoaDon] = useState(null);
  const [tongTien, setTongTien] = useState(0);

  const MAX_HOA_DON = 5;

  // 👉 tính tổng tiền
  const calcTongTien = (hd) => {
    const items = hd?.hoaDonChiTiets || [];

    const tong = items.reduce(
      (s, i) => s + i.gia * i.soLuong,
      0
    );

    setTongTien(tong);
  };

  // 👉 load detail hóa đơn
  const loadHoaDonDetail = async (id) => {
    try {
      const res = await posApi.getHoaDonChiTiet(id);
      const data = res.data;

      setActiveHoaDon(data);
      calcTongTien(data);
    } catch (err) {
      console.error("Lỗi load chi tiết:", err);
    }
  };

  // 🔥 load danh sách hóa đơn
  const loadHoaDons = async () => {
    try {
      const res = await posApi.getAllHoaDon();
      const list = res.data || [];

      setHoaDons(list);

      if (list.length > 0) {
        await loadHoaDonDetail(list[0].id);
      } else {
        setActiveHoaDon(null);
        setTongTien(0);
      }
    } catch (err) {
      console.error("Lỗi load hóa đơn:", err);
    }
  };

  // 👉 tạo hóa đơn
  const createHoaDon = async () => {
    try {
      if (hoaDons.length >= MAX_HOA_DON) {
        alert(`⚠️ Tối đa ${MAX_HOA_DON} hóa đơn`);
        return;
      }

      const res = await posApi.createHoaDon({
        kieuHoaDon: 0,
      });

      const newId = res.data.id;

      // 👉 reload list
      const listRes = await posApi.getAllHoaDon();
      const list = listRes.data || [];

      setHoaDons(list);

      // 👉 set active đúng hóa đơn vừa tạo
      await loadHoaDonDetail(newId);

    } catch (err) {
      console.error("Lỗi tạo hóa đơn:", err);
    }
  };

  // 👉 thêm sản phẩm
  const addToCart = async (sp) => {
    if (!activeHoaDon) return;

    try {
      await posApi.addSanPham({
        hoaDonId: activeHoaDon.id,
        chiTietSanPhamId: sp.id,
        soLuong: 1,
      });

      await loadHoaDonDetail(activeHoaDon.id);
    } catch (err) {
      console.error("Lỗi thêm:", err);
    }
  };

  // 👉 update số lượng
  const updateQty = async (item, qty) => {
    if (qty <= 0) return;

    try {
      await posApi.updateSoLuong({
        hoaDonId: activeHoaDon.id,
        chiTietSanPhamId: item.chiTietSanPhamId,
        soLuong: qty,
      });

      await loadHoaDonDetail(activeHoaDon.id);
    } catch (err) {
      console.error("Lỗi update:", err);
    }
  };

  // 👉 xoá sản phẩm
  const removeItem = async (id) => {
    try {
      await posApi.deleteItem(id);
      await loadHoaDonDetail(activeHoaDon.id);
    } catch (err) {
      console.error("Lỗi xoá:", err);
    }
  };

  // 👉 chuyển hóa đơn
  const switchHoaDon = async (id) => {
    await loadHoaDonDetail(id);
  };

  // 👉 thanh toán
  const thanhToan = async (data) => {
  try {
    await posApi.thanhToan({
      hoaDonId: activeHoaDon.id,
      ...data,
    });

    alert("✅ Thành công");

    setActiveHoaDon(null);
    await loadHoaDons();
  } catch (err) {
    console.error("Lỗi thanh toán:", err.response?.data || err);
    throw err;
  }
};

  useEffect(() => {
    loadHoaDons();
  }, []);

  return {
    hoaDons,
    activeHoaDon,
    tongTien,

    createHoaDon,
    switchHoaDon,

    addToCart,
    updateQty,
    removeItem,
    thanhToan,
  };
}