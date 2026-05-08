import { useState } from "react";
import sanPhamApi from "../../api/sanPhamApi";

export default function SanPhamForm({ lists }) {
  const [form, setForm] = useState({
    ten: "",
    moTa: "",
    kieuDangId: "",
    chatLieuId: "",
    nhaCungCapId: "",
  });

  const handleSubmit = async () => {
    await sanPhamApi.create(form);
    alert("Thêm thành công");
  };

  return (
    <div className="space-y-3">
      <input placeholder="Tên" className="input" 
        onChange={(e) => setForm({...form, ten: e.target.value})} />

      <textarea placeholder="Mô tả"
        onChange={(e) => setForm({...form, moTa: e.target.value})}
      />

      <select onChange={(e)=>setForm({...form,kieuDangId:e.target.value})}>
        <option>Kiểu dáng</option>
        {lists.kieuDang.map(i => (
          <option key={i.id} value={i.id}>{i.ten}</option>
        ))}
      </select>

      <select onChange={(e)=>setForm({...form,chatLieuId:e.target.value})}>
        <option>Chất liệu</option>
        {lists.chatLieu.map(i => (
          <option key={i.id}>{i.ten}</option>
        ))}
      </select>

      <button onClick={handleSubmit}
        className="bg-green-500 text-white px-4 py-2">
        Lưu
      </button>
    </div>
  );
}