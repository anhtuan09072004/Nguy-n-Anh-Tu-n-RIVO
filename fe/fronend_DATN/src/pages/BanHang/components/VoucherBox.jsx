import { useState, useRef, useEffect } from "react";

export default function VoucherBox({
  vouchers = [],
  selectedVoucher,
  setSelectedVoucher,
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!wrapperRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPercent = (v) => v?.giamGia || v?.giaTri || 0;
  const getQuantity = (v) => v?.soLuong || 0;

  const isExpired = (v) => {
    if (!v?.ngayKetThuc) return false;
    return new Date(v.ngayKetThuc) < new Date();
  };

  const formatMoney = (n) =>
    (n || 0).toLocaleString("vi-VN") + " đ";

  return (
    <div className="bg-white p-3 rounded shadow" ref={wrapperRef}>
      <div className="font-semibold mb-2">🎁 Voucher</div>

      <div
        className="border p-2 rounded cursor-pointer bg-white"
        onClick={() => setOpen(!open)}
      >
        {selectedVoucher ? (
          <span className="font-medium text-blue-600">
            {selectedVoucher.ten} - Giảm {getPercent(selectedVoucher)}%
          </span>
        ) : (
          <span className="text-gray-500">-- Chọn voucher --</span>
        )}
      </div>

      {open && (
        <div className="border mt-1 rounded bg-white shadow max-h-64 overflow-auto">
          <div
            className="p-2 hover:bg-gray-100 cursor-pointer border-b"
            onClick={() => {
              setSelectedVoucher(null);
              setOpen(false);
            }}
          >
            -- Không dùng voucher --
          </div>

          {vouchers.map((v) => {
            const percent = getPercent(v);
            const quantity = getQuantity(v);
            const expired = isExpired(v);
            const disabled = quantity <= 0 || expired;

            return (
              <div
                key={v.id}
                onClick={() => {
                  if (disabled) return;
                  setSelectedVoucher(v);
                  setOpen(false);
                }}
                className={`p-3 flex justify-between items-center border-b
                  ${
                    disabled
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-blue-50 cursor-pointer"
                  }`}
              >
                <div>
                  <div className="font-semibold text-gray-800">
                    {v.ten}
                  </div>

                  <div className="text-sm text-red-500">
                    🔥 Giảm {percent}% (tối đa{" "}
                    {formatMoney(v.maxGiam)})
                  </div>

                  {expired && (
                    <div className="text-xs text-gray-400">
                      ⛔ Hết hạn
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-600 text-right">
                  <div>SL: {quantity}</div>
                </div>
              </div>
            );
          })}

          {vouchers.length === 0 && (
            <div className="p-2 text-gray-400 text-center text-sm">
              Không có voucher
            </div>
          )}
        </div>
      )}

      {selectedVoucher && (
        <div className="mt-3 p-3 bg-gray-50 rounded border text-sm">
          <div className="font-semibold mb-1">
            📌 {selectedVoucher.ten}
          </div>
          <div>💸 Giảm: {getPercent(selectedVoucher)}%</div>
          <div>
            💰 Tối đa: {formatMoney(selectedVoucher.maxGiam)}
          </div>
          <div>📦 Còn: {getQuantity(selectedVoucher)}</div>
        </div>
      )}
    </div>
  );
}