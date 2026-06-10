import { Activity } from "lucide-react";

const cols = [
  {
    title: "Platform",
    links: ["Pipeline overview", "Tariff classification", "Cost engine", "Recommendation engine", "Confidence framework"],
  },
  {
    title: "Resources",
    links: ["Documentation", "API reference", "Provider registry", "Changelog", "Status"],
  },
  {
    title: "Company",
    links: ["About", "Customers", "Careers", "Press", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "DPA", "Security", "Subprocessors"],
  },
];

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900">
      <div className="max-w-[1280px] mx-auto px-6 py-14">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center">
                <Activity className="w-4 h-4 text-slate-900" strokeWidth={2.5} />
              </div>
              <span className="font-semibold text-[15px] tracking-tight text-white">VoltSave</span>
              <span className="ml-1 text-[10px] font-semibold tracking-wider text-slate-300 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 uppercase">AI</span>
            </div>
            <p className="mt-4 text-[12.5px] text-slate-400 leading-relaxed max-w-sm">
              Enterprise tariff intelligence and electricity cost-recovery analytics.
            </p>
            <p className="mt-6 text-[10.5px] mono text-slate-500">SOC 2 Type II · ISO 27001 in progress · GDPR · DPDP-IN</p>
          </div>
          {cols.map((col) => (
            <div key={col.title} className="md:col-span-2">
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-3">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-[12.5px] text-slate-300 hover:text-white transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-3 text-[11.5px] text-slate-500">
          <p>© {new Date().getFullYear()} VoltSave AI Inc. All rights reserved.</p>
          <p className="mono">build · 2025.11.08 · region · ap-south-1</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;