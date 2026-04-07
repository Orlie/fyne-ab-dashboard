import { percentDiff } from '@/lib/parse';

interface Props {
  label: string;
  valueA: number;
  valueB: number;
  format?: 'number' | 'percent' | 'currency';
}

export default function ComparisonRow({ label, valueA, valueB, format = 'number' }: Props) {
  const diff = percentDiff(valueA, valueB);
  const aWins = valueA > valueB;

  function fmt(v: number) {
    switch (format) {
      case 'percent': return `${(v * 100).toFixed(1)}%`;
      case 'currency': return `$${v.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
      default: return v.toLocaleString();
    }
  }

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600 w-32">{label}</span>
      <span className={`text-sm font-semibold w-28 text-right ${aWins ? 'text-emerald-600' : 'text-gray-900'}`}>
        {fmt(valueA)}
      </span>
      <span className={`text-sm font-semibold w-28 text-right ${!aWins ? 'text-emerald-600' : 'text-gray-900'}`}>
        {fmt(valueB)}
      </span>
      <span className={`text-xs w-20 text-right font-medium ${
        diff > 0 ? 'text-emerald-600' : diff < 0 ? 'text-red-500' : 'text-gray-400'
      }`}>
        {diff > 0 ? '+' : ''}{diff.toFixed(1)}%
      </span>
    </div>
  );
}
