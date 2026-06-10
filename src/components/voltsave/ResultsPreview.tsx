import { motion } from "framer-motion";
import { ShieldCheck, Lock, FileKey2, ServerCog, Eye, ScrollText, Check } from "lucide-react";

const securityItems = [
  { icon: Lock, title: "AES-256 at rest, TLS 1.3 in transit", desc: "Bills are encrypted on upload and processed inside an isolated worker pool." },
  { icon: FileKey2, title: "Account numbers are hashed", desc: "PII is SHA-256 hashed before persistence. Raw bill files auto-purge after 24 hours." },
  { icon: ServerCog, title: "Region-isolated processing", desc: "Bills can be pinned to EU, US, or APAC regions. No cross-region replication by default." },
  { icon: Eye, title: "Auditable evidence trail", desc: "Every recommendation links back to the extracted line items, regional benchmarks, and rule version that produced it." },
  { icon: ScrollText, title: "SOC 2 Type II ready", desc: "Continuous control monitoring via Vanta. DPA and SCC available on request." },
  { icon: ShieldCheck, title: "No model training on your data", desc: "Customer bills are never used to train upstream LLMs. Bring-your-own-key (BYOK) supported on Enterprise." },
];

const tiers = [
  {
    name: "Starter",
    price: "Free",
    cadence: "",
    desc: "For individuals analyzing a few bills.",
    cta: "Start free",
    features: ["3 analyses / month", "Basic effective rate metrics", "Tariff classification", "Region benchmarks", "Email support"],
  },
  {
    name: "Pro",
    price: "₹499",
    cadence: "/month",
    desc: "For households and small businesses tracking spend.",
    cta: "Start 14-day trial",
    highlight: true,
    features: ["Unlimited analyses", "Full recommendation engine", "Peak-hour & slab strategies", "PDF reports", "Appliance reconciliation", "Priority processing"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    desc: "For utilities, energy auditors, and ESG teams.",
    cta: "Contact sales",
    features: ["Multi-tenant workspace", "API & webhooks", "BYOK / private LLM", "SSO + SAML", "Custom provider onboarding", "SOC 2 + DPA"],
  },
];

const ResultsPreview = () => {
  return (
    <>
      {/* Security */}
      <section id="security" className="py-20 md:py-24 border-b border-slate-200 bg-white">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 mb-3">Security & trust</p>
              <h2 className="text-[28px] md:text-[34px] font-semibold tracking-tight text-slate-900 leading-tight">
                Built for teams that audit before they adopt.
              </h2>
              <p className="mt-3 text-[14.5px] text-slate-600 leading-relaxed">
                VoltSave handles financial documents. Security is treated as an engineering discipline, not a marketing badge.
              </p>
            </div>
            <div className="lg:col-span-8 grid sm:grid-cols-2 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden">
              {securityItems.map((s) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-5"
                >
                  <s.icon className="w-4 h-4 text-slate-700 mb-2" />
                  <p className="text-[13px] font-semibold text-slate-900">{s.title}</p>
                  <p className="text-[12px] text-slate-600 leading-relaxed mt-1">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-24 border-b border-slate-200 bg-slate-50/60">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 mb-3">Pricing</p>
            <h2 className="text-[28px] md:text-[34px] font-semibold tracking-tight text-slate-900 leading-tight">
              Transparent pricing, predictable bills.
            </h2>
            <p className="mt-3 text-[14.5px] text-slate-600 leading-relaxed">
              Start free. Upgrade when you need recurring intelligence on every bill cycle.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={`bg-white border rounded-lg p-6 flex flex-col ${
                  t.highlight ? "border-slate-900 shadow-[0_0_0_1px_rgba(15,23,42,0.9)]" : "border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[13px] font-semibold text-slate-900">{t.name}</p>
                  {t.highlight && <span className="text-[10px] mono uppercase tracking-wider text-white bg-slate-900 px-1.5 py-0.5 rounded">Recommended</span>}
                </div>
                <p className="text-[12px] text-slate-600">{t.desc}</p>
                <p className="mt-4 text-[28px] font-semibold text-slate-900 tnum">
                  {t.price}<span className="text-[13px] text-slate-500 font-normal ml-1">{t.cadence}</span>
                </p>
                <button
                  className={`mt-4 h-9 rounded-md text-[13px] font-semibold transition-colors ${
                    t.highlight
                      ? "bg-slate-900 text-white hover:bg-slate-800"
                      : "border border-slate-300 text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  {t.cta}
                </button>
                <ul className="mt-5 space-y-2 pt-5 border-t border-slate-100">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[12.5px] text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ResultsPreview;
