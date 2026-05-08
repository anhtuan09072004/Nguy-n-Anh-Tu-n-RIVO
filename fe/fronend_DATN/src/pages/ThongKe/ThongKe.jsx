import { useEffect, useState } from "react";
import thongKeApi from "../../api/thongKeApi";
import "./ThongKe.css";

export default function ThongKe() {
  const [data, setData] = useState({});
  const [topBanChay, setTopBanChay] = useState([]);
  const [topSapHet, setTopSapHet] = useState([]);

  const [filter, setFilter] = useState({
    fromDate: "",
    toDate: "",
  });

  // ================= LOAD =================
  useEffect(() => {
    loadHomNay();
    loadTop();

    const interval = setInterval(() => {
      loadTop();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const loadHomNay = async () => {
    try {
      const res = await thongKeApi.homNay();
      setData(res || {});
    } catch (e) {
      console.error(e);
    }
  };

  const loadTheoKhoang = async () => {
    if (!filter.fromDate || !filter.toDate) {
      alert("Chọn ngày");
      return;
    }

    try {
      const res = await thongKeApi.theoKhoang(filter);
      setData(res || {});
    } catch (e) {
      console.error(e);
    }
  };

  const loadTop = async () => {
    try {
      const banChay = await thongKeApi.topBanChay();
      const sapHet = await thongKeApi.topSapHet();

      setTopBanChay(banChay || []);
      setTopSapHet(sapHet || []);
    } catch (e) {
      console.error(e);
    }
  };

  // ================= FE CALCULATE =================
  const tongBan = topBanChay.reduce(
    (sum, item) => sum + (item.soLuongBan || 0),
    0
  );

  const sapHetCount = topSapHet.length;

  const giaTriTrungBinh =
    data.tongDon > 0
      ? Math.round((data.doanhThu || 0) / data.tongDon)
      : 0;

  const maxBan = topBanChay[0]?.soLuongBan || 1;

  // ================= UI =================
  return (
    <div className="tk-container">
      <h2>Thống kê cửa hàng</h2>

      <div className="tk-filter">
        <input
          type="date"
          value={filter.fromDate}
          onChange={(e) =>
            setFilter({ ...filter, fromDate: e.target.value })
          }
        />

        <input
          type="date"
          value={filter.toDate}
          onChange={(e) =>
            setFilter({ ...filter, toDate: e.target.value })
          }
        />

        <button onClick={loadTheoKhoang}>Lọc</button>
        <button onClick={loadHomNay}>Hôm nay</button>
      </div>

      {/* CARD */}
      <div className="tk-cards">
        <div className="tk-card">
          <h4>Doanh thu</h4>
          <p>{(data.doanhThu || 0).toLocaleString("vi-VN")} đ</p>
        </div>

        <div className="tk-card">
          <h4>Tổng đơn</h4>
          <p>{data.tongDon || 0}</p>
        </div>

        <div className="tk-card">
          <h4>Giá trị đơn TB</h4>
          <p>{giaTriTrungBinh.toLocaleString("vi-VN")} đ</p>
        </div>

        <div className="tk-card">
          <h4>Sản phẩm bán</h4>
          <p>{tongBan}</p>
        </div>

        <div className="tk-card">
          <h4>Sắp hết hàng</h4>
          <p>{sapHetCount}</p>
        </div>
      </div>

      {/* GRID */}
      <div className="tk-grid">
        {/* TOP BÁN */}
        <div className="tk-box">
          <h3>🔥 Top 5 bán chạy</h3>

          {topBanChay.length === 0 && <p>Không có dữ liệu</p>}

          {topBanChay.map((item, i) => (
            <div
              key={i}
              className="tk-item"
              style={{
                border:
                  item.soLuongBan >= 100
                    ? "2px solid red"
                    : "1px solid #ddd",
              }}
            >
              <img
                src={item.anh || "https://via.placeholder.com/50"}
                alt=""
                className="tk-img"
              />

              <div className="tk-info">
                <span className="tk-name">{item.tenSanPham}</span>

                <small>
                  {item.size || "N/A"} - {item.mauSac || "N/A"}
                </small>

                <div className="tk-progress">
                  <div
                    className="tk-progress-bar"
                    style={{
                      width: `${Math.min(
                        ((item.soLuongBan || 0) / maxBan) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <b className="tk-sold">{item.soLuongBan}</b>
            </div>
          ))}
        </div>

        {/* TOP SẮP HẾT */}
        <div className="tk-box">
          <h3>⚠️ Sắp hết hàng</h3>

          {topSapHet.length === 0 && <p>Không có dữ liệu</p>}

          {topSapHet.map((item, i) => (
            <div
              key={i}
              className="tk-item"
              style={{
                border:
                  item.soLuongTon <= 5
                    ? "2px solid red"
                    : "1px solid #ddd",
              }}
            >
              <img
                src={item.anh || "https://via.placeholder.com/50"}
                alt=""
                className="tk-img"
              />

              <div className="tk-info">
                <span className="tk-name">{item.tenSanPham}</span>

                <small>
                  {item.size || "N/A"} - {item.mauSac || "N/A"}
                </small>
              </div>

              <b
                className="tk-sold"
                style={{
                  color: item.soLuongTon <= 5 ? "red" : "black",
                }}
              >
                {item.soLuongTon}
              </b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}