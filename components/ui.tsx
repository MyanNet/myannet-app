"use client";
import React from "react";

export const THEME = {
  green: "#2e7d32", greenDark: "#1b5e20", greenText: "#24452a", greenSoft: "#e8f5e9",
  red: "#c0392b", redSoft: "#fdecea", page: "#f4faf4", border: "#d9e7da",
};

export function Modal({ onClose, children, width = 440 }: { onClose: () => void; children: React.ReactNode; width?: number }) {
  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 400, overflowY: "auto", padding: "24px 12px" }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 24, width: "100%", maxWidth: width, boxShadow: "0 20px 60px rgba(0,0,0,0.25)", position: "relative" }}>
        <button onClick={onClose} aria-label="Close" style={{ position: "absolute", right: 14, top: 12, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#999" }}>✕</button>
        {children}
      </div>
    </div>
  );
}

export const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px", borderRadius: 10, border: `1px solid ${THEME.border}`, fontSize: 14,
  boxSizing: "border-box", fontFamily: "inherit", background: "#fff",
};

export function Btn({ children, onClick, bg = THEME.red, color = "#fff", disabled, style }: {
  children: React.ReactNode; onClick?: () => void; bg?: string; color?: string; disabled?: boolean; style?: React.CSSProperties;
}) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ width: "100%", background: disabled ? "#bbb" : bg, color, border: "none", borderRadius: 12, padding: "12px", fontWeight: 800, cursor: disabled ? "default" : "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, ...style }}>
      {children}
    </button>
  );
}

export function Stars({ value, onChange, size = 16 }: { value: number; onChange?: (n: number) => void; size?: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }} aria-label={`${value.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} onClick={onChange ? () => onChange(n === value ? 0 : n) : undefined}
          style={{ fontSize: size, cursor: onChange ? "pointer" : "default", color: n <= Math.round(value) ? "#f59e0b" : "#d1d5db", lineHeight: 1 }}>★</span>
      ))}
    </span>
  );
}
