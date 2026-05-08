import { useEffect, useState, useRef } from "react";
import sanPhamChiTietApi from "../../../api/sanPhamChiTietApi";
import "./ProductList.css";

export default function ProductList({ onAdd }) {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const boxRef = useRef();

  // SEARCH API
  useEffect(() => {
    const delay = setTimeout(async () => {
      try {
        const keyword = search.trim();

        if (keyword.length < 2) {
          setData([]);
          return;
        }

        setLoading(true);

        const res = await sanPhamChiTietApi.search(keyword);
        setData(res.data || []);
      } catch (err) {
        console.error("Lỗi search:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  // CLICK OUTSIDE → đóng dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setData([]);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="product-list">
      <div className="search-box" ref={boxRef}>
        {/* INPUT */}
        <input
          className="search-input"
          placeholder="🔍 Nhập ít nhất 2 ký tự..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* LOADING */}
        {loading && <div className="dropdown">Đang tải...</div>}

        {/* DROPDOWN */}
        {!loading && data.length > 0 && (
          <div className="dropdown">
            {data.map((sp) => {
              const img = sp.hinhAnhs?.[0]?.ten;

              return (
                <div key={sp.id} className="card">
                  {/* IMAGE */}
                  <img
                    src={img || "https://via.placeholder.com/150"}
                    alt="product"
                    className="product-img"
                  />

                  {/* INFO */}
                  <div className="info">
                    <div className="name">
                      {sp.sanPham?.ten}
                    </div>

                    <div className="price">
                      {sp.gia?.toLocaleString()} đ
                    </div>

                    <div className="meta">
                      {sp.mauSac?.ten} - {sp.kichCo?.ten}
                    </div>

                    <div
                      className={
                        sp.soLuong > 0 ? "stock" : "out-stock"
                      }
                    >
                      {sp.soLuong > 0
                        ? `Còn ${sp.soLuong}`
                        : "Hết hàng"}
                    </div>

                    <button
                      className="btn-add"
                      onClick={() => {
                        onAdd(sp);
                        setSearch("");
                        setData([]);
                      }}
                    >
                      Thêm
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}