
interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  bgColor: string;
}

const MetricCard = ({ title, value, subtitle, bgColor }: MetricCardProps) => {
  return (
    <div className={`${bgColor} rounded-3xl p-6 flex flex-col`}>
      <p className="text-5xl font-bold text-gray-900 mb-2">{value}</p>
      <p className="text-gray-700 font-medium text-base">{title}</p>
      <p className="text-gray-500 text-sm mt-0.5">{subtitle}</p>
    </div>
  );
};

export default MetricCard;
