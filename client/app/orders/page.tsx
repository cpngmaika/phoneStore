import Link from 'next/link';

async function getOrders() {
  try {
    const res = await fetch(`${process.env.BASE_BACKEND_URL}/api/orders`, {
      cache: 'no-store'
    });
    console.log(res)
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Không thể kết nối tới backend:", error);
    return [];
  }
}

export default async function OrdersPage() {
  const orders = await getOrders();
  console.log(orders)

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Danh sách đơn hàng của bạn</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">Chưa có đơn hàng nào hoặc không kết nối được với server.</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {order.status === 'PENDING' && (
                      <Link 
                        href={`/checkout/qr?orderId=${order.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                      >
                        Chuyển khoản QR
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}