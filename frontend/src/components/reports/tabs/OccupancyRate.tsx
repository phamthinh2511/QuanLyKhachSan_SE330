"use client";

import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

interface Props {
  data: { labels: string[]; occupancy: number[]; guests: number[] };
}

export default function OccupancyRate({ data }: Props) {
  const chartData = data.labels.map((label, i) => ({
    label, occupancy: data.occupancy[i], guests: data.guests[i],
  }));

  const avgOccupancy = data.occupancy && data.occupancy.length > 0
    ? (data.occupancy.reduce((s, v) => s + v, 0) / data.occupancy.length).toFixed(2)
    : "0.00";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Occupancy line */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-1">Tỷ lệ lấp đầy (%)</h3>
          <p className="text-gray-400 text-xs mb-4">Trung bình: <span className="text-blue-600 font-semibold">{avgOccupancy}%</span></p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
              <Tooltip formatter={(v: any) => `${Number(v).toFixed(2)}%`} />
              <Line type="monotone" dataKey="occupancy" name="Tỷ lệ lấp đầy"
                stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Guests bar */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-1">Lượng khách</h3>
          <p className="text-gray-400 text-xs mb-4">Số lượng khách theo từng kỳ</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="guests" name="Khách" fill="#f59e0b" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}