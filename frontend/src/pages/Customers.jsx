import React, { useState, useEffect } from 'react';
import { Search, Plus, Users, Star, MapPin, Phone, Mail, TrendingUp, Edit2, X, Save } from 'lucide-react';
import { customersAPI } from '../api';
import toast from 'react-hot-toast';

const tierConfig = {
  Platinum: { color: 'bg-purple-100 text-purple-700', stars: 4, dotColor: 'bg-purple-500' },
  Gold:     { color: 'bg-gold-100 text-gold-700',     stars: 3, dotColor: 'bg-gold-500' },
  Silver:   { color: 'bg-gray-100 text-gray-600',     stars: 2, dotColor: 'bg-gray-400' },
  Bronze:   { color: 'bg-orange-100 text-orange-700', stars: 1, dotColor: 'bg-orange-400' },
};

const AVATAR_COLORS = [
  'bg-navy-700', 'bg-blue-600', 'bg-purple-600', 'bg-teal-600',
  'bg-indigo-600', 'bg-emerald-600', 'bg-rose-600', 'bg-amber-600',
];

const avatarColor = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const DEMO_CUSTOMERS = [
  { id:'1', companyName:'Toshkent Kiyim Bozori',   contactName:'Aziz Karimov',      email:'aziz@tkb.uz',    phone:'+998901234567', region:'Toshkent',  city:'Toshkent',  tier:'Platinum', totalPurchases:125000000, creditLimit:50000000, isActive:true },
  { id:'2', companyName:'Samarqand Fashion Store', contactName:'Dilnoza Ergasheva',  email:'dilnoza@sfs.uz', phone:'+998912345678', region:'Samarqand', city:'Samarqand', tier:'Gold',     totalPurchases:67000000,  creditLimit:25000000, isActive:true },
  { id:'3', companyName:'Namangan Textile Center', contactName:'Jasur Toshmatov',    email:'jasur@ntc.uz',   phone:'+998923456789', region:'Namangan',  city:'Namangan',  tier:'Gold',     totalPurchases:54000000,  creditLimit:20000000, isActive:true },
  { id:'4', companyName:'Andijon Moda',             contactName:'Mohira Yuldasheva', email:'mohira@am.uz',   phone:'+998934567890', region:'Andijon',   city:'Andijon',   tier:'Silver',   totalPurchases:32000000,  creditLimit:15000000, isActive:true },
  { id:'5', companyName:'Buxoro Style',             contactName:'Sherzod Nazarov',   email:'sherzod@bs.uz',  phone:'+998945678901', region:'Buxoro',    city:'Buxoro',    tier:'Silver',   totalPurchases:28000000,  creditLimit:12000000, isActive:true },
  { id:'6', companyName:'Fargona Online Shop',      contactName:'Feruza Xasanova',   email:'feruza@fos.uz',  phone:'+998956789012', region:'Fargona',   city:'Fargona',   tier:'Bronze',   totalPurchases:8500000,   creditLimit:5000000,  isActive:true },
];

const emptyForm = { companyName: '', contactName: '', email: '', phone: '', region: '', city: '', tier: 'Bronze', creditLimit: 0 };

export default function Customers() {
  const [customers, setCustomers]       = useState(DEMO_CUSTOMERS);
  const [search, setSearch]             = useState('');
  const [filterTier, setFilterTier]     = useState('');
  const [view, setView]                 = useState('table');
  const [showModal, setShowModal]       = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [form, setForm]                 = useState(emptyForm);

  useEffect(() => {
    customersAPI.getAll({ search, tier: filterTier, limit: 50 })
      .then((res) => setCustomers(res.data.customers))
      .catch(() => {});
  }, [search, filterTier]);

  const filtered = customers.filter((c) => {
    const s = search.toLowerCase();
    const matchSearch = !s || c.companyName.toLowerCase().includes(s) || c.contactName.toLowerCase().includes(s);
    const matchTier   = !filterTier || c.tier === filterTier;
    return matchSearch && matchTier;
  });

  const tierStats = ['Platinum', 'Gold', 'Silver', 'Bronze'].map((t) => ({
    tier: t,
    count: customers.filter((c) => c.tier === t).length,
    ...tierConfig[t],
  }));

  const openAdd = () => {
    setEditCustomer(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (c) => {
    setEditCustomer(c);
    setForm({ companyName: c.companyName, contactName: c.contactName, email: c.email, phone: c.phone, region: c.region, city: c.city || '', tier: c.tier, creditLimit: c.creditLimit });
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.companyName.trim() || !form.contactName.trim()) {
      toast.error("Kompaniya va aloqa shaxsi nomini kiriting");
      return;
    }
    if (editCustomer) {
      setCustomers((prev) => prev.map((c) => c.id === editCustomer.id ? { ...c, ...form } : c));
      toast.success('Mijoz yangilandi!');
    } else {
      const newCustomer = {
        id: String(Date.now()),
        ...form,
        creditLimit: parseInt(form.creditLimit, 10) || 0,
        totalPurchases: 0,
        isActive: true,
      };
      setCustomers((prev) => [newCustomer, ...prev]);
      toast.success(`${newCustomer.companyName} qo'shildi!`);
    }
    setShowModal(false);
    setForm(emptyForm);
    setEditCustomer(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-display font-bold text-navy-900">Mijozlar (CRM)</h1>
          <p className="text-gray-500 text-sm mt-0.5">{customers.length} ta kompaniya</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="w-4 h-4" /> Mijoz qo'shish
        </button>
      </div>

      {/* Tier summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {tierStats.map(({ tier, count, color, stars }) => (
          <div key={tier} className="card flex items-center gap-3 p-4">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0 text-sm font-bold`}>
              {count}
            </div>
            <div>
              <p className="font-semibold text-navy-900 text-sm">{tier}</p>
              <div className="flex gap-0.5 mt-0.5">
                {Array.from({ length: stars }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-gold-400 text-gold-400" />
                ))}
              </div>
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
              placeholder="Kompaniya yoki aloqa shaxsi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="select w-full sm:w-40" value={filterTier} onChange={(e) => setFilterTier(e.target.value)}>
            <option value="">Barcha tier</option>
            {['Platinum', 'Gold', 'Silver', 'Bronze'].map((t) => <option key={t}>{t}</option>)}
          </select>
          <div className="flex gap-1">
            {['table', 'card'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${view === v ? 'bg-navy-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {v === 'table' ? '≡ Jadval' : '⊞ Kartalar'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {view === 'card' ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => {
            const cfg = tierConfig[c.tier] || tierConfig.Bronze;
            return (
              <div key={c.id} className="card hover:shadow-card-hover transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${avatarColor(c.companyName)} flex items-center justify-center text-white font-bold text-lg`}>
                    {c.companyName.charAt(0)}
                  </div>
                  <span className={`badge ${cfg.color}`}>{c.tier}</span>
                </div>
                <h3 className="font-display font-bold text-navy-900 mb-0.5">{c.companyName}</h3>
                <p className="text-sm text-gray-500 mb-4">{c.contactName}</p>
                <div className="space-y-1.5 text-xs text-gray-500">
                  <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {c.city}, {c.region}</div>
                  <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {c.phone}</div>
                  <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {c.email}</div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Jami xaridlar</p>
                    <p className="font-semibold text-navy-800 text-sm">{(Number(c.totalPurchases) / 1_000_000).toFixed(1)}M so'm</p>
                  </div>
                  <button onClick={() => openEdit(c)} className="p-2 text-navy-600 hover:bg-navy-50 rounded-xl transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="table-th">Kompaniya</th>
                  <th className="table-th">Aloqa</th>
                  <th className="table-th">Shahar</th>
                  <th className="table-th">Tier</th>
                  <th className="table-th text-right">Jami xaridlar</th>
                  <th className="table-th text-right">Kredit limit</th>
                  <th className="table-th text-center">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((c) => {
                  const cfg = tierConfig[c.tier] || tierConfig.Bronze;
                  return (
                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="table-td">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl ${avatarColor(c.companyName)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                            {c.companyName.charAt(0)}
                          </div>
                          <p className="font-semibold text-navy-800">{c.companyName}</p>
                        </div>
                      </td>
                      <td className="table-td">
                        <p className="text-navy-700">{c.contactName}</p>
                        <p className="text-xs text-gray-400">{c.phone}</p>
                      </td>
                      <td className="table-td text-gray-600">{c.city}, {c.region}</td>
                      <td className="table-td">
                        <span className={`badge ${cfg.color}`}>{c.tier}</span>
                      </td>
                      <td className="table-td text-right font-semibold text-navy-800">
                        {(Number(c.totalPurchases) / 1_000_000).toFixed(1)}M so'm
                      </td>
                      <td className="table-td text-right text-gray-600">
                        {(Number(c.creditLimit) / 1_000_000).toFixed(0)}M so'm
                      </td>
                      <td className="table-td text-center">
                        <button onClick={() => openEdit(c)} className="p-1.5 text-navy-600 hover:bg-navy-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Mijoz topilmadi</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Add / Edit Customer Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-display font-bold text-navy-900">
                {editCustomer ? 'Mijozni tahrirlash' : "Yangi mijoz qo'shish"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleSave}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Kompaniya nomi *</label>
                  <input
                    className="input"
                    required
                    placeholder="Toshkent Kiyim Bozori"
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Aloqa shaxsi *</label>
                  <input
                    className="input"
                    required
                    placeholder="Aziz Karimov"
                    value={form.contactName}
                    onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Email</label>
                  <input
                    className="input"
                    type="email"
                    placeholder="info@company.uz"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Telefon</label>
                  <input
                    className="input"
                    placeholder="+998901234567"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Viloyat</label>
                  <input
                    className="input"
                    placeholder="Toshkent"
                    value={form.region}
                    onChange={(e) => setForm({ ...form, region: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Shahar</label>
                  <input
                    className="input"
                    placeholder="Toshkent"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Tier</label>
                  <select className="select" value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value })}>
                    {['Bronze', 'Silver', 'Gold', 'Platinum'].map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Kredit limit (so'm)</label>
                  <input
                    className="input"
                    type="number"
                    min="0"
                    placeholder="5000000"
                    value={form.creditLimit}
                    onChange={(e) => setForm({ ...form, creditLimit: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">
                  Bekor qilish
                </button>
                <button type="submit" className="btn-primary flex-1 justify-center">
                  <Save className="w-4 h-4" /> {editCustomer ? 'Yangilash' : 'Saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
