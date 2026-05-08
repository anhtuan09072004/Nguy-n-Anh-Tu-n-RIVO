import { useEffect, useState } from "react";
import khachHangApi from "../../../api/customerApi";

export default function FillKhachHang({ form, setForm }) {
  const [customers, setCustomers] = useState([]);
  const [searchKH, setSearchKH] = useState("");

  useEffect(() => {
    const loadCustomers = async () => {
        try {
            const res = await khachHangApi.getAll();

            setCustomers(res.data || []); // 🔥 FIX CHÍNH Ở ĐÂY
        } catch (e) {
            console.error("Lỗi load khách hàng:", e);
            setCustomers([]);
        }
        };
    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) =>
    c.ten?.toLowerCase().includes(searchKH.toLowerCase())
  );

  return (
    <div style={{ border: "1px solid #ccc", padding: 10 }}>
      <p>👤 Khách hàng</p>

      {/* <input
        placeholder="Tìm tên khách..."
        value={searchKH}
        onChange={(e) => setSearchKH(e.target.value)}
      /> */}

      <select
        onChange={(e) => {
          const kh = customers.find(
            (c) => String(c.id) === String(e.target.value)
          );

          if (kh) {
            console.log("KH:", kh);
            setForm((prev) => ({
              ...prev,
              tenKhachHang: kh.ten || "",
             sdt: kh.sdt || kh.soDienThoai || kh.phone ||  kh.phoneNumber || "",
              email: kh.email || ""
          
            }));
          }
        }}
      >
        <option value="">-- Chọn khách hàng --</option>

        {filteredCustomers.map((c) => (
          <option key={c.id} value={c.id}>
            {c.ten} - {c.sdt}
          </option>
        ))}
      </select>

      <input
        placeholder="Tên khách"
        value={form.tenKhachHang}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, tenKhachHang: e.target.value }))
        }
      />

      <input
        placeholder="SĐT"
        value={form.sdt}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, sdt: e.target.value }))
        }
      />

      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, email: e.target.value }))
        }
      />
    </div>
  );
}