import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import quanLyHoaDonApi from "../../api/quanLyHoaDonApi";
import "./quanLyHoaDon.css";

export default function QuanLyHoaDon() {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [list, setList] = useState([]);
  const [sortType, setSortType] = useState("default"); // 🔥 thêm dòng này

  const [filter, setFilter] = useState({
      ma: "",
    trangThai: "",
    kieuHoaDon: "",
    sdt: "",
    fromDate: "",
    toDate: ""
  });

    const loadData = async () => {
      console.log("FILTER SEND:", {
        ma: filter.ma,
        trangThai: filter.trangThai,
        kieuHoaDon: filter.kieuHoaDon,
        sdt: filter.sdt,
        fromDate: filter.fromDate,
        toDate: filter.toDate
      });
    const res = await quanLyHoaDonApi.search({
      ma: filter.ma || null,
      trangThai: filter.trangThai || null,
      kieuHoaDon: filter.kieuHoaDon || null,
      sdt: filter.sdt || null,
      tuNgay: filter.fromDate || null,
      denNgay: filter.toDate || null,
      page,
      size,
      sortType // 🔥 thêm dòng này
    });

     setList(res.data?.content || []);
    setTotalPages(res.data?.totalPages || 0);
  };

  const navigate = useNavigate();
       useEffect(() => {
        loadData();
      }, [filter, page, sortType]); // 🔥 thêm sortType


  const goDetail = (id) => {
    navigate(`/admin/hoa-don/${id}`);
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn hủy?")) return;
    await quanLyHoaDonApi.cancel(id);
    loadData();
  };

  const formatTrangThai = (tt, type) => {
  // POS
   const status = Number(tt);
  const orderType = Number(type);
  if (orderType  === 0) {
    switch (status) {
      case 0: return "Chờ thanh toán";
       case 1: return "Đã tạo";  
      case 5: return "Hoàn thành";
      case 6: return "Đã hủy";
      default: return "Không rõ";
    }
  }

  // ONLINE
  if (orderType  === 1) {
    switch (status) {
      case 1: return "Chờ xác nhận";
      case 2: return "Đã xác nhận";
      case 3: return "Chờ lấy hàng";
      case 4: return "Đang giao hàng";
      case 5: return "Hoàn thành";
      case 6: return "Đã hủy";
      case 7: return "Trả hàng";
      default: return "Không rõ";
    }
  }

  console.log("type:", type, typeof type);
  console.log("tt:", tt, typeof tt);
  return "Không rõ";
};

  const getStatusClass = (tt) => {
     const status = Number(tt);
      switch (status) {
      case 0:
      case 1:
      case 3:
        return "pending";   // vàng

      case 2:
        return "confirm";   // xanh dương

      case 4:
        return "shipping";  // tím

      case 5:
        return "done";      // xanh lá

      case 6:
      case 7:
        return "cancel";    // đỏ

      default:
        return "";
    }
  };
  const formatHinhThuc = (type) => {
     const t = Number(type);
    switch (t) {
      case 0:
        return "Tại quầy";
      case 1:
        return "Giao hàng";
      default:
        return "Không rõ";
    }
  };
  const canCancel = (tt) => {
    return [0, 1, 2].includes(Number(tt)); 
      };
      
        const formatDate = (date) => {
          if (!date) return "";

      let d;

      if (Array.isArray(date)) {
        d = new Date(...date);
      } else {
        d = new Date(date.replace(" ", "T"));
      }

      if (isNaN(d)) return "";

      return d.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    };

  return (
    <div className="qlhd-container">
      <h2 className="title">📋 Quản lý hóa đơn</h2>

      {/* FILTER */}
      <div className="filter-box">
        <input
          className="input"
          placeholder="Mã hóa đơn..."
          value={filter.ma}
          onChange={(e) =>
            setFilter({ ...filter, ma: e.target.value })
          }
        />
        

        <input
          className="input"
          placeholder="SĐT..."
          value={filter.sdt}
          onChange={(e) =>
            setFilter({ ...filter, sdt: e.target.value })
          }
        />

        <select
          className="select"
          value={filter.kieuHoaDon}
          onChange={(e) =>
            setFilter({ ...filter, kieuHoaDon: e.target.value })
          }
        >
          <option value="">Hình thức</option>
          <option value="0">Tại quầy</option>
          <option value="1">Giao hàng</option>
        </select>

        <select
          className="select"
          value={filter.trangThai}
          onChange={(e) =>
            setFilter({ ...filter, trangThai: e.target.value })
          }
        >
          <option value="">Trạng thái</option>
          <option value="0">Chờ thanh toán</option>
          <option value="1">Chờ xác nhận</option>
          <option value="2">Đã xác nhận</option>
          <option value="3">Chờ lấy hàng</option>
          <option value="4">Đang giao</option>
          <option value="5">Hoàn thành</option>
          <option value="6">Đã hủy</option>
          {/* <option value="7">Trả hàng</option> */}
        </select>

        {/* DATE */}
        <input
          type="datetime-local"
          className="input"
          value={filter.fromDate}
          onChange={(e) => {
            setPage(0);
            setFilter({ ...filter, fromDate: e.target.value });
          }}
        />

        <input
          type="datetime-local"
          className="input"
          value={filter.toDate}
          onChange={(e) => {
            setPage(0); // 🔥 reset về trang đầu
            setFilter({ ...filter, toDate: e.target.value });
          }}
        />
        <div style={{ marginTop: "10px" }}>
          <label>
            <input
              type="radio"
              value="default"
              checked={sortType === "default"}
              onChange={(e) => {
                setSortType(e.target.value);
                setPage(0);
              }}
            />
            Mặc định
          </label>

          <label style={{ marginLeft: "20px" }}>
            <input
              type="radio"
              value="newest"
              checked={sortType === "newest"}
              onChange={(e) => {
                setSortType(e.target.value);
                setPage(0);
              }}
            />
            Mới nhất
          </label>
        </div>

      </div>

      {/* TABLE */}
      <div className="pagination">
          <button 
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            ◀
          </button>

          <span>Trang {page + 1} / {totalPages}</span>

          <button 
            disabled={page + 1 >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            ▶
          </button>
        </div>
      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>Mã</th>
              <th>Khách</th>
              <th>SĐT</th>
              <th>Hình thức</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {list.map((hd) => {
                return (
                  <tr key={hd.id}>
                    <td>{hd.ma}</td>
                    <td>{hd.tenKhachHang}</td>
                    <td>{hd.sdt}</td>

                    <td>{formatHinhThuc(hd.kieuHoaDon)}</td>

                    <td>{hd.tongTien?.toLocaleString()} đ</td>

                    <td>
                      <span className={`status ${getStatusClass(hd.trangThai)}`}>
                        {formatTrangThai(hd.trangThai, hd.kieuHoaDon)}
                      </span>
                    </td>
                    <td>{formatDate(hd.taoLuc)}</td>

                    <td className="actions">
                      <button onClick={() => goDetail(hd.id)}>Xem</button>

                      {canCancel(hd.trangThai) && (
                        <button
                          className="btn-cancel"
                          onClick={() => handleCancel(hd.id)}
                        >
                          Hủy
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}