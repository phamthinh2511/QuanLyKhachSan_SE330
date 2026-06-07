import clsx from "clsx";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  iconBg: string;
}

export default function StatCard({ title, value, icon, iconBg }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={clsx("p-3 rounded-xl", iconBg)}>
        {icon}
      </div>
    </div>
  );
}