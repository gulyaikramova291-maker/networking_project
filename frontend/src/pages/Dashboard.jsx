import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area,
} from 'recharts';
import { TrendingUp, TrendingDown, ShoppingCart, Users, Package, DollarSign, Clock, CheckCircle2, Truck, AlertTriangle } from 'lucide-react';
import { dashboardAPI, ordersAPI } from '../api';
import toast from 'react-hot-toast';

const StatCard = ({ title, value, sub, icon: Icon, iconBg, change, changeType }) => (
  <div className="stat-card">
    <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
      <Icon className="w-6 h-6" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-gray-500 font-medium mb-0.5">{title}</p>
      <p className="font-display text-2xl font-bold text-navy-900 truncate">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
    {change !== undefined && (
      <div className={`flex items-center gap-0.5 text-xs font-semibold ${changeType === 'up' ? 'text-green-600' : 'text-red-500'}`}>
        {changeType === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
        {change}%
      </div>
    )}
  </div>
);

const statusConfig = {
  Pending:    { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  Confirmed:  { color: 'bg-blue-100 text-blue-700',    icon: CheckCircle2 },
  Processing: { color: 'bg-purple-100 text-purple-700', icon: Package },
  Shipped:    { color: 'bg-teal-100 text-teal-700',    icon: Truck },
  Delivered:  { color: 'bg-green-100 text-green-700',  icon: CheckCircle2 },
  Cancelled:  { color: 'bg-red-100 text-red-700',      icon: AlertTriangle },
};

const fmtMoney = (v) => {
  if (!v) return '0';
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'M';
  if (v >= 1_000) return (v / 1_000).toFixed(0) + 'K';
  return v.toLocaleString();
};

// Demo data fallback
const DEMO_SUMMARY = {
  orders:    { total: 847, thisMonth: 143, growth: 23.5 },
  revenue:   { total: 4_250_000_000, thisMonth: 712_000_000, growth: 18.2 },
  customers: { total: 312, newThisMonth: 24 },
  products:  { total: 2_400, lowStock: 38 },
};
const DEMO_CHART = [
  { month: 'Jan 2024', revenue: 380000000, orders: 98 },
  { month: 'Feb 2024', revenue: 420000000, orders: 112 },
  { month: 'Mar 2024', revenue: 510000000, orders: 135 },
  { month: 'Apr 2024', revenue: 480000000, orders: 128 },
  { month: 'May 2024', revenue: 630000000, orders: 156 },
  { month: 'Jun 2024', revenue: 712000000, orders: 143 },
];
const DEMO_ORDERS = [
  { orderNumber: 'TH-002000', status: 'Delivered',  total: 4_320_000, customer: { companyName: 'Toshkent Kiyim Bozori' } },
  { orderNumber: 'TH-002001', status: 'Processing', total: 2_880_000, customer: { companyName: 'Samarqand Fashion Store' } },
  { orderNumber: 'TH-002002', status: 'Pending',    total: 1_680_000, customer: { companyName: 'Namangan Textile Center' } },
  { orderNumber: 'TH-002003', status: 'Shipped',    total: 5_760_000, customer: { companyName: 'Andijon Moda' } },
  { orderNumber: 'TH-002004', status: 'Confirmed',  total: 3_360_000, customer: { companyName: 'Buxoro Style' } },
];

export default function Dashboard() {
  const [summary, setSummary] = useState(DEMO_SUMMARY);
  const [chart, setChart] = useState(DEMO_CHART);
  const [recentOrders, setRecentOrders] = useState(DEMO_ORDERS);

  useEffect(() => {
    Promise.allSettled([
      dashboardAPI.summary(),
      dashboardAPI.revenueChart(),
      ordersAPI.getAll({ limit: 5 }),
    ]).then(([sumRes, chartRes, ordersRes]) => {
      if (sumRes.status === 'fulfilled') setSummary(sumRes.value.data);
      if (chartRes.status === 'fulfilled') setChart(chartRes.value.data);
      if (ordersRes.status === 'fulfilled') setRecentOrders(ordersRes.value.data.orders || DEMO_ORDERS);
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-display font-bold text-navy-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">TekstilHub ERP · CRM · WMS</p>
        </div>
        <div className="text-sm text-gray-500 bg-white border border-gray-100 rounded-xl px-4 py-2 shadow-card">
          {new Date().toLocaleDateString('uz-UZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Jami Daromad"
          value={`₿ ${fmtMoney(summary.revenue.total)}`}
          sub={`Bu oy: ${fmtMoney(summary.revenue.thisMonth)} so'm`}
          icon={DollarSign}
          iconBg="bg-green-100 text-green-600"
          change={summary.revenue.growth}
          changeType="up"
        />
        <StatCard
          title="Buyurtmalar"
          value={summary.orders.total.toLocaleString()}
          sub={`Bu oy: ${summary.orders.thisMonth} ta`}
          icon={ShoppingCart}
          iconBg="bg-blue-100 text-blue-600"
          change={summary.orders.growth}
          changeType="up"
        />
        <StatCard
          title="Faol Mijozlar"
          value={summary.customers.total.toLocaleString()}
          sub={`Yangi: +${summary.customers.newThisMonth} bu oy`}
          icon={Users}
          iconBg="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="Mahsulotlar"
          value={summary.products.total.toLocaleString()}
          sub={`${summary.products.lowStock} ta kam zaxira`}
          icon={Package}
          iconBg="bg-gold-50 text-gold-600"
        />
      </div>

      {/* Charts row */}
      <div className="grid xl:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="card xl:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-navy-900">Daromad Dinamikasi</h3>
              <p className="text-sm text-gray-400 mt-0.5">So'nggi 6 oy</p>
            </div>
            <span className="badge bg-green-100 text-green-700">+{summary.revenue.growth}%</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chart} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#163972" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#163972" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis tickFormatter={(v) => fmtMoney(v)} tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <Tooltip formatter={(v) => [`${fmtMoney(v)} so'm`, 'Daromad']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '12px' }} />
              <Area type="monotone" dataKey="revenue" stroke="#163972" strokeWidth={2.5} fill="url(#revenueGrad)" dot={false} activeDot={{ r: 4, fill: '#163972' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by status (mini donut-style bar) */}
        <div className="card">
          <h3 className="font-display font-bold text-navy-900 mb-6">Buyurtma Holati</h3>
          <div className="space-y-3">
            {[
              { label: 'Bajarildi', value: 342, total: 847, color: 'bg-green-500' },
              { label: 'Yetkazilmoqda', value: 189, total: 847, color: 'bg-teal-500' },
              { label: 'Qayta ishlash', value: 156, total: 847, color: 'bg-purple-500' },
              { label: 'Kutilmoqda', value: 98, total: 847, color: 'bg-yellow-500' },
              { label: 'Bekor qilindi', value: 62, total: 847, color: 'bg-red-400' },
            ].map(({ label, value, total, color }) => (
              <div key={label}>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-navy-700">{label}</span>
                  <span className="text-gray-500">{value}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${color} rounded-full`} style={{ width: `${(value / total * 100).toFixed(0)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-bold text-navy-900">So'nggi Buyurtmalar</h3>
          <a href="/orders" className="text-sm text-navy-600 font-medium hover:underline">Hammasini ko'rish →</a>
        </div>
        <div className="overflow-x-auto -mx-6">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="table-th">Buyurtma #</th>
                <th className="table-th">Mijoz</th>
                <th className="table-th">Holat</th>
                <th className="table-th text-right">Summa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map((order) => {
                const cfg = statusConfig[order.status] || { color: 'bg-gray-100 text-gray-600', icon: Package };
                const StatusIcon = cfg.icon;
                return (
                  <tr key={order.orderNumber || order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="table-td font-mono font-semibold text-navy-700">{order.orderNumber}</td>
                    <td className="table-td text-gray-600">{order.customer?.companyName || '—'}</td>
                    <td className="table-td">
                      <span className={`badge ${cfg.color} gap-1`}>
                        <StatusIcon className="w-3 h-3" /> {order.status}
                      </span>
                    </td>
                    <td className="table-td text-right font-semibold text-navy-800">
                      {Number(order.total).toLocaleString()} so'm
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
