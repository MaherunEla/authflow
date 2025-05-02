"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type ChartData = {
  date: string;
  count: number;
};

export default function UserBarChart() {
  const [days, setDays] = useState(7);
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/analytics/user?days=${days}`);
      const json = await res.json();
      setData(json);
    }
    fetchData();
  }, [days]);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-xl font-semibold ">User Registrations</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter:</span>
          <Select onValueChange={(value) => setDays(+value)} defaultValue="7">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Last 7 Days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="60">Last 60 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
