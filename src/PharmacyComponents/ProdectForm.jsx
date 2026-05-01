import { useState } from 'react';

export default function ProductForm({ addProduct }) {
  const [product, setProduct] = useState({ name: '', price: '', quantity: '', image: '' });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image' && files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProduct({ ...product, image: ev.target.result });
      };
      reader.readAsDataURL(files[0]);
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (product.name && product.price && product.quantity) {
      addProduct(product);
      setProduct({ name: '', price: '', quantity: '', image: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 rounded shadow">
      <input
        name="name"
        value={product.name}
        onChange={handleChange}
        placeholder="Medicine Name"
        className="border rounded p-2 w-full"
      />
      <input
        name="price"
        value={product.price}
        onChange={handleChange}
        placeholder="Price"
        className="border rounded p-2 w-full"
      />
      <input
        name="quantity"
        value={product.quantity}
        onChange={handleChange}
        placeholder="Quantity"
        className="border rounded p-2 w-full"
      />
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleChange}
        className="border rounded p-2 w-full"
      />

      {product.image && (
        <img src={product.image} alt="Preview" className="h-32 w-32 object-contain border rounded mt-2" />
      )}

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Add Medicine
      </button>
    </form>
  );
}
