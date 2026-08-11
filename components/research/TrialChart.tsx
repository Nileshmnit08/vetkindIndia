"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const data = [
  { week: "Wk 1", control: 22.1, treatment: 22.3 },
  { week: "Wk 2", control: 21.8, treatment: 22.8 },
  { week: "Wk 3", control: 21.5, treatment: 23.4 },
  { week: "Wk 4", control: 21.2, treatment: 24.1 },
  { week: "Wk 5", control: 20.8, treatment: 24.5 },
  { week: "Wk 6", control: 20.5, treatment: 24.6 },
];

export function TrialChart() {
  return (
    <div className="w-full h-64 sm:h-80" aria-label="Line chart comparing control vs treatment milk yields over 6 weeks">
      <h5 className="text-center text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
        Average Daily Milk Yield (Liters)
      </h5>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
          <XAxis 
            dataKey="week" 
            tick={{ fontSize: 12, fill: "#71717a" }}
            axisLine={{ stroke: "#e4e4e7" }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: "#71717a" }}
            axisLine={false}
            tickLine={false}
            domain={['dataMin - 1', 'dataMax + 1']}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            labelStyle={{ color: '#18181b', fontWeight: 'bold' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Line 
            type="monotone" 
            name="Control Group"
            dataKey="control" 
            stroke="#a1a1aa" 
            strokeWidth={3}
            activeDot={{ r: 6 }} 
          />
          <Line 
            type="monotone" 
            name="Treatment Group"
            dataKey="treatment" 
            stroke="#16a34a" 
            strokeWidth={3}
            activeDot={{ r: 6 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
