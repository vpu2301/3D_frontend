
interface ActivityItemProps {
  id: number;
  type: string;
  message: string;
  time: string;
  status: 'success' | 'error' | 'info' | 'running';
}

const ActivityItem = ({ message, time, status }: ActivityItemProps) => {
  const renderIcon = () => {
    if (status === 'running') {
      return (
        <div className="w-7 h-7 rounded-full border-2 border-pink-300 flex items-center justify-center flex-shrink-0">
          <div className="w-3 h-3 rounded-full bg-pink-400 animate-pulse" />
        </div>
      );
    }
    // success, info, error — all use circled check variant
    const borderColor = status === 'error' ? 'border-red-300' : 'border-green-400';
    const strokeColor = status === 'error' ? '#ef4444' : '#22c55e';
    return (
      <div className={`w-7 h-7 rounded-full border-2 ${borderColor} flex items-center justify-center flex-shrink-0`}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2.5 7L5.5 10L11.5 4" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    );
  };

  return (
    <div className="flex items-center px-4 py-3 bg-white/60 border border-gray-200/70 rounded-2xl gap-3">
      {renderIcon()}
      <span className="flex-1 text-gray-800 text-sm font-medium">{message}</span>
      <span className="text-gray-400 text-sm whitespace-nowrap">
        {status === 'running' ? 'Running' : time}
      </span>
    </div>
  );
};

export default ActivityItem;
