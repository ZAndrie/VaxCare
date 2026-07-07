import { useState, useMemo, useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  Users, Syringe, Calendar, Package, Bell, FileText, Home,
  ChevronRight, AlertTriangle, CheckCircle, Clock, TrendingUp,
  Search, Plus, X, Filter, Download, Eye, Edit2, Trash2,
  ShieldCheck, Activity, BarChart2, UserPlus, RefreshCw,
  ChevronDown, Thermometer,
  MapPin, Phone, Mail, LogOut, Settings, Menu,
  GitCommitHorizontal, HeartPulse, Star, Award, Layers, PrinterIcon
} from "lucide-react";

// ─── Auth ─────────────────────────────────────────────────────────────────────
type UserRole = "admin" | "worker" | "resident";

interface AuthUser {
  username: string;
  displayName: string;
  role: UserRole;
  residentId?: string;
  avatar: string;
  title: string;
}

const ACCOUNTS: { username: string; password: string; user: AuthUser }[] = [
  { username: "admin", password: "admin2025", user: { username: "admin", displayName: "Dr. Pedro Cruz", role: "admin", avatar: "P", title: "Barangay Health Officer" } },
  { username: "ana.reyes", password: "health123", user: { username: "ana.reyes", displayName: "RN Ana Reyes", role: "worker", avatar: "A", title: "Registered Nurse" } },
  { username: "luz.garcia", password: "health123", user: { username: "luz.garcia", displayName: "RN Luz Garcia", role: "worker", avatar: "L", title: "Registered Nurse" } },
  { username: "R001", password: "1990-03-15", user: { username: "R001", displayName: "Maria Santos", role: "resident", residentId: "R001", avatar: "M", title: "Resident" } },
  { username: "R002", password: "1979-07-22", user: { username: "R002", displayName: "Jose dela Cruz", role: "resident", residentId: "R002", avatar: "J", title: "Resident" } },
  { username: "R003", password: "1996-11-08", user: { username: "R003", displayName: "Ana Reyes", role: "resident", residentId: "R003", avatar: "A", title: "Resident" } },
  { username: "R006", password: "1969-08-14", user: { username: "R006", displayName: "Ramon Villanueva", role: "resident", residentId: "R006", avatar: "R", title: "Resident" } },
];

const ROLE_ACCESS: Record<UserRole, Module[]> = {
  admin: ["dashboard", "residents", "vaccinations", "schedule", "inventory", "reports", "portal", "notifications", "timeline", "family", "priority", "certificate", "batches"],
  worker: ["dashboard", "residents", "vaccinations", "schedule", "inventory", "reports", "portal", "notifications", "timeline", "family", "priority", "certificate", "batches"],
  resident: ["portal"],
};

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (user: AuthUser) => void }) {
  const [tab, setTab] = useState<"staff" | "resident">("staff");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const match = ACCOUNTS.find(a =>
        a.username.toLowerCase() === username.trim().toLowerCase() &&
        a.password === password &&
        (tab === "staff" ? a.user.role !== "resident" : a.user.role === "resident")
      );
      if (match) {
        onLogin(match.user);
      } else {
        setError(tab === "staff"
          ? "Invalid username or password."
          : "Resident ID or birthdate not found. Use format YYYY-MM-DD.");
      }
      setLoading(false);
    }, 600);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Syringe size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">VaxCare</h1>
          <p className="text-sm text-muted-foreground mt-1">Barangay Health Center Management System</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-border">
            <button onClick={() => { setTab("staff"); setError(""); setUsername(""); setPassword(""); }} className={`flex-1 py-3 text-sm font-semibold transition-colors ${tab === "staff" ? "text-primary border-b-2 border-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"}`}>
              Staff Login
            </button>
            <button onClick={() => { setTab("resident"); setError(""); setUsername(""); setPassword(""); }} className={`flex-1 py-3 text-sm font-semibold transition-colors ${tab === "resident" ? "text-primary border-b-2 border-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"}`}>
              Resident Login
            </button>
          </div>

          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                {tab === "staff" ? "Username" : "Resident ID"}
              </label>
              <input
                value={username}
                onChange={e => { setUsername(e.target.value); setError(""); }}
                placeholder={tab === "staff" ? "e.g. admin" : "e.g. R001"}
                autoComplete="username"
                className="w-full bg-input-background border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                {tab === "staff" ? "Password" : "Date of Birth (YYYY-MM-DD)"}
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  placeholder={tab === "staff" ? "••••••••" : "e.g. 1990-03-15"}
                  autoComplete="current-password"
                  className="w-full bg-input-background border border-border rounded-lg px-3.5 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
                <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <Eye size={14} />
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                <AlertTriangle size={13} className="text-red-500 shrink-0" />
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full bg-primary text-primary-foreground font-semibold text-sm py-2.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          VaxCare v1.0 · Barangay Health Center · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────
type Module ="dashboard" | "residents" | "vaccinations" | "schedule" | "inventory" | "reports" | "portal" | "notifications" | "timeline" | "family" | "priority" | "certificate" | "batches";

interface Resident {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female";
  birthdate: string;
  address: string;
  phone: string;
  purok: string;
  status: "Fully Vaccinated" | "Partially Vaccinated" | "Unvaccinated";
  vaccinations: VaccinationRecord[];
  nextDue: string | null;
}

interface VaccinationRecord {
  id: string;
  vaccine: string;
  dose: string;
  date: string;
  worker: string;
  batchNo: string;
  site: string;
}

interface VaccineStock {
  id: string;
  name: string;
  type: string;
  quantity: number;
  minStock: number;
  expiryDate: string;
  manufacturer: string;
  lastRestocked: string;
}

interface ScheduleItem {
  id: string;
  residentId: string;
  residentName: string;
  vaccine: string;
  dose: string;
  scheduledDate: string;
  status: "Upcoming" | "Completed" | "Missed" | "Rescheduled";
  worker: string;
  purok: string;
}

interface Notification {
  id: string;
  type: "alert" | "info" | "warning" | "success";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const RESIDENTS: Resident[] = [
  { id: "R001", name: "Maria Santos", age: 34, gender: "Female", birthdate: "1990-03-15", address: "123 Sampaguita St.", phone: "09171234567", purok: "Purok 1", status: "Fully Vaccinated", nextDue: null, vaccinations: [{ id: "V1", vaccine: "COVID-19 Bivalent", dose: "Booster", date: "2024-11-10", worker: "RN Ana Reyes", batchNo: "BV-2024-001", site: "Left Arm" }, { id: "V2", vaccine: "Influenza", dose: "Annual", date: "2025-03-05", worker: "RN Ana Reyes", batchNo: "FLU-2025-01", site: "Right Arm" }] },
  { id: "R002", name: "Jose dela Cruz", age: 45, gender: "Male", birthdate: "1979-07-22", address: "45 Rizal Ave.", phone: "09282345678", purok: "Purok 2", status: "Partially Vaccinated", nextDue: "2025-07-22", vaccinations: [{ id: "V3", vaccine: "COVID-19 Bivalent", dose: "1st Dose", date: "2025-01-15", worker: "RN Luz Garcia", batchNo: "BV-2025-003", site: "Left Arm" }] },
  { id: "R003", name: "Ana Reyes", age: 28, gender: "Female", birthdate: "1996-11-08", address: "78 Mabini Blvd.", phone: "09393456789", purok: "Purok 1", status: "Fully Vaccinated", nextDue: null, vaccinations: [{ id: "V4", vaccine: "HPV", dose: "1st Dose", date: "2024-09-20", worker: "Dr. Pedro Cruz", batchNo: "HPV-2024-05", site: "Right Arm" }, { id: "V5", vaccine: "HPV", dose: "2nd Dose", date: "2024-12-20", worker: "Dr. Pedro Cruz", batchNo: "HPV-2024-08", site: "Right Arm" }] },
  { id: "R004", name: "Carlos Mendoza", age: 62, gender: "Male", birthdate: "1962-05-30", address: "9 Aguinaldo Rd.", phone: "09504567890", purok: "Purok 3", status: "Partially Vaccinated", nextDue: "2025-08-15", vaccinations: [{ id: "V6", vaccine: "Pneumococcal", dose: "1st Dose", date: "2025-02-10", worker: "RN Luz Garcia", batchNo: "PNE-2025-02", site: "Left Arm" }] },
  { id: "R005", name: "Luisa Torres", age: 19, gender: "Female", birthdate: "2005-12-01", address: "56 Luna St.", phone: "09615678901", purok: "Purok 2", status: "Unvaccinated", nextDue: "2025-07-10", vaccinations: [] },
  { id: "R006", name: "Ramon Villanueva", age: 55, gender: "Male", birthdate: "1969-08-14", address: "32 Bonifacio St.", phone: "09726789012", purok: "Purok 4", status: "Fully Vaccinated", nextDue: null, vaccinations: [{ id: "V7", vaccine: "COVID-19 Bivalent", dose: "Booster", date: "2024-10-05", worker: "Dr. Pedro Cruz", batchNo: "BV-2024-002", site: "Left Arm" }, { id: "V8", vaccine: "Influenza", dose: "Annual", date: "2025-02-28", worker: "Dr. Pedro Cruz", batchNo: "FLU-2025-02", site: "Right Arm" }] },
  { id: "R007", name: "Gloria Aquino", age: 41, gender: "Female", birthdate: "1983-04-17", address: "11 Magsaysay Blvd.", phone: "09837890123", purok: "Purok 3", status: "Partially Vaccinated", nextDue: "2025-07-30", vaccinations: [{ id: "V9", vaccine: "Hepatitis B", dose: "1st Dose", date: "2025-04-30", worker: "RN Ana Reyes", batchNo: "HB-2025-01", site: "Right Arm" }] },
  { id: "R008", name: "Ernesto Lim", age: 70, gender: "Male", birthdate: "1954-01-23", address: "88 Quezon Ave.", phone: "09948901234", purok: "Purok 5", status: "Fully Vaccinated", nextDue: null, vaccinations: [{ id: "V10", vaccine: "COVID-19 Bivalent", dose: "Booster", date: "2025-01-08", worker: "RN Luz Garcia", batchNo: "BV-2025-001", site: "Left Arm" }, { id: "V11", vaccine: "Pneumococcal", dose: "Annual", date: "2025-03-15", worker: "RN Luz Garcia", batchNo: "PNE-2025-04", site: "Right Arm" }] },
  { id: "R009", name: "Precy Abad", age: 25, gender: "Female", birthdate: "2000-06-11", address: "22 Pasig Rd.", phone: "09159012345", purok: "Purok 1", status: "Unvaccinated", nextDue: "2025-07-15", vaccinations: [] },
  { id: "R010", name: "Roberto Castillo", age: 38, gender: "Male", birthdate: "1986-09-28", address: "67 Taft Ave.", phone: "09260123456", purok: "Purok 4", status: "Partially Vaccinated", nextDue: "2025-08-01", vaccinations: [{ id: "V12", vaccine: "COVID-19 Bivalent", dose: "1st Dose", date: "2025-03-20", worker: "Dr. Pedro Cruz", batchNo: "BV-2025-005", site: "Left Arm" }] },
];

const VACCINE_STOCK: VaccineStock[] = [
  { id: "VS001", name: "COVID-19 Bivalent", type: "mRNA", quantity: 145, minStock: 50, expiryDate: "2025-12-31", manufacturer: "Pfizer-BioNTech", lastRestocked: "2025-05-10" },
  { id: "VS002", name: "Influenza (Quadrivalent)", type: "Inactivated", quantity: 38, minStock: 40, expiryDate: "2025-10-15", manufacturer: "Sanofi Pasteur", lastRestocked: "2025-04-20" },
  { id: "VS003", name: "HPV (Cervarix)", type: "VLP", quantity: 62, minStock: 30, expiryDate: "2026-03-20", manufacturer: "GlaxoSmithKline", lastRestocked: "2025-03-05" },
  { id: "VS004", name: "Hepatitis B", type: "Recombinant", quantity: 15, minStock: 30, expiryDate: "2025-09-30", manufacturer: "Merck & Co.", lastRestocked: "2025-02-15" },
  { id: "VS005", name: "Pneumococcal (PCV13)", type: "Conjugate", quantity: 89, minStock: 25, expiryDate: "2026-01-10", manufacturer: "Pfizer", lastRestocked: "2025-05-01" },
  { id: "VS006", name: "Measles-Mumps-Rubella", type: "Live Attenuated", quantity: 74, minStock: 35, expiryDate: "2025-11-25", manufacturer: "Serum Institute", lastRestocked: "2025-04-12" },
  { id: "VS007", name: "Varicella", type: "Live Attenuated", quantity: 22, minStock: 20, expiryDate: "2025-08-14", manufacturer: "Merck & Co.", lastRestocked: "2025-01-30" },
];

const SCHEDULES: ScheduleItem[] = [
  { id: "S001", residentId: "R002", residentName: "Jose dela Cruz", vaccine: "COVID-19 Bivalent", dose: "2nd Dose", scheduledDate: "2025-07-22", status: "Upcoming", worker: "RN Ana Reyes", purok: "Purok 2" },
  { id: "S002", residentId: "R005", residentName: "Luisa Torres", vaccine: "COVID-19 Bivalent", dose: "1st Dose", scheduledDate: "2025-07-10", status: "Upcoming", worker: "RN Luz Garcia", purok: "Purok 2" },
  { id: "S003", residentId: "R009", residentName: "Precy Abad", vaccine: "HPV", dose: "1st Dose", scheduledDate: "2025-07-15", status: "Upcoming", worker: "Dr. Pedro Cruz", purok: "Purok 1" },
  { id: "S004", residentId: "R004", residentName: "Carlos Mendoza", vaccine: "Pneumococcal", dose: "2nd Dose", scheduledDate: "2025-08-15", status: "Upcoming", worker: "RN Ana Reyes", purok: "Purok 3" },
  { id: "S005", residentId: "R010", residentName: "Roberto Castillo", vaccine: "COVID-19 Bivalent", dose: "2nd Dose", scheduledDate: "2025-08-01", status: "Upcoming", worker: "Dr. Pedro Cruz", purok: "Purok 4" },
  { id: "S006", residentId: "R007", residentName: "Gloria Aquino", vaccine: "Hepatitis B", dose: "2nd Dose", scheduledDate: "2025-07-30", status: "Upcoming", worker: "RN Ana Reyes", purok: "Purok 3" },
  { id: "S007", residentId: "R001", residentName: "Maria Santos", vaccine: "Influenza", dose: "Annual", scheduledDate: "2025-06-10", status: "Missed", worker: "RN Luz Garcia", purok: "Purok 1" },
  { id: "S008", residentId: "R006", residentName: "Ramon Villanueva", vaccine: "Influenza", dose: "Annual", scheduledDate: "2025-06-05", status: "Completed", worker: "Dr. Pedro Cruz", purok: "Purok 4" },
];

const NOTIFICATIONS: Notification[] = [
  { id: "N001", type: "alert", title: "Critical Stock Level", message: "Hepatitis B vaccine has fallen below minimum stock threshold (15 remaining, minimum 30).", time: "2 min ago", read: false },
  { id: "N002", type: "warning", title: "Low Inventory Warning", message: "Influenza (Quadrivalent) stock is below minimum (38 remaining, minimum 40).", time: "1 hour ago", read: false },
  { id: "N003", type: "warning", title: "Missed Vaccination", message: "Maria Santos (R001) missed her scheduled Influenza vaccination on June 10, 2025.", time: "3 hours ago", read: false },
  { id: "N004", type: "info", title: "Upcoming Schedule", message: "5 residents have vaccinations scheduled in the next 7 days.", time: "5 hours ago", read: true },
  { id: "N005", type: "warning", title: "Near-Expiry Vaccine", message: "Varicella vaccine lot expires on August 14, 2025. Prioritize usage.", time: "1 day ago", read: true },
  { id: "N006", type: "success", title: "Stock Replenished", message: "COVID-19 Bivalent vaccines restocked: 145 doses available.", time: "2 days ago", read: true },
];

const MONTHLY_VAX_DATA = [
  { month: "Jan", vaccinations: 42, target: 50 },
  { month: "Feb", vaccinations: 58, target: 50 },
  { month: "Mar", vaccinations: 61, target: 55 },
  { month: "Apr", vaccinations: 49, target: 55 },
  { month: "May", vaccinations: 73, target: 60 },
  { month: "Jun", vaccinations: 38, target: 60 },
];

const VACCINE_DIST_DATA = [
  { name: "COVID-19", doses: 145 },
  { name: "Influenza", doses: 38 },
  { name: "HPV", doses: 62 },
  { name: "Hep B", doses: 15 },
  { name: "PCV13", doses: 89 },
  { name: "MMR", doses: 74 },
  { name: "Varicella", doses: 22 },
];

// ─── Utility helpers ──────────────────────────────────────────────────────────
const statusColor: Record<string, string> = {
  "Fully Vaccinated": "bg-emerald-100 text-emerald-700",
  "Partially Vaccinated": "bg-amber-100 text-amber-700",
  "Unvaccinated": "bg-red-100 text-red-600",
  "Upcoming": "bg-blue-100 text-blue-700",
  "Completed": "bg-emerald-100 text-emerald-700",
  "Missed": "bg-red-100 text-red-600",
  "Rescheduled": "bg-purple-100 text-purple-700",
};

const notifIcon: Record<string, JSX.Element> = {
  alert: <AlertTriangle size={14} className="text-red-500" />,
  warning: <AlertTriangle size={14} className="text-amber-500" />,
  info: <Bell size={14} className="text-blue-500" />,
  success: <CheckCircle size={14} className="text-emerald-500" />,
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string | number; sub?: string; trend?: number; color: string }) {
  return (
    <div className="bg-card rounded-lg border border-border p-6 flex items-center gap-4">
      <div className={`p-3 rounded-full ${color} shrink-0`}>{icon}</div>
      <div>
        <p className="text-3xl font-bold text-foreground leading-none">{value}</p>
        <p className="text-sm font-medium text-foreground mt-1.5">{label}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ residents, stock, schedules, notifications, setModule }: {
  residents: Resident[]; stock: VaccineStock[]; schedules: ScheduleItem[]; notifications: Notification[]; setModule: (m: Module) => void;
}) {
  const fullyVax = residents.filter(r => r.status === "Fully Vaccinated").length;
  const partial = residents.filter(r => r.status === "Partially Vaccinated").length;
  const unvax = residents.filter(r => r.status === "Unvaccinated").length;
  const lowStock = stock.filter(s => s.quantity <= s.minStock).length;
  const missed = schedules.filter(s => s.status === "Missed").length;
  const upcoming = schedules.filter(s => s.status === "Upcoming").length;
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {unread > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:bg-amber-100 transition-colors" onClick={() => setModule("notifications")}>
          <AlertTriangle size={18} className="text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800">{unread} alert{unread > 1 ? "s" : ""} need your attention — {lowStock} low-stock warning{lowStock !== 1 ? "s" : ""}, {missed} missed vaccination{missed !== 1 ? "s" : ""}</p>
          <ChevronRight size={16} className="text-amber-600 ml-auto shrink-0" />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<Users size={20} className="text-teal-700" />} label="Total Residents" value={residents.length} sub="Registered in system" color="bg-teal-50" />
        <StatCard icon={<ShieldCheck size={20} className="text-emerald-700" />} label="Fully Vaccinated" value={fullyVax} sub={`${Math.round(fullyVax / residents.length * 100)}% coverage rate`} color="bg-emerald-50" />
        <StatCard icon={<Calendar size={20} className="text-blue-700" />} label="Upcoming Schedules" value={upcoming} sub="Next 30 days" color="bg-blue-50" />
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-base font-semibold text-foreground mb-5">Monthly Vaccinations vs. Target</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={MONTHLY_VAX_DATA} barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4EAED" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 13, fill: "#5E7A8A" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 13, fill: "#5E7A8A" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13, border: "1px solid #E4EAED" }} />
            <Bar dataKey="vaccinations" fill="#0B7065" radius={[4, 4, 0, 0]} name="Administered" />
            <Bar dataKey="target" fill="#E4F2F0" radius={[4, 4, 0, 0]} name="Target" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-card rounded-lg border border-border p-6">
          <SectionHeader title="Upcoming Schedules" action={
            <button onClick={() => setModule("schedule")} className="text-sm text-primary font-medium hover:underline">View all</button>
          } />
          <div className="space-y-3">
            {schedules.filter(s => s.status === "Upcoming").slice(0, 4).map(s => (
              <div key={s.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{s.residentName.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.residentName}</p>
                    <p className="text-sm text-muted-foreground">{s.vaccine} · {s.dose}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground">{new Date(s.scheduledDate).toLocaleDateString("en-PH", { month: "short", day: "numeric" })}</p>
                  <p className="text-sm text-muted-foreground">{s.purok}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <SectionHeader title="Vaccine Inventory" action={
            <button onClick={() => setModule("inventory")} className="text-sm text-primary font-medium hover:underline">Manage</button>
          } />
          <div className="space-y-4">
            {stock.map(v => {
              const pct = Math.min(100, Math.round(v.quantity / (v.minStock * 3) * 100));
              const isCritical = v.quantity < v.minStock;
              const isLow = v.quantity <= v.minStock * 1.2;
              return (
                <div key={v.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-foreground">{v.name}</span>
                    <span className={`text-sm ${isCritical ? "text-red-600 font-semibold" : isLow ? "text-amber-600" : "text-muted-foreground"}`}>{v.quantity} doses</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${isCritical ? "bg-red-500" : isLow ? "bg-amber-400" : "bg-primary"}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Residents ────────────────────────────────────────────────────────────────
function ResidentsModule({ residents, setResidents }: { residents: Resident[]; setResidents: (r: Resident[]) => void }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("All");
  const [selected, setSelected] = useState<Resident | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", age: "", gender: "Female" as "Male" | "Female", birthdate: "", address: "", phone: "", purok: "Purok 1" });

  const filtered = useMemo(() =>
    residents.filter(r =>
      (filter === "All" || r.status === filter) &&
      (r.name.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()))
    ), [residents, search, filter]);

  function addResident() {
    if (!form.name || !form.birthdate) return;
    const newR: Resident = { id: `R${String(residents.length + 1).padStart(3, "0")}`, name: form.name, age: Number(form.age) || 0, gender: form.gender, birthdate: form.birthdate, address: form.address, phone: form.phone, purok: form.purok, status: "Unvaccinated", nextDue: null, vaccinations: [] };
    setResidents([...residents, newR]);
    setShowAdd(false);
    setForm({ name: "", age: "", gender: "Female", birthdate: "", address: "", phone: "", purok: "Purok 1" });
  }

  return (
    <div>
      <SectionHeader title="Resident Health Profiles" subtitle={`${residents.length} registered residents`} action={
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors">
          <UserPlus size={14} /> Register Resident
        </button>
      } />

      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-semibold text-foreground">Register New Resident</h3>
              <button onClick={() => setShowAdd(false)} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              {[["Full Name", "name", "text"], ["Date of Birth", "birthdate", "date"], ["Age", "age", "number"], ["Address", "address", "text"], ["Phone", "phone", "tel"]].map(([label, key, type]) => (
                <div key={key}>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">{label}</label>
                  <input type={type} value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Gender</label>
                  <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value as "Male" | "Female" }))} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none">
                    <option>Female</option><option>Male</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Purok</label>
                  <select value={form.purok} onChange={e => setForm(f => ({ ...f, purok: e.target.value }))} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none">
                    {["Purok 1", "Purok 2", "Purok 3", "Purok 4", "Purok 5"].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-5 border-t border-border">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm rounded-md border border-border text-foreground hover:bg-muted transition-colors">Cancel</button>
              <button onClick={addResident} className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">Register</button>
            </div>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card">
              <div>
                <h3 className="font-semibold text-foreground">{selected.name}</h3>
                <p className="text-xs text-muted-foreground">{selected.id} · {selected.purok}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[["Age", selected.age + " years"], ["Gender", selected.gender], ["Birthdate", selected.birthdate], ["Phone", selected.phone], ["Address", selected.address, 2]].map(([k, v, span]) => (
                  <div key={k as string} className={span === 2 ? "col-span-2" : ""}>
                    <p className="text-xs text-muted-foreground">{k}</p>
                    <p className="text-sm font-medium text-foreground">{v}</p>
                  </div>
                ))}
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge className={statusColor[selected.status]}>{selected.status}</Badge>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Vaccination History</h4>
                {selected.vaccinations.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No vaccinations recorded.</p>
                ) : (
                  <div className="space-y-2">
                    {selected.vaccinations.map(v => (
                      <div key={v.id} className="bg-muted rounded-md p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">{v.vaccine}</span>
                          <span className="text-xs font-mono text-muted-foreground">{v.date}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{v.dose} · {v.site} · Batch: {v.batchNo}</p>
                        <p className="text-xs text-muted-foreground">Administered by: {v.worker}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or ID…" className="w-full bg-card border border-border rounded-md pl-9 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Fully Vaccinated", "Partially Vaccinated", "Unvaccinated"].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {["ID", "Name", "Age", "Gender", "Purok", "Contact", "Status", "Next Due", "Actions"].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">{h !== "Actions" ? h : ""}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{r.id}</td>
                <td className="px-4 py-2.5 font-medium text-foreground">{r.name}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{r.age}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{r.gender}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{r.purok}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{r.phone || "—"}</td>
                <td className="px-4 py-2.5"><Badge className={statusColor[r.status]}>{r.status}</Badge></td>
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{r.nextDue || "—"}</td>
                <td className="px-4 py-2.5">
                  <button onClick={() => setSelected(r)} className="p-1 text-muted-foreground hover:text-primary transition-colors"><Eye size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Vaccinations ─────────────────────────────────────────────────────────────
function VaccinationsModule({ residents, setResidents, stock }: { residents: Resident[]; setResidents: (r: Resident[]) => void; stock: VaccineStock[] }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ residentId: "", vaccine: "", dose: "", date: new Date().toISOString().split("T")[0], worker: "RN Ana Reyes", batchNo: "", site: "Left Arm" });
  const [search, setSearch] = useState("");

  const allRecords = useMemo(() =>
    residents.flatMap(r => r.vaccinations.map(v => ({ ...v, residentName: r.name, residentId: r.id, residentPurok: r.purok }))),
    [residents]
  ).filter(r => r.residentName.toLowerCase().includes(search.toLowerCase()) || r.vaccine.toLowerCase().includes(search.toLowerCase()));

  function recordVaccination() {
    if (!form.residentId || !form.vaccine || !form.dose) return;
    const newRec: VaccinationRecord = { id: `V${Date.now()}`, vaccine: form.vaccine, dose: form.dose, date: form.date, worker: form.worker, batchNo: form.batchNo, site: form.site };
    const updated = residents.map(r => {
      if (r.id !== form.residentId) return r;
      const vaxList = [...r.vaccinations, newRec];
      const status: Resident["status"] = vaxList.length >= 2 ? "Fully Vaccinated" : "Partially Vaccinated";
      return { ...r, vaccinations: vaxList, status };
    });
    setResidents(updated);
    setShowForm(false);
    setForm(f => ({ ...f, residentId: "", vaccine: "", dose: "", batchNo: "" }));
  }

  return (
    <div>
      <SectionHeader title="Vaccination Records" subtitle="Record and view all vaccination administrations" action={
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors">
          <Plus size={14} /> Record Vaccination
        </button>
      } />

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-semibold text-foreground">Record Vaccination</h3>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Resident</label>
                <select value={form.residentId} onChange={e => setForm(f => ({ ...f, residentId: e.target.value }))} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none">
                  <option value="">Select resident…</option>
                  {residents.map(r => <option key={r.id} value={r.id}>{r.name} ({r.id})</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Vaccine</label>
                <select value={form.vaccine} onChange={e => setForm(f => ({ ...f, vaccine: e.target.value }))} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none">
                  <option value="">Select vaccine…</option>
                  {stock.map(s => <option key={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Dose</label>
                  <select value={form.dose} onChange={e => setForm(f => ({ ...f, dose: e.target.value }))} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none">
                    <option value="">Select…</option>
                    {["1st Dose", "2nd Dose", "3rd Dose", "Booster", "Annual"].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Date</label>
                  <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Site</label>
                  <select value={form.site} onChange={e => setForm(f => ({ ...f, site: e.target.value }))} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none">
                    {["Left Arm", "Right Arm", "Left Thigh", "Right Thigh"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Batch No.</label>
                  <input value={form.batchNo} onChange={e => setForm(f => ({ ...f, batchNo: e.target.value }))} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none" placeholder="e.g. BV-2025-001" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Health Worker</label>
                <select value={form.worker} onChange={e => setForm(f => ({ ...f, worker: e.target.value }))} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none">
                  {["RN Ana Reyes", "RN Luz Garcia", "Dr. Pedro Cruz"].map(w => <option key={w}>{w}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-5 border-t border-border">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm rounded-md border border-border text-foreground hover:bg-muted">Cancel</button>
              <button onClick={recordVaccination} className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90">Record</button>
            </div>
          </div>
        </div>
      )}

      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by resident or vaccine…" className="w-full bg-card border border-border rounded-md pl-9 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {["Resident", "Vaccine", "Dose", "Date", "Site", "Batch No.", "Administered By"].map((h, i) => (
                <th key={`vax-h-${i}`} className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allRecords.slice(0, 20).map(r => (
              <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-2.5">
                  <p className="font-medium text-foreground">{r.residentName}</p>
                  <p className="text-xs text-muted-foreground font-mono">{r.residentId}</p>
                </td>
                <td className="px-4 py-2.5 text-foreground">{r.vaccine}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{r.dose}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{r.date}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{r.site}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{r.batchNo}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{r.worker}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Schedule ─────────────────────────────────────────────────────────────────
function ScheduleModule({ schedules, setSchedules, residents }: { schedules: ScheduleItem[]; setSchedules: (s: ScheduleItem[]) => void; residents: Resident[] }) {
  const [filter, setFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ residentId: "", vaccine: "", dose: "1st Dose", date: "", worker: "RN Ana Reyes" });

  const filtered = filter === "All" ? schedules : schedules.filter(s => s.status === filter);

  function addSchedule() {
    if (!form.residentId || !form.vaccine || !form.date) return;
    const resident = residents.find(r => r.id === form.residentId);
    if (!resident) return;
    const newS: ScheduleItem = { id: `S${Date.now()}`, residentId: form.residentId, residentName: resident.name, vaccine: form.vaccine, dose: form.dose, scheduledDate: form.date, status: "Upcoming", worker: form.worker, purok: resident.purok };
    setSchedules([...schedules, newS]);
    setShowAdd(false);
    setForm(f => ({ ...f, residentId: "", vaccine: "", date: "" }));
  }

  function markMissed(id: string) {
    setSchedules(schedules.map(s => s.id === id ? { ...s, status: "Missed" as const } : s));
  }
  function markCompleted(id: string) {
    setSchedules(schedules.map(s => s.id === id ? { ...s, status: "Completed" as const } : s));
  }

  const missed = schedules.filter(s => s.status === "Missed");

  return (
    <div>
      <SectionHeader title="Vaccination Scheduling" subtitle="Manage and track all scheduled vaccinations" action={
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors">
          <Plus size={14} /> New Schedule
        </button>
      } />

      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-semibold text-foreground">Schedule Vaccination</h3>
              <button onClick={() => setShowAdd(false)} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              {[["Resident", "residentId", "select-resident"], ["Vaccine", "vaccine", "select-vaccine"], ["Dose", "dose", "select-dose"], ["Date", "date", "date"], ["Health Worker", "worker", "select-worker"]].map(([label, key, type]) => (
                <div key={key}>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">{label}</label>
                  {type === "select-resident" ? (
                    <select value={form.residentId} onChange={e => setForm(f => ({ ...f, residentId: e.target.value }))} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none">
                      <option value="">Select…</option>{residents.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  ) : type === "select-vaccine" ? (
                    <select value={form.vaccine} onChange={e => setForm(f => ({ ...f, vaccine: e.target.value }))} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none">
                      <option value="">Select…</option>{["COVID-19 Bivalent", "Influenza", "HPV", "Hepatitis B", "Pneumococcal", "MMR", "Varicella"].map(v => <option key={v}>{v}</option>)}
                    </select>
                  ) : type === "select-dose" ? (
                    <select value={form.dose} onChange={e => setForm(f => ({ ...f, dose: e.target.value }))} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none">
                      {["1st Dose", "2nd Dose", "3rd Dose", "Booster", "Annual"].map(d => <option key={d}>{d}</option>)}
                    </select>
                  ) : type === "select-worker" ? (
                    <select value={form.worker} onChange={e => setForm(f => ({ ...f, worker: e.target.value }))} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none">
                      {["RN Ana Reyes", "RN Luz Garcia", "Dr. Pedro Cruz"].map(w => <option key={w}>{w}</option>)}
                    </select>
                  ) : (
                    <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 p-5 border-t border-border">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm rounded-md border border-border text-foreground hover:bg-muted">Cancel</button>
              <button onClick={addSchedule} className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90">Schedule</button>
            </div>
          </div>
        </div>
      )}

      {missed.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} className="text-red-500" />
            <h4 className="text-sm font-semibold text-red-700">Missed Vaccinations ({missed.length})</h4>
          </div>
          <div className="space-y-1.5">
            {missed.map(s => (
              <div key={s.id} className="flex items-center justify-between text-xs text-red-700 bg-red-100/60 rounded px-3 py-2">
                <span>{s.residentName} — {s.vaccine} {s.dose}</span>
                <span className="font-mono">{s.scheduledDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-4 flex-wrap">
        {["All", "Upcoming", "Completed", "Missed", "Rescheduled"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>{f}</button>
        ))}
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {["Resident", "Vaccine", "Dose", "Scheduled Date", "Health Worker", "Purok", "Status", "Actions"].map((h, i) => (
                <th key={`sched-h-${i}`} className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-2.5 font-medium text-foreground">{s.residentName}</td>
                <td className="px-4 py-2.5 text-foreground">{s.vaccine}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{s.dose}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-foreground">{s.scheduledDate}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{s.worker}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{s.purok}</td>
                <td className="px-4 py-2.5"><Badge className={statusColor[s.status]}>{s.status}</Badge></td>
                <td className="px-4 py-2.5">
                  {s.status === "Upcoming" && (
                    <div className="flex gap-1">
                      <button onClick={() => markCompleted(s.id)} className="p-1 text-emerald-600 hover:text-emerald-700 transition-colors" title="Mark completed"><CheckCircle size={14} /></button>
                      <button onClick={() => markMissed(s.id)} className="p-1 text-red-500 hover:text-red-600 transition-colors" title="Mark missed"><X size={14} /></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Inventory ────────────────────────────────────────────────────────────────
function InventoryModule({ stock, setStock }: { stock: VaccineStock[]; setStock: (s: VaccineStock[]) => void }) {
  const [showRestock, setShowRestock] = useState<string | null>(null);
  const [restockQty, setRestockQty] = useState("50");

  function restock(id: string) {
    setStock(stock.map(s => s.id === id ? { ...s, quantity: s.quantity + Number(restockQty), lastRestocked: new Date().toISOString().split("T")[0] } : s));
    setShowRestock(null);
    setRestockQty("50");
  }

  const critical = stock.filter(s => s.quantity < s.minStock);
  const low = stock.filter(s => s.quantity >= s.minStock && s.quantity <= s.minStock * 1.3);

  return (
    <div>
      <SectionHeader title="Vaccine Inventory" subtitle="Monitor stock levels and manage replenishment" action={
        <button className="flex items-center gap-1.5 bg-card border border-border text-foreground text-sm font-medium px-3 py-1.5 rounded-md hover:bg-muted transition-colors">
          <Download size={14} /> Export Report
        </button>
      } />

      {(critical.length > 0 || low.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {critical.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3.5">
              <div className="flex items-center gap-2 mb-1.5">
                <AlertTriangle size={14} className="text-red-500" />
                <span className="text-sm font-semibold text-red-700">Critical Stock</span>
              </div>
              {critical.map(s => <p key={s.id} className="text-xs text-red-600">{s.name}: <span className="font-mono font-bold">{s.quantity}</span> / {s.minStock} min</p>)}
            </div>
          )}
          {low.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5">
              <div className="flex items-center gap-2 mb-1.5">
                <AlertTriangle size={14} className="text-amber-500" />
                <span className="text-sm font-semibold text-amber-700">Low Stock</span>
              </div>
              {low.map(s => <p key={s.id} className="text-xs text-amber-600">{s.name}: <span className="font-mono font-bold">{s.quantity}</span> / {s.minStock} min</p>)}
            </div>
          )}
        </div>
      )}

      {showRestock && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border w-full max-w-xs shadow-xl p-6">
            <h3 className="font-semibold text-foreground mb-1">Restock Vaccine</h3>
            <p className="text-xs text-muted-foreground mb-4">{stock.find(s => s.id === showRestock)?.name}</p>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Doses to Add</label>
              <input type="number" value={restockQty} onChange={e => setRestockQty(e.target.value)} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowRestock(null)} className="flex-1 px-4 py-2 text-sm rounded-md border border-border text-foreground hover:bg-muted">Cancel</button>
              <button onClick={() => restock(showRestock)} className="flex-1 px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90">Restock</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-card rounded-lg border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Stock Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={VACCINE_DIST_DATA} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E4EAED" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fontFamily: "DM Mono", fill: "#5E7A8A" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#5E7A8A" }} axisLine={false} tickLine={false} width={65} />
              <Tooltip contentStyle={{ borderRadius: 6, fontSize: 12, border: "1px solid #E4EAED" }} />
              <Bar dataKey="doses" fill="#0B7065" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-lg border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Stock Summary</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-red-50 rounded-lg p-3">
                <p className="text-xl font-bold text-red-600">{critical.length}</p>
                <p className="text-xs text-red-600 mt-0.5">Critical</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3">
                <p className="text-xl font-bold text-amber-600">{low.length}</p>
                <p className="text-xs text-amber-600 mt-0.5">Low Stock</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3">
                <p className="text-xl font-bold text-emerald-600">{stock.length - critical.length - low.length}</p>
                <p className="text-xs text-emerald-600 mt-0.5">Adequate</p>
              </div>
            </div>
            <div className="space-y-1.5 pt-2">
              <p className="text-xs font-medium text-muted-foreground">Expiring Soon (within 90 days)</p>
              {stock.filter(s => {
                const exp = new Date(s.expiryDate);
                const now = new Date();
                const diff = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
                return diff < 90;
              }).map(s => (
                <div key={s.id} className="flex justify-between text-xs">
                  <span className="text-foreground">{s.name}</span>
                  <span className="font-mono text-amber-600">{s.expiryDate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {["Vaccine", "Type", "In Stock", "Min. Stock", "Expiry Date", "Manufacturer", "Last Restocked", "Restock"].map((h, i) => (
                <th key={`inv-h-${i}`} className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">{h !== "Restock" ? h : ""}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stock.map(s => {
              const isCrit = s.quantity < s.minStock;
              const isLow = s.quantity >= s.minStock && s.quantity <= s.minStock * 1.3;
              return (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-2.5 font-medium text-foreground">{s.name}</td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{s.type}</td>
                  <td className="px-4 py-2.5">
                    <span className={`font-mono font-semibold text-sm ${isCrit ? "text-red-600" : isLow ? "text-amber-600" : "text-emerald-600"}`}>{s.quantity}</span>
                    {isCrit && <span className="ml-1.5 text-xs text-red-500">CRITICAL</span>}
                    {isLow && <span className="ml-1.5 text-xs text-amber-500">LOW</span>}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{s.minStock}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{s.expiryDate}</td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{s.manufacturer}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{s.lastRestocked}</td>
                  <td className="px-4 py-2.5">
                    <button onClick={() => setShowRestock(s.id)} className="flex items-center gap-1 text-xs text-primary hover:underline font-medium">
                      <RefreshCw size={12} /> Restock
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Reports ──────────────────────────────────────────────────────────────────
function ReportsModule({ residents, schedules, stock }: { residents: Resident[]; schedules: ScheduleItem[]; stock: VaccineStock[] }) {
  const [activeReport, setActiveReport] = useState("coverage");

  const purokStats = useMemo(() => {
    const puroks = ["Purok 1", "Purok 2", "Purok 3", "Purok 4", "Purok 5"];
    return puroks.map(p => ({
      name: p.replace("Purok ", "P"),
      total: residents.filter(r => r.purok === p).length,
      vaccinated: residents.filter(r => r.purok === p && r.status === "Fully Vaccinated").length,
    }));
  }, [residents]);

  const vaccineTypeStats = useMemo(() => {
    const allVax = residents.flatMap(r => r.vaccinations);
    const counts: Record<string, number> = {};
    allVax.forEach(v => { counts[v.vaccine] = (counts[v.vaccine] || 0) + 1; });
    return Object.entries(counts).map(([name, count]) => ({ name: name.split(" ")[0], count }));
  }, [residents]);

  return (
    <div>
      <SectionHeader title="Reports & Analytics" subtitle="Vaccination coverage and operational insights" action={
        <button className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors">
          <Download size={14} /> Export PDF
        </button>
      } />

      <div className="flex gap-2 mb-5 flex-wrap">
        {[["coverage", "Coverage Report"], ["purok", "By Purok"], ["vaccine", "By Vaccine"], ["schedule", "Schedule Summary"]].map(([k, label]) => (
          <button key={k} onClick={() => setActiveReport(k)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${activeReport === k ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>{label}</button>
        ))}
      </div>

      {activeReport === "coverage" && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            {[["Fully Vaccinated", residents.filter(r => r.status === "Fully Vaccinated").length, "text-emerald-600", "bg-emerald-50"],
              ["Partially Vaccinated", residents.filter(r => r.status === "Partially Vaccinated").length, "text-amber-600", "bg-amber-50"],
              ["Unvaccinated", residents.filter(r => r.status === "Unvaccinated").length, "text-red-600", "bg-red-50"]].map(([label, count, tc, bg]) => (
              <div key={label as string} className={`rounded-lg p-4 ${bg}`}>
                <p className={`text-2xl font-bold ${tc}`}>{count as number}</p>
                <p className={`text-xs mt-0.5 ${tc}`}>{label}</p>
                <p className={`text-xs font-mono mt-1 ${tc}`}>{Math.round(count as number / residents.length * 100)}%</p>
              </div>
            ))}
          </div>
          <div className="bg-card rounded-lg border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Monthly Vaccination Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={MONTHLY_VAX_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4EAED" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "DM Mono", fill: "#5E7A8A" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fontFamily: "DM Mono", fill: "#5E7A8A" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 6, fontSize: 12, border: "1px solid #E4EAED" }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="vaccinations" stroke="#0B7065" strokeWidth={2} dot={{ r: 4, fill: "#0B7065" }} name="Administered" />
                <Line type="monotone" dataKey="target" stroke="#CBD5E1" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeReport === "purok" && (
        <div className="bg-card rounded-lg border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Vaccination Coverage by Purok</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={purokStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4EAED" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: "DM Mono", fill: "#5E7A8A" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fontFamily: "DM Mono", fill: "#5E7A8A" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 6, fontSize: 12, border: "1px solid #E4EAED" }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="total" fill="#E4F2F0" radius={[3, 3, 0, 0]} name="Total Residents" />
              <Bar dataKey="vaccinated" fill="#0B7065" radius={[3, 3, 0, 0]} name="Fully Vaccinated" />
            </BarChart>
          </ResponsiveContainer>
          <table className="w-full text-sm mt-4">
            <thead><tr className="border-b border-border">
              {["Purok", "Total", "Fully Vaccinated", "Coverage %"].map(h => <th key={h} className="py-2 text-left text-xs font-semibold text-muted-foreground">{h}</th>)}
            </tr></thead>
            <tbody>{purokStats.map(p => (
              <tr key={p.name} className="border-b border-border last:border-0">
                <td className="py-2 text-sm font-medium text-foreground">{p.name.replace("P", "Purok ")}</td>
                <td className="py-2 font-mono text-xs text-muted-foreground">{p.total}</td>
                <td className="py-2 font-mono text-xs text-emerald-600 font-semibold">{p.vaccinated}</td>
                <td className="py-2 font-mono text-xs text-foreground">{p.total > 0 ? Math.round(p.vaccinated / p.total * 100) : 0}%</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {activeReport === "vaccine" && (
        <div className="bg-card rounded-lg border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Doses Administered by Vaccine Type</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={vaccineTypeStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4EAED" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: "DM Mono", fill: "#5E7A8A" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fontFamily: "DM Mono", fill: "#5E7A8A" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 6, fontSize: 12, border: "1px solid #E4EAED" }} />
              <Bar dataKey="count" fill="#3BADA0" radius={[3, 3, 0, 0]} name="Doses Administered" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeReport === "schedule" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[["Upcoming", schedules.filter(s => s.status === "Upcoming").length, "text-blue-600", "bg-blue-50"],
            ["Completed", schedules.filter(s => s.status === "Completed").length, "text-emerald-600", "bg-emerald-50"],
            ["Missed", schedules.filter(s => s.status === "Missed").length, "text-red-600", "bg-red-50"],
            ["Total Scheduled", schedules.length, "text-foreground", "bg-muted"]].map(([label, count, tc, bg]) => (
            <div key={label as string} className={`rounded-lg p-4 ${bg}`}>
              <p className={`text-2xl font-bold ${tc}`}>{count}</p>
              <p className={`text-xs mt-0.5 ${tc}`}>{label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Notifications ────────────────────────────────────────────────────────────
function NotificationsModule({ notifications, setNotifications }: { notifications: Notification[]; setNotifications: (n: Notification[]) => void }) {
  function markAllRead() {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  }
  function markRead(id: string) {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  }

  const unread = notifications.filter(n => !n.read);

  const typeBg: Record<string, string> = {
    alert: "border-l-4 border-l-red-400 bg-red-50",
    warning: "border-l-4 border-l-amber-400 bg-amber-50",
    info: "border-l-4 border-l-blue-400 bg-blue-50",
    success: "border-l-4 border-l-emerald-400 bg-emerald-50",
  };

  return (
    <div>
      <SectionHeader title="Notifications & Alerts" subtitle={`${unread.length} unread notifications`} action={
        unread.length > 0 ? (
          <button onClick={markAllRead} className="text-xs text-primary font-medium hover:underline">Mark all as read</button>
        ) : undefined
      } />
      <div className="space-y-2">
        {notifications.map(n => (
          <div key={n.id} onClick={() => markRead(n.id)} className={`rounded-lg p-4 cursor-pointer transition-all ${typeBg[n.type]} ${n.read ? "opacity-60" : ""}`}>
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{notifIcon[n.type]}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{n.title}</span>
                  <span className="text-xs font-mono text-muted-foreground">{n.time}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.message}</p>
              </div>
              {!n.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Resident Portal ──────────────────────────────────────────────────────────
function ResidentPortal({ residents, schedules, stock, defaultResidentId }: { residents: Resident[]; schedules: ScheduleItem[]; stock: VaccineStock[]; defaultResidentId?: string }) {
  const [residentId, setResidentId] = useState(defaultResidentId ?? "");
  const [found, setFound] = useState<Resident | null>(() =>
    defaultResidentId ? (residents.find(r => r.id === defaultResidentId) ?? null) : null
  );
  const [activeTab, setActiveTab] = useState("schedule");
  const [notFound, setNotFound] = useState(false);

  function lookup() {
    const r = residents.find(res => res.id.toLowerCase() === residentId.toLowerCase() || res.name.toLowerCase().includes(residentId.toLowerCase()));
    if (r) { setFound(r); setNotFound(false); }
    else { setFound(null); setNotFound(true); }
  }

  const mySchedules = found ? schedules.filter(s => s.residentId === found.id) : [];

  return (
    <div>
      <div className="bg-gradient-to-br from-primary to-teal-600 rounded-xl p-6 text-white mb-6">
        <div className="flex items-center gap-3 mb-1">
          <ShieldCheck size={20} />
          <h2 className="text-lg font-bold">Resident Health Portal</h2>
        </div>
        <p className="text-sm text-white/80">View your vaccination records, upcoming schedules, and reminders.</p>
        <div className="mt-4 flex gap-2">
          <input value={residentId} onChange={e => setResidentId(e.target.value)} onKeyDown={e => e.key === "Enter" && lookup()} placeholder="Enter your name or Resident ID…" className="flex-1 bg-white/20 border border-white/30 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/60 focus:outline-none focus:bg-white/30" />
          <button onClick={lookup} className="bg-white text-primary font-semibold text-sm px-4 py-2 rounded-md hover:bg-white/90 transition-colors">Look Up</button>
        </div>
        {notFound && <p className="text-xs text-red-200 mt-2">No resident found. Try your full name or ID (e.g. R001).</p>}
        {!found && !notFound && (
          <p className="text-xs text-white/60 mt-2">Try: "Maria Santos", "R001", or any resident name from the system.</p>
        )}
      </div>

      {found && (
        <div className="space-y-5">
          <div className="bg-card rounded-lg border border-border p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">{found.name.charAt(0)}</div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground">{found.name}</h3>
              <p className="text-xs text-muted-foreground">{found.id} · {found.gender} · {found.age} years old · {found.purok}</p>
              <Badge className={`mt-1 ${statusColor[found.status]}`}>{found.status}</Badge>
            </div>
            {found.nextDue && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Next Due</p>
                <p className="text-sm font-mono font-semibold text-primary">{found.nextDue}</p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {["schedule", "history", "vaccines"].map(t => (
              <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 rounded-md text-xs font-medium capitalize transition-colors ${activeTab === t ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>{t === "vaccines" ? "Vaccine Info" : t === "schedule" ? "My Schedules" : "Vax History"}</button>
            ))}
          </div>

          {activeTab === "schedule" && (
            <div className="bg-card rounded-lg border border-border divide-y divide-border">
              {mySchedules.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">No scheduled vaccinations on record.</div>
              ) : mySchedules.map(s => (
                <div key={s.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${s.status === "Upcoming" ? "bg-blue-100" : s.status === "Completed" ? "bg-emerald-100" : "bg-red-100"}`}>
                      {s.status === "Completed" ? <CheckCircle size={14} className="text-emerald-600" /> : s.status === "Missed" ? <X size={14} className="text-red-500" /> : <Clock size={14} className="text-blue-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{s.vaccine}</p>
                      <p className="text-xs text-muted-foreground">{s.dose} · {s.worker}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm text-foreground">{s.scheduledDate}</p>
                    <Badge className={statusColor[s.status]}>{s.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "history" && (
            <div className="bg-card rounded-lg border border-border divide-y divide-border">
              {found.vaccinations.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">No vaccination history recorded yet.</div>
              ) : found.vaccinations.map(v => (
                <div key={v.id} className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Syringe size={14} className="text-primary" />
                      <span className="text-sm font-medium text-foreground">{v.vaccine}</span>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">{v.date}</span>
                  </div>
                  <p className="text-xs text-muted-foreground pl-5">{v.dose} · {v.site} · Batch {v.batchNo}</p>
                  <p className="text-xs text-muted-foreground pl-5">Administered by {v.worker}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "vaccines" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stock.map(v => (
                <div key={v.id} className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{v.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{v.type} · {v.manufacturer}</p>
                    </div>
                    <Badge className={v.quantity > v.minStock ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}>
                      {v.quantity > v.minStock ? "Available" : "Limited"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Expiry: <span className="font-mono">{v.expiryDate}</span></p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!found && !notFound && (
        <div className="bg-card rounded-lg border border-border p-8 text-center">
          <ShieldCheck size={36} className="text-primary/30 mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-1">Your Health. Our Priority.</h3>
          <p className="text-sm text-muted-foreground">Enter your name or Resident ID above to access your vaccination records, upcoming schedules, and health reminders.</p>
        </div>
      )}
    </div>
  );
}

// ─── Health History Timeline ──────────────────────────────────────────────────
function HealthHistoryTimeline({ residents, schedules }: { residents: Resident[]; schedules: ScheduleItem[] }) {
  const [selectedId, setSelectedId] = useState(residents[0]?.id ?? "");
  const resident = residents.find(r => r.id === selectedId);

  type TimelineEvent = { date: string; type: "vaccination" | "scheduled" | "missed"; label: string; sub: string };

  const events: TimelineEvent[] = useMemo(() => {
    if (!resident) return [];
    const vaxEvents: TimelineEvent[] = resident.vaccinations.map(v => ({
      date: v.date, type: "vaccination" as const,
      label: `${v.vaccine} — ${v.dose}`,
      sub: `${v.site} · Batch ${v.batchNo} · ${v.worker}`,
    }));
    const schedEvents: TimelineEvent[] = schedules
      .filter(s => s.residentId === resident.id)
      .map(s => ({
        date: s.scheduledDate,
        type: s.status === "Missed" ? "missed" as const : "scheduled" as const,
        label: `${s.vaccine} — ${s.dose}`,
        sub: `${s.status} · ${s.worker}`,
      }));
    return [...vaxEvents, ...schedEvents].sort((a, b) => a.date.localeCompare(b.date));
  }, [resident, schedules]);

  const dotColor: Record<TimelineEvent["type"], string> = {
    vaccination: "bg-primary border-primary",
    scheduled: "bg-blue-400 border-blue-400",
    missed: "bg-red-400 border-red-400",
  };
  const labelColor: Record<TimelineEvent["type"], string> = {
    vaccination: "text-primary",
    scheduled: "text-blue-600",
    missed: "text-red-600",
  };

  return (
    <div>
      <SectionHeader title="Resident Health History Timeline" subtitle="Chronological view of all health events per resident" />
      <div className="flex items-center gap-3 mb-6">
        <label className="text-xs font-medium text-muted-foreground whitespace-nowrap">Select Resident</label>
        <select value={selectedId} onChange={e => setSelectedId(e.target.value)} className="bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 flex-1 max-w-xs">
          {residents.map(r => <option key={r.id} value={r.id}>{r.name} ({r.id})</option>)}
        </select>
      </div>

      {resident && (
        <div className="flex gap-6 flex-col lg:flex-row">
          <div className="lg:w-56 shrink-0 bg-card border border-border rounded-lg p-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary mb-3">{resident.name.charAt(0)}</div>
            <p className="font-bold text-foreground">{resident.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{resident.id} · {resident.purok}</p>
            <p className="text-xs text-muted-foreground">{resident.gender} · {resident.age} yrs</p>
            <Badge className={`mt-2 ${statusColor[resident.status]}`}>{resident.status}</Badge>
            <div className="mt-4 space-y-2 pt-3 border-t border-border">
              <div className="flex items-center gap-2 text-xs"><div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" /><span className="text-muted-foreground">Vaccination given</span></div>
              <div className="flex items-center gap-2 text-xs"><div className="w-2.5 h-2.5 rounded-full bg-blue-400 shrink-0" /><span className="text-muted-foreground">Scheduled</span></div>
              <div className="flex items-center gap-2 text-xs"><div className="w-2.5 h-2.5 rounded-full bg-red-400 shrink-0" /><span className="text-muted-foreground">Missed</span></div>
            </div>
          </div>

          <div className="flex-1">
            {events.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-10 text-center text-muted-foreground text-sm">No health events recorded for this resident.</div>
            ) : (
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                <div className="space-y-0">
                  {events.map((ev, i) => (
                    <div key={i} className="relative flex gap-5 pb-5">
                      <div className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 bg-card ${dotColor[ev.type]}`}>
                        {ev.type === "vaccination" ? <Syringe size={12} className="text-white" /> : ev.type === "missed" ? <X size={12} className="text-white" /> : <Clock size={12} className="text-white" />}
                      </div>
                      <div className="bg-card border border-border rounded-lg p-3.5 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <span className={`text-sm font-semibold ${labelColor[ev.type]}`}>{ev.label}</span>
                          <span className="font-mono text-xs text-muted-foreground shrink-0">{ev.date}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{ev.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Family Health Dashboard ───────────────────────────────────────────────────
function FamilyHealthDashboard({ residents }: { residents: Resident[] }) {
  const families = useMemo(() => {
    const byAddress: Record<string, Resident[]> = {};
    residents.forEach(r => {
      const key = r.address;
      if (!byAddress[key]) byAddress[key] = [];
      byAddress[key].push(r);
    });
    const byLastName: Record<string, Resident[]> = {};
    residents.forEach(r => {
      const lastName = r.name.split(" ").slice(-1)[0];
      if (!byLastName[lastName]) byLastName[lastName] = [];
      byLastName[lastName].push(r);
    });
    return Object.entries(byLastName).map(([name, members]) => {
      const fullyVax = members.filter(m => m.status === "Fully Vaccinated").length;
      const partial = members.filter(m => m.status === "Partially Vaccinated").length;
      const unvax = members.filter(m => m.status === "Unvaccinated").length;
      const coverage = Math.round(fullyVax / members.length * 100);
      const riskLevel = unvax > 0 ? "High Risk" : partial > 0 ? "Moderate" : "Protected";
      return { name, members, fullyVax, partial, unvax, coverage, riskLevel };
    }).sort((a, b) => a.coverage - b.coverage);
  }, [residents]);

  const riskStyle: Record<string, string> = {
    "High Risk": "bg-red-100 text-red-700",
    "Moderate": "bg-amber-100 text-amber-700",
    "Protected": "bg-emerald-100 text-emerald-700",
  };

  return (
    <div>
      <SectionHeader title="Family Health Dashboard" subtitle={`${families.length} family units tracked across all puroks`} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {families.map(fam => (
          <div key={fam.name} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <HeartPulse size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{fam.name} Family</p>
                  <p className="text-xs text-muted-foreground">{fam.members.length} member{fam.members.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
              <Badge className={riskStyle[fam.riskLevel]}>{fam.riskLevel}</Badge>
            </div>

            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1.5">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${fam.coverage}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mb-3">{fam.coverage}% fully vaccinated coverage</p>

            <div className="flex gap-2 text-xs mb-3">
              <span className="flex items-center gap-1 text-emerald-600"><div className="w-2 h-2 rounded-full bg-emerald-400" />{fam.fullyVax} fully</span>
              <span className="flex items-center gap-1 text-amber-600"><div className="w-2 h-2 rounded-full bg-amber-400" />{fam.partial} partial</span>
              <span className="flex items-center gap-1 text-red-500"><div className="w-2 h-2 rounded-full bg-red-400" />{fam.unvax} none</span>
            </div>

            <div className="space-y-1 pt-2 border-t border-border">
              {fam.members.map(m => (
                <div key={m.id} className="flex items-center justify-between">
                  <span className="text-xs text-foreground">{m.name}</span>
                  <Badge className={`text-[10px] ${statusColor[m.status]}`}>{m.status.split(" ")[0]}</Badge>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Priority Patient Identification ─────────────────────────────────────────
function PriorityPatients({ residents, schedules }: { residents: Resident[]; schedules: ScheduleItem[] }) {
  const prioritized = useMemo(() => {
    return residents.map(r => {
      let score = 0;
      const reasons: string[] = [];
      if (r.status === "Unvaccinated") { score += 40; reasons.push("Unvaccinated"); }
      if (r.status === "Partially Vaccinated") { score += 20; reasons.push("Incomplete series"); }
      if (r.age >= 60) { score += 20; reasons.push("Senior citizen (60+)"); }
      if (r.age <= 5) { score += 15; reasons.push("Young child (≤5 yrs)"); }
      const missedCount = schedules.filter(s => s.residentId === r.id && s.status === "Missed").length;
      if (missedCount > 0) { score += missedCount * 15; reasons.push(`${missedCount} missed appointment${missedCount > 1 ? "s" : ""}`); }
      if (r.nextDue) {
        const daysUntil = (new Date(r.nextDue).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
        if (daysUntil <= 7) { score += 15; reasons.push("Due within 7 days"); }
      }
      const level = score >= 60 ? "Critical" : score >= 35 ? "High" : score >= 15 ? "Medium" : "Low";
      return { ...r, score, reasons, level };
    }).filter(r => r.score > 0).sort((a, b) => b.score - a.score);
  }, [residents, schedules]);

  const levelStyle: Record<string, { badge: string; bar: string; border: string }> = {
    Critical: { badge: "bg-red-100 text-red-700", bar: "bg-red-500", border: "border-l-red-400" },
    High: { badge: "bg-orange-100 text-orange-700", bar: "bg-orange-400", border: "border-l-orange-400" },
    Medium: { badge: "bg-amber-100 text-amber-700", bar: "bg-amber-400", border: "border-l-amber-400" },
    Low: { badge: "bg-blue-100 text-blue-700", bar: "bg-blue-400", border: "border-l-blue-400" },
  };

  const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  prioritized.forEach(p => { counts[p.level as keyof typeof counts]++; });

  return (
    <div>
      <SectionHeader title="Priority Patient Identification" subtitle="Residents flagged for urgent vaccination follow-up" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {(["Critical", "High", "Medium", "Low"] as const).map(lv => (
          <div key={lv} className={`rounded-lg p-3.5 border-l-4 bg-card border border-border ${levelStyle[lv].border}`}>
            <p className={`text-2xl font-bold ${levelStyle[lv].badge.split(" ")[1]}`}>{counts[lv]}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{lv} Priority</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {prioritized.map((r, i) => (
          <div key={r.id} className={`bg-card border border-border rounded-lg p-4 border-l-4 ${levelStyle[r.level].border}`}>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground text-sm">{r.name}</span>
                    <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={levelStyle[r.level].badge}>{r.level} Priority</Badge>
                    <span className="font-mono text-xs font-bold text-foreground">Score: {r.score}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {r.reasons.map(reason => (
                    <span key={reason} className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded">{reason}</span>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span>{r.purok}</span>
                  <span>·</span>
                  <span>{r.age} yrs · {r.gender}</span>
                  {r.nextDue && <><span>·</span><span className="text-amber-600 font-medium">Due: {r.nextDue}</span></>}
                </div>
              </div>
              <div className="w-20 shrink-0">
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full ${levelStyle[r.level].bar}`} style={{ width: `${Math.min(100, r.score)}%` }} />
                </div>
              </div>
            </div>
          </div>
        ))}
        {prioritized.length === 0 && (
          <div className="bg-card border border-border rounded-lg p-10 text-center">
            <CheckCircle size={32} className="text-emerald-400 mx-auto mb-2" />
            <p className="font-semibold text-foreground">All residents are up to date!</p>
            <p className="text-sm text-muted-foreground mt-1">No priority follow-ups required at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Digital Vaccination Certificate ─────────────────────────────────────────
function VaccinationCertificate({ residents }: { residents: Resident[] }) {
  const [selectedId, setSelectedId] = useState(residents[0]?.id ?? "");
  const resident = residents.find(r => r.id === selectedId);

  return (
    <div>
      <SectionHeader title="Digital Vaccination Certificate" subtitle="Generate official vaccination records for residents" action={
        <button onClick={() => window.print()} className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors">
          <PrinterIcon size={14} /> Print Certificate
        </button>
      } />

      <div className="flex items-center gap-3 mb-6">
        <label className="text-xs font-medium text-muted-foreground whitespace-nowrap">Select Resident</label>
        <select value={selectedId} onChange={e => setSelectedId(e.target.value)} className="bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 flex-1 max-w-xs">
          {residents.map(r => <option key={r.id} value={r.id}>{r.name} ({r.id})</option>)}
        </select>
      </div>

      {resident && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border-2 border-primary/30 rounded-xl overflow-hidden shadow-md">
            <div className="bg-gradient-to-r from-primary to-teal-500 px-8 py-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/70">Republic of the Philippines</p>
                    <p className="font-bold text-lg leading-tight">VaxCare</p>
                    <p className="text-[10px] text-white/70">Barangay Health Center</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-white/70 uppercase tracking-wider">Certificate No.</p>
                  <p className="font-mono font-bold text-lg">VC-{resident.id}-2025</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-[10px] uppercase tracking-widest text-white/70 mb-0.5">Official Vaccination Certificate</p>
                <p className="text-2xl font-bold">{resident.name}</p>
                <p className="text-sm text-white/80 mt-0.5">{resident.id} · {resident.gender} · Born {resident.birthdate} · {resident.purok}</p>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Vaccination Record</h3>
                <Badge className={statusColor[resident.status]}>{resident.status}</Badge>
              </div>

              {resident.vaccinations.length === 0 ? (
                <p className="text-sm text-muted-foreground italic text-center py-6">No vaccinations on record.</p>
              ) : (
                <table className="w-full text-sm mb-6">
                  <thead>
                    <tr className="border-b-2 border-primary/20">
                      {["#", "Vaccine", "Dose", "Date Administered", "Site", "Batch No.", "Health Worker"].map((h, i) => (
                        <th key={`cert-h-${i}`} className="pb-2 text-left text-xs font-bold text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {resident.vaccinations.map((v, i) => (
                      <tr key={v.id} className="border-b border-border">
                        <td className="py-2.5 font-mono text-xs text-muted-foreground">{i + 1}</td>
                        <td className="py-2.5 font-medium text-foreground">{v.vaccine}</td>
                        <td className="py-2.5 text-xs text-muted-foreground">{v.dose}</td>
                        <td className="py-2.5 font-mono text-xs text-foreground">{v.date}</td>
                        <td className="py-2.5 text-xs text-muted-foreground">{v.site}</td>
                        <td className="py-2.5 font-mono text-xs text-muted-foreground">{v.batchNo}</td>
                        <td className="py-2.5 text-xs text-muted-foreground">{v.worker}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div className="flex items-end justify-between pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Date Issued</p>
                  <p className="text-sm font-mono font-semibold text-foreground">{new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })}</p>
                </div>
                <div className="text-center">
                  <div className="w-32 border-b border-foreground mb-1" />
                  <p className="text-xs text-muted-foreground">Dr. Pedro Cruz</p>
                  <p className="text-xs font-semibold text-foreground">Barangay Health Officer</p>
                </div>
                <div className="w-16 h-16 rounded-full border-2 border-primary/40 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award size={20} className="text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Vaccine Batch Tracking ───────────────────────────────────────────────────
function BatchTracking({ residents, stock }: { residents: Resident[]; stock: VaccineStock[] }) {
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);

  const batches = useMemo(() => {
    const map: Record<string, { batchNo: string; vaccine: string; recipients: { name: string; id: string; date: string; dose: string }[] }> = {};
    residents.forEach(r => {
      r.vaccinations.forEach(v => {
        if (!v.batchNo) return;
        if (!map[v.batchNo]) map[v.batchNo] = { batchNo: v.batchNo, vaccine: v.vaccine, recipients: [] };
        map[v.batchNo].recipients.push({ name: r.name, id: r.id, date: v.date, dose: v.dose });
      });
    });
    return Object.values(map).sort((a, b) => a.vaccine.localeCompare(b.vaccine));
  }, [residents]);

  const selected = batches.find(b => b.batchNo === selectedBatch);

  const stockByName = useMemo(() => {
    const m: Record<string, VaccineStock> = {};
    stock.forEach(s => { m[s.name] = s; });
    return m;
  }, [stock]);

  return (
    <div>
      <SectionHeader title="Vaccine Batch Tracking" subtitle={`${batches.length} active batches across all vaccine types`} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">All Batches</p>
          <div className="bg-card border border-border rounded-lg divide-y divide-border">
            {batches.length === 0 && <p className="p-6 text-sm text-muted-foreground text-center">No batch records found.</p>}
            {batches.map(b => {
              const stockInfo = stockByName[b.vaccine];
              const isSelected = b.batchNo === selectedBatch;
              return (
                <button key={b.batchNo} onClick={() => setSelectedBatch(isSelected ? null : b.batchNo)} className={`w-full text-left px-4 py-3 transition-colors flex items-center justify-between gap-3 ${isSelected ? "bg-primary/5" : "hover:bg-muted/40"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                      <Layers size={14} />
                    </div>
                    <div>
                      <p className="font-mono text-sm font-semibold text-foreground">{b.batchNo}</p>
                      <p className="text-xs text-muted-foreground">{b.vaccine}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono text-xs font-semibold text-foreground">{b.recipients.length} doses used</p>
                    {stockInfo && <p className="text-xs text-muted-foreground">Exp: {stockInfo.expiryDate}</p>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            {selected ? `Batch ${selected.batchNo} — Recipients` : "Select a batch to see details"}
          </p>
          {selected ? (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="bg-primary/5 border-b border-border px-4 py-3">
                <p className="text-sm font-bold text-primary">{selected.vaccine}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="font-mono text-xs text-muted-foreground">{selected.batchNo}</span>
                  {stockByName[selected.vaccine] && (
                    <>
                      <span className="text-border">·</span>
                      <span className="text-xs text-muted-foreground">Mfr: {stockByName[selected.vaccine].manufacturer}</span>
                      <span className="text-border">·</span>
                      <span className="text-xs text-muted-foreground">Exp: {stockByName[selected.vaccine].expiryDate}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="divide-y divide-border">
                {selected.recipients.map((rec, i) => (
                  <div key={i} className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{rec.name.charAt(0)}</div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{rec.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{rec.id} · {rec.dose}</p>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">{rec.date}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg p-10 text-center">
              <Layers size={32} className="text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Click a batch on the left to see which residents received doses from it.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────
const NAV_ITEMS: { id: Module; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <Home size={15} /> },
  { id: "residents", label: "Residents", icon: <Users size={15} /> },
  { id: "vaccinations", label: "Vaccinations", icon: <Syringe size={15} /> },
  { id: "schedule", label: "Schedule", icon: <Calendar size={15} /> },
  { id: "inventory", label: "Inventory", icon: <Package size={15} /> },
  { id: "reports", label: "Reports", icon: <BarChart2 size={15} /> },
  { id: "portal", label: "Resident Portal", icon: <ShieldCheck size={15} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={15} /> },
  { id: "timeline", label: "Health Timeline", icon: <GitCommitHorizontal size={15} /> },
  { id: "family", label: "Family Dashboard", icon: <HeartPulse size={15} /> },
  { id: "priority", label: "Priority Patients", icon: <Star size={15} /> },
  { id: "certificate", label: "Vax Certificate", icon: <Award size={15} /> },
  { id: "batches", label: "Batch Tracking", icon: <Layers size={15} /> },
];

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [module, setModule] = useState<Module>("dashboard");
  const [residents, setResidents] = useState<Resident[]>(RESIDENTS);
  const [stock, setStock] = useState<VaccineStock[]>(VACCINE_STOCK);
  const [schedules, setSchedules] = useState<ScheduleItem[]>(SCHEDULES);
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // When a resident logs in, send them straight to the portal pre-filled
  function handleLogin(u: AuthUser) {
    setUser(u);
    setModule(u.role === "resident" ? "portal" : "dashboard");
  }

  function handleLogout() {
    setUser(null);
    setModule("dashboard");
    setSidebarOpen(false);
  }

  if (!user) return <LoginScreen onLogin={handleLogin} />;

  const allowedModules = ROLE_ACCESS[user.role];
  const visibleNav = NAV_ITEMS.filter(item => allowedModules.includes(item.id));

  const unreadCount = notifications.filter(n => !n.read).length;

  const moduleTitle: Record<Module, string> = {
    dashboard: "Dashboard", residents: "Residents", vaccinations: "Vaccinations",
    schedule: "Schedule", inventory: "Inventory", reports: "Reports",
    portal: "Resident Portal", notifications: "Notifications",
    timeline: "Health History Timeline", family: "Family Health Dashboard",
    priority: "Priority Patient Identification", certificate: "Digital Vaccination Certificate",
    batches: "Vaccine Batch Tracking",
  };

  const roleBadge: Record<UserRole, string> = {
    admin: "bg-primary/20 text-primary",
    worker: "bg-blue-100 text-blue-700",
    resident: "bg-teal-100 text-teal-700",
  };

  const mgmtItems = visibleNav.filter(i => ["dashboard","residents","vaccinations","schedule","inventory","reports"].includes(i.id));
  const serviceItems = visibleNav.filter(i => ["portal","notifications"].includes(i.id));
  const advancedItems = visibleNav.filter(i => ["timeline","family","priority","certificate","batches"].includes(i.id));

  return (
    <div className="flex h-screen bg-background overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:relative z-30 h-full flex flex-col bg-card border-r border-border transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`} style={{ width: 220 }}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Syringe size={15} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground leading-tight">VaxCare</p>
              <p className="text-[10px] text-muted-foreground leading-tight">Brgy. Health Center</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {mgmtItems.length > 0 && <>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">Management</p>
            {mgmtItems.map(item => (
              <button key={item.id} onClick={() => { setModule(item.id); setSidebarOpen(false); }} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${module === item.id ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"}`}>
                {item.icon} {item.label}
              </button>
            ))}
          </>}
          {serviceItems.length > 0 && <>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2 mt-2">Services</p>
            {serviceItems.map(item => (
              <button key={item.id} onClick={() => { setModule(item.id); setSidebarOpen(false); }} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${module === item.id ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"}`}>
                {item.icon} {item.label}
                {item.id === "notifications" && unreadCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{unreadCount}</span>
                )}
              </button>
            ))}
          </>}
          {advancedItems.length > 0 && <>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2 mt-2">Advanced</p>
            {advancedItems.map(item => (
              <button key={item.id} onClick={() => { setModule(item.id); setSidebarOpen(false); }} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${module === item.id ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"}`}>
                {item.icon} {item.label}
              </button>
            ))}
          </>}
        </nav>

        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">{user.avatar}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{user.displayName}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user.title}</p>
            </div>
            <button onClick={handleLogout} title="Sign out" className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors rounded-md hover:bg-red-50 shrink-0">
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-card border-b border-border px-5 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-muted-foreground hover:text-foreground" onClick={() => setSidebarOpen(true)}><Menu size={18} /></button>
            <div>
              <h1 className="text-sm font-bold text-foreground">{moduleTitle[module]}</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Barangay Health Center · {new Date().toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {user.role !== "resident" && (
              <button onClick={() => setModule("notifications")} className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted">
                <Bell size={16} />
                {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />}
              </button>
            )}
            <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${roleBadge[user.role]}`}>
              {user.role === "admin" ? "Admin" : user.role === "worker" ? "Staff" : "Resident"}
            </div>
            <button onClick={handleLogout} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-md transition-colors font-medium">
              <LogOut size={12} /> Sign Out
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5">
          {module === "dashboard" && <Dashboard residents={residents} stock={stock} schedules={schedules} notifications={notifications} setModule={setModule} />}
          {module === "residents" && <ResidentsModule residents={residents} setResidents={setResidents} />}
          {module === "vaccinations" && <VaccinationsModule residents={residents} setResidents={setResidents} stock={stock} />}
          {module === "schedule" && <ScheduleModule schedules={schedules} setSchedules={setSchedules} residents={residents} />}
          {module === "inventory" && <InventoryModule stock={stock} setStock={setStock} />}
          {module === "reports" && <ReportsModule residents={residents} schedules={schedules} stock={stock} />}
          {module === "portal" && <ResidentPortal residents={residents} schedules={schedules} stock={stock} defaultResidentId={user.role === "resident" ? user.residentId : undefined} />}
          {module === "notifications" && <NotificationsModule notifications={notifications} setNotifications={setNotifications} />}
          {module === "timeline" && <HealthHistoryTimeline residents={residents} schedules={schedules} />}
          {module === "family" && <FamilyHealthDashboard residents={residents} />}
          {module === "priority" && <PriorityPatients residents={residents} schedules={schedules} />}
          {module === "certificate" && <VaccinationCertificate residents={residents} />}
          {module === "batches" && <BatchTracking residents={residents} stock={stock} />}
        </main>
      </div>
    </div>
  );
}
