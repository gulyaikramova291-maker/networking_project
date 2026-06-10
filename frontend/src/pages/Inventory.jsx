import React, { useState } from 'react';
import { Warehouse, AlertTriangle, TrendingDown, CheckCircle2, BarChart3, RefreshCw, Plus, Search, Edit2, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_INVENTORY = [
  { id:'1',  sku:'TH-M-001', productName:'Classic Oxford Shirt',   category:"Men's Clothing",      location:'A-01-01', quantity:480, reserved:48,  reorderPoint:100, lastRestocked:'2024-05-20' },
  { id:'2',  sku:'TH-W-001', productName:'Floral Wrap Dress',       category:"Women's Clothing",    location:'B-02-03', quantity:240, reserved:24,  reorderPoint:60,  lastRestocked:'2024-05-18' },
  { id:'3',  sku:'TH-K-001', productName:'Kids Denim Jacket',       category:"Children's Clothing", location:'C-01-02', quantity:300, reserved:36,  reorderPoint:80,  lastRestocked:'2024-06-01' },
  { id:'4',  sku:'TH-S-001', productName:'Sport Running T-Shirt',   category:'Sportswear',          location:'D-03-01', quantity:600, reserved:120, reorderPoint:120, lastRestocked:'2024-06-02' },
  { id:'5',  sku:'TH-O-001', productName:'Winter Down Jacket',      category:'Outerwear',           location:'E-01-01', quantity:120, reserved:18,  reorderPoint:50,  lastRestocked:'2024-04-15' },
  { id:'6',  sku:'TH-M-003', productName:'Formal Suit',             category:"Men's Clothing",      location:'A-02-04', quantity:60,  reserved:9,   reorderPoint:30,  lastRestocked:'2024-05-10' },
  { id:'7',  sku:'TH-K-002', productName:'School Uniform Set',      category:"Children's Clothing", location:'C-02-01', quantity:25,  reserved:12,  reorderPoint:60,  lastRestocked:'2024-03-20' },
  { id:'8',  sku:'TH-A-001', productName:'Leather Belt',            category:'Accessories',         location:'F-01-02', quantity:480, reserved:0,   reorderPoint:100, lastRestocked:'2024-06-05' },
  { id:'9',  sku:'TH-W-002', productName:'Office Blazer',           category:"Women's Clothing",    location:'B-01-02', quantity:180, reserved:18,  reorderPoint:40,  lastRestocked:'2024-05-25' },
  { id:'10', sku:'TH-U-001', productName:'Cotton Boxer Set',        category:'Underwear',           location:'G-01-01', quantity:720, reserved:72,  reorderPoint:150, lastRestocked:'2024-06-08' },
];

const INITIAL_MOVEMENTS = [
  { id:1, sku:'TH-K-002', product:'School Uniform Set', type:'OUT',        qty:12,  ref:'TH-002002', time:'Bugun 14:30',  by:'Nilufar' },
  { id:2, sku:'TH-S-001', product:'Sport T-Shirt',       type:'OUT',        qty:120, ref:'TH-002003', time:'Bugun 11:00',  by:'Sardor' },
  { id:3, sku:'TH-M-001', product:'Oxford Shirt',         type:'IN',         qty:240, ref:'PO-00234',  time:'Kecha 16:00',  by:'Admin' },
  { id:4, sku:'TH-O-001', product:'Down Jacket',           type:'ADJUSTMENT', qty:-6,  ref:'ADJ-001',   time:'Kecha 10:00',  by:'Sardor' },
  { id:5, sku:'TH-W-001', product:'Wrap Dress',            type:'OUT',        qty:24,  ref:'TH-002001', time:'3 kun oldin',  by:'Nilufar' },
];

const movTypeConfig = {
  IN:         'bg-green-100 text-green-700',
  OUT:        'bg-blue-100 text-blue-700',
  ADJUSTMENT: 'bg-orange-100 text-orange-700',
  TRANSFER:   'bg-purple-100 text-purple-700',
  RETURN:     'bg-gray-100 text-gray-700',
};

const movTypes = [
  { value: 'IN',         label: 'Kirim (IN)' },
  { value: 'OUT',        label: 'Chiqim (OUT)' },
  { value: 'RETURN',     label: 'Qaytarish (RETURN)' },
  { value: 'ADJUSTMENT', label: 'Tuzatish (ADJUSTMENT)' },
  { value: 'TRANSFER',   label: "Ko'chirish (TRANSFER)" },
];

const getStockStatus = (qty, reorderPoint) => {
  if (qty === 0) return { label: 'Tugagan',    color: 'bg-red-100 text-red-700',       icon: AlertTriangle };
  if (qty <= reorderPoint) return { label: 'Kam zaxira', color: 'bg-orange-100 text-orange-700', icon: TrendingDown };
  return { label: 'Yetarli', color: 'bg-green-100 text-green-700',   icon: CheckCircle2 };
};

const today = () => new Date().toISOString().split('T')[0];
const nowTime = () => {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export default function Inventory() {
  const [inventory, setInventory]       = useState(INITIAL_INVENTORY);
  const [movementList, setMovementList] = useState(INITIAL_MOVEMENTS);
  const [search, setSearch]             = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem]         = useState(null);

  const emptyForm = { sku: INITIAL_INVENTORY[0].sku, type: 'IN', qty: '', ref: '', notes: '' };
  const [form, setForm] = useState(emptyForm);

  // ──── computed ────
  const filtered = inventory.filter((item) => {
    const s = search.toLowerCase();
    const matchSearch = !s || item.productName.toLowerCase().includes(s) || item.sku.toLowerCase().includes(s);
    if (filterStatus === 'low') return matchSearch && item.quantity <= item.reorderPoint && item.quantity > 0;
    if (filterStatus === 'out') return matchSearch && item.quantity === 0;
    if (filterStatus === 'ok')  return matchSearch && item.quantity > item.reorderPoint;
    return matchSearch;
  });

  const totalItems = inventory.reduce((s, i) => s + i.quantity, 0);
  const lowStock   = inventory.filter((i) => i.quantity <= i.reorderPoint && i.quantity > 0).length;
  const outOfStock = inventory.filter((i) => i.quantity === 0).length;
  const reserved   = inventory.reduce((s, i) => s + i.reserved, 0);

  // ──── handlers ────
  const handleRefresh = () => {
    setSearch('');
    setFilterStatus('');
    toast.success("Ma'lumotlar yangilandi");
  };

  const handleAddMovement = (e) => {
    e.preventDefault();
    const item = inventory.find((i) => i.sku === form.sku);
    if (!item) return;
    const qty = parseInt(form.qty, 10);
    if (!qty || qty <= 0) { toast.error('Miqdorni to\'g\'ri kiriting'); return; }

    const movQty = form.type === 'OUT' ? qty : form.type === 'ADJUSTMENT' ? -qty : qty;

    setMovementList((prev) => [
      {
        id: Date.now(),
        sku: form.sku,
        product: item.productName,
        type: form.type,
        qty: movQty,
        ref: form.ref || `REF-${String(Date.now()).slice(-6)}`,
        time: `Bugun ${nowTime()}`,
        by: 'Admin',
      },
      ...prev.slice(0, 9),
    ]);

    setInventory((prev) =>
      prev.map((i) => {
        if (i.sku !== form.sku) return i;
        let newQty = i.quantity;
        if (form.type === 'IN' || form.type === 'RETURN') newQty = i.quantity + qty;
        else if (form.type === 'OUT') newQty = Math.max(0, i.quantity - qty);
        else if (form.type === 'ADJUSTMENT') newQty = Math.max(0, i.quantity - qty);
        return { ...i, quantity: newQty, ...(form.type === 'IN' ? { lastRestocked: today() } : {}) };
      })
    );

    toast.success(`${form.type} harakati muvaffaqiyatli qo'shildi!`);
    setShowAddModal(false);
    setForm(emptyForm);
  };

  const openEdit = (item) => {
    setEditItem({ ...item });
    setShowEditModal(true);
  };

  const handleUpdateItem = (e) => {
    e.preventDefault();
    setInventory((prev) => prev.map((i) => (i.id === editItem.id ? editItem : i)));
    toast.success('Mahsulot yangilandi!');
    setShowEditModal(false);
    setEditItem(null);
  };

  // ──── render ────
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-display font-bold text-navy-900">Ombor Boshqaruvi (WMS)</h1>
          <p className="text-gray-500 text-sm mt-0.5">Zaxira va harakatlarni kuzating</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4" /> Yangilash
          </button>
          <button className="btn-primary" onClick={() => { setForm(emptyForm); setShowAddModal(true); }}>
            <Plus className="w-4 h-4" /> Kirim qo'shish
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Jami dona',      value: totalItems.toLocaleString(), icon: Warehouse,    iconBg: 'bg-blue-100 text-blue-600' },
          { label: 'Band (reserved)',value: reserved.toLocaleString(),   icon: BarChart3,    iconBg: 'bg-purple-100 text-purple-600' },
          { label: 'Kam zaxira',     value: lowStock,                    icon: TrendingDown, iconBg: 'bg-orange-100 text-orange-600' },
          { label: 'Tugagan',        value: outOfStock,                  icon: AlertTriangle,iconBg: 'bg-red-100 text-red-600' },
        ].map(({ label, value, icon: Icon, iconBg }) => (
          <div key={label} className="stat-card">
            <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
              <p className="font-display text-xl font-bold text-navy-900 mt-0.5">{value}</p>
            </div>
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
              placeholder="Mahsulot nomi yoki SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {[['', 'Barchasi'], ['low', '⚠ Kam'], ['out', '✕ Tugagan'], ['ok', '✓ Yetarli']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilterStatus(val)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  filterStatus === val ? 'bg-navy-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="table-th">Mahsulot</th>
                <th className="table-th">Joylashuv</th>
                <th className="table-th text-right">Zaxira</th>
                <th className="table-th text-right">Band</th>
                <th className="table-th text-right">Mavjud</th>
                <th className="table-th text-right">Qayta buyurt.</th>
                <th className="table-th">Holat</th>
                <th className="table-th">So'nggi kirim</th>
                <th className="table-th text-center">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((item) => {
                const { label, color, icon: SIcon } = getStockStatus(item.quantity, item.reorderPoint);
                const available = item.quantity - item.reserved;
                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="table-td">
                      <p className="font-semibold text-navy-800">{item.productName}</p>
                      <p className="text-xs text-gray-400 font-mono">{item.sku}</p>
                    </td>
                    <td className="table-td">
                      <span className="font-mono text-sm bg-gray-100 px-2 py-0.5 rounded-lg text-navy-700">
                        {item.location}
                      </span>
                    </td>
                    <td className="table-td text-right font-semibold text-navy-800">{item.quantity.toLocaleString()}</td>
                    <td className="table-td text-right text-gray-500">{item.reserved}</td>
                    <td className="table-td text-right font-semibold text-green-700">{available.toLocaleString()}</td>
                    <td className="table-td text-right text-gray-500">{item.reorderPoint}</td>
                    <td className="table-td">
                      <span className={`badge ${color} gap-1`}>
                        <SIcon className="w-3 h-3" /> {label}
                      </span>
                    </td>
                    <td className="table-td text-gray-500 text-xs">{item.lastRestocked}</td>
                    <td className="table-td text-center">
                      <button
                        onClick={() => openEdit(item)}
                        className="p-1.5 text-navy-600 hover:bg-navy-50 rounded-lg transition-colors"
                        title="Tahrirlash"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent movements */}
      <div className="card">
        <h3 className="font-display font-bold text-navy-900 mb-5">So'nggi harakatlar</h3>
        <div className="space-y-3">
          {movementList.map((m) => (
            <div key={m.id} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
              <span className={`badge ${movTypeConfig[m.type] || 'bg-gray-100 text-gray-600'}`}>{m.type}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-navy-800 truncate">{m.product}</p>
                <p className="text-xs text-gray-400">{m.ref} · {m.by}</p>
              </div>
              <p className={`text-sm font-bold ${m.qty < 0 || m.type === 'OUT' ? 'text-red-600' : 'text-green-600'}`}>
                {m.qty > 0 && m.type !== 'OUT' ? '+' : ''}{m.qty} dona
              </p>
              <p className="text-xs text-gray-400 whitespace-nowrap">{m.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Add Movement Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-display font-bold text-navy-900">Kirim qo'shish</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddMovement} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">Mahsulot *</label>
                <select
                  className="select"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                >
                  {inventory.map((i) => (
                    <option key={i.sku} value={i.sku}>
                      {i.productName} ({i.sku}) — {i.quantity} dona
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Harakat turi *</label>
                  <select
                    className="select"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    {movTypes.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Miqdor (dona) *</label>
                  <input
                    className="input"
                    type="number"
                    min="1"
                    required
                    placeholder="100"
                    value={form.qty}
                    onChange={(e) => setForm({ ...form, qty: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">Havola raqami</label>
                <input
                  className="input"
                  placeholder="PO-00234 yoki TH-002010"
                  value={form.ref}
                  onChange={(e) => setForm({ ...form, ref: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">Izoh</label>
                <input
                  className="input"
                  placeholder="Qo'shimcha ma'lumot..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary flex-1 justify-center">
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

      {/* ── Edit Item Modal ── */}
      {showEditModal && editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="font-display font-bold text-navy-900">Mahsulotni yangilash</h2>
                <p className="text-xs text-gray-400 mt-0.5 font-mono">{editItem.sku}</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateItem} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">Mahsulot nomi</label>
                <input className="input bg-gray-50" value={editItem.productName} readOnly />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Joylashuv</label>
                  <input
                    className="input"
                    placeholder="A-01-01"
                    value={editItem.location}
                    onChange={(e) => setEditItem({ ...editItem, location: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Qayta buyurtma nuqtasi</label>
                  <input
                    className="input"
                    type="number"
                    min="0"
                    value={editItem.reorderPoint}
                    onChange={(e) => setEditItem({ ...editItem, reorderPoint: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Zaxira (dona)</label>
                  <input
                    className="input"
                    type="number"
                    min="0"
                    value={editItem.quantity}
                    onChange={(e) => setEditItem({ ...editItem, quantity: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Band qilingan (dona)</label>
                  <input
                    className="input"
                    type="number"
                    min="0"
                    value={editItem.reserved}
                    onChange={(e) => setEditItem({ ...editItem, reserved: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowEditModal(false)} className="btn-secondary flex-1 justify-center">
                  Bekor qilish
                </button>
                <button type="submit" className="btn-primary flex-1 justify-center">
                  <Save className="w-4 h-4" /> Yangilash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
