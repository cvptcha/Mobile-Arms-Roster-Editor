export function Input({ ...props }) {
  return (
    <input
      {...props}
      className="bg-black text-blue-300 border border-blue-500 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  );
}
