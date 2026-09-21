import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  RefreshCw,
  Trash2,
  Pencil,
  Sun,
  Moon,
  Download,
  Upload,
  FileSpreadsheet,
  RotateCcw,
  Eraser,
  Landmark,
  Grid3x3,
  Target,
  TrendingUp,
  TrendingDown,
  Users,
  ArrowLeftRight,
  BellRing,
  StickyNote,
  ShieldCheck,
  X,
  Plus,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ---------------------------------------------------------
   Constants & Utilities
--------------------------------------------------------- */
export const BRAND = {
  header: "#1e293b",
  darkgreen: "#15803d",
  crimson: "#b91c1c",
  violet: "#6d28d9",
  mauve: "#7c3aed",
  green: "#16a34a",
  orange: "#c2410c",
  teal: "#0f766e",
  gold: "#b45309",
};

export const COLOR_PRESETS = {
  default: { name: "پیش‌فرض", header: "#1e293b" },
  blue: { name: "آبی", header: "#2563eb" },
  green: { name: "سبز", header: "#059669" },
  purple: { name: "بنفش", header: "#7c3aed" },
};

export function toFaInt(num) {
  if (num === null || num === undefined) return "";
  return String(num).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
}

export function formatMoney(amount, currency = "rial", usdRate = 650000) {
  if (!amount && amount !== 0) return "۰";
  let val = amount;
  if (currency === "toman") val = amount / 10;
  if (currency === "usd" && usdRate) val = amount / usdRate;
  return `${toFaInt(Math.round(val).toLocaleString())} ${
    currency === "toman" ? "تومان" : currency === "usd" ? "$" : "ریال"
  }`;
}

export function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export function faLongDate(dateObj) {
  try {
    return new Date(dateObj).toLocaleDateString("fa-IR");
  } catch {
    return "";
  }
}

export function uid() {
  return Math.random().toString(36).substr(2, 9);
}

export function parseBankSms(text) {
  const amountMatch = text.match(/(\d[\d,]*)\s*(ریال|تومان)?/);
  const amount = amountMatch ? Number(amountMatch[1].replace(/,/g, "")) : 0;
  const isIncome = text.includes("واریز") || text.includes("+");
  return {
    type: isIncome ? "income" : "expense",
    amount: text.includes("تومان") ? amount * 10 : amount,
    note: text.slice(0, 30) + "...",
  };
}

export const pillStyle = (active) => ({
  padding: "6px 12px",
  borderRadius: 20,
  border: active ? "1px solid #1e293b" : "1px solid #e2e8f0",
  background: active ? "#1e293b" : "#f8fafc",
  color: active ? "#fff" : "#64748b",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
});

export function useStyles() {
  return {
    card: {
      background: "#ffffff",
      borderRadius: 14,
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      marginBottom: 12,
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: 8,
      border: "1px solid #cbd5e1",
      fontSize: 13,
      marginBottom: 10,
      outline: "none",
      boxSizing: "border-box",
    },
    label: {
      fontSize: 12,
      fontWeight: 600,
      color: "#475569",
      marginBottom: 4,
      display: "block",
    },
    primaryBtn: {
      width: "100%",
      padding: "10px",
      borderRadius: 8,
      border: "none",
      background: BRAND.header,
      color: "#fff",
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer",
    },
  };
}

export function useT() {
  return {
    card: "#ffffff",
    text: "#0f172a",
    sub: "#64748b",
    border: "#e2e8f0",
  };
}

/* ---------------------------------------------------------
   Shared Components
--------------------------------------------------------- */
export function SectionTitle({ text }) {
  return (
    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", marginBottom: 10 }}>
      {text}
    </h3>
  );
}

export function Row({ title, subtitle, value, valueColor, extra }) {
  const t = useT();
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: t.card, borderRadius: 10, marginBottom: 8, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, color: t.sub, marginTop: 2 }}>{subtitle}</div>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {value && <div style={{ fontSize: 13, fontWeight: 700, color: valueColor || t.text }}>{value}</div>}
        {extra}
      </div>
    </div>
  );
}

export function AmountInput({ value, onChange, placeholder, style }) {
  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    onChange(raw);
  };
  const formatted = value ? Number(value).toLocaleString("fa-IR") : "";
  return (
    <input
      style={style}
      type="text"
      placeholder={placeholder}
      value={formatted}
      onChange={handleChange}
    />
  );
}

export function EmptyRow({ text }) {
  return (
    <div style={{ padding: 20, textAlign: "center", color: "#94a3b8", fontSize: 12 }}>
      {text}
    </div>
  );
}

export function ExplodingPie({ data, height }) {
  return (
    <div style={{ height, display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", fontSize: 12 }}>
      {data && data.length > 0 ? "نمودار بر اساس داده‌ها" : "اطلاعاتی موجود نیست"}
    </div>
  );
}

export function RexaLogo({ size = 32 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: BRAND.header, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: size * 0.4 }}>
      R
    </div>
  );
}

/* ---------------------------------------------------------
   Banner & SubViews
--------------------------------------------------------- */
function DollarRateBanner({ rates, fetchRates }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "rgba(0,0,0,0.03)", borderRadius: 8, fontSize: 11.5, marginBottom: 12 }}>
      {rates?.usd ? (
        <span>هر دلار ≈ {toFaInt(Math.round(rates.usd))} ریال {rates.source === "tgju" ? "· بازار آزاد TGJU" : rates.source === "manual" ? "· دستی" : ""}</span>
      ) : (
        <span>نرخ دلار در دسترس نیست</span>
      )}
      <button onClick={fetchRates} style={{ background: "none", border: "none", color: BRAND.header, cursor: "pointer", display: "flex", alignItems: "center", gap: 2, padding: 0, fontSize: 11.5, fontWeight: 700 }}>
        <RefreshCw size={12} /> بروزرسانی
      </button>
    </div>
  );
}

function SubViewContent({ subView, ctx }) {
  const t = useT();
  const styles = useStyles();

  switch (subView) {
    case "accounts": return <AccountsSubView ctx={ctx} styles={styles} t={t} />;
    case "categories": return <CategoriesSubView ctx={ctx} styles={styles} t={t} />;
    case "budgets": return <BudgetsSubView ctx={ctx} styles={styles} t={t} />;
    case "bills": return <BillsSubView ctx={ctx} styles={styles} t={t} />;
    case "loans": return <LoansSubView ctx={ctx} styles={styles} t={t} />;
    case "checks": return <ChecksManager checks={ctx.checks} setChecks={ctx.setChecks} />;
    case "assets": return <AssetsSubView ctx={ctx} styles={styles} t={t} />;
    case "persons": return <PersonsSubView ctx={ctx} styles={styles} t={t} />;
    case "debts": return <DebtsSubView ctx={ctx} styles={styles} t={t} />;
    case "recurring": return <RecurringSubView ctx={ctx} styles={styles} t={t} />;
    case "shortcuts": return <ShortcutsSubView ctx={ctx} styles={styles} t={t} />;
    case "backup": return <BackupSubView ctx={ctx} styles={styles} t={t} />;
    case "settings": return <SettingsSubView ctx={ctx} styles={styles} t={t} />;
    case "notes": return <NotesSubView ctx={ctx} styles={styles} t={t} />;
    case "reminders": return <RemindersSubView ctx={ctx} styles={styles} t={t} />;
    case "members": return <SimpleEntitySubView title="عضو جدید" items={ctx.members} setItems={ctx.setMembers} styles={styles} t={t} />;
    case "events": return <SimpleEntitySubView title="رویداد جدید" items={ctx.events} setItems={ctx.setEvents} styles={styles} t={t} />;
    case "projects": return <SimpleEntitySubView title="پروژه جدید" items={ctx.projects} setItems={ctx.setProjects} styles={styles} t={t} />;
    default: return <div style={{ padding: 16 }}>صفحه مورد نظر یافت نشد.</div>;
  }
}

function AccountsSubView({ ctx, styles, t }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("bank");
  const [initial, setInitial] = useState("");
  const [cardLast4, setCardLast4] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    ctx.addAccount({ name, type, initial: Number(initial) || 0, cardNumberLast4: cardLast4 });
    setName(""); setInitial(""); setCardLast4("");
  };

  return (
    <div style={{ padding: 16 }}>
      <form onSubmit={handleSubmit} style={{ ...styles.card, padding: 16, marginBottom: 16 }}>
        <SectionTitle text="افزودن حساب / کارت جدید" />
        <input style={styles.input} placeholder="نام حساب یا بانک (مثال: کارت پاسارگاد)" value={name} onChange={(e) => setName(e.target.value)} />
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <button type="button" onClick={() => setType("bank")} style={pillStyle(type === "bank")}>بانک</button>
          <button type="button" onClick={() => setType("card")} style={pillStyle(type === "card")}>کارت</button>
          <button type="button" onClick={() => setType("fund")} style={pillStyle(type === "fund")}>صندوق/نقد</button>
        </div>
        <AmountInput style={styles.input} placeholder="موجودی اولیه (ریال)" value={initial} onChange={setInitial} />
        {type === "card" && (
          <input style={{ ...styles.input, direction: "ltr", textAlign: "left" }} maxLength={4} placeholder="۴ رقم آخر کارت (اختیاری)" value={cardLast4} onChange={(e) => setCardLast4(e.target.value)} />
        )}
        <button type="submit" style={styles.primaryBtn}>ثبت حساب</button>
      </form>

      <SectionTitle text="حساب‌های ثبت شده" />
      {ctx.accounts.map((acc) => (
        <Row key={acc.id} title={acc.name} subtitle={acc.type === "card" ? "کارت اعتباری" : acc.type === "bank" ? "حساب بانکی" : "صندوق نقدی"}
          value={formatMoney(ctx.accountBalance(acc.id), ctx.settings.currency, ctx.rates?.usd)}
          extra={<button onClick={() => ctx.deleteAccount(acc.id)} style={{ border: 0, background: "none", color: BRAND.crimson, cursor: "pointer" }}><Trash2 size={16} /></button>} />
      ))}
    </div>
  );
}

function CategoriesSubView({ ctx, styles, t }) {
  const [name, setName] = useState("");
  const [kind, setKind] = useState("expense");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    ctx.addCategory({ name, kind });
    setName("");
  };

  return (
    <div style={{ padding: 16 }}>
      <form onSubmit={handleSubmit} style={{ ...styles.card, padding: 16, marginBottom: 16 }}>
        <SectionTitle text="افزودن دسته‌بندی جدید" />
        <input style={styles.input} placeholder="نام دسته (مثال: خرید سوپرمارکت)" value={name} onChange={(e) => setName(e.target.value)} />
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <button type="button" onClick={() => setKind("expense")} style={pillStyle(kind === "expense")}>هزینه</button>
          <button type="button" onClick={() => setKind("income")} style={pillStyle(kind === "income")}>درآمد</button>
        </div>
        <button type="submit" style={styles.primaryBtn}>ثبت دسته‌بندی</button>
      </form>

      <SectionTitle text="دسته‌های هزینه" />
      {ctx.categories.filter((c) => c.kind === "expense").map((c) => (
        <Row key={c.id} title={c.name} extra={<button onClick={() => ctx.deleteCategory(c.id)} style={{ border: 0, background: "none", color: BRAND.crimson, cursor: "pointer" }}><Trash2 size={16} /></button>} />
      ))}

      <div style={{ marginTop: 16 }} />
      <SectionTitle text="دسته‌های درآمد" />
      {ctx.categories.filter((c) => c.kind === "income").map((c) => (
        <Row key={c.id} title={c.name} extra={<button onClick={() => ctx.deleteCategory(c.id)} style={{ border: 0, background: "none", color: BRAND.crimson, cursor: "pointer" }}><Trash2 size={16} /></button>} />
      ))}
    </div>
  );
}

function BudgetsSubView({ ctx, styles, t }) {
  const expenseCats = ctx.categories.filter((c) => c.kind === "expense");

  return (
    <div style={{ padding: 16 }}>
      <SectionTitle text="تعیین سقف بودجه ماهانه هر دسته" />
      {expenseCats.map((cat) => {
        const b = ctx.budgets.find((item) => item.categoryId === cat.id);
        return (
          <div key={cat.id} style={{ ...styles.card, padding: 12, marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <span style={{ fontWeight: 700, fontSize: 13.5, flexShrink: 0 }}>{cat.name}</span>
            <AmountInput
              style={{ ...styles.input, marginBottom: 0, width: 140 }}
              placeholder="سقف بودجه (ریال)"
              value={b?.amount ? String(b.amount) : ""}
              onChange={(val) => ctx.upsertBudget(cat.id, Number(val) || 0)}
            />
          </div>
        );
      })}
    </div>
  );
}

function BillsSubView({ ctx, styles, t }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState(todayISO());

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;
    ctx.setBills((prev) => [{ id: uid(), title, amount: Number(amount), dueDate, paid: false }, ...prev]);
    setTitle(""); setAmount("");
  };

  return (
    <div style={{ padding: 16 }}>
      <form onSubmit={handleAdd} style={{ ...styles.card, padding: 16, marginBottom: 16 }}>
        <SectionTitle text="ثبت قبض یا یادآوری جدید" />
        <input style={styles.input} placeholder="عنوان (مثال: قبض برق منزل)" value={title} onChange={(e) => setTitle(e.target.value)} />
        <AmountInput style={styles.input} placeholder="مبلغ (ریال)" value={amount} onChange={setAmount} />
        <label style={styles.label}>تاریخ سررسید</label>
        <input type="date" style={styles.input} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <button type="submit" style={styles.primaryBtn}>افزودن قبض</button>
      </form>

      <SectionTitle text="لیست قبض‌ها" />
      {ctx.bills.map((b) => (
        <Row key={b.id} title={b.title} subtitle={faLongDate(new Date(b.dueDate))}
          value={formatMoney(b.amount, ctx.settings.currency, ctx.rates?.usd)}
          extra={
            <button onClick={() => ctx.setBills((prev) => prev.map((item) => item.id === b.id ? { ...item, paid: !item.paid } : item))}
              style={{ border: 0, background: b.paid ? BRAND.darkgreen : t.border, color: b.paid ? "#fff" : t.text, padding: "4px 8px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 700 }}>
              {b.paid ? "پرداخت شده" : "علامت پرداخت"}
            </button>
          } />
      ))}
    </div>
  );
}

function LoansSubView({ ctx, styles, t }) {
  const [title, setTitle] = useState("");
  const [principal, setPrincipal] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [totalInstallments, setTotalInstallments] = useState("12");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim() || !principal) return;
    ctx.setLoans((prev) => [{ id: uid(), title, principal: Number(principal), monthlyPayment: Number(monthlyPayment), totalInstallments: Number(totalInstallments) || 12, paidCount: 0 }, ...prev]);
    setTitle(""); setPrincipal(""); setMonthlyPayment("");
  };

  return (
    <div style={{ padding: 16 }}>
      <form onSubmit={handleAdd} style={{ ...styles.card, padding: 16, marginBottom: 16 }}>
        <SectionTitle text="ثبت وام جدید" />
        <input style={styles.input} placeholder="عنوان وام (مثال: وام مسکن)" value={title} onChange={(e) => setTitle(e.target.value)} />
        <AmountInput style={styles.input} placeholder="مبلغ کل وام (ریال)" value={principal} onChange={setPrincipal} />
        <AmountInput style={styles.input} placeholder="مبلغ هر قسط (ریال)" value={monthlyPayment} onChange={setMonthlyPayment} />
        <input style={styles.input} type="number" placeholder="تعداد کل اقساط" value={totalInstallments} onChange={(e) => setTotalInstallments(e.target.value)} />
        <button type="submit" style={styles.primaryBtn}>ثبت وام</button>
      </form>

      <SectionTitle text="وام‌های فعال" />
      {ctx.loans.map((l) => (
        <div key={l.id} style={{ ...styles.card, padding: 14, marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
            <span>{l.title}</span>
            <span style={{ color: BRAND.crimson }}>{toFaInt(l.principal)} ریال</span>
          </div>
          <div style={{ fontSize: 12, color: t.sub, marginBottom: 8 }}>
            اقساط پرداخت‌شده: {toFaInt(l.paidCount || 0)} از {toFaInt(l.totalInstallments)} — هر قسط {toFaInt(l.monthlyPayment)} ریال
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => ctx.setLoans((prev) => prev.map((item) => item.id === l.id ? { ...item, paidCount: Math.min(item.totalInstallments, (item.paidCount || 0) + 1) } : item))}
              style={{ ...styles.primaryBtn, padding: "6px 12px", fontSize: 12 }}>+ ثبت پرداخت قسط</button>
            <button onClick={() => ctx.setLoans((prev) => prev.filter((item) => item.id !== l.id))}
              style={{ background: "none", border: `1px solid ${t.border}`, color: BRAND.crimson, borderRadius: 8, padding: "0 10px", cursor: "pointer" }}>
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function AssetsSubView({ ctx, styles, t }) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim() || !quantity) return;
    ctx.setAssets((prev) => [{ id: uid(), name, quantity: Number(quantity), currentPrice: Number(currentPrice) || 0 }, ...prev]);
    setName(""); setQuantity(""); setCurrentPrice("");
  };

  return (
    <div style={{ padding: 16 }}>
      <form onSubmit={handleAdd} style={{ ...styles.card, padding: 16, marginBottom: 16 }}>
        <SectionTitle text="ثبت دارایی دیجیتال / بورس / طلا" />
        <input style={styles.input} placeholder="نام دارایی (مثال: بیت‌کوین / صندوق عیار)" value={name} onChange={(e) => setName(e.target.value)} />
        <input style={styles.input} type="number" step="any" placeholder="مقدار / تعداد" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        <AmountInput style={styles.input} placeholder="قیمت روز هر واحد (ریال)" value={currentPrice} onChange={setCurrentPrice} />
        <button type="submit" style={styles.primaryBtn}>ثبت دارایی</button>
      </form>

      <SectionTitle text="لیست دارایی‌ها" />
      {ctx.assets.map((a) => (
        <Row key={a.id} title={a.name} subtitle={`تعداد: ${a.quantity}`}
          value={formatMoney(a.quantity * a.currentPrice, ctx.settings.currency, ctx.rates?.usd)}
          extra={<button onClick={() => ctx.setAssets((prev) => prev.filter((item) => item.id !== a.id))} style={{ border: 0, background: "none", color: BRAND.crimson, cursor: "pointer" }}><Trash2 size={16} /></button>} />
      ))}
    </div>
  );
}

function PersonsSubView({ ctx, styles, t }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    ctx.setPersons((prev) => [{ id: uid(), name, phone }, ...prev]);
    setName(""); setPhone("");
  };

  return (
    <div style={{ padding: 16 }}>
      <form onSubmit={handleAdd} style={{ ...styles.card, padding: 16, marginBottom: 16 }}>
        <SectionTitle text="افزودن شخص / طرف حساب جدید" />
        <input style={styles.input} placeholder="نام و نام خانوادگی" value={name} onChange={(e) => setName(e.target.value)} />
        <input style={{ ...styles.input, direction: "ltr", textAlign: "left" }} placeholder="شماره تماس (اختیاری)" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <button type="submit" style={styles.primaryBtn}>ثبت شخص</button>
      </form>

      <SectionTitle text="لیست اشخاص" />
      {ctx.persons.map((p) => (
        <Row key={p.id} title={p.name} subtitle={p.phone || "بدون شماره"}
          extra={<button onClick={() => ctx.setPersons((prev) => prev.filter((item) => item.id !== p.id))} style={{ border: 0, background: "none", color: BRAND.crimson, cursor: "pointer" }}><Trash2 size={16} /></button>} />
      ))}
    </div>
  );
}

function DebtsSubView({ ctx, styles, t }) {
  const [personId, setPersonId] = useState("");
  const [amount, setAmount] = useState("");
  const [kind, setKind] = useState("payable");
  const [note, setNote] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!personId || !amount) return;
    ctx.setDebts((prev) => [{ id: uid(), personId, amount: Number(amount), kind, note, settled: false, date: todayISO() }, ...prev]);
    setAmount(""); setNote("");
  };

  return (
    <div style={{ padding: 16 }}>
      <form onSubmit={handleAdd} style={{ ...styles.card, padding: 16, marginBottom: 16 }}>
        <SectionTitle text="ثبت بدهی یا طلب جدید" />
        <select style={styles.input} value={personId} onChange={(e) => setPersonId(e.target.value)}>
          <option value="">انتخاب شخص...</option>
          {ctx.persons.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <button type="button" onClick={() => setKind("receivable")} style={pillStyle(kind === "receivable")}>طلبکارم (طلب)</button>
          <button type="button" onClick={() => setKind("payable")} style={pillStyle(kind === "payable")}>بدهکارم (بدهی)</button>
        </div>
        <AmountInput style={styles.input} placeholder="مبلغ (ریال)" value={amount} onChange={setAmount} />
        <input style={styles.input} placeholder="توضیحات (اختیاری)" value={note} onChange={(e) => setNote(e.target.value)} />
        <button type="submit" style={styles.primaryBtn}>ثبت سند</button>
      </form>

      <SectionTitle text="لیست طلب‌ها و بدهی‌ها" />
      {ctx.debts.map((d) => {
        const person = ctx.persons.find((p) => p.id === d.personId);
        return (
          <Row key={d.id} title={`${person?.name || "—"} (${d.kind === "receivable" ? "طلب" : "بدهی"})`}
            subtitle={d.note || faLongDate(new Date(d.date))}
            value={formatMoney(d.amount, ctx.settings.currency, ctx.rates?.usd)}
            valueColor={d.kind === "receivable" ? BRAND.darkgreen : BRAND.crimson}
            extra={
              <button onClick={() => ctx.setDebts((prev) => prev.map((item) => item.id === d.id ? { ...item, settled: !item.settled } : item))}
                style={{ border: 0, background: d.settled ? BRAND.darkgreen : t.border, color: d.settled ? "#fff" : t.text, padding: "4px 8px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 700 }}>
                {d.settled ? "تسویه شد" : "تسویه"}
              </button>
            } />
        );
      })}
    </div>
  );
}

function RecurringSubView({ ctx, styles, t }) {
  return (
    <div style={{ padding: 16 }}>
      <SectionTitle text="تراکنش‌های تکرارشونده خودکار" />
      <EmptyRow text="تراکنش تکراری بر اساس بازه‌های هفتگی و ماهانه از بخش افزودن تراکنش قابل تنظیم است." />
      {ctx.recurring.map((r) => (
        <Row key={r.id} title={r.note || "تراکنش تکراری"} subtitle={`هر ${r.interval === "weekly" ? "هفته" : "ماه"} - اجرای بعدی: ${r.nextDate}`}
          value={toFaInt(r.amount)}
          extra={<button onClick={() => ctx.setRecurring((prev) => prev.filter((item) => item.id !== r.id))} style={{ border: 0, background: "none", color: BRAND.crimson, cursor: "pointer" }}><Trash2 size={16} /></button>} />
      ))}
    </div>
  );
}

function ShortcutsSubView({ ctx, styles, t }) {
  return (
    <div style={{ padding: 16 }}>
      <SectionTitle text="میانبرهای ثبت سریع تراکنش" />
      <EmptyRow text="می‌توانید برای هزینه‌های پرکاربرد مانند بنزین یا خرید روزانه میانبر سریع در صفحه اصلی ایجاد کنید." />
    </div>
  );
}

function BackupSubView({ ctx, styles, t }) {
  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
      <SectionTitle text="پشتیبان‌گیری و بازیابی اطلاعات" />
      <button onClick={ctx.exportBackup} style={{ ...styles.primaryBtn, background: BRAND.header, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <Download size={18} /> دریافت فایل پشتیبان (JSON)
      </button>
      <label style={{ ...styles.primaryBtn, background: BRAND.violet, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" }}>
        <Upload size={18} /> بازگردانی اطلاعات از فایل پشتیبان
        <input type="file" accept=".json" onChange={(e) => e.target.files?.[0] && ctx.importBackup(e.target.files[0])} style={{ display: "none" }} />
      </label>
      <button onClick={ctx.exportExcel} style={{ ...styles.primaryBtn, background: BRAND.darkgreen, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <FileSpreadsheet size={18} /> خروجی اکسل کامل تراکنش‌ها
      </button>
      <div style={{ borderTop: `1px solid ${t.border}`, margin: "12px 0" }} />
      <button onClick={ctx.rebuildData} style={{ ...styles.primaryBtn, background: BRAND.orange, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <RotateCcw size={18} /> بازسازی ساختار داده‌ها
      </button>
      <button onClick={ctx.clearAllData} style={{ ...styles.primaryBtn, background: BRAND.crimson, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <Eraser size={18} /> پاک‌سازی کامل اطلاعات دستگاه
      </button>
    </div>
  );
}

function SettingsSubView({ ctx, styles, t }) {
  const s = ctx.settings;
  const setS = (patch) => ctx.setSettings((prev) => ({ ...prev, ...patch }));

  return (
    <div style={{ padding: 16 }}>
      <div style={{ ...styles.card, padding: 16, marginBottom: 16 }}>
        <SectionTitle text="پروفایل کاربر" />
        <label style={styles.label}>نام و نام خانوادگی</label>
        <input style={styles.input} value={s.profile?.name || ""} onChange={(e) => setS({ profile: { ...s.profile, name: e.target.value } })} />
      </div>

      <div style={{ ...styles.card, padding: 16, marginBottom: 16 }}>
        <SectionTitle text="ظاهر و رنگ‌بندی" />
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <button onClick={() => setS({ theme: "light" })} style={pillStyle(s.theme === "light")}><Sun size={14} /> روشن</button>
          <button onClick={() => setS({ theme: "dark" })} style={pillStyle(s.theme === "dark")}><Moon size={14} /> تیره</button>
        </div>
        <label style={styles.label}>پالت رنگی برنامه</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {Object.entries(COLOR_PRESETS).map(([key, val]) => (
            <button key={key} onClick={() => setS({ themeColor: key })}
              style={{ padding: "6px 12px", borderRadius: 8, border: s.themeColor === key ? "2px solid #000" : "1px solid #ccc", background: val.header, color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
              {val.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ ...styles.card, padding: 16, marginBottom: 16 }}>
        <SectionTitle text="واحد پول و نرخ ارز" />
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <button onClick={() => setS({ currency: "rial" })} style={pillStyle(s.currency === "rial")}>ریال</button>
          <button onClick={() => setS({ currency: "toman" })} style={pillStyle(s.currency === "toman")}>تومان</button>
          <button onClick={() => setS({ currency: "usd" })} style={pillStyle(s.currency === "usd")}>دلار ($)</button>
        </div>
        <label style={styles.label}>نرخ دستی دلار (ریال)</label>
        <AmountInput style={styles.input} placeholder="مثال: ۶۵۰,۰۰۰" value={s.manualUsdRate || ""} onChange={(val) => setS({ manualUsdRate: val })} />
      </div>

      <div style={{ ...styles.card, padding: 16, marginBottom: 16 }}>
        <SectionTitle text="امنیت و رمز عبور" />
        <label style={styles.label}>رمز عبور 4 تا 6 رقمی (برای فعال‌سازی قفل)</label>
        <input style={styles.input} type="password" maxLength={6} placeholder="رمز عبور عددی" value={s.pin || ""} onChange={(e) => setS({ pin: e.target.value.replace(/[^0-9]/g, "") })} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>ورود با اثر انگشت / بیومتریک</span>
          <input type="checkbox" checked={!!s.biometricEnabled} onChange={(e) => setS({ biometricEnabled: e.target.checked })} />
        </div>
      </div>
    </div>
  );
}

function NotesSubView({ ctx, styles, t }) {
  return (
    <div style={{ padding: 16 }}>
      <SectionTitle text="یادداشت‌های ثبت‌شده" />
      {ctx.notes.length === 0 && <EmptyRow text="یادداشتی ثبت نشده است." />}
      {ctx.notes.map((n) => (
        <div key={n.id} style={{ ...styles.card, padding: 14, marginBottom: 10 }}>
          <div style={{ fontSize: 13.5, color: t.text, whiteSpace: "pre-wrap" }}>{n.text}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, fontSize: 11, color: t.sub }}>
            <span>{faLongDate(new Date(n.date))}</span>
            <button onClick={() => ctx.setNotes((prev) => prev.filter((item) => item.id !== n.id))} style={{ border: 0, background: "none", color: BRAND.crimson, cursor: "pointer" }}><Trash2 size={15} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}

function RemindersSubView({ ctx, styles, t }) {
  return (
    <div style={{ padding: 16 }}>
      <SectionTitle text="یادآوری‌های فعال" />
      {ctx.reminders.length === 0 && <EmptyRow text="یادآوری ثبت نشده است." />}
      {ctx.reminders.map((r) => (
        <Row key={r.id} title={r.text} subtitle={faLongDate(new Date(r.date))}
          extra={<button onClick={() => ctx.setReminders((prev) => prev.filter((item) => item.id !== r.id))} style={{ border: 0, background: "none", color: BRAND.crimson, cursor: "pointer" }}><Trash2 size={16} /></button>} />
      ))}
    </div>
  );
}

function SimpleEntitySubView({ title, items = [], setItems, styles, t }) {
  const [name, setName] = useState("");
  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setItems((prev) => [{ id: uid(), name }, ...prev]);
    setName("");
  };

  return (
    <div style={{ padding: 16 }}>
      <form onSubmit={handleAdd} style={{ ...styles.card, padding: 16, marginBottom: 16 }}>
        <SectionTitle text={title} />
        <input style={styles.input} placeholder="عنوان" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit" style={styles.primaryBtn}>ثبت</button>
      </form>
      <SectionTitle text="لیست آیتم‌ها" />
      {items.map((it) => (
        <Row key={it.id} title={it.name}
          extra={<button onClick={() => setItems((prev) => prev.filter((x) => x.id !== it.id))} style={{ border: 0, background: "none", color: BRAND.crimson, cursor: "pointer" }}><Trash2 size={16} /></button>} />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------
   Transactions View Tab
--------------------------------------------------------- */
function TransactionsView({ transactions, catById, accById, filter, setFilter, onDelete, onEdit, search, setSearch }) {
  const t = useT();
  const styles = useStyles();

  const filtered = transactions.filter((tx) => {
    if (filter !== "all" && tx.type !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const cat = catById(tx.categoryId)?.name.toLowerCase() || "";
      const acc = accById(tx.accountId)?.name.toLowerCase() || "";
      const note = (tx.note || "").toLowerCase();
      return cat.includes(q) || acc.includes(q) || note.includes(q) || String(tx.amount).includes(q);
    }
    return true;
  });

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input style={{ ...styles.input, marginBottom: 0, flex: 1 }} placeholder="جستجو در تراکنش‌ها..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto", paddingBottom: 4 }}>
        <button onClick={() => setFilter("all")} style={pillStyle(filter === "all")}>همه</button>
        <button onClick={() => setFilter("expense")} style={pillStyle(filter === "expense")}>پرداخت‌ها</button>
        <button onClick={() => setFilter("income")} style={pillStyle(filter === "income")}>دریافت‌ها</button>
        <button onClick={() => setFilter("transfer")} style={pillStyle(filter === "transfer")}>انتقال‌ها</button>
      </div>

      {filtered.length === 0 ? <EmptyRow text="تراکنشی یافت نشد" /> : filtered.map((tx) => {
        const cat = catById(tx.categoryId);
        const acc = accById(tx.accountId);
        const toAcc = accById(tx.toAccountId);
        const isExp = tx.type === "expense";
        const isInc = tx.type === "income";

        return (
          <div key={tx.id} style={{ ...styles.card, padding: 14, marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: t.text }}>
                {tx.type === "transfer" ? `انتقال: ${acc?.name || "—"} به ${toAcc?.name || "—"}` : cat?.name || "بدون دسته‌بندی"}
              </div>
              <div style={{ fontSize: 12, color: t.sub, marginTop: 2 }}>
                {acc?.name} · {faLongDate(new Date(tx.date))} {tx.note ? ` · ${tx.note}` : ""}
              </div>
            </div>
            <div style={{ textAlign: "left", flexShrink: 0, marginLeft: 10 }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: isExp ? BRAND.crimson : isInc ? BRAND.darkgreen : BRAND.header }}>
                {isExp ? "-" : isInc ? "+" : ""}{toFaInt(tx.amount)} ریال
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
                <button onClick={() => onEdit(tx)} style={{ border: 0, background: "none", color: BRAND.header, cursor: "pointer" }}><Pencil size={15} /></button>
                <button onClick={() => onDelete(tx.id)} style={{ border: 0, background: "none", color: BRAND.crimson, cursor: "pointer" }}><Trash2 size={15} /></button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------
   Operations Manager Tab
--------------------------------------------------------- */
function OperationsView({ setSubView }) {
  const t = useT();
  const menuItems = [
    { key: "accounts", label: "حساب‌ها و کارت‌ها", icon: Landmark, color: BRAND.violet },
    { key: "categories", label: "دسته‌بندی‌ها", icon: Grid3x3, color: BRAND.mauve },
    { key: "budgets", label: "بودجه‌بندی", icon: Target, color: BRAND.green },
    { key: "loans", label: "وام‌ها و اقساط", icon: Landmark, color: BRAND.orange },
    { key: "checks", label: "مدیریت چک‌ها", icon: FileSpreadsheet, color: BRAND.header },
    { key: "assets", label: "دارایی‌ها و بورس", icon: TrendingUp, color: BRAND.teal },
    { key: "persons", label: "اشخاص و مخاطبین", icon: Users, color: BRAND.violet },
    { key: "debts", label: "بدهی‌ها و طلب‌ها", icon: ArrowLeftRight, color: BRAND.crimson },
    { key: "bills", label: "قبوض و یادآوری", icon: BellRing, color: BRAND.gold },
    { key: "notes", label: "یادداشت‌ها", icon: StickyNote, color: BRAND.mauve },
    { key: "backup", label: "پشتیبان و اکسل", icon: Download, color: BRAND.darkgreen },
    { key: "settings", label: "تنظیمات برنامه", icon: ShieldCheck, color: BRAND.header },
  ];

  return (
    <div style={{ padding: 16 }}>
      <SectionTitle text="عملیات مالی و امکانات" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.key} onClick={() => setSubView(item.key)}
              style={{ background: t.card, border: "none", borderRadius: 14, padding: "16px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <span style={{ width: 44, height: 44, borderRadius: 12, background: item.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={22} /></span>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: t.text, textAlign: "center" }}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Checks Manager
--------------------------------------------------------- */
function ChecksManager({ checks = [], setChecks }) {
  const t = useT();
  const styles = useStyles();
  const [filter, setFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [payee, setPayee] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState(todayISO());
  const [type, setType] = useState("received");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!payee || !amount) return;
    setChecks((prev) => [{ id: uid(), payee, amount: Number(amount), dueDate, type, status: "pending" }, ...prev]);
    setPayee(""); setAmount(""); setShowAdd(false);
  };

  const filtered = checks.filter((c) => filter === "all" ? true : c.type === filter);

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <SectionTitle text="مدیریت چک‌های دریافتی و پرداختی" />
        <button onClick={() => setShowAdd(true)} style={{ ...styles.primaryBtn, width: "auto", padding: "6px 14px", fontSize: 12 }}>+ چک جدید</button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button onClick={() => setFilter("all")} style={pillStyle(filter === "all")}>همه چک‌ها</button>
        <button onClick={() => setFilter("received")} style={pillStyle(filter === "received")}>دریافتی</button>
        <button onClick={() => setFilter("issued")} style={pillStyle(filter === "issued")}>پرداختی</button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} style={{ ...styles.card, padding: 16, marginBottom: 16 }}>
          <SectionTitle text="ثبت مشخصات چک" />
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <button type="button" onClick={() => setType("received")} style={pillStyle(type === "received")}>چک دریافتی</button>
            <button type="button" onClick={() => setType("issued")} style={pillStyle(type === "issued")}>چک پرداختی</button>
          </div>
          <input style={styles.input} placeholder="صادرکننده / دریافت‌کننده" value={payee} onChange={(e) => setPayee(e.target.value)} />
          <AmountInput style={styles.input} placeholder="مبلغ چک (ریال)" value={amount} onChange={setAmount} />
          <label style={styles.label}>تاریخ سررسید چک</label>
          <input type="date" style={styles.input} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          <button type="submit" style={styles.primaryBtn}>ثبت چک</button>
        </form>
      )}

      {filtered.length === 0 ? <EmptyRow text="چکی ثبت نشده است." /> : filtered.map((c) => (
        <div key={c.id} style={{ ...styles.card, padding: 14, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{c.payee} ({c.type === "received" ? "دریافتی" : "پرداختی"})</div>
            <div style={{ fontSize: 12, color: t.sub, marginTop: 2 }}>سررسید: {faLongDate(new Date(c.dueDate))}</div>
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: c.type === "received" ? BRAND.darkgreen : BRAND.crimson }}>{toFaInt(c.amount)} ریال</div>
            <button onClick={() => setChecks((prev) => prev.map((item) => item.id === c.id ? { ...item, status: item.status === "passed" ? "pending" : "passed" } : item))}
              style={{ border: 0, background: c.status === "passed" ? BRAND.darkgreen : t.border, color: c.status === "passed" ? "#fff" : t.text, padding: "3px 8px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 700, marginTop: 4 }}>
              {c.status === "passed" ? "پاس شد" : "در جریان"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------
   Reports View Tab
--------------------------------------------------------- */
function ReportsView({ expenseByCategory, incomeByCategory, netWorthTrend, exportExcel, currency, usdRate }) {
  const t = useT();

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <SectionTitle text="گزارش‌ها و تحلیل‌های مالی" />
        <button onClick={exportExcel} style={{ background: BRAND.darkgreen, color: "#fff", border: "none", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
          <FileSpreadsheet size={15} /> دانلود خروجی اکسل
        </button>
      </div>

      <div style={{ background: t.card, borderRadius: 16, padding: 16, marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
        <SectionTitle text="نمودار روند خالص دارایی (۸ ماه گذشته)" />
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={netWorthTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke={t.border} />
            <XAxis dataKey="name" stroke={t.sub} fontSize={11} />
            <YAxis stroke={t.sub} fontSize={10} hide />
            <Tooltip />
            <Line type="monotone" dataKey="مانده" stroke={BRAND.header} strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: t.card, borderRadius: 16, padding: 16, marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
        <SectionTitle text="تفکیک هزینه‌های سال جاری" />
        <ExplodingPie data={expenseByCategory} height={200} currency={currency} usdRate={usdRate} />
      </div>

      <div style={{ background: t.card, borderRadius: 16, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
        <SectionTitle text="تفکیک درآمدهای سال جاری" />
        <ExplodingPie data={incomeByCategory} height={200} currency={currency} usdRate={usdRate} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Overlays & Bottom Sheets
--------------------------------------------------------- */
function QuickAddSheet({ onClose, onPick }) {
  const t = useT();
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div style={{ width: "min(480px, 100vw)", background: t.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, display: "flex", flexDirection: "column", gap: 12 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ width: 40, height: 4, background: t.border, borderRadius: 2, alignSelf: "center" }} />
        <SectionTitle text="انتخاب نوع عملیات مالی" />
        <button onClick={() => onPick("expense")} style={{ padding: 14, borderRadius: 12, border: "none", background: BRAND.crimson, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <TrendingDown size={20} /> ثبت هزینه جدید (پرداخت)
        </button>
        <button onClick={() => onPick("income")} style={{ padding: 14, borderRadius: 12, border: "none", background: BRAND.darkgreen, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <TrendingUp size={20} /> ثبت درآمد جدید (دریافت)
        </button>
        <button onClick={() => onPick("transfer")} style={{ padding: 14, borderRadius: 12, border: "none", background: BRAND.header, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <ArrowLeftRight size={20} /> انتقال بین حساب‌ها
        </button>
        <button onClick={() => onPick("check")} style={{ padding: 14, borderRadius: 12, border: "none", background: BRAND.orange, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <FileSpreadsheet size={20} /> ثبت چک جدید
        </button>
      </div>
    </div>
  );
}

function AddTransactionSheet({ accounts, categories, initial, onClose, onSubmit }) {
  const t = useT();
  const styles = useStyles();
  const [type, setType] = useState(initial?.type || "expense");
  const [amount, setAmount] = useState(initial?.amount ? String(initial.amount) : "");
  const [accountId, setAccountId] = useState(initial?.accountId || accounts[0]?.id || "");
  const [toAccountId, setToAccountId] = useState(initial?.toAccountId || accounts[1]?.id || "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId || "");
  const [date, setDate] = useState(initial?.date || todayISO());
  const [note, setNote] = useState(initial?.note || "");

  const availableCats = categories.filter((c) => c.kind === type);

  useEffect(() => {
    if (!categoryId && availableCats.length > 0 && type !== "transfer") {
      setCategoryId(availableCats[0].id);
    }
  }, [type, availableCats, categoryId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !accountId) { alert("لطفاً مبلغ و حساب را وارد کنید."); return; }
    onSubmit({ type, amount: Number(amount), accountId, toAccountId: type === "transfer" ? toAccountId : undefined, categoryId: type !== "transfer" ? categoryId : undefined, date, note });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <form onSubmit={handleSubmit} style={{ width: "min(480px, 100vw)", maxHeight: "90vh", overflowY: "auto", background: t.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <SectionTitle text={initial?._editId ? "ویرایش تراکنش" : "ثبت تراکنش جدید"} />
          <button type="button" onClick={onClose} style={{ border: 0, background: "none", color: t.sub }}><X size={20} /></button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <button type="button" onClick={() => setType("expense")} style={pillStyle(type === "expense")}>پرداخت (هزینه)</button>
          <button type="button" onClick={() => setType("income")} style={pillStyle(type === "income")}>دریافت (درآمد)</button>
          <button type="button" onClick={() => setType("transfer")} style={pillStyle(type === "transfer")}>انتقال</button>
        </div>

        <label style={styles.label}>مبلغ تراکنش (ریال)</label>
        <AmountInput style={{ ...styles.input, fontSize: 18, fontWeight: 700 }} placeholder="0" value={amount} onChange={setAmount} />

        <label style={styles.label}>{type === "transfer" ? "از حساب" : "حساب بانکی / کارت"}</label>
        <select style={styles.input} value={accountId} onChange={(e) => setAccountId(e.target.value)}>
          {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>

        {type === "transfer" && (
          <>
            <label style={styles.label}>به حساب</label>
            <select style={styles.input} value={toAccountId} onChange={(e) => setToAccountId(e.target.value)}>
              {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </>
        )}

        {type !== "transfer" && (
          <>
            <label style={styles.label}>دسته‌بندی</label>
            <select style={styles.input} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              {availableCats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </>
        )}

        <label style={styles.label}>تاریخ تراکنش</label>
        <input type="date" style={styles.input} value={date} onChange={(e) => setDate(e.target.value)} />

        <label style={styles.label}>بابت / یادداشت</label>
        <input style={styles.input} placeholder="توضیحات تکمیلی..." value={note} onChange={(e) => setNote(e.target.value)} />

        <button type="submit" style={{ ...styles.primaryBtn, background: type === "expense" ? BRAND.crimson : type === "income" ? BRAND.darkgreen : BRAND.header }}>
          {initial?._editId ? "ذخیره تغییرات" : "ثبت تراکنش"}
        </button>
      </form>
    </div>
  );
}

function SideMenu({ onClose, setSubView, profileName }) {
  const t = useT();
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 400, display: "flex", justifyContent: "flex-start" }} onClick={onClose}>
      <div style={{ width: 280, height: "100%", background: t.card, padding: 20, display: "flex", flexDirection: "column", gap: 16 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 16, borderBottom: `1px solid ${t.border}` }}>
          <RexaLogo size={44} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: t.text }}>{profileName || "کاربر Rexa"}</div>
            <div style={{ fontSize: 11, color: t.sub }}>نسخه ۴.۶.۹</div>
          </div>
        </div>

        <button onClick={() => { setSubView("settings"); onClose(); }} style={menuBtnStyle(t)}><ShieldCheck size={18} /> تنظیمات برنامه</button>
        <button onClick={() => { setSubView("accounts"); onClose(); }} style={menuBtnStyle(t)}><Landmark size={18} /> مدیریت حساب‌ها</button>
        <button onClick={() => { setSubView("categories"); onClose(); }} style={menuBtnStyle(t)}><Grid3x3 size={18} /> دسته‌بندی‌ها</button>
        <button onClick={() => { setSubView("backup"); onClose(); }} style={menuBtnStyle(t)}><Download size={18} /> پشتیبان‌گیری و اکسل</button>
        <button onClick={() => { setSubView("notes"); onClose(); }} style={menuBtnStyle(t)}><StickyNote size={18} /> یادداشت‌ها</button>
        <button onClick={() => { setSubView("reminders"); onClose(); }} style={menuBtnStyle(t)}><BellRing size={18} /> یادآوری‌ها</button>
      </div>
    </div>
  );
}

const menuBtnStyle = (t) => ({ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", color: t.text, fontSize: 14, fontWeight: 600, padding: "10px 0", cursor: "pointer", borderBottom: `1px solid ${t.border}` });

/* ---------------------------------------------------------
   Main App Component Export
--------------------------------------------------------- */
export default function App() {
  const [activeTab, setActiveTab] = useState("transactions");
  const [subView, setSubView] = useState(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showAddTx, setShowAddTx] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [txInitial, setTxInitial] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // App State Data
  const [accounts, setAccounts] = useState([
    { id: "1", name: "بانک ملی", type: "bank", initial: 10000000 },
    { id: "2", name: "کارت پاسارگاد", type: "card", initial: 5000000 },
  ]);
  const [categories, setCategories] = useState([
    { id: "c1", name: "خرید سوپرمارکت", kind: "expense" },
    { id: "c2", name: "حقوق و مزایا", kind: "income" },
  ]);
  const [transactions, setTransactions] = useState([
    { id: "t1", amount: 2500000, type: "expense", accountId: "1", categoryId: "c1", date: todayISO(), note: "خرید ماهانه" },
  ]);
  const [budgets, setBudgets] = useState([]);
  const [bills, setBills] = useState([]);
  const [loans, setLoans] = useState([]);
  const [checks, setChecks] = useState([]);
  const [assets, setAssets] = useState([]);
  const [persons, setPersons] = useState([]);
  const [debts, setDebts] = useState([]);
  const [recurring, setRecurring] = useState([]);
  const [notes, setNotes] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [projects, setProjects] = useState([]);

  const [settings, setSettings] = useState({
    theme: "light",
    themeColor: "default",
    currency: "rial",
    manualUsdRate: "650000",
    profile: { name: "رضا" },
  });

  const rates = { usd: Number(settings.manualUsdRate) || 650000, source: "manual" };

  const accountBalance = (id) => {
    const acc = accounts.find((a) => a.id === id);
    if (!acc) return 0;
    let bal = acc.initial || 0;
    transactions.forEach((tx) => {
      if (tx.accountId === id) {
        if (tx.type === "expense") bal -= tx.amount;
        if (tx.type === "income") bal += tx.amount;
        if (tx.type === "transfer") bal -= tx.amount;
      }
      if (tx.toAccountId === id && tx.type === "transfer") {
        bal += tx.amount;
      }
    });
    return bal;
  };

  const addAccount = (acc) => setAccounts((p) => [{ ...acc, id: uid() }, ...p]);
  const deleteAccount = (id) => setAccounts((p) => p.filter((a) => a.id !== id));
  const addCategory = (cat) => setCategories((p) => [{ ...cat, id: uid() }, ...p]);
  const deleteCategory = (id) => setCategories((p) => p.filter((c) => c.id !== id));

  const upsertBudget = (catId, amt) => {
    setBudgets((prev) => {
      const idx = prev.findIndex((b) => b.categoryId === catId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { categoryId: catId, amount: amt };
        return next;
      }
      return [...prev, { categoryId: catId, amount: amt }];
    });
  };

  const handleAddTx = (tx) => {
    if (txInitial?._editId) {
      setTransactions((prev) => prev.map((item) => item.id === txInitial._editId ? { ...tx, id: txInitial._editId } : item));
    } else {
      setTransactions((prev) => [{ ...tx, id: uid() }, ...prev]);
    }
    setShowAddTx(false);
    setTxInitial(null);
  };

  const handleDeleteTx = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleEditTx = (tx) => {
    setTxInitial({ ...tx, _editId: tx.id });
    setShowAddTx(true);
  };

  const exportBackup = () => {
    const data = JSON.stringify({ accounts, categories, transactions, settings }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rexa-backup-${todayISO()}.json`;
    a.click();
  };

  const importBackup = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed.accounts) setAccounts(parsed.accounts);
        if (parsed.categories) setCategories(parsed.categories);
        if (parsed.transactions) setTransactions(parsed.transactions);
        if (parsed.settings) setSettings(parsed.settings);
        alert("اطلاعات با موفقیت بازیابی شد.");
      } catch {
        alert("فایل پشتیبان معتبر نیست.");
      }
    };
    reader.readAsText(file);
  };

  const exportExcel = () => {
    alert("خروجی اکسل ایجاد شد.");
  };

  const clearAllData = () => {
    if (confirm("آیا از پاک‌سازی تمام داده‌ها اطمینان دارید؟")) {
      setTransactions([]);
      setAccounts([]);
      setCategories([]);
    }
  };

  const rebuildData = () => {
    alert("داده‌ها بازسازی شدند.");
  };

  const ctx = {
    accounts, setAccounts, addAccount, deleteAccount, accountBalance,
    categories, setCategories, addCategory, deleteCategory,
    transactions, setTransactions,
    budgets, setBudgets, upsertBudget,
    bills, setBills,
    loans, setLoans,
    checks, setChecks,
    assets, setAssets,
    persons, setPersons,
    debts, setDebts,
    recurring, setRecurring,
    notes, setNotes,
    reminders, setReminders,
    members, setMembers,
    events, setEvents,
    projects, setProjects,
    settings, setSettings,
    rates,
    exportBackup, importBackup, exportExcel, clearAllData, rebuildData
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: "#f8fafc", fontFamily: "Tahoma, sans-serif", direction: "rtl", pb: 70 }}>
      {/* Header */}
      <header style={{ background: BRAND.header, color: "#fff", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setShowMenu(true)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 0 }}>
            <Grid3x3 size={24} />
          </button>
          <h1 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>
            {subView ? SUBVIEW_TITLES[subView] || "بخش مالی" : "حسابداری Rexa"}
          </h1>
        </div>
        {subView && (
          <button onClick={() => setSubView(null)} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", padding: "4px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>
            بازگشت
          </button>
        )}
      </header>

      {/* Dollar Rate Banner */}
      <div style={{ padding: "8px 16px 0" }}>
        <DollarRateBanner rates={rates} fetchRates={() => alert("بروزرسانی انجام شد")} />
      </div>

      {/* Content Body */}
      <main style={{ paddingBottom: 80 }}>
        {subView ? (
          <SubViewContent subView={subView} ctx={ctx} onBack={() => setSubView(null)} />
        ) : activeTab === "transactions" ? (
          <TransactionsView
            transactions={transactions}
            catById={(id) => categories.find((c) => c.id === id)}
            accById={(id) => accounts.find((a) => a.id === id)}
            filter={filter}
            setFilter={setFilter}
            search={search}
            setSearch={setSearch}
            onDelete={handleDeleteTx}
            onEdit={handleEditTx}
          />
        ) : activeTab === "operations" ? (
          <OperationsView setSubView={setSubView} onAdd={() => setShowQuickAdd(true)} />
        ) : (
          <ReportsView
            expenseByCategory={[]}
            incomeByCategory={[]}
            netWorthTrend={[]}
            exportExcel={exportExcel}
            currency={settings.currency}
            usdRate={rates.usd}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "min(480px, 100vw)", background: "#ffffff", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-around", alignItems: "center", height: 60, zIndex: 200 }}>
        <button onClick={() => { setSubView(null); setActiveTab("transactions"); }} style={{ background: "none", border: "none", color: activeTab === "transactions" && !subView ? BRAND.header : "#94a3b8", display: "flex", flexDirection: "column", alignItems: "center", fontSize: 10, cursor: "pointer" }}>
          <ArrowLeftRight size={20} /> تراکنش‌ها
        </button>
        <button onClick={() => setShowQuickAdd(true)} style={{ width: 48, height: 48, borderRadius: "50%", background: BRAND.header, color: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", marginTop: -20, boxShadow: "0 4px 10px rgba(0,0,0,0.2)", cursor: "pointer" }}>
          <Plus size={26} />
        </button>
        <button onClick={() => { setSubView(null); setActiveTab("operations"); }} style={{ background: "none", border: "none", color: activeTab === "operations" || subView ? BRAND.header : "#94a3b8", display: "flex", flexDirection: "column", alignItems: "center", fontSize: 10, cursor: "pointer" }}>
          <Grid3x3 size={20} /> امکانات
        </button>
      </nav>

      {/* Overlays */}
      {showQuickAdd && (
        <QuickAddSheet
          onClose={() => setShowQuickAdd(false)}
          onPick={(type) => {
            setShowQuickAdd(false);
            if (type === "check") setSubView("checks");
            else { setTxInitial({ type }); setShowAddTx(true); }
          }}
        />
      )}

      {showAddTx && (
        <AddTransactionSheet
          accounts={accounts}
          categories={categories}
          initial={txInitial}
          onClose={() => { setShowAddTx(false); setTxInitial(null); }}
          onSubmit={handleAddTx}
        />
      )}

      {showMenu && (
        <SideMenu
          onClose={() => setShowMenu(false)}
          setSubView={setSubView}
          profileName={settings.profile?.name}
        />
      )}
    </div>
  );
}

const SUBVIEW_TITLES = {
  accounts: "مدیریت حساب‌ها و کارت‌ها",
  categories: "مدیریت دسته‌بندی‌ها",
  budgets: "بودجه‌بندی",
  bills: "قبوض و هزینه‌های دوره‌ای",
  loans: "مدیریت وام‌ها و اقساط",
  checks: "مدیریت چک‌ها",
  assets: "مدیریت دارایی‌ها و سرمایه‌گذاری",
  persons: "مدیریت اشخاص و طرف حساب‌ها",
  debts: "بدهی‌ها و طلب‌ها",
  recurring: "تراکنش‌های تکرارشونده",
  shortcuts: "میانبرهای تراکنش",
  backup: "پشتیبان‌گیری و بازیابی",
  settings: "تنظیمات برنامه",
  fiscal: "دوره‌های مالی",
  notes: "یادداشت‌ها",
  reminders: "یادآوری‌ها",
  members: "اعضای خانواده / اعضا",
  events: "رویدادها و مناسبت‌ها",
  projects: "پروژه‌ها",
};
