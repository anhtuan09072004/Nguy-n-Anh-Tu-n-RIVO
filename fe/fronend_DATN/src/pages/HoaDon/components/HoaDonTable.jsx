import HoaDonRow from "./HoaDonRow";

export default function HoaDonTable({ data, onUpdate, onView, selectedId }) {
  return (
    <table className="w-full border rounded-lg overflow-hidden">
      <thead>
        <tr className="bg-gray-100 text-center">
          <th className="p-2">ID</th>
          <th className="p-2">Khách</th>
          <th className="p-2">SĐT</th>
          <th className="p-2">Hình thức</th>
          <th className="p-2">Tổng tiền</th>
          <th className="p-2">Trạng thái</th>
          <th className="p-2">Đổi trạng thái</th>
          <th className="p-2">Hành động</th>
        </tr>
      </thead>

      <tbody>
        {data.map((hd) => (
          <HoaDonRow
            key={hd.id}
            hd={hd}
            onUpdate={onUpdate}
            onView={onView}
            selected={selectedId === hd.id}
          />
          
        ))}
      </tbody>
    </table>
    
  );
  
  
}