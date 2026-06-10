import React, { useState, useEffect } from 'react';
import { Search, Plus, ShoppingCart, Clock, CheckCircle2, Truck, Package, AlertTriangle, X, Save } from 'lucide-react';
import { ordersAPI } from '../api';
import toast from 'react-hot-toast';

const statusConfig = {
  Pending:    { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  Confirmed:  { color: 'bg-blue-100 text-blue-700',    icon: CheckCircle2 },
  Processing: { color: 'bg-purple-100 text-purple-700', icon: Package },
  Shipped:    { color: 'bg-teal-100 text-teal-700',    icon: Truck },
  Delivered:  { color: 'bg-green-100 text-green-700',  icon: CheckCircle2 },
  Cancelled:  { color: 'bg-red-100 text-red-700',      icon: AlertTriangle },
  Returned:   { color: 'bg-orange-100 text-orange-700', icon: AlertTriangle },
};

const paymentConfig = {
  Unpaid:   'bg-red-50 text-red-600',
  Partial:  'bg-yellow-50 text-yellow-600',
  Paid:     'bg-green-50 text-green-700',
  Refunded: 'bg-gray-100 text-gray-600',
};

const priorityConfig = {
  Low:    'bg-gray-100 text-gray-500',
  Normal: 'bg-blue-50 text-blue-600',
  High:   'bg-orange-50 text-orange-600',
  Urgent: 'bg-red-50 text-red-600',
};

const DEMO_ORDERS = [
  { id:'1', orderNumber:'TH-002000', status:'Delivered',  paymentStatus:'Paid',    priority:'Normal', total:4320000, createdAt:'2024-06-01', customer:{ companyName:'Toshkent Kiyim Bozori' },   items:[{productName:'Oxford Shirt',  quantity:48},{productName:'Chino Pants',   quantity:24}] },
  { id:'2', orderNumber:'TH-002001', status:'Processing', paymentStatus:'Partial', priority:'High',   total:2880000, createdAt:'2024-06-03', customer:{ companyName:'Samarqand Fashion Store' }, items:[{productName:'Wrap Dress',     quantity:24}] },
  { id:'3', orderNumber:'TH-002002', status:'Pending',    paymentStatus:'Unpaid',  priority:'Normal', total:1680000, createdAt:'2024-06-05', customer:{ companyName:'Namangan Textile Center' }, items:[{productName:'Kids Jacket',    quantity:36}] },
  { id:'4', orderNumber:'TH-002003', status:'Shipped',    paymentStatus:'Paid',    priority:'Urgent', total:5760000, createdAt:'2024-06-06', customer:{ companyName:'Andijon Moda' },             items:[{productName:'Sport T-Shirt', quantity:120}] },
  { id:'5', orderNumber:'TH-002004', status:'Confirmed',  paymentStatus:'Unpaid',  priority:'Normal', total:3360000, createdAt:'2024-06-07', customer:{ companyName:'Buxoro Style' },             items:[{productName:'Office Blazer', quantity:18}] },
  { id:'6', orderNumber:'TH-001999', status:'Delivered',  paymentStatus:'Paid',    priority:'Low',    total:840000,  createdAt:'2024-05-28', customer:{ companyName:'Fargona Online Shop' },      items:[{productName:'Leather Belt',  quantity:48}] },
  { id:'7', orderNumber:'TH-001998', status:'Cancelled',  paymentStatus:'Refunded',priority:'Normal', total:2100000, createdAt:'2024-05-26', customer:{ companyName:'Toshkent Kiyim Bozori' },   items:[{productName:'Down Jacket',   quantity:12}] },
  { id:'8', orderNumber:'TH-002005', status:'Processing', paymentStatus:'Paid',    priority:'High',   total:8160000, createdAt:'2024-06-08', customer:{ companyName:'Namangan Textile Center' }, items:[{productName:'Formal Suit',   quantity:9}] },
];

const statuses        = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const paymentStatuses = ['Unpaid', 'Partial', 'Paid'];
const priorities      = ['Low', 'Normal', 'High', 'Urgent'];

const emptyOrderForm = {
  customerName: '',
  productName:  '',
  qty:          '',
  priority:     'Normal',
  paymentStatus:'Unpaid',
  total:        '',
};

let orderCounter = 2006;

export default function Orders() {
  const [orders, setOrders]             = useState(DEMO_ORDERS);
  const [search, setSearch]             = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPayment, setFilterPayment] = useState('');
  const [showModal, setShowModal]       = useState(false);
  const [orderForm, setOrderForm]       = useState(emptyOrderForm);

  useEffect(() => {
    ordersAPI
      .getAll({ search, status: filterStatus, paymentStatus: filterPayment, limit: 50 })
      .then((res) => setOrders(res.data.orders))
      .catch(() => {});
  }, [search, filterStatus, filterPayment]);

  const updateStatus = async (id, status) => {
    // optimistic update first
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    toast.success(`Status yangilandi: ${status}`);
    try {
      await ordersAPI.updateStatus(id, status);
    } catch {
      // already updated locally — silent fail for demo
    }
  };

  const handleAddOrder = (e) => {
    e.preventDefault();
    if (!orderForm.customerName.trim() || !orderForm.productName.trim()) {
      toast.error("Mijoz va mahsulot nomini kiriting");
      return;
    }
    orderCounter += 1;
    const newOrder = {
      id: String(Date.now()),
      orderNumber: `TH-${String(orderCounter).padStart(6, '0')}`,
      status: 'Pending',
      paymentStatus: orderForm.paymentStatus,
      priority: orderForm.priority,
      total: parseInt(orderForm.total, 10) || 0,
      createdAt: new Date().toISOString(),
      customer: { companyName: orderForm.customerName },
      items: [{ productName: orderForm.productName, quantity: parseInt(orderForm.qty, 10) || 1 }],
    };
    setOrders((prev) => [newOrder, ...prev]);
    toast.success(`Yangi buyurtma ${newOrder.orderNumber} qo'shildi!`);
    setShowModal(false);
    setOrderForm(emptyOrderForm);
  };

  const filtered = orders.filter((o) => {
    const s = search.toLowerCase();
    const matchSearch  = !s || o.orderNumber.toLowerCase().includes(s) || o.customer?.companyName?.toLowerCase().includes(s);
    const matchStatus  = !filterStatus  || o.status        === filterStatus;
    const matchPayment = !filterPayment || o.paymentStatus === filterPayment;
    return matchSearch && matchStatus && matchPayment;
  });

  const stats = [
    { label: 'Jami',       value: orders.length,                                                           color: 'text-navy-900' },
    { label: 'Kutilmoqda', value: orders.filter((o) => o.status === 'Pending').length,                     color: 'text-yellow-600' },
    { label: 'Jarayonda',  value: orders.filter((o) => ['Confirmed','Processing'].includes(o.status)).length, color: 'text-purple-600' },
    { label: 'Yetkazildi', value: orders.filter((o) => o.status === 'Delivered').length,                   color: 'text-green-600' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-display font-bold text-navy-900">Buyurtmalar (ERP)</h1>
          <p className="text-gray-500 text-sm mt-0.5">Barcha savdo buyurtmalarini boshqaring</p>
        </div>
        <button className="btn-primary" onClick={() => { setOrderForm(emptyOrderForm); setShowModal(true); }}>
          <Plus className="w-4 h-4" /> Yangi buyurtma
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="card text-center py-4">
            <p className={`font-display text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="input pl-9"
              placeholder="Buyurtma # yoki mijoz nomi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="select w-full sm:w-44" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Barcha holat</option>
            {statuses.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select className="select w-full sm:w-40" value={filterPayment} onChange={(e) => setFilterPayment(e.target.value)}>
            <option value="">To'lov holati</option>
            {paymentStatuses.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="table-th">Buyurtma</th>
                <th className="table-th">Mijoz</th>
                <th className="table-th">Mahsulotlar</th>
                <th className="table-th">Ustuvorlik</th>
                <th className="table-th">Holat</th>
                <th className="table-th">To'lov</th>
                <th className="table-th text-right">Summa</th>
                <th className="table-th text-center">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((order) => {
                const scfg  = statusConfig[order.status] || { color: 'bg-gray-100 text-gray-600', icon: Package };
                const SIcon = scfg.icon;
                return (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="table-td">
                      <p className="font-mono font-semibold text-navy-700">{order.orderNumber}</p>
                      <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('uz-UZ')}</p>
                    </td>
                    <td className="table-td font-medium text-navy-800">{order.customer?.companyName}</td>
                    <td className="table-td text-gray-500 text-xs max-w-xs">
                      {(order.items || []).slice(0, 2).map((i) => `${i.productName} ×${i.quantity}`).join(', ')}
                    </td>
                    <td className="table-td">
                      <span className={`badge ${priorityConfig[order.priority] || ''}`}>{order.priority}</span>
                    </td>
                    <td className="table-td">
                      <span className={`badge ${scfg.color} gap-1`}>
                        <SIcon className="w-3 h-3" /> {order.status}
                      </span>
                    </td>
                    <td className="table-td">
                      <span className={`badge ${paymentConfig[order.paymentStatus] || ''}`}>{order.paymentStatus}</span>
                    </td>
                    <td className="table-td text-right font-semibold text-navy-800">
                      {Number(order.total).toLocaleString()} so'm
                    </td>
                    <td className="table-td text-center">
                      <select
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-navy-300"
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                      >
                        {statuses.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Buyurtma topilmadi</p>
            </div>
          )}
        </div>
      </div>

      {/* ── New Order Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-display font-bold text-navy-900">Yangi buyurtma qo'shish</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddOrder} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">Mijoz kompaniyasi *</label>
                <input
                  className="input"
                  required
                  placeholder="Toshkent Kiyim Bozori"
                  value={orderForm.customerName}
                  onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Mahsulot nomi *</label>
                  <input
                    className="input"
                    required
                    placeholder="Oxford Shirt"
                    value={orderForm.productName}
                    onChange={(e) => setOrderForm({ ...orderForm, productName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Miqdor (dona) *</label>
                  <input
                    className="input"
                    type="number"
                    min="1"
                    required
                    placeholder="24"
                    value={orderForm.qty}
                    onChange={(e) => setOrderForm({ ...orderForm, qty: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Ustuvorlik</label>
                  <select
                    className="select"
                    value={orderForm.priority}
                    onChange={(e) => setOrderForm({ ...orderForm, priority: e.target.value })}
                  >
                    {priorities.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">To'lov holati</label>
                  <select
                    className="select"
                    value={orderForm.paymentStatus}
                    onChange={(e) => setOrderForm({ ...orderForm, paymentStatus: e.target.value })}
                  >
                    {paymentStatuses.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">Umumiy summa (so'm)</label>
                <input
                  className="input"
                  type="number"
                  min="0"
                  placeholder="1680000"
                  value={orderForm.total}
                  onChange={(e) => setOrderForm({ ...orderForm, total: e.target.value })}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">
                  Bekor qilish
                </button>
                <button type="submit" className="btn-primary flex-1 justify-center">
                  <Save className="w-4 h-4" /> Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
