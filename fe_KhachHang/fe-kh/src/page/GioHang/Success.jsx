import { useLocation, useNavigate } from "react-router-dom";

export default function Success() {
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);

  const orderId = query.get("orderId");
  const responseCode = query.get("vnp_ResponseCode");

  const isVnpay = responseCode !== null;
  const isSuccess = !isVnpay || responseCode === "00";

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          background: "#fff",
          borderRadius: 12,
          padding: 32,
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ fontSize: 54, marginBottom: 12 }}>
          {isSuccess ? "🎉" : "❌"}
        </div>

        <h2
          style={{
            marginBottom: 12,
            color: isSuccess ? "#16a34a" : "#dc2626",
          }}
        >
          {isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại"}
        </h2>

        {orderId ? (
          <p style={{ marginBottom: 8 }}>
            Mã đơn hàng: <b>{orderId}</b>
          </p>
        ) : (
          <p style={{ marginBottom: 8 }}>
            {isSuccess
              ? "Đơn hàng đã được tạo thành công"
              : "Không thể hoàn tất thanh toán"}
          </p>
        )}

        <p style={{ color: "#666", marginBottom: 24 }}>
          {isSuccess
            ? "Cảm ơn bạn đã mua hàng tại shop áo phông RiVoPoly."
            : "Bạn có thể thử lại hoặc chọn phương thức thanh toán khác."}
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {isSuccess && (
            <button
              onClick={() => navigate("/orders")}
              style={{
                padding: "10px 18px",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Xem đơn hàng
            </button>
          )}

          <button
            onClick={() => navigate("/")}
            style={{
              padding: "10px 18px",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}