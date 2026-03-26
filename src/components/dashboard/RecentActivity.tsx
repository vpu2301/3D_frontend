
import ActivityItem from './ActivityItem';

const RecentActivity = () => {
  const activities = [
    { id: 1, type: 'automation', message: 'Weekly report drafted and sent', time: '2 min ago', status: 'success' as const },
    { id: 2, type: 'task', message: 'Meeting notes summarized → Notion', time: '14 min ago', status: 'success' as const },
    { id: 3, type: 'automation', message: 'Q4 budget analysis in progress...', time: '', status: 'running' as const },
  ];

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <ActivityItem key={activity.id} {...activity} />
      ))}
    </div>
  );
};

export default RecentActivity;
