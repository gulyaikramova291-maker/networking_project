import React, { useState, useEffect } from 'react';
import { Search, Plus, Package, Edit2, Trash2, AlertTriangle, X, Save } from 'lucide-react';
import { productsAPI } from '../api';
import toast from 'react-hot-toast';

const categories = ["Men's Clothing", "Women's Clothing", "Children's Clothing", "Accessories", "Sportswear", "Workwear", "Underwear", "Outerwear"];

const DEMO_PRODUCTS = [
  { id:'1', sku:'TH-M-001', name:'Classic Oxford Shirt',   category:"Men's Clothing",      brand:'TextilPro',   wholesalePrice:28000,  stockQty:480, minOrderQty:12, colors:['White','Blue'],        sizes:['S','M','L','XL'] },
  { id:'2', sku:'TH-W-001', name:'Floral Wrap Dress',      category:"Women's Clothing",    brand:'EleganceUz',  wholesalePrice:60000,  stockQty:240, minOrderQty:6,  colors:['Red','Blue'],           sizes:['XS','S','M','L'] },
  { id:'3', sku:'TH-K-001', name:'Kids Denim Jacket',      category:"Children's Clothing", brand:'KidsFirst',   wholesalePrice:36000,  stockQty:300, minOrderQty:12, colors:['Blue'],                  sizes:['4Y','6Y','8Y'] },
  { id:'4', sku:'TH-S-001', name:'Sport Running T-Shirt',  category:'Sportswear',          brand:'ActiveUz',    wholesalePrice:25600,  stockQty:600, minOrderQty:24, colors:['Black','White'],         sizes:['S','M','L','XL'] },
  { id:'5', sku:'TH-O-001', name:'Winter Down Jacket',     category:'Outerwear',           brand:'WarmWear',    wholesalePrice:144000, stockQty:120, minOrderQty:6,  colors:['Black','Navy'],          sizes:['S','M','L','XL'] },
  { id:'6', sku:'TH-M-003', name:'Formal Suit',            category:"Men's Clothing",      brand:'TextilPro',   wholesalePrice:280000, stockQty:60,  minOrderQty:3,  colors:['Black','Navy'],          sizes:['46','48','50'] },
  { id:'7', sku:'TH-K-002', name:'School Uniform Set',     category:"Children's Clothing", brand:'KidsFirst',   wholesalePrice:68000,  stockQty:25,  minOrderQty:12, colors:['Dark Blue'],             sizes:['6Y','8Y','10Y'] },
  { id:'8', sku:'TH-A-001', name:'Leather Belt',           category:'Accessories',         brand:'AccessoPro',  wholesalePrice:22400,  stockQty:480, minOrderQty:24, colors:['Black','Brown'],         sizes:['S','M','L'] },
];

const categoryColors = {
  "Men's Clothing":      'bg-blue-50 text-blue-700',
  "Women's Clothing":    'bg-pink-50 text-pink-700',
  "Children's Clothing": 'bg-yellow-50 text-yellow-700',
  'Accessories':         'bg-purple-50 text-purple-700',
  'Sportswear':          'bg-green-50 text-green-700',
  'Workwear':            'bg-gray-100 text-gray-700',
  'Underwear':           'bg-rose-50 text-rose-700',
  'Outerwear':           'bg-indigo-50 text-indigo-700',
};

/* ── SVG Category Thumbnails ── */
const CategoryThumbnail = ({ category }) => {
  switch (category) {
    case "Men's Clothing":
      return (
        <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect width="56" height="56" rx="12" fill="#DBEAFE"/>
          {/* dress shirt */}
          <path d="M28 10c-1.5 0-3 1-4 2.5L18 9l-7 5 4 4 1-1v20h24V17l1 1 4-4-7-5-6 3.5c-1-1.5-2.5-2.5-4-2.5z" fill="#3B82F6" opacity="0.85"/>
          <path d="M26 10c0 0 0.5 3 2 3s2-3 2-3" fill="#2563EB" opacity="0.6"/>
          {/* buttons */}
          <circle cx="28" cy="20" r="1" fill="white" opacity="0.8"/>
          <circle cx="28" cy="25" r="1" fill="white" opacity="0.8"/>
          <circle cx="28" cy="30" r="1" fill="white" opacity="0.8"/>
        </svg>
      );
    case "Women's Clothing":
      return (
        <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect width="56" height="56" rx="12" fill="#FCE7F3"/>
          {/* dress */}
          <path d="M22 10 L18 16 L20 18 L16 44 L40 44 L36 18 L38 16 L34 10 C33 12 31 13 28 13 C25 13 23 12 22 10z" fill="#EC4899" opacity="0.8"/>
          {/* waist detail */}
          <path d="M20 24 Q28 27 36 24" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" fill="none"/>
          {/* neckline */}
          <path d="M22 10 Q28 15 34 10" stroke="#BE185D" strokeWidth="1.5" fill="none" opacity="0.6"/>
        </svg>
      );
    case "Children's Clothing":
      return (
        <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect width="56" height="56" rx="12" fill="#FEF9C3"/>
          {/* small jacket */}
          <path d="M28 11c-1 0-2 0.5-3 1.5L19 10l-5 4 3 3 1-0.5V38h20V16.5l1 0.5 3-3-5-4-6 2.5c-1-1-2-1.5-3-1.5z" fill="#EAB308" opacity="0.85"/>
          {/* collar */}
          <path d="M25 11 L28 15 L31 11" stroke="#CA8A04" strokeWidth="1.5" fill="none"/>
          {/* pocket */}
          <rect x="20" y="26" width="6" height="5" rx="1.5" fill="white" opacity="0.4"/>
          <rect x="30" y="26" width="6" height="5" rx="1.5" fill="white" opacity="0.4"/>
        </svg>
      );
    case 'Sportswear':
      return (
        <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect width="56" height="56" rx="12" fill="#DCFCE7"/>
          {/* athletic tshirt */}
          <path d="M28 10c-1.5 0-3 1-4 2L17 9l-5 5 4 3 1-0.5V38h22V16.5l1 0.5 4-3-5-5-7 3c-1-1-2-2-3-2z" fill="#16A34A" opacity="0.8"/>
          {/* side stripe */}
          <path d="M17 16.5 L17 38" stroke="white" strokeWidth="2.5" opacity="0.4"/>
          <path d="M39 16.5 L39 38" stroke="white" strokeWidth="2.5" opacity="0.4"/>
          {/* collar */}
          <path d="M24 10 Q28 14 32 10" stroke="#15803D" strokeWidth="1.5" fill="none" strokeOpacity="0.7"/>
        </svg>
      );
    case 'Outerwear':
      return (
        <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect width="56" height="56" rx="12" fill="#E0E7FF"/>
          {/* parka/jacket */}
          <path d="M28 9c-1.5 0-3 0.8-4 2L15 7l-5 6 4 4 2-1.5V44h24V15.5l2 1.5 4-4-5-6-10 4c-1-1.2-2.5-2-4-2z" fill="#4F46E5" opacity="0.82"/>
          {/* hood detail */}
          <path d="M22 9 Q28 5 34 9" stroke="#3730A3" strokeWidth="2" fill="none" opacity="0.5"/>
          {/* zipper */}
          <line x1="28" y1="15" x2="28" y2="44" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" strokeDasharray="3 2"/>
          {/* pockets */}
          <rect x="16" y="30" width="8" height="6" rx="2" fill="white" opacity="0.3"/>
          <rect x="32" y="30" width="8" height="6" rx="2" fill="white" opacity="0.3"/>
        </svg>
      );
    case 'Accessories':
      return (
        <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect width="56" height="56" rx="12" fill="#F3E8FF"/>
          {/* belt */}
          <rect x="8" y="24" width="40" height="8" rx="4" fill="#7C3AED" opacity="0.8"/>
          {/* buckle */}
          <rect x="20" y="22" width="16" height="12" rx="3" fill="#6D28D9" opacity="0.9"/>
          <rect x="23" y="25" width="10" height="6" rx="2" fill="#DDD6FE" opacity="0.7"/>
          {/* buckle pin */}
          <line x1="28" y1="24" x2="28" y2="32" stroke="#7C3AED" strokeWidth="2"/>
          {/* holes */}
          <circle cx="36" cy="28" r="1.2" fill="#A78BFA" opacity="0.7"/>
          <circle cx="40" cy="28" r="1.2" fill="#A78BFA" opacity="0.7"/>
          <circle cx="44" cy="28" r="1.2" fill="#A78BFA" opacity="0.7"/>
        </svg>
      );
    case 'Underwear':
      return (
        <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect width="56" height="56" rx="12" fill="#FFE4E6"/>
          {/* boxer briefs */}
          <path d="M11 16h34l-4 24H15L11 16z" fill="#FB7185" opacity="0.75"/>
          {/* elastic waistband */}
          <rect x="11" y="13" width="34" height="6" rx="3" fill="#F43F5E" opacity="0.85"/>
          {/* seam line */}
          <line x1="28" y1="19" x2="28" y2="40" stroke="white" strokeWidth="1.5" strokeOpacity="0.5"/>
          {/* leg bands */}
          <path d="M15 40 Q14 44 18 45" stroke="#F43F5E" strokeWidth="2" fill="none" opacity="0.6"/>
          <path d="M41 40 Q42 44 38 45" stroke="#F43F5E" strokeWidth="2" fill="none" opacity="0.6"/>
        </svg>
      );
    case 'Workwear':
      return (
        <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect width="56" height="56" rx="12" fill="#F3F4F6"/>
          {/* work vest/overall */}
          <path d="M28 10c-1.5 0-3 1-4 2L17 9 12 14l3 3 1.5-1V44h23V16l1.5 1 3-3-5-5-8 3c-1-1.2-2.5-2-3-2z" fill="#4B5563" opacity="0.85"/>
          {/* reflective strips */}
          <rect x="13" y="24" width="30" height="3" rx="1.5" fill="#FBBF24" opacity="0.75"/>
          <rect x="13" y="32" width="30" height="3" rx="1.5" fill="#FBBF24" opacity="0.75"/>
          {/* chest pocket */}
          <rect x="21" y="16" width="7" height="6" rx="1.5" fill="white" opacity="0.3"/>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect width="56" height="56" rx="12" fill="#F1F5F9"/>
          <Package className="w-6 h-6 text-gray-400" style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)' }} />
        </svg>
      );
  }
};

const emptyForm = { sku: '', name: '', category: categories[0], brand: '', wholesalePrice: '', stockQty: '', minOrderQty: 12 };

export default function Products() {
  const [products, setProducts] = useState(DEMO_PRODUCTS);
  const [loading, setLoading]   = useState(false);
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm]         = useState(emptyForm);
  const [page, setPage]         = useState(1);
  const [total, setTotal]       = useState(DEMO_PRODUCTS.length);

  const load = async () => {
    setLoading(true);
    try {
      const res = await productsAPI.getAll({ search, category, page, limit: 20 });
      setProducts(res.data.products);
      setTotal(res.data.total);
    } catch {
      // use demo data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [search, category, page]);

  const openAdd = () => {
    setEditProduct(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditProduct(p);
    setForm({ sku: p.sku, name: p.name, category: p.category, brand: p.brand, wholesalePrice: p.wholesalePrice, stockQty: p.stockQty, minOrderQty: p.minOrderQty });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (editProduct) {
      setProducts((prev) => prev.map((p) => p.id === editProduct.id ? { ...p, ...form, wholesalePrice: Number(form.wholesalePrice), stockQty: Number(form.stockQty), minOrderQty: Number(form.minOrderQty) } : p));
      toast.success('Mahsulot yangilandi!');
    } else {
      try {
        await productsAPI.create(form);
        toast.success("Mahsulot qo'shildi!");
        load();
      } catch {
        const newProduct = {
          id: String(Date.now()),
          ...form,
          wholesalePrice: Number(form.wholesalePrice),
          stockQty: Number(form.stockQty),
          minOrderQty: Number(form.minOrderQty),
          colors: [],
          sizes: [],
        };
        setProducts((prev) => [newProduct, ...prev]);
        setTotal((t) => t + 1);
        toast.success("Mahsulot qo'shildi!");
      }
    }
    setShowModal(false);
    setForm(emptyForm);
    setEditProduct(null);
  };

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Mahsulot o'chirildi");
  };

  const filtered = products.filter((p) => {
    const s = search.toLowerCase();
    const matchSearch = !s || p.name.toLowerCase().includes(s) || p.sku.toLowerCase().includes(s) || p.brand?.toLowerCase().includes(s);
    const matchCat    = !category || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-display font-bold text-navy-900">Mahsulotlar</h1>
          <p className="text-gray-500 text-sm mt-0.5">{total} ta mahsulot</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="w-4 h-4" /> Mahsulot qo'shish
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="input pl-9"
              placeholder="Nom, SKU yoki brend bo'yicha qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="select w-full sm:w-56" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Barcha kategoriyalar</option>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="table-th w-14"></th>
                <th className="table-th">SKU / Nom</th>
                <th className="table-th">Kategoriya</th>
                <th className="table-th">Brend</th>
                <th className="table-th">Ranglar / O'lchamlar</th>
                <th className="table-th text-right">Ulgurji narx</th>
                <th className="table-th text-right">Zaxira</th>
                <th className="table-th text-center">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p) => {
                const isLow = p.stockQty < 50;
                return (
                  <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="table-td">
                      <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0">
                        <CategoryThumbnail category={p.category} />
                      </div>
                    </td>
                    <td className="table-td">
                      <p className="font-semibold text-navy-800">{p.name}</p>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">{p.sku}</p>
                    </td>
                    <td className="table-td">
                      <span className={`badge ${categoryColors[p.category] || 'bg-gray-100 text-gray-600'}`}>
                        {p.category}
                      </span>
                    </td>
                    <td className="table-td text-gray-600">{p.brand}</td>
                    <td className="table-td">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(p.colors || []).slice(0, 3).map((c) => <span key={c} className="badge bg-gray-100 text-gray-600">{c}</span>)}
                        {(p.sizes  || []).slice(0, 4).map((s) => <span key={s} className="badge bg-navy-50 text-navy-600">{s}</span>)}
                      </div>
                    </td>
                    <td className="table-td text-right font-semibold text-navy-800">
                      {Number(p.wholesalePrice).toLocaleString()} so'm
                    </td>
                    <td className="table-td text-right">
                      <span className={`font-semibold flex items-center justify-end gap-1 ${isLow ? 'text-orange-600' : 'text-navy-800'}`}>
                        {isLow && <AlertTriangle className="w-3.5 h-3.5" />}
                        {p.stockQty}
                      </span>
                    </td>
                    <td className="table-td text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 text-navy-600 hover:bg-navy-50 rounded-lg transition-colors"
                          title="Tahrirlash"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="O'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Mahsulot topilmadi</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Add / Edit Product Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-display font-bold text-navy-900">
                {editProduct ? 'Mahsulotni tahrirlash' : "Yangi mahsulot qo'shish"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">SKU *</label>
                  <input
                    className="input"
                    required
                    placeholder="TH-M-010"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Brend *</label>
                  <input
                    className="input"
                    required
                    placeholder="TextilPro"
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">Mahsulot nomi *</label>
                <input
                  className="input"
                  required
                  placeholder="Classic Oxford Shirt"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">Kategoriya</label>
                <select
                  className="select"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Ulgurji narx (so'm)</label>
                  <input
                    className="input"
                    type="number"
                    required
                    placeholder="28000"
                    value={form.wholesalePrice}
                    onChange={(e) => setForm({ ...form, wholesalePrice: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Zaxira (dona)</label>
                  <input
                    className="input"
                    type="number"
                    placeholder="100"
                    value={form.stockQty}
                    onChange={(e) => setForm({ ...form, stockQty: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Min buyurtma</label>
                  <input
                    className="input"
                    type="number"
                    value={form.minOrderQty}
                    onChange={(e) => setForm({ ...form, minOrderQty: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">
                  Bekor qilish
                </button>
                <button type="submit" className="btn-primary flex-1 justify-center">
                  <Save className="w-4 h-4" /> {editProduct ? 'Yangilash' : 'Saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
