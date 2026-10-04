"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Stethoscope,
  Pill,
  UserRoundCog,
  CreditCard,
  Receipt,
  MessageSquare,
  ChartNoAxesCombined,
  Settings2,
  LifeBuoy,
  ChevronsUpDown,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Bell,
  Plus,
  MapPin,
  ChevronDown,
  ArrowUpRight,
  Command,
  Building2,
} from "lucide-react";
import {
  Avatar,
  Button,
  Logo,
  Menu,
  Modal,
  SearchInput,
  EmptyState,
} from "@/components/ui/primitives";
import { useClinic } from "@/hooks/use-clinic";
import { dentists } from "@/data/dentists";
import { notifications as initialNotifications } from "@/data/messages";
import {
  AppointmentDrawer,
  NewAppointmentDialog,
} from "@/components/calendar/appointment-dialogs";
const navigation = [
  {
    label: "WORKSPACE",
    items: [
      ["Dashboard", "/dashboard", LayoutDashboard],
      ["Appointments", "/appointments", CalendarDays],
      ["Patients", "/patients", Users],
    ],
  },
  {
    label: "CLINICAL",
    items: [
      ["Treatments", "/treatments", Stethoscope],
      ["Prescriptions", "/prescriptions", Pill],
    ],
  },
  {
    label: "TEAM",
    items: [
      ["Dentists", "/dentists", UserRoundCog],
      ["Staff", "/staff", Users],
    ],
  },
  {
    label: "FINANCE",
    items: [
      ["Invoices", "/invoices", Receipt],
      ["Payments", "/payments", CreditCard],
    ],
  },
  { label: "COMMUNICATION", items: [["Messages", "/messages", MessageSquare]] },
  {
    label: "SYSTEM",
    items: [
      ["Reports", "/reports", ChartNoAxesCombined],
      ["Settings", "/settings/clinic", Settings2],
    ],
  },
] as const;
// Screens included in Dentix Lite; everything else in the sidebar is a Pro preview.
const liteRoutes = ["/dashboard", "/patients"];
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const clinic = useClinic();
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [help, setHelp] = useState(false);
  const [location, setLocation] = useState("Downtown Clinic");
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearch((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  const results = [
    ...clinic.patients.map((p) => ({
      title: p.name,
      kind: "Patient",
      href: `/patients/${p.slug}`,
    })),
    ...dentists.map((d) => ({
      title: d.name,
      kind: d.specialty,
      href: `/dentists/${d.slug}`,
    })),
    ...clinic.invoices.map((i) => ({
      title: i.id,
      kind: "Invoice",
      href: `/invoices/${i.id}`,
    })),
    ...clinic.treatments.map((t) => ({
      title: t.name,
      kind: "Treatment",
      href: `/treatments/${t.id}`,
    })),
    ...clinic.appointments.map((a) => ({
      title: `${clinic.patients.find((p) => p.id === a.patientId)?.name} · ${a.date} ${a.time}`,
      kind: "Appointment",
      href: "/appointments",
      id: a.id,
    })),
  ]
    .filter((r) =>
      `${r.title} ${r.kind}`.toLowerCase().includes(query.toLowerCase()),
    )
    .slice(0, 9);
  const sidebar = (
    <>
      <div className="sidebar-brand">
        <Link href="/dashboard" aria-label="Dentix home">
          <Logo compact={collapsed} />
        </Link>
        <button
          className="icon-button collapse-button"
          aria-label="Collapse navigation"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <PanelLeftOpen size={17} />
          ) : (
            <PanelLeftClose size={17} />
          )}
        </button>
      </div>
      <button
        className="clinic-switch"
        onClick={() =>
          setLocation(
            location === "Downtown Clinic"
              ? "All locations"
              : "Downtown Clinic",
          )
        }
      >
        <span className="clinic-icon">
          <Building2 size={19} />
        </span>
        <span>
          <strong>{location}</strong>
          <small>Professional workspace</small>
        </span>
        <ChevronsUpDown size={14} />
      </button>
      <nav>
        {navigation.map((g) => (
          <div className="nav-group" key={g.label}>
            <div className="nav-label">{g.label}</div>
            {g.items.map(([label, href, Icon]) => (
              <Link
                title={collapsed ? label : undefined}
                onClick={() => setMobile(false)}
                className={`nav-item ${pathname.startsWith(href.split("/").slice(0, 2).join("/")) ? "active" : ""}`}
                href={href}
                key={href}
              >
                <Icon size={18} />
                <span>{label}</span>
                {!liteRoutes.includes(href) && (
                  <em className="pro-badge">PRO</em>
                )}
              </Link>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <button className="nav-item" onClick={() => setHelp(true)}>
          <LifeBuoy size={18} />
          <span>Help & support</span>
          <ArrowUpRight size={14} />
        </button>
        <div className="sidebar-user">
          <Avatar name="Olivia Carter" color="rose" />
          <div>
            <strong>Dr. Olivia Carter</strong>
            <small>Clinic Administrator</small>
          </div>
          <Menu
            label="Account menu"
            items={[
              {
                label: "Profile & settings",
                onClick: () => router.push("/settings/clinic"),
              },
              { label: "Demo sign out", onClick: () => router.push("/login") },
              {
                label: collapsed ? "Expand sidebar" : "Collapse sidebar",
                onClick: () => setCollapsed(!collapsed),
              },
            ]}
          >
            <ChevronsUpDown size={15} />
          </Menu>
        </div>
      </div>
    </>
  );
  return (
    <div className={`app-shell ${collapsed ? "is-collapsed" : ""}`}>
      <aside className="sidebar">{sidebar}</aside>
      <Modal
        open={mobile}
        onClose={() => setMobile(false)}
        title="Navigation"
        drawer
      >
        <div className="mobile-sidebar">{sidebar}</div>
      </Modal>
      <div className="app-body">
        <header className="app-header">
          <button
            className="icon-button mobile-menu"
            aria-label="Open navigation"
            onClick={() => setMobile(true)}
          >
            <PanelLeftOpen size={21} />
          </button>
          <button className="global-search" onClick={() => setSearch(true)}>
            <Search size={18} />
            <span>Search patients, appointments, invoices...</span>
            <kbd>⌘ K</kbd>
          </button>
          <div className="header-right">
            <Menu
              label="Select clinic"
              items={[
                {
                  label: "Downtown Clinic",
                  onClick: () => setLocation("Downtown Clinic"),
                },
                {
                  label: "All locations",
                  onClick: () => setLocation("All locations"),
                },
              ]}
            >
              <span className="location-control">
                <MapPin size={15} />
                {location}
                <ChevronDown size={13} />
              </span>
            </Menu>
            <button
              className="icon-button"
              aria-label="Quick new appointment"
              title="New appointment"
              onClick={() => clinic.setBooking({})}
            >
              <Plus size={19} />
            </button>
            <span className="header-divider" />
            <button
              className="icon-button notification-button"
              aria-label="Notifications"
              onClick={() => setNotice(true)}
            >
              <Bell size={19} />
              {notifications.some((n) => !n.read) && <i />}
            </button>
            <Link href="/settings/clinic" aria-label="Your profile">
              <Avatar name="Olivia Carter" color="rose" size="sm" />
            </Link>
          </div>
        </header>
        <main id="main-content" className="main-content" key={pathname}>
          {children}
          <footer className="app-footer">
            <span>© 2026 Dentix. Dental care, beautifully organized.</span>
            <span>
              <span className="status-dot" />
              Demo workspace · Fictional patient data
            </span>
          </footer>
        </main>
      </div>
      <Modal
        open={search}
        onClose={() => setSearch(false)}
        title="Find anything in Dentix"
        description="Patients, appointments, dentists, treatments, and invoices"
      >
        <div className="dialog-body">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search your workspace..."
          />
          <div className="command-results">
            {results.map((r, i) => (
              <button
                key={r.title + i}
                onClick={() => {
                  setSearch(false);
                  router.push(r.href);
                  if ("id" in r) clinic.setAppointmentId(String(r.id));
                }}
              >
                <span className="command-icon">
                  <Search size={16} />
                </span>
                <span>
                  <strong>{r.title}</strong>
                  <small>{r.kind}</small>
                </span>
                <ArrowUpRight size={16} />
              </button>
            ))}
            {!results.length && <EmptyState />}
          </div>
          <div className="command-hint">
            <Command size={13} /> K to open <span>Esc to close</span>
          </div>
        </div>
      </Modal>
      <Modal
        open={notice}
        onClose={() => setNotice(false)}
        title="Notifications"
        description="Keep a pulse on your clinic."
        drawer
      >
        <div className="dialog-body">
          <Button
            onClick={() =>
              setNotifications((n) => n.map((i) => ({ ...i, read: true })))
            }
          >
            Mark all as read
          </Button>
          {notifications.map((n) => (
            <Link
              onClick={() => setNotice(false)}
              className={`notification-item ${n.read ? "read" : ""}`}
              href={n.href}
              key={n.id}
            >
              <Bell size={19} />
              <div>
                <strong>{n.title}</strong>
                <p>{n.body}</p>
              </div>
              {!n.read && <span className="status-dot" />}
            </Link>
          ))}
        </div>
      </Modal>
      <Modal
        open={help}
        onClose={() => setHelp(false)}
        title="A little help, when you need it"
        description="Get comfortable in your Dentix demo workspace."
      >
        <div className="dialog-body stack">
          <CardHelp
            title="Start with a patient"
            text="Open Sarah Johnson’s profile to explore treatment planning, tooth charting, appointment history, files, and billing."
          />
          <CardHelp
            title="Make the workspace yours"
            text="Open Settings to update your clinic, opening hours, notifications, and brand color. Changes stay active until refresh."
          />
          <CardHelp
            title="Connect your own backend"
            text="The included README explains the data models, shared state, theme tokens, and production setup."
          />
          <Button
            variant="primary"
            onClick={() => {
              setHelp(false);
              router.push("/patients/sarah-johnson");
            }}
          >
            Explore Sarah’s profile <ArrowUpRight size={16} />
          </Button>
        </div>
      </Modal>
      <AppointmentDrawer />
      <NewAppointmentDialog />
    </div>
  );
}
function CardHelp({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h3>{title}</h3>
      <p className="muted">{text}</p>
    </div>
  );
}
