import { useEffect, useState, useCallback } from "react";
import sanPhamChiTietApi from "../../api/sanPhamChiTietApi";
import kichCoApi from "../../api/kichCoApi";
import mauSacApi from "../../api/mauSacApi";
import hinhAnhApi from "../../api/hinhAnhApi";

export default function useSanPhamChiTiet(productId) {
  // ================= STATE =================
  const [data, setData] = useState([]);
  const [kichCoList, setKichCoList] = useState([]);
  const [mauSacList, setMauSacList] = useState([]);
  const [images, setImages] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  // ================= FETCH SPCT =================
  const fetchData = useCallback(async (id) => {
    if (!id) return [];

    try {
      const res = await sanPhamChiTietApi.getBySanPham(id);
      const result = res?.data || [];

      setData(result);
      return result;
    } catch (err) {
      console.log("fetchData error:", err);
      setErrorMsg("Lỗi load sản phẩm chi tiết");
      return [];
    }
  }, []);

  // ================= FETCH DROPDOWN =================
  const fetchSelect = useCallback(async () => {
    try {
      const [kc, ms] = await Promise.all([
        kichCoApi.getAll(),
        mauSacApi.getAll()
      ]);

      setKichCoList(kc?.data || kc || []);
      setMauSacList(ms?.data || ms || []);
    } catch (err) {
      console.log(err);
      setErrorMsg("Lỗi load dropdown");
    }
  }, []);

  // ================= FETCH IMAGES =================
  const fetchImages = useCallback(async (spctId) => {
    if (!spctId) return [];

    try {
      const res = await hinhAnhApi.getBySPCT(spctId);
      const result = res?.data || [];

      setImages(result);
      return result;
    } catch (err) {
      console.log(err);
      setErrorMsg("Lỗi load ảnh");
      return [];
    }
  }, []);

  // ================= INIT EFFECT =================
  useEffect(() => {
    if (productId) {
      fetchData(productId);
    }
  }, [productId, fetchData]);

  useEffect(() => {
    fetchSelect();
  }, [fetchSelect]);

  // ================= RETURN =================
  return {
    data,
    setData,

    kichCoList,
    mauSacList,

    images,
    setImages,

    fetchData,
    fetchSelect,
    fetchImages,

    errorMsg,
    setErrorMsg
  };
}