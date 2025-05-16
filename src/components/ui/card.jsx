export function Card({ children, className = "" }) {
  return <div className={`rounded-lg p-4 shadow-md ${className}`}>{children}</div>;
}

export function CardContent({ children, className = "" }) {
  return <div className={`mt-2 ${className}`}>{children}</div>;
}
