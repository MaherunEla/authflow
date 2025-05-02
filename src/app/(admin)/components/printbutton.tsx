"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="mb-4 rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 print:hidden"
    >
      🖨️ Print Table
    </button>
  );
}
