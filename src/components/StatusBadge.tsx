interface Props {
  status: 'running' | 'completed' | 'paused';
}

export default function StatusBadge({ status }: Props) {
  const styles = {
    running: 'bg-emerald-100 text-emerald-700',
    completed: 'bg-blue-100 text-blue-700',
    paused: 'bg-gray-100 text-gray-600',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {status === 'running' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
