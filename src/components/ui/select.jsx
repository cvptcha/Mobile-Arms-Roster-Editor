import { useState } from "react";

export function Select({ children, onValueChange, value }) {
  return (
    <select
      className="bg-black text-blue-300 border border-blue-500 rounded px-2 py-1 w-full"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
    >
      {children}
    </select>
  );
}

export function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>;
}

export function SelectTrigger({ children }) {
  return <>{children}</>;
}

export function SelectContent({ children }) {
  return <>{children}</>;
}
