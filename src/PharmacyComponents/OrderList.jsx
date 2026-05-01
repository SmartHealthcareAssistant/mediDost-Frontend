export default function OrderList({ orders, handleOrderDecision }) {
  if (!orders.length) return <p className="text-gray-500 mt-6">No orders yet.</p>;

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-4">Orders</h2>
      <ul className="space-y-2">
        {orders.map((o, i) => (
          <li key={i} className="p-3 border rounded bg-white flex justify-between items-center">
            <div>
              <p className="font-semibold">{o.customer}</p>
              <p>
                {o.product} × {o.quantity} pcs
              </p>
              <p className="text-sm text-gray-600">Status: {o.status || 'Pending'}</p>
            </div>
            {o.status === undefined && (
              <div className="space-x-2">
                <button
                  onClick={() => handleOrderDecision(i, true)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleOrderDecision(i, false)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
