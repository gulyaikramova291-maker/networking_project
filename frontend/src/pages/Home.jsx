import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Boxes, ArrowRight, CheckCircle2, BarChart3, Users, Warehouse,
  ShieldCheck, Zap, Globe, TrendingUp, Star, ChevronRight, Package
} from 'lucide-react';

const CountUp = ({ target, suffix = '' }) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const step = target / 60;
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(current));
    }, 25);
    return () => clearInterval(timer);
  }, [target]);
  return <>{value.toLocaleString()}{suffix}</>;
};

const features = [
  { icon: BarChart3,   title: 'ERP Tizimi',   desc: 'Buyurtmalar, moliya va biznes jarayonlarini yagona tizimda boshqaring.', color: 'bg-blue-50 text-blue-600' },
  { icon: Users,       title: 'CRM Tizimi',   desc: 'Mijozlar bilan munosabatlarni kuzating, savdo tarixini saqlang.',        color: 'bg-green-50 text-green-600' },
  { icon: Warehouse,   title: 'WMS Tizimi',   desc: 'Ombor zaxirasini real vaqtda boshqaring va optimallang.',                color: 'bg-purple-50 text-purple-600' },
  { icon: ShieldCheck, title: 'AWS Bulut',     desc: 'AWS VPC, SSL/TLS shifrlash va 99.9% uptime kafolati.',                  color: 'bg-gold-50 text-gold-600' },
  { icon: Zap,         title: 'Auto-Scaling', desc: "Yuklama oshganda tizim avtomatik kengayadi — tezligi pasaymaydi.",       color: 'bg-orange-50 text-orange-600' },
  { icon: Globe,       title: 'CDN & Tezlik', desc: "O'zbekiston bo'ylab barcha foydalanuvchilarga tez yuklanish.",           color: 'bg-teal-50 text-teal-600' },
];

const FeatureIllustrations = {
  'ERP Tizimi': () => (
    <svg viewBox="0 0 80 50" fill="none" className="w-full h-12 mb-3 opacity-80">
      <rect x="5" y="10" width="70" height="30" rx="5" fill="#DBEAFE"/>
      <rect x="10" y="15" width="20" height="8" rx="2" fill="#3B82F6" opacity="0.7"/>
      <rect x="35" y="15" width="15" height="8" rx="2" fill="#93C5FD"/>
      <rect x="55" y="15" width="15" height="8" rx="2" fill="#93C5FD"/>
      <rect x="10" y="27" width="60" height="3" rx="1.5" fill="#BFDBFE"/>
      <rect x="10" y="33" width="40" height="3" rx="1.5" fill="#BFDBFE"/>
    </svg>
  ),
  'CRM Tizimi': () => (
    <svg viewBox="0 0 80 50" fill="none" className="w-full h-12 mb-3 opacity-80">
      {[0,1,2].map((i) => (
        <g key={i} transform={`translate(${i * 24 + 4}, 8)`}>
          <circle cx="12" cy="10" r="8" fill="#BBF7D0"/>
          <circle cx="12" cy="8" r="4" fill="#16A34A" opacity="0.7"/>
          <path d="M4 18 Q12 14 20 18" fill="#16A34A" opacity="0.5"/>
        </g>
      ))}
      <rect x="5" y="36" width="70" height="5" rx="2.5" fill="#DCFCE7"/>
    </svg>
  ),
  'WMS Tizimi': () => (
    <svg viewBox="0 0 80 50" fill="none" className="w-full h-12 mb-3 opacity-80">
      <rect x="5" y="5" width="70" height="40" rx="4" fill="#EDE9FE"/>
      {[0,1,2].map((i) => (
        <g key={i}>
          <rect x={10 + i * 23} y="12" width="18" height="12" rx="2" fill="#7C3AED" opacity="0.6"/>
          <rect x={10 + i * 23} y="28" width="18" height="12" rx="2" fill="#A78BFA" opacity="0.6"/>
        </g>
      ))}
    </svg>
  ),
  'AWS Bulut': () => (
    <svg viewBox="0 0 80 50" fill="none" className="w-full h-12 mb-3 opacity-80">
      <path d="M15 35 Q10 35 10 28 Q10 20 18 20 Q20 12 30 14 Q34 8 42 10 Q52 10 52 20 Q60 20 60 28 Q60 35 55 35 Z" fill="#FEF3C7"/>
      <path d="M15 35 Q10 35 10 28 Q10 20 18 20 Q20 12 30 14 Q34 8 42 10 Q52 10 52 20 Q60 20 60 28 Q60 35 55 35 Z" stroke="#D97706" strokeWidth="1.5" fill="none"/>
      <path d="M28 28 L28 42 M32 28 L32 42 M36 28 L36 42 M40 28 L40 42" stroke="#D97706" strokeWidth="1.5" strokeOpacity="0.6"/>
      <rect x="20" y="40" width="40" height="5" rx="2.5" fill="#FDE68A" opacity="0.8"/>
    </svg>
  ),
  'Auto-Scaling': () => (
    <svg viewBox="0 0 80 50" fill="none" className="w-full h-12 mb-3 opacity-80">
      {[0,1,2,3,4].map((i, _, arr) => {
        const heights = [20, 32, 25, 40, 30];
        return (
          <rect key={i} x={8 + i * 14} y={45 - heights[i]} width="10" height={heights[i]} rx="3"
            fill={i === 3 ? '#F97316' : '#FFEDD5'} stroke="#F97316" strokeWidth="1" opacity="0.9"/>
        );
      })}
      <path d="M8 45 Q22 28 36 35 Q50 20 72 12" stroke="#F97316" strokeWidth="2" fill="none" strokeDasharray="4 2"/>
    </svg>
  ),
  'CDN & Tezlik': () => (
    <svg viewBox="0 0 80 50" fill="none" className="w-full h-12 mb-3 opacity-80">
      <circle cx="40" cy="25" r="18" fill="#CCFBF1"/>
      <circle cx="40" cy="25" r="18" stroke="#0F766E" strokeWidth="1.5" fill="none"/>
      <path d="M22 25 Q40 15 58 25" stroke="#0F766E" strokeWidth="1" fill="none"/>
      <path d="M22 25 Q40 35 58 25" stroke="#0F766E" strokeWidth="1" fill="none"/>
      <line x1="40" y1="7" x2="40" y2="43" stroke="#0F766E" strokeWidth="1"/>
      {[15, 25, 35].map((cx) => (
        <circle key={cx} cx={cx} cy="25" r="3" fill="#0D9488" opacity="0.8"/>
      ))}
      <circle cx="55" cy="25" r="3" fill="#0D9488" opacity="0.8"/>
    </svg>
  ),
};

const testimonials = [
  { name: 'Aziz Karimov', company: 'Toshkent Kiyim Bozori', text: "TekstilHub bizning biznesimizni tubdan o'zgartirdi. Buyurtmalar 3x tezroq ishlanmoqda.", tier: 'Platinum', rating: 5 },
  { name: 'Dilnoza Ergasheva', company: 'Samarqand Fashion Store', text: "WMS tizimi tufayli ombordagi yo'qotishlar 80% kamaydi. Juda samarali!", tier: 'Gold', rating: 5 },
  { name: 'Jasur Toshmatov', company: 'Namangan Textile Center', text: "CRM moduli orqali mijozlarimizni yaxshiroq bilaman. Savdo 40% o'sdi.", tier: 'Gold', rating: 5 },
];

const tierColors = { Platinum: 'text-purple-600 bg-purple-50', Gold: 'text-gold-600 bg-gold-50', Silver: 'text-gray-600 bg-gray-100' };

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-900/95 backdrop-blur-md border-b border-navy-700/30">
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center">
              <Boxes className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-white text-xl">TekstilHub<span className="text-gold-400">.uz</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-navy-300">
            <a href="#features" className="hover:text-white transition-colors">Imkoniyatlar</a>
            <a href="#stats" className="hover:text-white transition-colors">Statistika</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Mijozlar</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-navy-300 hover:text-white px-4 py-2 transition-colors hidden sm:block">Kirish</Link>
            <Link to="/login" className="btn-gold text-sm py-2 px-4">
              Boshlash <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen bg-navy-900 hero-pattern flex items-center pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800" />

        {/* Decorative circles */}
        <div className="absolute top-1/4 right-10 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-navy-600/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-5 py-24 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-gold-500/15 text-gold-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-gold-500/20">
              <Zap className="w-3 h-3" /> AWS Bulut Platformasi
            </span>
            <h1 className="font-display text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6">
              Kiyim-Kechak<br />
              <span className="text-gold-400">Ulgurjisi</span> uchun<br />
              Smart Tizim
            </h1>
            <p className="text-navy-300 text-lg leading-relaxed mb-10 max-w-lg">
              ERP, CRM va WMS — uchta tizim bitta platformada. Buyurtmalar, mijozlar va
              ombor zaxirasini real vaqtda boshqaring.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/login" className="btn-gold px-7 py-3 text-base">
                Bepul boshlash <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#features" className="btn-secondary border-navy-600 text-navy-200 hover:bg-navy-700 bg-transparent px-7 py-3 text-base">
                Ko'proq bilish
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-5 text-sm text-navy-300">
              {["Kredit karta shart emas", "14 kun bepul sinash", "24/7 qo'llab-quvvatlash"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-400" /> {t}
                </span>
              ))}
            </div>
          </div>

          {/* Hero illustration + Mock dashboard preview */}
          <div className="relative hidden lg:block">
            {/* Floating textile illustration */}
            <div className="absolute -top-8 -right-4 opacity-20 pointer-events-none">
              <svg viewBox="0 0 200 200" width="200" height="200" fill="none">
                <circle cx="100" cy="100" r="80" stroke="#f5a623" strokeWidth="1.5" strokeDasharray="6 4"/>
                <path d="M60 70 L80 55 L100 70 L120 55 L140 70 L140 130 L60 130 Z" stroke="#f5a623" strokeWidth="1.5" fill="none" opacity="0.7"/>
                <path d="M80 55 C80 48 100 44 100 44 C100 44 120 48 120 55" stroke="#f5a623" strokeWidth="1.5" fill="none"/>
              </svg>
            </div>
            <div className="bg-navy-800/80 backdrop-blur rounded-2xl border border-navy-600/30 p-5 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-2 text-navy-400 text-xs">Retake/dashboard</span>
              </div>
              {/* Mini stat cards */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: 'Oylik Daromad', value: '₿ 124.5M', change: '+18%', color: 'text-green-400' },
                  { label: 'Buyurtmalar', value: '847', change: '+23%', color: 'text-green-400' },
                  { label: 'Faol Mijozlar', value: '312', change: '+8%', color: 'text-green-400' },
                  { label: 'Mahsulotlar', value: '2,400', change: '-12 kam', color: 'text-orange-400' },
                ].map(({ label, value, change, color }) => (
                  <div key={label} className="bg-navy-700/50 rounded-xl p-3 border border-navy-600/20">
                    <p className="text-navy-400 text-xs mb-1">{label}</p>
                    <p className="text-white font-bold text-lg leading-none">{value}</p>
                    <p className={`text-xs mt-1 font-medium ${color}`}>{change}</p>
                  </div>
                ))}
              </div>
              {/* Mini chart bars */}
              <div className="bg-navy-700/30 rounded-xl p-3 border border-navy-600/20">
                <p className="text-navy-400 text-xs mb-3">So'nggi 6 oy daromadi</p>
                <div className="flex items-end gap-2 h-16">
                  {[40, 65, 45, 80, 60, 90].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full rounded-t-md" style={{ height: `${h}%`, background: i === 5 ? '#f5a623' : '#2c5fa4' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-16 bg-navy-800">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
            {[
              { label: "Faol Kompaniya", value: 500, suffix: '+' },
              { label: "Mahsulot SKU", value: 12000, suffix: '+' },
              { label: "Kunlik Buyurtma", value: 1800, suffix: '+' },
              { label: "Uptime Kafolati", value: 99, suffix: '.9%' },
            ].map(({ label, value, suffix }) => (
              <div key={label}>
                <div className="font-display text-4xl font-extrabold text-gold-400 mb-2">
                  <CountUp target={value} suffix={suffix} />
                </div>
                <p className="text-navy-300 text-sm font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-16">
            <span className="text-gold-600 text-sm font-semibold uppercase tracking-wider">Imkoniyatlar</span>
            <h2 className="font-display text-4xl font-bold text-navy-900 mt-2 mb-4">
              Biznesingizni boshqarish uchun<br />kerak bo'lgan hamma narsa
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Yagona platforma orqali ERP, CRM va WMS tizimlarini bir joyda nazorat qiling.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color }) => {
              const Illus = FeatureIllustrations[title];
              return (
                <div key={title} className="card hover:shadow-card-hover transition-all duration-200 group overflow-hidden">
                  {Illus && <Illus />}
                  <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-navy-900 mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-navy-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Ko'proq <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-16">
            <span className="text-gold-600 text-sm font-semibold uppercase tracking-wider">Mijozlar fikri</span>
            <h2 className="font-display text-4xl font-bold text-navy-900 mt-2">
              Ular allaqachon ishonishdi
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, company, text, tier, rating }) => (
              <div key={name} className="card hover:shadow-card-hover transition-all">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center text-white font-bold text-sm">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-navy-900 text-sm">{name}</p>
                    <p className="text-gray-500 text-xs">{company}</p>
                  </div>
                  <span className={`ml-auto badge ${tierColors[tier]}`}>{tier}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-2xl mx-auto px-5 text-center">
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Hoziroq boshlang
          </h2>
          <p className="text-navy-300 text-lg mb-10">
            14 kun bepul sinab ko'ring. Karta shart emas.
          </p>
          <Link to="/login" className="btn-gold text-base px-8 py-3.5">
            Bepul ro'yxatdan o'tish <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-950 py-10 text-center text-navy-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Boxes className="w-4 h-4 text-gold-500" />
          <span className="font-display font-bold text-white">TekstilHub<span className="text-gold-400">.uz</span></span>
        </div>
        <p>© 2024 TekstilHub. Barcha huquqlar himoyalangan.</p>
        <p className="mt-1 text-navy-600">AWS Cloud · Toshkent, O'zbekiston</p>
      </footer>
    </div>
  );
}
