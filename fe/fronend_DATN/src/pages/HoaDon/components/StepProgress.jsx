import React from "react";

export default function StepProgress({ status }) {

  const steps = [
    { key: "CHO_XAC_NHAN", label: "Chờ xác nhận" },
    { key: "DA_XAC_NHAN", label: "Đã xác nhận" },
    { key: "DANG_GIAO", label: "Đang giao" },
    { key: "HOAN_THANH", label: "Hoàn thành" },
  ];

  const currentIndex = steps.findIndex(s => s.key === status);

  const isCanceled = status === "DA_HUY";

  return (
    <div className="w-full mb-6">
      <div className="flex items-center">

        {steps.map((step, index) => {
          const isActive = index <= currentIndex;

          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold
                  ${
                    isCanceled
                      ? "bg-red-500"
                      : isActive
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-xs mt-1">{step.label}</span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-1 ${
                    isCanceled
                      ? "bg-red-500"
                      : index < currentIndex
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}

        {/* 🔥 STEP HỦY */}
        <div className="flex flex-col items-center ml-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold
            ${isCanceled ? "bg-red-500" : "bg-gray-400"}`}
          >
            ✕
          </div>
          <span className="text-xs mt-1">Đã hủy</span>
        </div>

      </div>
    </div>
  );
}