import { useEffect, useState } from "react";
import sanPhamApi from "../../api/sanPhamApi";
import thuongHieuApi from "../../api/thuongHieuApi";
import xuatXuApi from "../../api/xuatXuApi";
import { useNavigate } from "react-router-dom";
import "./SanPham.css";

export default function SanPham() {
  const [list, setList] = useState([]);
  const [brands, setBrands] = useState([]);
  const [origins, setOrigins] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [keyword, setKeyword] = useState("");
  const [brandId, setBrandId] = useState("");
  const [originId, setOriginId] = useState("");

  const navigate = useNavigate();
  const pageSize = 8;

  useEffect(() => {
    thuongHieuApi.getAll().then(setBrands).catch(console.error);
    xuatXuApi.getAll().then(setOrigins).catch(console.error);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      sanPhamApi
        .filter({
          keyword,
          thuongHieuId: brandId || null,
          xuatXuId: originId || null,
        })
        .then((data) => {
          setList(data || []);
          setCurrentPage(1);
        })
        .catch(console.error);
    }, 300);

    return () => clearTimeout(timeout);
  }, [keyword, brandId, originId]);

  const totalPage = Math.ceil(list.length / pageSize);
  const start = (currentPage - 1) * pageSize;
  const currentData = list.slice(start, start + pageSize);

  const clearFilter = () => {
    setKeyword("");
    setBrandId("");
    setOriginId("");
  };

  return (
    <div className="sp-container">
      <div className="sp-header">
        <div>
          <h2 className="title">Tất cả sản phẩm</h2>
          <p className="sub-title">
            Khám phá những mẫu thời trang mới nhất
          </p>
        </div>

        <div className="result-count">
          {list.length} sản phẩm
        </div>
      </div>

      {/* FILTER */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Tìm sản phẩm..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <select value={brandId} onChange={(e) => setBrandId(e.target.value)}>
          <option value="">Tất cả thương hiệu</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.ten}
            </option>
          ))}
        </select>

        <select value={originId} onChange={(e) => setOriginId(e.target.value)}>
          <option value="">Tất cả xuất xứ</option>
          {origins.map((o) => (
            <option key={o.id} value={o.id}>
              {o.ten}
            </option>
          ))}
        </select>

        <button className="clear-btn" onClick={clearFilter}>
          Xóa lọc
        </button>
      </div>

      {/* PRODUCT LIST */}
      <div className="product-grid">
        {currentData.length === 0 && (
          <div className="empty-box">
            Không tìm thấy sản phẩm phù hợp
          </div>
        )}

        {currentData.map((p) => (
          <div
            className="product-card"
            key={p.id}
            onClick={() => navigate(`/san-pham/${p.id}`)}
          >
            <div className="img-wrapper">
              <span className="sale-badge">NEW</span>

              <img
                src={p.hinhAnh || "https://via.placeholder.com/300"}
                alt={p.ten}
                className="product-img"
              />
            </div>

            <div className="product-info">
              <h4 className="product-name">{p.ten}</h4>

              <div className="meta">
                <span>{p.thuongHieuTen || "N/A"}</span>
                <span>{p.xuatXuTen || "N/A"}</span>
              </div>

             <p className="sp-price">
                {p.giaMin === p.giaMax
                  ? `${p.giaMin?.toLocaleString("vi-VN")} đ`
                  : `${p.giaMin?.toLocaleString("vi-VN")} - ${p.giaMax?.toLocaleString("vi-VN")} đ`}
              </p>

              <button
                className="detail-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/san-pham/${p.id}`);
                }}
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          ← Trước
        </button>

        <span>
          Trang {currentPage} / {totalPage || 1}
        </span>

        <button
          disabled={currentPage === totalPage || totalPage === 0}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Sau →
        </button>
      </div>
    </div>
  );
}