import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import sanPhamChiTietApi from "../../api/sanPhamChiTietApi";
import cartApi from "../../api/cartApi";
import "./SanPhamDetail.css";

export default function SanPhamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const [soLuong, setSoLuong] = useState(1);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!id) return;

    sanPhamChiTietApi
      .getBySanPhamId(id)
      .then((data) => {
        setVariants(data || []);

        if (data?.length > 0) {
          const first = data[0];
          setSelectedVariant(first);
          setSelectedColor(first.mauSac?.ten || null);
          setSelectedSize(first.kichCo?.ten || null);
        }
      })
      .catch(console.error);
  }, [id]);

  const colors = [
    ...new Set(
      variants.map((v) => v.mauSac?.ten).filter(Boolean)
    ),
  ];

  const allSizes = [
    ...new Set(
      variants.map((v) => v.kichCo?.ten).filter(Boolean)
    ),
  ];

  useEffect(() => {
    if (!selectedColor || !selectedSize) return;

    const found = variants.find(
      (v) =>
        v.mauSac?.ten === selectedColor &&
        v.kichCo?.ten === selectedSize
    );

    setSelectedVariant(found || null);
    setSoLuong(1);
  }, [selectedColor, selectedSize, variants]);

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      alert("Vui lòng chọn màu và size");
      return;
    }

    if (!user?.id) {
      alert("Bạn cần đăng nhập");
      return;
    }

    try {
      setLoading(true);

      const cart = await cartApi.getMyCart(user.id);

     const existed = (cart.items || []).find(
        (item) => item.id === selectedVariant.id
      );

      const currentQty = existed?.soLuong || 0;
      const totalQty = currentQty + soLuong;

      if (totalQty > selectedVariant.soLuong) {
        alert(
          `Bạn đã có ${currentQty} sản phẩm trong giỏ. Chỉ còn ${selectedVariant.soLuong} sản phẩm trong kho`
        );
        return;
      }

      await cartApi.add({
        chiTietSanPhamId: selectedVariant.id,
        soLuong,
        taiKhoanId: user.id,
      });

      alert("Đã thêm vào giỏ hàng");
    } catch (err) {
      console.error(err);
      alert(err.message || "Lỗi thêm giỏ hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/gio-hang");
  };

  if (!variants.length) {
    return <p className="detail-loading">Đang tải sản phẩm...</p>;
  }

  return (
    <div className="detail-page">
      {/* breadcrumb */}
      <div className="breadcrumb">
        <span onClick={() => navigate("/")}>Trang chủ</span>
        <span>/</span>
        <span onClick={() => navigate("/san-pham")}>Sản phẩm</span>
        <span>/</span>
        <span className="active">
          {selectedVariant?.sanPham?.ten}
        </span>
      </div>

      <div className="detail-container">
        {/* IMAGE */}
        <div className="detail-left">
          <div className="detail-img">
            <img
              src={
                selectedVariant?.hinhAnhs?.[0]?.ten ||
                "https://via.placeholder.com/600"
              }
              alt={selectedVariant?.sanPham?.ten}
            />
          </div>
        </div>

        {/* INFO */}
        <div className="detail-right">
          <h1 className="product-name">
            {selectedVariant?.sanPham?.ten}
          </h1>

          <div className="price-box">
            <span className="price">
              {selectedVariant?.gia?.toLocaleString("vi-VN")}đ
            </span>
          </div>

          <div className="stock-box">
            {selectedVariant?.soLuong > 0 ? (
              <span className="in-stock">
                Còn {selectedVariant.soLuong} sản phẩm
              </span>
            ) : (
              <span className="out-stock">Hết hàng</span>
            )}
          </div>

          {/* COLOR */}
          <div className="option-group">
            <p className="option-title">Màu sắc</p>

            <div className="option-list">
              {colors.map((c) => (
                <button
                  key={c}
                  className={
                    selectedColor === c
                      ? "option-btn active"
                      : "option-btn"
                  }
                  onClick={() => {
                    setSelectedColor(c);

                    const first = variants.find(
                      (v) => v.mauSac?.ten === c
                    );

                    setSelectedSize(first?.kichCo?.ten || null);
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* SIZE */}
          <div className="option-group">
            <p className="option-title">Kích cỡ</p>

            <div className="option-list">
              {allSizes.map((s) => {
                const available = variants.some(
                  (v) =>
                    v.kichCo?.ten === s &&
                    (!selectedColor ||
                      v.mauSac?.ten === selectedColor)
                );

                return (
                  <button
                    key={s}
                    disabled={!available}
                    className={
                      selectedSize === s
                        ? "option-btn active"
                        : "option-btn"
                    }
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* QUANTITY */}
          <div className="qty-box">
            <span>Số lượng</span>

            <div className="qty-control">
              <button
                onClick={() =>
                  setSoLuong((prev) => Math.max(1, prev - 1))
                }
              >
                -
              </button>

              <span>{soLuong}</span>

              <button
                onClick={() =>
                  setSoLuong((prev) =>
                    Math.min(selectedVariant?.soLuong || 1, prev + 1)
                  )
                }
              >
                +
              </button>
            </div>
          </div>

          {/* ACTION */}
          <div className="detail-actions">
            <button
              className="add-cart-btn"
              onClick={handleAddToCart}
              disabled={loading || selectedVariant?.soLuong === 0}
            >
              {loading ? "Đang thêm..." : "Thêm vào giỏ"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}