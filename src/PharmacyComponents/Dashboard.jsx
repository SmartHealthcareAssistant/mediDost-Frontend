import { useState, useEffect } from 'react';
import ProductForm from './ProdectForm';
import ProductList from './ProdectList';
import OrderList from './OrderList';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    const savedOrders = localStorage.getItem('orders');
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  const addProduct = (product) => {
    const updated = [...products, { ...product, purchased: 0 }];
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
  };

  const addOrder = (order) => {
    const updatedOrders = [...orders, order];
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const handleOrderDecision = (index, accept) => {
    const updatedOrders = [...orders];
    updatedOrders[index].status = accept ? 'Accepted' : 'Rejected';
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    // Update purchased quantity if accepted
    if (accept) {
      const updatedProducts = products.map((p) =>
        p.name === updatedOrders[index].product
          ? { ...p, purchased: (p.purchased || 0) + updatedOrders[index].quantity }
          : p
      );
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Medical Shop Dashboard</h1>
      <ProductForm addProduct={addProduct} />
      <ProductList products={products} />
      <OrderList orders={orders} handleOrderDecision={handleOrderDecision} />
    </div>
  );
}
