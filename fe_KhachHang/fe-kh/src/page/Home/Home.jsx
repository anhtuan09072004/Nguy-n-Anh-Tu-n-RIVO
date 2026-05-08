import { useEffect, useState } from "react";
import banner from "../../component/img/banner1.jpg";
import sanPhamApi from "../../api/sanPhamApi";
import noImage from "../../component/img/no-image.png";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const BASE_IMG_URL = "http://localhost:8080/images/";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await sanPhamApi.getTopBanChay();
        console.log("DATA API:", data);
        setProducts(data || []);
      } catch (err) {
        console.error("Lỗi load top sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // format giá
  const formatPrice = (value) => {
    if (!value) return "0 đ";
    return Number(value).toLocaleString("vi-VN") + " đ";
  };

  // 🔥 FIX CHUẨN ẢNH
  const getImageUrl = (img) => {
    if (!img || img === "null" || img.trim() === "") {
      return noImage;
    }

    // nếu đã là link đầy đủ
    if (img.startsWith("http")) {
      return img;
    }

    // nếu là filename
    return BASE_IMG_URL + img;
  };

  return (
    <div className="home-container">
      <img src={banner} alt="Banner" className="banner" />

      <h2 className="title">🔥 Sản phẩm bán chạy</h2>

      {loading && <p className="loading">Đang tải sản phẩm...</p>}

      {!loading && products.length === 0 && (
        <p className="empty">Không có sản phẩm</p>
      )}

      <div className="product-list">
        {products.map((p) => {
          const imageUrl = getImageUrl(p.hinhAnh);

          return (
            <div
              className="product-card"
              key={p.id}
              onClick={() => navigate(`/san-pham/${p.id}`)}
            >
              <img
                src={imageUrl}
                alt={p.ten}
                className="product-img"
                onError={(e) => {
                  console.log("Lỗi ảnh:", imageUrl);
                  e.target.src = noImage;
                }}
              />

              <div className="product-info">
                <h4 className="product-name">{p.ten}</h4>

                <p className="home-price">
                  {p.giaMin && p.giaMax ? (
                    p.giaMin === p.giaMax ? (
                      formatPrice(p.giaMin)
                    ) : (
                      `${formatPrice(p.giaMin)} - ${formatPrice(p.giaMax)}`
                    )
                  ) : (
                    "Liên hệ"
                  )}
                </p>

                <p className="sold">
                  Đã bán: {p.tongDaBan || 0}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}