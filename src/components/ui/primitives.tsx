"use client";
import type { ReactNode, ButtonHTMLAttributes } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import {
  ArrowUpRight,
  ChevronDown,
  MoreHorizontal,
  Search,
  X,
  Inbox,
  ArrowDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
export function Button({
  children,
  className,
  variant = "default",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "primary" | "ghost" | "danger";
}) {
  return (
    <button className={cn("btn", `btn-${variant}`, className)} {...props}>
      {children}
    </button>
  );
}
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="logo">
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <rect width="40" height="40" rx="11" fill="currentColor" />
        <path
          d="M12 10h8c9 0 13 6 10 13-2 5-6 7-10 7h-8V10Z"
          stroke="white"
          strokeWidth="3"
        />
        <path
          d="M19 15v10m-5-5h10"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      {!compact && (
        <span>
          dentix<span className="logo-dot">.</span>
        </span>
      )}
    </span>
  );
}
export function Avatar({
  name,
  color = "teal",
  size = "md",
}: {
  name: string;
  color?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const clean = name.replace("Dr. ", "");
  return (
    <span
      className={cn("avatar", `avatar-${color}`, `avatar-${size}`)}
      aria-label={name}
    >
      {clean
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join("")}
    </span>
  );
}
export function StatusBadge({ status }: { status: string }) {
  const tone = ["Paid", "Completed", "Active", "Available today"].includes(
    status,
  )
    ? "green"
    : ["Confirmed", "New"].includes(status)
      ? "teal"
      : ["Checked In", "Follow-up"].includes(status)
        ? "violet"
        : [
              "In Treatment",
              "In treatment",
              "Pending",
              "Planned",
              "Partially Paid",
              "Away",
            ].includes(status)
          ? "amber"
          : ["Overdue", "Cancelled", "No Show"].includes(status)
            ? "red"
            : "slate";
  return (
    <span className={`badge badge-${tone}`}>
      <span className="status-dot" />
      {status}
    </span>
  );
}
export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
}: {
  title: string;
  description?: string;
  eyebrow?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="page-header">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      <div className="page-actions">{actions}</div>
    </div>
  );
}
export function Card({
  children,
  className,
  title,
  description,
  action,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <section className={cn("card", className)}>
      {title && (
        <div className="card-header">
          <div>
            <h2>{title}</h2>
            {description && <p>{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
export function MetricCard({
  label,
  value,
  change,
  icon,
  negative = false,
  caption = "vs. last month",
}: {
  label: string;
  value: string;
  change?: string;
  icon: ReactNode;
  negative?: boolean;
  caption?: string;
}) {
  return (
    <div className="metric-card">
      <div className="metric-top">
        <span>{label}</span>
        <span className="metric-icon">{icon}</span>
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-bottom">
        {change && (
          <span className={negative ? "trend muted" : "trend"}>
            {negative ? (
              <ArrowDownRight size={13} />
            ) : (
              <ArrowUpRight size={13} />
            )}{" "}
            {change}
          </span>
        )}
        <span>{caption}</span>
      </div>
    </div>
  );
}
export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label?: string;
}) {
  return (
    <div className="search-input">
      <Search size={16} />
      <input
        aria-label={label || placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: (string | { label: string; value: string })[];
}) {
  return (
    <div className="select-wrap">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option
            key={typeof o === "string" ? o : o.value}
            value={typeof o === "string" ? o : o.value}
          >
            {typeof o === "string" ? o : o.label}
          </option>
        ))}
      </select>
      <ChevronDown size={14} />
    </div>
  );
}
export function Menu({
  children,
  items,
  label = "More options",
}: {
  children?: ReactNode;
  label?: string;
  items: { label: string; onClick: () => void; danger?: boolean }[];
}) {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <button className="icon-button" aria-label={label}>
          {children || <MoreHorizontal size={18} />}
        </button>
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content className="dropdown" sideOffset={8} align="end">
          {items.map((i) => (
            <Dropdown.Item
              key={i.label}
              className={cn("dropdown-item", i.danger && "text-danger")}
              onSelect={i.onClick}
            >
              {i.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  drawer = false,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  drawer?: boolean;
  wide?: boolean;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content
          className={cn(
            "dialog-content",
            drawer && "drawer",
            wide && "dialog-wide",
          )}
        >
          <div className="dialog-header">
            <div>
              <Dialog.Title>{title}</Dialog.Title>
              <Dialog.Description>
                {description || "Manage your clinic information."}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button aria-label="Close dialog" className="icon-button">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
export function EmptyState({
  title = "No results found",
  description = "Try adjusting your search or filters.",
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <span>
        <Inbox size={25} />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
export function Tabs({
  tabs,
  value,
  onChange,
}: {
  tabs: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((t) => (
        <button
          role="tab"
          aria-selected={t === value}
          tabIndex={t === value ? 0 : -1}
          key={t}
          className={t === value ? "active" : ""}
          onClick={() => onChange(t)}
          onKeyDown={(e) => {
            if (["ArrowRight", "ArrowLeft"].includes(e.key)) {
              e.preventDefault();
              const next =
                tabs[
                  (tabs.indexOf(t) +
                    (e.key === "ArrowRight" ? 1 : tabs.length - 1)) %
                    tabs.length
                ];
              onChange(next);
              (
                e.currentTarget.parentElement?.children[
                  tabs.indexOf(next)
                ] as HTMLElement
              )?.focus();
            }
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
export function LoadingSkeleton({ kind = "dashboard" }: { kind?: string }) {
  return (
    <div
      className="loading-layout"
      aria-label={`Loading ${kind}`}
      aria-busy="true"
    >
      <div className="skeleton skeleton-title" />
      <div className="metrics-grid four">
        {Array.from({ length: 4 }, (_, i) => (
          <div className="skeleton skeleton-metric" key={i} />
        ))}
      </div>
      <div className="skeleton skeleton-content" />
      {Array.from({ length: 5 }, (_, i) => (
        <div className="skeleton skeleton-row" key={i} />
      ))}
    </div>
  );
}
export function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: ReactNode;
  error?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {error && <small className="text-danger">{error}</small>}
    </label>
  );
}
export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={cn("toggle", checked && "on")}
      onClick={() => onChange(!checked)}
    >
      <span />
    </button>
  );
}
