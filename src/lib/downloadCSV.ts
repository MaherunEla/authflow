import { TableUser } from "@/app/(admin)/dashboard/page";

export function downloadCSV(data: TableUser[], filename: string) {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
function convertToCSV(data: TableUser[]): string {
  if (!data.length) return "";

  const keys = Object.keys(data[0]) as (keyof TableUser)[];
  const rows = data.map((row) =>
    keys.map((k) => `"${row[k] ?? ""}"`).join(",")
  );

  return [keys.join(","), ...rows].join("\n");
}
