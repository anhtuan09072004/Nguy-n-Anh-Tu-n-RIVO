import { useState } from "react";

export default function VariantModal({
  show,
  variants,
  selected,
  setSelected,
  qty,
  setQty,
  addToCart,
  formatMoney,
}) {
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleAdd = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await addToCart();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-4 rounded-2xl w-[500px]">
        <h3 className="font-bold mb-3">Chọn biến thể</h3>

        <div className="grid grid-cols-2 gap-3 max-h-60 overflow-auto">
          {variants.map((v) => {
            const isSelected = selected?.id === v.id;
            const isOut = v.soLuong === 0;

            return (
              <div
                key={v.id}
                onClick={() => !isOut && setSelected(v)}
                className={`border p-2 rounded-xl cursor-pointer flex gap-2 items-center relative transition-all
                  ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 shadow-md scale-[1.02]"
                      : "hover:border-gray-400"
                  }
                  ${isOut ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                {isSelected && (
                  <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    ✓
                  </div>
                )}

                <img
                  src={v.image || "/placeholder.png"}
                  className={`w-16 h-16 object-cover rounded ${
                    isSelected ? "ring-2 ring-blue-400" : ""
                  }`}
                />

                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {v.tenSize} - {v.tenMauSac}
                  </div>

                  <div className="text-blue-500 text-sm">
                    {formatMoney(v.gia)}
                  </div>

                  <div
                    className={`text-xs ${
                      isOut ? "text-red-500 font-medium" : "text-gray-500"
                    }`}
                  >
                    {isOut ? "Hết hàng" : `Còn: ${v.soLuong}`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <input
          type="number"
          value={qty}
          min={1}
          max={selected?.soLuong || 1}
          onChange={(e) => setQty(Number(e.target.value))}
          className="border p-2 w-full mt-3 rounded-lg"
        />

        <button
          onClick={handleAdd}
          disabled={loading || !selected || selected.soLuong === 0}
          className={`w-full p-2 mt-2 rounded-lg text-white ${
            loading || !selected || selected.soLuong === 0
              ? "bg-gray-400"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Đang thêm..." : "Thêm vào giỏ"}
        </button>
      </div>
    </div>
  );
}