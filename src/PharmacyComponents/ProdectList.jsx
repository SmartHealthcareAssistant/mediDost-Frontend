export default function ProductList({ products }) {
  if (!products.length) return <p className="text-gray-500">No medicines yet.</p>;

  return (
    <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
      {products.map((p, i) => (
        <div key={i} className="p-3 border rounded shadow-sm bg-white flex flex-col items-center">
          {p.image && (
            <img src={p.image} alt={p.name} className="h-32 w-32 object-contain mb-2 border rounded" />
          )}
          <h3 className="font-semibold">{p.name}</h3>
          <p>{p.price} ₹ × {p.quantity}</p>
          <p className="text-sm text-gray-600">Purchased: {p.purchased || 0}</p>
        </div>
      ))}
    </div>
  );
}
