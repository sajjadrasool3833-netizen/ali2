import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders').then(({ data }) => setOrders(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="admin-header"><h1>Orders</h1></div>
      <div className="card" style={{ padding: '24px', overflowX: 'auto' }}>
        {loading ? <p>Loading...</p> : orders.length === 0 ? <p style={{ color: 'var(--gray-400)' }}>No orders yet.</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.2)', textAlign: 'left' }}>
                <th style={{ padding: '12px' }}>Order #</th>
                <th style={{ padding: '12px' }}>Customer</th>
                <th style={{ padding: '12px' }}>Service</th>
                <th style={{ padding: '12px' }}>Budget</th>
                <th style={{ padding: '12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px', color: 'var(--gold)' }}>{o.orderNumber}</td>
                  <td style={{ padding: '12px' }}>{o.customerName}</td>
                  <td style={{ padding: '12px' }}>{o.service}</td>
                  <td style={{ padding: '12px' }}>{o.budget}</td>
                  <td style={{ padding: '12px' }}>{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}