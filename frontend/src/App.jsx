import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Radial score ring ──────────────────────────────────────────────────
function ScoreRing({ score, size = 120, strokeWidth = 10, color, label }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(Math.max(score, 0), 100);
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e293b" strokeWidth={strokeWidth}/>
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: "stroke-dashoffset 1.2s ease" }}
        />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
          fill="white" fontSize={size * 0.18} fontWeight="700">{pct}%</text>
      </svg>
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
    </div>
  );
}

// ── Horizontal bar ─────────────────────────────────────────────────────
function ScoreBar({ label, score, status }) {
  const colorMap = {
    STRONG: "#22c55e", PASS: "#84cc16", REVISE: "#f59e0b", FAIL: "#ef4444"
  };
  const color = colorMap[status] || "#64748b";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-semibold">
        <span className="text-slate-300 capitalize">{label}</span>
        <span style={{ color }}>{score}% <span className="text-[9px] opacity-70">{status}</span></span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ── Badge ──────────────────────────────────────────────────────────────
function Badge({ text, variant = "neutral" }) {
  const styles = {
    red: "bg-red-500/10 text-red-400 border border-red-500/20",
    green: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    blue: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    neutral: "bg-slate-700/50 text-slate-300 border border-slate-600/30",
    critical: "bg-rose-500/10 text-rose-300 border border-rose-500/30",
  };
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-semibold ${styles[variant]}`}>
      {text}
    </span>
  );
}

// ── Collapsible section card ───────────────────────────────────────────
function SectionCard({ name, data }) {
  const [open, setOpen] = useState(false);
  const colorMap = { STRONG: "#22c55e", PASS: "#84cc16", REVISE: "#f59e0b", FAIL: "#ef4444" };
  const color = colorMap[data.status] || "#64748b";
  return (
    <div className="border border-slate-700/50 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-slate-800/60 hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          <span className="font-bold text-sm capitalize text-slate-100">{name}</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ color, backgroundColor: `${color}15` }}>
            {data.status}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg font-black" style={{ color }}>{data.score}%</span>
          <span className="text-slate-500 text-xs">{open ? "▲" : "▼"}</span>
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4 space-y-4 bg-slate-900/50">
              <p className="text-slate-400 text-sm">{data.feedback}</p>

              {data.key_gaps?.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase text-rose-400 mb-2 tracking-widest">Key Gaps</p>
                  <div className="flex flex-wrap gap-2">
                    {data.key_gaps.map((g, i) => <Badge key={i} text={g} variant="red" />)}
                  </div>
                </div>
              )}

              {data.bullet_fixes?.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase text-amber-400 tracking-widest">Bullet Fixes</p>
                  {data.bullet_fixes.map((fix, i) => (
                    <div key={i} className="rounded-lg border border-slate-700 overflow-hidden text-xs">
                      <div className="px-3 py-2 bg-red-500/5 border-b border-slate-700">
                        <p className="text-[9px] font-bold text-red-400 mb-1 uppercase">Original</p>
                        <p className="text-slate-400 italic">{fix.original}</p>
                      </div>
                      <div className="px-3 py-2 bg-amber-500/5 border-b border-slate-700">
                        <p className="text-[9px] font-bold text-amber-400 mb-1 uppercase">Issue</p>
                        <p className="text-slate-400">{fix.issue}</p>
                      </div>
                      <div className="px-3 py-2 bg-emerald-500/5">
                        <p className="text-[9px] font-bold text-emerald-400 mb-1 uppercase">✓ Improved</p>
                        <p className="text-emerald-300">{fix.fix}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────
export default function App() {
  const [cv, setCv] = useState(null);
  const [cvName, setCvName] = useState("");
  const [jd, setJd] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rewriting, setRewriting] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [dlFormat, setDlFormat] = useState("pdf");
  const fileRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) { setCv(f); setCvName(f.name); }
  };

  const analyze = async () => {
    if (!cv || !jd.trim()) return alert("Upload your resume PDF and paste the job description.");
    setLoading(true); setError(null); setData(null);
    const form = new FormData();
    form.append("cv", cv); form.append("jd", jd);
    try {
      const res = await fetch("http://127.0.0.1:8000/v4/analyze", { method: "POST", body: form });
      if (!res.ok) throw new Error(await res.text());
      setData(await res.json());
      setActiveTab("overview");
    } catch (err) {
      setError("Backend unreachable. Ensure the FastAPI server is running on port 8000.");
      console.error(err);
    } finally { setLoading(false); }
  };

  const rewriteAndDownload = async () => {
    if (!cv || !jd.trim()) return alert("Upload resume and paste JD first.");
    setRewriting(true);
    const form = new FormData();
    form.append("cv", cv); form.append("jd", jd); form.append("format", dlFormat);
    try {
      const res = await fetch("http://127.0.0.1:8000/v4/rewrite", { method: "POST", body: form });
      if (!res.ok) throw new Error(await res.text());
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `optimized_resume.${dlFormat}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError("Resume rewrite failed. Check backend logs.");
      console.error(err);
    } finally { setRewriting(false); }
  };

  const tabs = ["overview", "sections", "keywords", "fixes"];

  return (
    <div className="min-h-screen bg-[#060a14] text-slate-100" style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-sm font-black">A</div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">ATS Surgeon Pro</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">v4</span>
          </div>
          <h1 className="text-3xl font-black text-white leading-tight">Resume Intelligence Engine</h1>
          <p className="text-slate-500 text-sm mt-1">Deep ATS analysis · Section-level scoring · AI rewrite & export</p>
        </div>

        {/* Input Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* File Upload */}
          <div
            onClick={() => fileRef.current.click()}
            className="relative group cursor-pointer border-2 border-dashed border-slate-700 hover:border-blue-500/50 rounded-2xl p-6 transition-all bg-slate-900/40"
          >
            <input type="file" accept=".pdf" ref={fileRef} onChange={handleFile} className="hidden" />
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl group-hover:border-blue-500/40 transition-colors">
                📄
              </div>
              {cvName ? (
                <>
                  <p className="text-sm font-bold text-blue-400">{cvName}</p>
                  <p className="text-[11px] text-slate-500">Click to change file</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-slate-300">Upload Resume PDF</p>
                  <p className="text-[11px] text-slate-500">Click or drag & drop</p>
                </>
              )}
            </div>
          </div>

          {/* JD Input */}
          <div className="border border-slate-700/60 rounded-2xl p-4 bg-slate-900/40">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Job Description</p>
            <textarea
              value={jd}
              onChange={e => setJd(e.target.value)}
              placeholder="Paste the full job description here..."
              className="w-full bg-transparent text-sm text-slate-300 h-28 focus:outline-none resize-none placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={analyze}
            disabled={loading}
            className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 disabled:opacity-40 transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing with AI...
              </span>
            ) : "⚡ Run Deep Analysis"}
          </button>
          {data && (
            <div className="flex gap-2">
              <select
                value={dlFormat}
                onChange={e => setDlFormat(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 text-sm text-slate-300 focus:outline-none"
              >
                <option value="pdf">PDF</option>
                <option value="docx">DOCX</option>
              </select>
              <button
                onClick={rewriteAndDownload}
                disabled={rewriting}
                className="px-5 py-3.5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 transition-colors whitespace-nowrap"
              >
                {rewriting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Rewriting...
                  </span>
                ) : "✦ AI Rewrite & Download"}
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {data && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              
              {/* Score Rings */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="col-span-3 md:col-span-1 bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-4">
                  <ScoreRing score={data.overall_score} size={140} strokeWidth={12} color="#3b82f6" label="ATS Match Score" />
                </div>
                <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-4">
                  <ScoreRing score={data.ats_compatibility} size={110} strokeWidth={10} color="#8b5cf6" label="ATS Compatibility" />
                </div>
                <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-4">
                  <ScoreRing score={data.impact_score} size={110} strokeWidth={10} color="#f59e0b" label="Impact Score" />
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mb-4 bg-slate-900/60 border border-slate-700/40 rounded-xl p-1">
                {tabs.map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors capitalize ${
                      activeTab === t ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Tab: Overview */}
              {activeTab === "overview" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Critical Issues */}
                    <div className="bg-slate-900/60 border border-rose-500/20 rounded-2xl p-5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400 mb-3">🚨 Critical Issues</p>
                      <ul className="space-y-2">
                        {data.critical_issues?.map((issue, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                            <span className="text-rose-500 mt-0.5 shrink-0">✗</span>
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Quick Wins */}
                    <div className="bg-slate-900/60 border border-emerald-500/20 rounded-2xl p-5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-3">⚡ Quick Wins</p>
                      <ul className="space-y-2">
                        {data.quick_wins?.map((win, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                            <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                            {win}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Strategy */}
                  <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/20 border border-blue-500/20 rounded-2xl p-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-2">🧠 AI Optimization Strategy</p>
                    <p className="text-slate-300 text-sm leading-relaxed">{data.optimization_strategy}</p>
                  </div>

                  {/* Section bars */}
                  <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5 space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Section Alignment</p>
                    {Object.entries(data.sections).map(([key, val]) => (
                      <ScoreBar key={key} label={key} score={val.score} status={val.status} />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Tab: Sections */}
              {activeTab === "sections" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  {Object.entries(data.sections).map(([key, val]) => (
                    <SectionCard key={key} name={key} data={val} />
                  ))}
                </motion.div>
              )}

              {/* Tab: Keywords */}
              {activeTab === "keywords" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-3">Missing Keywords</p>
                      <div className="flex flex-wrap gap-2">
                        {data.missing_keywords?.map((kw, i) => (
                          <Badge key={i} text={kw} variant="red" />
                        ))}
                      </div>
                    </div>
                    <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-3">Present Keywords</p>
                      <div className="flex flex-wrap gap-2">
                        {data.present_keywords?.map((kw, i) => (
                          <Badge key={i} text={kw} variant="green" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {data.keyword_analysis?.length > 0 && (
                    <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Keyword Intelligence</p>
                      <div className="space-y-2">
                        {data.keyword_analysis.map((kw, i) => (
                          <div key={i} className="flex items-start gap-3 py-2 border-b border-slate-800 last:border-0">
                            <span className={`shrink-0 w-4 h-4 rounded-full mt-0.5 ${kw.present ? "bg-emerald-500" : "bg-red-500"}`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-bold text-slate-200">{kw.keyword}</span>
                                <Badge
                                  text={kw.importance}
                                  variant={kw.importance === "critical" ? "critical" : kw.importance === "high" ? "red" : "amber"}
                                />
                                {!kw.present && <Badge text="MISSING" variant="red" />}
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">{kw.context}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Tab: Fixes */}
              {activeTab === "fixes" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl px-4 py-3 text-sm text-blue-300">
                    💡 All bullet-level fixes across every section. Use these or click <strong>AI Rewrite & Download</strong> to get a fully rewritten resume.
                  </div>
                  {Object.entries(data.sections).map(([secName, secData]) =>
                    secData.bullet_fixes?.length > 0 && (
                      <div key={secName}>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 capitalize">
                          {secName}
                        </p>
                        <div className="space-y-3">
                          {secData.bullet_fixes.map((fix, i) => (
                            <div key={i} className="rounded-xl border border-slate-700 overflow-hidden text-sm">
                              <div className="px-4 py-3 bg-red-500/5">
                                <p className="text-[9px] font-bold text-red-400 uppercase mb-1">Original</p>
                                <p className="text-slate-400 italic text-xs">{fix.original}</p>
                              </div>
                              <div className="px-4 py-3 bg-amber-500/5 border-y border-slate-700">
                                <p className="text-[9px] font-bold text-amber-400 uppercase mb-1">Issue</p>
                                <p className="text-slate-400 text-xs">{fix.issue}</p>
                              </div>
                              <div className="px-4 py-3 bg-emerald-500/5">
                                <p className="text-[9px] font-bold text-emerald-400 uppercase mb-1">✓ Improved Version</p>
                                <p className="text-emerald-300 text-xs">{fix.fix}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </motion.div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-12 text-center text-[10px] text-slate-700">
          ATS Surgeon Pro v4 · Powered by Anthropic Claude + Sentence Transformers
        </div>
      </div>
    </div>
  );
}
