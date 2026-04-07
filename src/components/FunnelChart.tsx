'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FunnelData {
  stage: string;
  variantA: number;
  variantB: number;
}

interface Props {
  data: FunnelData[];
  variantAName: string;
  variantBName: string;
}

export default function FunnelChart({ data, variantAName, variantBName }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h3 className="font-semibold text-gray-900 mb-4">Funnel Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
          />
          <Legend />
          <Bar dataKey="variantA" name={variantAName} fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="variantB" name={variantBName} fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
