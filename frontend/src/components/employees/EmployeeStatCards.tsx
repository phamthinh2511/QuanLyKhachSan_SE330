import { Employee } from "@/types/employee";
import { Users, UserCheck, Briefcase, Network } from "lucide-react";

interface Props { employees: Employee[] }

export default function EmployeeStatCards({ employees }: Props) {
  const total      = employees.length;
  const active     = employees.filter((e) => e.status === "Đang làm việc").length;
  const departments = new Set(employees.map((e) => e.department)).size;
  const positions   = new Set(employees.map((e) => e.position)).size;

  const cards = [
    { 
      label: "Tổng nhân viên", 
      value: String(total), 
      color: "text-blue-600",
      icon: <Users className="w-5 h-5 text-blue-600" />,
      iconBg: "bg-blue-50 border border-blue-100"
    },
    { 
      label: "Đang làm việc", 
      value: String(active), 
      color: "text-emerald-600",
      icon: <UserCheck className="w-5 h-5 text-emerald-600" />,
      iconBg: "bg-emerald-50 border border-emerald-100"
    },
    { 
      label: "Phòng ban", 
      value: String(departments), 
      color: "text-purple-600",
      icon: <Network className="w-5 h-5 text-purple-600" />,
      iconBg: "bg-purple-50 border border-purple-100"
    },
    { 
      label: "Vị trí", 
      value: String(positions), 
      color: "text-amber-600",
      icon: <Briefcase className="w-5 h-5 text-amber-600" />,
      iconBg: "bg-amber-50 border border-amber-100"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-start justify-between hover:-translate-y-1.5 hover:translate-x-1.5 hover:shadow-lg transition-all duration-300 cursor-pointer">
          <div>
            <p className="text-gray-400 text-sm mb-1 font-medium">{c.label}</p>
            <p className={`text-2xl font-bold tracking-tight ${c.color}`}>{c.value}</p>
          </div>
          <div className={`p-3 rounded-xl ${c.iconBg}`}>
            {c.icon}
          </div>
        </div>
      ))}
    </div>
  );
}