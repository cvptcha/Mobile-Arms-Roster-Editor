export function Button({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition ${className}`}
    >
      {children}
    </button>
  );
}
