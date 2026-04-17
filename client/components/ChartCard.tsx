interface ChartCardProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg: string;
  children: React.ReactNode;
}

export default function ChartCard({ title, subtitle, icon, iconBg, children }: ChartCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col h-full">
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shadow-inner`}>
          {icon}
        </div>
        <div>
          <h3 className="font-black text-slate-800 text-sm tracking-tight">{title}</h3>
          {subtitle && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{subtitle}</p>}
        </div>
      </div>
      <div className="flex-1 w-full min-h-[220px]">
        {children}
      </div>
    </div>
  );
}
