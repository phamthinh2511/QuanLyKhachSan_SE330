import { Pencil, Trash2 } from "lucide-react";
import { Service } from "@/types/service";

interface Props {
  services: Service[];
  onEdit: (s: Service) => void;
  onDelete: (id: number) => void;
  isAdmin?: boolean;
}

export default function ServiceGrid({ services, onEdit, onDelete, isAdmin = true }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {services.map((s) => (
        <div key={s.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-lg">
                ✨
              </div>
              <div>
                <p className="font-semibold text-gray-800">{s.name}</p>
              </div>
            </div>
            {isAdmin && (
              <div className="flex gap-1">
                <button onClick={() => onEdit(s)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(s.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-500 text-sm">{s.description}</p>

          {/* Price */}
          <div>
            <p className="text-xs text-gray-400">Giá</p>
            <p className="text-xl font-bold text-blue-600">{s.price.toLocaleString("vi-VN")} VNĐ</p>
          </div>
        </div>
      ))}
    </div>
  );
}