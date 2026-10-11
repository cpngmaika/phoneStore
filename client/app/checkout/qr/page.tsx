async function getQrData(orderId) {
  try {
    const res = await fetch(`${process.env.BASE_BACKEND_URL}/api/payment/check?orderId=${orderId}`, {
      cache: 'no-store'
    });
    console.log(res)
    const text = await res.text();

console.log("RAW RESPONSE:", text);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Lỗi lấy thông tin QR:", error);
    return null;
  }
}

export default async function QrPaymentPage({ searchParams }) {
  const { orderId } = await (searchParams);

  if (!orderId) {
    return <div className="p-8 text-center text-red-500">Thiếu mã đơn hàng trên đường dẫn!</div>;
  }

  const qrData = await getQrData(orderId);

  if (!qrData) {
    return <div className="p-8 text-center text-red-500">Không tìm thấy thông tin thanh toán cho đơn hàng này.</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100 text-center">
      <h1 className="text-xl font-bold text-gray-800 mb-1">Quét mã QR để thanh toán</h1>
      <p className="text-sm text-gray-500 mb-6">Hệ thống SePay tự động nhận diện giao dịch</p>

      {/* Hiển thị ảnh QR từ SePay */}
      <div className="flex justify-center mb-6 bg-gray-50 p-4 rounded-lg border">
        <img 
          src={qrData.qrCodeUrl} 
          alt="SePay QR Code" 
          className="rounded-md object-contain w-[260px] h-[260px]"
        />
      </div>

      {/* Bảng chi tiết chuyển khoản */}
      <div className="space-y-3 text-left bg-gray-50 p-4 rounded-lg mb-6 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Ngân hàng:</span>
          <span className="font-semibold text-gray-800">{qrData.bankCode}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Số tài khoản:</span>
          <span className="font-semibold text-gray-800">{qrData.accountNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Chủ tài khoản:</span>
          <span className="font-semibold text-gray-800">{qrData.accountName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Số tiền:</span>
          <span className="font-bold text-blue-600">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(qrData.totalAmount)}
          </span>
        </div>
        <div className="flex justify-between border-t pt-2">
          <span className="text-gray-500">Nội dung CK:</span>
          <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">{qrData.orderCode}</span>
        </div>
      </div>

      <div className="text-xs text-gray-400">
        Trạng thái đơn hàng sẽ tự động chuyển thành công khi tiền vào tài khoản.
      </div>
    </div>
  );
}