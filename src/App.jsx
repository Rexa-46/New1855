import React, { useState } from 'react';

// ==========================================
// ۱. ویجت آموزشی مکالمه روزانه انگلیسی (تکرار ثابت در طول روز)
// ==========================================
const DAILY_ENGLISH_CONVERSATIONS = [
  { en: "How's your day going so far?", fa: "امروزت تا الان چطور گذشته؟" },
  { en: "Could you please give me a hand with this?", fa: "میشه لطفاً در این کار به من کمک کنی؟" },
  { en: "That sounds like a great idea!", fa: "فکر خیلی خوبی به نظر میرسه!" },
  { en: "I'll let you know as soon as possible.", fa: "در اولین فرصت بهت خبر میدم." },
  { en: "Take your time, there's no rush.", fa: "عجله نکن، وقت داری." },
  { en: "What do you usually do in your free time?", fa: "معمولاً در وقت آزادت چکار میکنی؟" },
  { en: "I'm really looking forward to it.", fa: "واقعاً بی‌صبرانه منتظرشم." },
  { en: "Sorry to bother you, but I have a quick question.", fa: "بخشید مزاحمت میشم، ولی یه سوال کوتاه دارم." },
  { en: "Let's grab a cup of coffee sometime.", fa: "بیا یه وقت با هم یه قهوه بخوریم." },
  { en: "Everything is going according to plan.", fa: "همه چیز طبق برنامه پیش میره." }
];

function DailyEnglishWidget() {
  // محاسبه نمایه ثابت بر اساس روز سال برای ثبات پخش در یک روز مشخص
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const diff = today - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  const currentItem = DAILY_ENGLISH_CONVERSATIONS[dayOfYear % DAILY_ENGLISH_CONVERSATIONS.length];

  const playSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentItem.en);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("مرورگر شما از قابلیت خواندن صوتی پشتیبانی نمی‌کند.");
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-600 rounded-2xl p-4 text-white shadow-md my-4 relative overflow-hidden">
      <div className="flex items-center justify-between mb-2 border-b border-white/20 pb-2">
        <span className="text-xs font-bold tracking-wide uppercase bg-white/20 px-2.5 py-1 rounded-full flex items-center gap-1">
          🎓 مکالمه کاربردی امروز
        </span>
        <button 
          onClick={playSpeech}
          className="bg-white text-indigo-700 hover:bg-indigo-50 p-2 rounded-full shadow-md transition-transform active:scale-90 flex items-center justify-center"
          title="پخش تلفظ انگلیسی"
        >
          🔊
        </button>
      </div>
      <div className="space-y-1 text-left" dir="ltr">
        <p className="text-base font-bold text-amber-200 font-sans tracking-wide">
          "{currentItem.en}"
        </p>
        <p className="text-xs font-medium text-slate-100 text-right" dir="rtl">
          {currentItem.fa}
        </p>
      </div>
    </div>
  );
}

// ==========================================
// ۲. چارت صفحه اصلی و کارت‌های خلاصه درآمد/هزینه (شبیه تصویر دوم)
// ==========================================
function MainPieChartCard({ totalIncome = 38000000, totalExpense = 16650000 }) {
  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-4">
      {/* هدر تاریخ و ناوبری */}
      <div className="flex items-center justify-between text-indigo-900 font-bold text-sm mb-4">
        <button className="p-1 rounded-full hover:bg-gray-100 text-gray-400">❮</button>
        <span className="flex items-center gap-1">
          سررسیدهای، شنبه ۱۶ فروردین
        </span>
        <button className="p-1 rounded-full hover:bg-gray-100 text-gray-400">❯</button>
      </div>

      {/* چارت دایره‌ای ۵ تکه رنگی */}
      <div className="relative w-52 h-52 mx-auto my-2 flex items-center justify-center">
        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
          {/* بخش اول - بنفش */}
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 12.5 6.0" fill="none" stroke="#7c3aed" strokeWidth="8" />
          {/* بخش دوم - قرمز */}
          <path d="M30.5 8.0845 a 15.9155 15.9155 0 0 1 0 19.8" fill="none" stroke="#ef4444" strokeWidth="8" />
          {/* بخش سوم - آبی */}
          <path d="M30.5 27.8845 a 15.9155 15.9155 0 0 1 -17.5 3.5" fill="none" stroke="#0ea5e9" strokeWidth="8" />
          {/* بخش چهارم - سبز */}
          <path d="M13 31.3845 a 15.9155 15.9155 0 0 1 -10.5 -18" fill="none" stroke="#84cc16" strokeWidth="8" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white shadow-inner flex items-center justify-center text-xs text-gray-400">
            📊
          </div>
        </div>
      </div>

      {/* باکس‌های خلاصه درآمد و هزینه در پایین */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {/* جمع هزینه‌ها */}
        <div className="border-2 border-rose-400 rounded-2xl p-2.5 flex items-center justify-between bg-rose-50/20">
          <div className="text-right">
            <span className="text-xs font-bold text-gray-500 block">جمع هزینه‌ها</span>
            <span className="text-sm font-extrabold text-rose-600">
              {totalExpense.toLocaleString()} <span className="text-[10px] font-normal text-rose-500">تومان</span>
            </span>
          </div>
          <div className="w-7 h-7 rounded-full bg-rose-200 text-rose-600 flex items-center justify-center font-bold text-lg">
            -
          </div>
        </div>

        {/* جمع درآمدها */}
        <div className="border-2 border-gray-300 rounded-2xl p-2.5 flex items-center justify-between bg-gray-50/30">
          <div className="text-right">
            <span className="text-xs font-bold text-gray-500 block">جمع درآمدها</span>
            <span className="text-sm font-extrabold text-emerald-600">
              {totalIncome.toLocaleString()} <span className="text-[10px] font-normal text-emerald-500">تومان</span>
            </span>
          </div>
          <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-lg">
            +
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// ۳. میانبر تراکنش‌ها (شبیه تصویر سوم)
// ==========================================
function ShortcutsGrid() {
  const shortcuts = [
    { name: "قبض برق", icon: "🏠", bg: "bg-amber-100 text-amber-700" },
    { name: "قبض آب", icon: "🏠", bg: "bg-amber-100 text-amber-700" },
    { name: "حقوق ماهانه", icon: "💵", bg: "bg-cyan-100 text-cyan-700" },
    { name: "کرایه تاکسی", icon: "🚌", bg: "bg-amber-100 text-amber-700" },
    { name: "سوپر مارکت", icon: "🔔", bg: "bg-amber-100 text-amber-700" },
    { name: "خرید پوشاک", icon: "👕", bg: "bg-cyan-100 text-cyan-700" },
    { name: "اینترنت", icon: "🎭", bg: "bg-rose-100 text-rose-700" },
    { name: "کارمزد بانک", icon: "🏢", bg: "bg-purple-100 text-purple-700" },
    { name: "وام بانکی", icon: "📲", bg: "bg-rose-100 text-rose-700" },
    { name: "بازی و سرگرمی", icon: "🎭", bg: "bg-rose-100 text-rose-700" },
    { name: "بنزین", icon: "🚗", bg: "bg-amber-100 text-amber-700" },
    { name: "غذای بیرون", icon: "🔔", bg: "bg-amber-100 text-amber-700" },
    { name: "افزودن میانبر", icon: "➕", bg: "bg-cyan-100 text-cyan-700" },
    { name: "تعمیرات ساختمان", icon: "🏠", bg: "bg-amber-100 text-amber-700" },
    { name: "مهر (شهدا) ۶۴۱", icon: "✔️", bg: "bg-lime-200 text-lime-800", sub: "۹۷۰۰۵۰۴۱۱۹۱۱" },
  ];

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 my-4">
      {/* بنر هدر */}
      <div className="bg-rose-700 text-white p-3.5 flex items-center justify-between font-bold text-sm">
        <button className="text-white text-base">▲</button>
        <span>میانبر تراکنش ها</span>
      </div>

      {/* گرید آیکون‌ها */}
      <div className="grid grid-cols-4 gap-3 p-3 text-center">
        {shortcuts.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center text-2xl shadow-sm mb-1 cursor-pointer hover:opacity-80`}>
              {item.icon}
            </div>
            <span className="text-[11px] font-bold text-gray-700 leading-tight">
              {item.name}
            </span>
            {item.sub && (
              <span className="text-[9px] text-gray-400 font-sans block mt-0.5">
                {item.sub}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// ۴. بخش وام‌ها (شبیه تصویر چهارم)
// ==========================================
function LoansCardSection() {
  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 my-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
        <span className="text-xs text-gray-400 font-bold">۲ وام فعال</span>
        <span className="font-bold text-gray-800 text-sm">لیست وام‌ها</span>
      </div>
      
      {/* کارت وام نمونه */}
      <div className="bg-slate-50 rounded-2xl p-3 mb-2 border border-slate-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">در حال پرداخت</span>
          <span className="font-bold text-sm text-gray-700">وام مسکن</span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden my-2">
          <div className="bg-indigo-600 h-full w-2/3"></div>
        </div>
        <div className="flex justify-between text-[11px] text-gray-500 font-medium">
          <span>اقساط باقی‌مانده: ۱۲ قسط</span>
          <span>مبلغ قسط: ۲,۵۰۰,۰۰۰ تومان</span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// ۵. بخش گزارش بانک من (شبیه تصویر پنجم)
// ==========================================
function BankReportSection() {
  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 my-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
        <span className="text-xs text-indigo-600 font-bold cursor-pointer">مشاهده همه</span>
        <span className="font-bold text-gray-800 text-sm">گزارش بانک من</span>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-4 text-white shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs opacity-80">بانک ملی</span>
          <span className="font-bold text-sm">حساب اصلی</span>
        </div>
        <div className="text-left font-sans tracking-widest text-lg font-semibold mb-2" dir="ltr">
          ۶۰۳۷ **** **** ۱۲۳۴
        </div>
        <div className="flex justify-between items-end mt-2">
          <span className="text-xs opacity-90">موجودی:</span>
          <span className="text-base font-extrabold">۴۵,۲۰۰,۰۰۰ تومان</span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// کامپوننت اصلی برنامه (کامپوننت‌های بالا داخل چیدمان اصلی فراخوانی می‌شوند)
// ==========================================
export default function App() {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-100 p-3 font-sans pb-20" dir="rtl">
      {/* ویجت مکالمه روزانه انگلیسی */}
      <DailyEnglishWidget />

      {/* چارت دایره‌ای و باکس درآمد/هزینه */}
      <MainPieChartCard />

      {/* میانبر تراکنش‌ها */}
      <ShortcutsGrid />

      {/* گزارش بانک من */}
      <BankReportSection />

      {/* بخش وام‌ها */}
      <LoansCardSection />
    </div>
  );
}
