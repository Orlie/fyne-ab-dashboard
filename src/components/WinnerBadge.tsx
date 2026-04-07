interface Props {
  confidence: 'high' | 'medium' | 'low';
  winner?: string;
}

export default function WinnerBadge({ confidence, winner }: Props) {
  const styles = {
    high: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  const labels = {
    high: 'Clear Winner',
    medium: 'Likely Winner',
    low: 'Needs More Data',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${styles[confidence]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        confidence === 'high' ? 'bg-emerald-500' : confidence === 'medium' ? 'bg-yellow-500' : 'bg-gray-400'
      }`} />
      {labels[confidence]}{winner ? `: ${winner}` : ''}
    </span>
  );
}
