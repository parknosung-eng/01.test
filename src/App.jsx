import { useState, useEffect, useCallback } from "react";

const COLORS = {
  bg: "#080c10", bg2: "#0d1117", bg3: "#131920",
  border: "#1e2d3d", border2: "#243447",
  text: "#c8d6e5", text2: "#7a9ab8", text3: "#4a6a88",
  green: "#00d4aa", red: "#ff4d6a", yellow: "#f5c842", blue: "#0099ff",
  purple: "#9b72ff"
};

const PRESETS = [
  { label: "삼성전자", code: "005930" },
  { label: "SK하이닉스", code: "000660" },
  { label: "NAVER", code: "035420" },
  { label: "카카오", code: "035720" },
  { label: "현대차", code: "005380" },
  { label: "LG에너지솔루션", code: "373220" },
  { label: "POSCO홀딩스", code: "005490" },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #080c10; }
  .fa-app { font-family: 'Noto Sans KR', sans-serif; background: #080c10; color: #c8d6e5; min-height: 100vh; font-size: 14px; }
  .mono { font-family: 'IBM Plex Mono', monospace; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .pulse { animation: pulse 2s infinite; }
  .spin { animation: spin 0.8s linear infinite; }
  .fadeIn { animation: fadeIn 0.4s ease forwards; }
  .score-card { transition: border-color 0.2s, transform 0.2s; }
  .score-card:hover { border-color: #243447 !important; transform: translateY(-1px); }
  .analyze-btn:hover { background: #00f0c0 !important; transform: translateY(-1px); }
  .analyze-btn { transition: all 0.2s; }
  .meter-fill { transition: width 0.9s cubic-bezier(0.16, 1, 0.3, 1); }
  ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0d1117; } ::-webkit-scrollbar-thumb { background: #1e2d3d; border-radius: 2px; }
`;

function MeterBar({ pct, color }) {
  return (
    <div style={{ height: 4, background: "#131920", borderRadius: 2, overflow: "hidden", marginTop: 8 }}>
      <div className="meter-fill" style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 2 }} />
    </div>
  );
}

function ScoreCard({ label, score, sub, trend }) {
  const color = trend === "pos" ? COLORS.green : trend === "neg" ? COLORS.red : COLORS.yellow;
  const topColor = trend === "pos" ? COLORS.green : trend === "neg" ? COLORS.red : COLORS.yellow;
  return (
    <div className="score-card" style={{
      background: COLORS.bg2, border: `1px solid ${COLORS.border}`, borderRadius: 6,
      padding: 16, position: "relative", overflow: "hidden"
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: topColor }} />
      <div className="mono" style={{ fontSize: 10, color: COLORS.text3, marginBottom: 8, letterSpacing: "0.05em" }}>{label}</div>
      <div className="mono" style={{ fontSize: 30, fontWeight: 600, color, lineHeight: 1, marginBottom: 4 }}>{score}</div>
      <div style={{ fontSize: 11.5, color: COLORS.text2 }}>{sub}</div>
      <MeterBar pct={score} color={color} />
    </div>
  );
}

function FlowBar({ label, val }) {
  const pct = Math.min(Math.abs(val) / 1.5, 46);
  const isPos = val >= 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
      <div className="mono" style={{ width: 100, textAlign: "right", fontSize: 11, color: COLORS.text2, flexShrink: 0 }}>{label}</div>
      <div style={{ flex: 1, height: 22, background: COLORS.bg3, borderRadius: 3, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: COLORS.border2 }} />
        <div style={{
          position: "absolute", [isPos ? "left" : "right"]: "50%",
          top: 2, bottom: 2, borderRadius: 2,
          width: `${pct}%`, background: isPos ? COLORS.green : COLORS.red, opacity: 0.75
        }} />
      </div>
      <div className="mono" style={{ width: 48, fontSize: 11.5, textAlign: "right", color: isPos ? COLORS.green : COLORS.red, flexShrink: 0 }}>
        {val > 0 ? "+" : ""}{val}
      </div>
    </div>
  );
}

function SignalItem({ name, active, type, desc }) {
  const typeColor = { green: COLORS.green, red: COLORS.red, yellow: COLORS.yellow }[type] || COLORS.green;
  const icons = { green: "▲", red: "▼", yellow: "◆" };
  return (
    <div style={{ background: COLORS.bg3, border: `1px solid ${COLORS.border}`, borderRadius: 5, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, flexShrink: 0,
        background: active ? `${typeColor}22` : "rgba(74,106,136,0.15)",
        color: active ? typeColor : COLORS.text3,
        filter: active ? "none" : "grayscale(1)"
      }}>{icons[type] || "●"}</div>
      <div>
        <div style={{ fontSize: 11.5, color: COLORS.text, marginBottom: 2 }}>
          {name} <span className="mono" style={{ fontSize: 10, color: active ? typeColor : COLORS.text3 }}>{active ? "●활성" : "○비활성"}</span>
        </div>
        <div style={{ fontSize: 10.5, color: COLORS.text3 }}>{desc}</div>
      </div>
    </div>
  );
}

export default function App() {
  const [stockName, setStockName] = useState("");
  const [stockCode, setStockCode] = useState("");
  const [period, setPeriod] = useState("20");
  const [consec, setConsec] = useState("5");
  const [sensitivity, setSensitivity] = useState("mid");
  const [fxInclude, setFxInclude] = useState("yes");
  const [wF, setWF] = useState(40); const [wI, setWI] = useState(35);
  const [wC, setWC] = useState(15); const [wD, setWD] = useState(10);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [clock, setClock] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString("ko-KR", { hour12: false }));
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);

  const runAnalysis = useCallback(async () => {
    if (!stockName && !stockCode) { setError("종목명 또는 코드를 입력하세요."); return; }
    setError(""); setLoading(true);

    const prompt = `당신은 한국 주식시장 수급 분석 전문가입니다.
종목: ${stockName || "미지정"} (${stockCode || "코드미입력"})
분석기간: ${period}일 / 연속기준: ${consec}일 / 민감도: ${sensitivity} / 환율: ${fxInclude}
가중치: 외국인${wF}% 기관${wI}% 연속성${wC}% 괴리${wD}%

아래 JSON 형식으로만 응답하세요. 마크다운 없이 순수 JSON만.
{
  "stockName":"종목명","stockCode":"코드",
  "totalScore":<0-100>,
  "signal":"STRONG_BUY|BUY|NEUTRAL|SELL|STRONG_SELL",
  "signalKr":"강력매수|매수|중립|매도|강력매도",
  "verdictTitle":"한줄평가(15자이내)",
  "verdictSub":"상세평가(60자이내)",
  "tags":["태그1","태그2","태그3"],
  "tagTypes":["green|red|yellow|blue","...","..."],
  "scores":{
    "foreignScore":<0-100>,"foreignLabel":"외국인 수급","foreignSub":"설명20자이내","foreignTrend":"pos|neg|neu",
    "institutionScore":<0-100>,"institutionLabel":"기관 수급","institutionSub":"설명20자이내","institutionTrend":"pos|neg|neu",
    "consecScore":<0-100>,"consecLabel":"연속성","consecSub":"설명20자이내","consecTrend":"pos|neg|neu",
    "divergScore":<0-100>,"divergLabel":"괴리신호","divergSub":"설명20자이내","divergTrend":"pos|neg|neu"
  },
  "flowData":[
    {"date":"1일전","foreign":<-100~100>,"institution":<-100~100>,"individual":<-100~100>},
    {"date":"2일전","foreign":<-100~100>,"institution":<-100~100>,"individual":<-100~100>},
    {"date":"3일전","foreign":<-100~100>,"institution":<-100~100>,"individual":<-100~100>},
    {"date":"4일전","foreign":<-100~100>,"institution":<-100~100>,"individual":<-100~100>},
    {"date":"5일전","foreign":<-100~100>,"institution":<-100~100>,"individual":<-100~100>}
  ],
  "institutionBreakdown":{
    "pension":<-100~100>,"trust":<-100~100>,"insurance":<-100~100>,"bank":<-100~100>,"foreign_prog":<-100~100>
  },
  "signals":[
    {"name":"동반매수 신호","active":<true|false>,"type":"green|red|yellow","desc":"설명"},
    {"name":"연속순매수","active":<true|false>,"type":"green|red|yellow","desc":"설명"},
    {"name":"주가괴리 축적","active":<true|false>,"type":"green|red|yellow","desc":"설명"},
    {"name":"분배국면","active":<true|false>,"type":"red","desc":"설명"},
    {"name":"환율 리스크","active":<true|false>,"type":"yellow","desc":"설명"},
    {"name":"비차익 프로그램","active":<true|false>,"type":"green|yellow","desc":"설명"}
  ],
  "riskLevel":<1-5>,
  "accumulationPct":<0-100>,
  "distributionPct":<0-100>,
  "keyFindings":["핵심발견1(30자이내)","핵심발견2(30자이내)","핵심발견3(30자이내)"]
}`;

    try {
      const resp = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error?.message || data.error || "API 오류");
      }
      const raw = (data.content || []).map(c => c.text || "").join("");
      const clean = raw.replace(/```json|```/g, "").trim();
      setResult(JSON.parse(clean));
    } catch (e) {
      setError("분석 오류: " + e.message); console.error(e);
    } finally { setLoading(false); }
  }, [stockName, stockCode, period, consec, sensitivity, fxInclude, wF, wI, wC, wD]);

  const trendColor = (t) => t === "pos" ? COLORS.green : t === "neg" ? COLORS.red : COLORS.yellow;
  const tagColor = (t) => ({ green: COLORS.green, red: COLORS.red, yellow: COLORS.yellow, blue: COLORS.blue }[t] || COLORS.blue);
  const sigColor = (score) => score >= 70 ? COLORS.green : score <= 40 ? COLORS.red : COLORS.yellow;

  const inputStyle = { background: COLORS.bg3, border: `1px solid ${COLORS.border2}`, color: COLORS.text, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, padding: "8px 10px", borderRadius: 4, outline: "none", width: "100%" };
  const selectSmall = { ...inputStyle, width: 72, textAlign: "right" };

  return (
    <>
      <style>{css}</style>
      <div className="fa-app">
        {/* HEADER */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderBottom: `1px solid ${COLORS.border}`, background: COLORS.bg2, position: "sticky", top: 0, zIndex: 100 }}>
          <div className="mono" style={{ fontSize: 13, fontWeight: 600, color: COLORS.green, letterSpacing: "0.15em" }}>
            FLOW<span style={{ color: COLORS.text3, fontWeight: 300 }}>/</span>ANALYZER
          </div>
          <div className="mono" style={{ display: "flex", gap: 20, fontSize: 11, color: COLORS.text3 }}>
            <span><span className="pulse" style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: COLORS.green, marginRight: 6 }} />AI-POWERED</span>
            <span>{clock}</span>
            <span>KRX MARKET</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", minHeight: "calc(100vh - 53px)" }}>
          {/* SIDEBAR */}
          <div style={{ background: COLORS.bg2, borderRight: `1px solid ${COLORS.border}`, padding: "20px 16px", overflowY: "auto" }}>

            <div className="mono" style={{ fontSize: 10, color: COLORS.text3, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>종목 선택</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 20 }}>
              <select style={inputStyle} onChange={e => { const v = e.target.value; if (v) { const [n, c] = v.split("|"); setStockName(n); setStockCode(c); } }}>
                <option value="">— 프리셋 —</option>
                {PRESETS.map(p => <option key={p.code} value={`${p.label}|${p.code}`}>{p.label} ({p.code})</option>)}
              </select>
              <input style={inputStyle} placeholder="종목명" value={stockName} onChange={e => setStockName(e.target.value)} />
              <input style={inputStyle} placeholder="종목코드" value={stockCode} onChange={e => setStockCode(e.target.value)} />
              {error && <div style={{ fontSize: 11, color: COLORS.red }}>{error}</div>}
              <button className="analyze-btn" onClick={runAnalysis} disabled={loading}
                style={{ background: COLORS.green, color: COLORS.bg, fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 700, padding: "10px", border: "none", borderRadius: 4, cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase", opacity: loading ? 0.6 : 1 }}>
                {loading ? "분석 중..." : "▶ 분석 실행"}
              </button>
            </div>

            <div className="mono" style={{ fontSize: 10, color: COLORS.text3, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>파라미터</div>
            {[
              ["분석 기간", <select style={selectSmall} value={period} onChange={e => setPeriod(e.target.value)}><option value="5">5일</option><option value="10">10일</option><option value="20">20일</option><option value="60">60일</option></select>],
              ["연속기준일", <select style={selectSmall} value={consec} onChange={e => setConsec(e.target.value)}><option value="3">3일</option><option value="5">5일</option><option value="10">10일</option></select>],
              ["민감도", <select style={selectSmall} value={sensitivity} onChange={e => setSensitivity(e.target.value)}><option value="low">낮음</option><option value="mid">중간</option><option value="high">높음</option></select>],
              ["환율반영", <select style={selectSmall} value={fxInclude} onChange={e => setFxInclude(e.target.value)}><option value="yes">포함</option><option value="no">제외</option></select>],
            ].map(([label, ctrl]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: `1px solid rgba(30,45,61,0.4)` }}>
                <span style={{ fontSize: 12, color: COLORS.text2 }}>{label}</span>{ctrl}
              </div>
            ))}

            <div className="mono" style={{ fontSize: 10, color: COLORS.text3, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 18, marginBottom: 10 }}>가중치 (%)</div>
            {[["외국인", wF, setWF], ["기관", wI, setWI], ["연속성", wC, setWC], ["괴리", wD, setWD]].map(([label, val, set]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: `1px solid rgba(30,45,61,0.4)` }}>
                <span style={{ fontSize: 12, color: COLORS.text2 }}>{label}</span>
                <input type="number" style={{ ...selectSmall, width: 65 }} value={val} min={0} max={100} onChange={e => set(Number(e.target.value))} />
              </div>
            ))}
          </div>

          {/* CONTENT */}
          <div style={{ padding: 24, overflowY: "auto" }}>
            {loading && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 16 }}>
                <div className="spin" style={{ width: 36, height: 36, border: `2px solid ${COLORS.border2}`, borderTopColor: COLORS.green, borderRadius: "50%" }} />
                <div className="mono" style={{ fontSize: 12, color: COLORS.text2, letterSpacing: "0.1em" }}>AI 수급 분석 중...</div>
              </div>
            )}

            {!loading && !result && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 12, color: COLORS.text3 }}>
                <svg width="56" height="56" viewBox="0 0 60 60" fill="none">
                  <rect x="8" y="30" width="8" height="22" rx="2" fill="#1e2d3d"/>
                  <rect x="20" y="18" width="8" height="34" rx="2" fill="#243447"/>
                  <rect x="32" y="8" width="8" height="44" rx="2" fill="#2a3d52"/>
                  <rect x="44" y="22" width="8" height="30" rx="2" fill="#1e2d3d"/>
                  <path d="M12 22L24 14L36 4L48 18" stroke="#00d4aa" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
                </svg>
                <div className="mono" style={{ fontSize: 13, letterSpacing: "0.1em" }}>종목을 선택하고 분석 실행</div>
                <div style={{ fontSize: 12 }}>기관·외국인 수급을 AI가 정량 분석합니다</div>
              </div>
            )}

            {!loading && result && (
              <div className="fadeIn" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {/* VERDICT */}
                <div style={{ background: COLORS.bg2, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "18px 24px", display: "flex", alignItems: "center", gap: 24 }}>
                  <div className="mono" style={{ fontSize: 52, fontWeight: 700, color: sigColor(result.totalScore), lineHeight: 1, minWidth: 90 }}>{result.totalScore}</div>
                  <div style={{ width: 1, height: 56, background: COLORS.border2 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{result.verdictTitle} <span className="mono" style={{ fontSize: 12, color: sigColor(result.totalScore), fontWeight: 400 }}>[{result.signalKr}]</span></div>
                    <div style={{ fontSize: 13, color: COLORS.text2, lineHeight: 1.6 }}>{result.verdictSub}</div>
                    <div style={{ display: "flex", gap: 7, marginTop: 10, flexWrap: "wrap" }}>
                      {(result.tags || []).map((t, i) => (
                        <span key={i} className="mono" style={{ fontSize: 10.5, padding: "2px 8px", borderRadius: 3, border: `1px solid ${tagColor(result.tagTypes?.[i])}44`, color: tagColor(result.tagTypes?.[i]), background: `${tagColor(result.tagTypes?.[i])}0a` }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SCORE CARDS */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                  {["foreign","institution","consec","diverg"].map(k => (
                    <ScoreCard key={k}
                      label={result.scores[`${k}Label`]}
                      score={result.scores[`${k}Score`]}
                      sub={result.scores[`${k}Sub`]}
                      trend={result.scores[`${k}Trend`]}
                    />
                  ))}
                </div>

                {/* PANELS ROW 1 */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {/* 일별 동향 */}
                  <div style={{ background: COLORS.bg2, border: `1px solid ${COLORS.border}`, borderRadius: 6, overflow: "hidden" }}>
                    <div style={{ padding: "11px 16px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span className="mono" style={{ fontSize: 10, color: COLORS.text2, letterSpacing: "0.1em", textTransform: "uppercase" }}>일별 순매수 동향</span>
                      <span className="mono" style={{ fontSize: 10, padding: "2px 7px", borderRadius: 3, background: `${COLORS.blue}18`, color: COLORS.blue }}>5-DAY</span>
                    </div>
                    <div style={{ padding: 16 }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'IBM Plex Mono',monospace", fontSize: 12 }}>
                        <thead>
                          <tr>{["기간","외국인","기관","개인"].map(h => <th key={h} style={{ textAlign: "left", padding: "5px 8px", color: COLORS.text3, fontSize: 10, fontWeight: 400, letterSpacing: "0.08em", borderBottom: `1px solid ${COLORS.border}` }}>{h}</th>)}</tr>
                        </thead>
                        <tbody>
                          {(result.flowData || []).map((r, i) => (
                            <tr key={i}>
                              <td style={{ padding: "8px 8px", borderBottom: `1px solid rgba(30,45,61,0.3)`, color: COLORS.text2 }}>{r.date}</td>
                              {["foreign","institution","individual"].map(k => (
                                <td key={k} style={{ padding: "8px 8px", borderBottom: `1px solid rgba(30,45,61,0.3)`, color: r[k] > 0 ? COLORS.green : COLORS.red }}>{r[k] > 0 ? "+" : ""}{r[k]}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 기관 세부 */}
                  <div style={{ background: COLORS.bg2, border: `1px solid ${COLORS.border}`, borderRadius: 6, overflow: "hidden" }}>
                    <div style={{ padding: "11px 16px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span className="mono" style={{ fontSize: 10, color: COLORS.text2, letterSpacing: "0.1em", textTransform: "uppercase" }}>기관 세부 주체</span>
                      <span className="mono" style={{ fontSize: 10, padding: "2px 7px", borderRadius: 3, background: `${COLORS.blue}18`, color: COLORS.blue }}>BREAKDOWN</span>
                    </div>
                    <div style={{ padding: 16 }}>
                      {[["연기금", result.institutionBreakdown?.pension], ["투신", result.institutionBreakdown?.trust], ["보험", result.institutionBreakdown?.insurance], ["은행", result.institutionBreakdown?.bank], ["외국계 프로그램", result.institutionBreakdown?.foreign_prog]].map(([label, val]) => (
                        <FlowBar key={label} label={label} val={val || 0} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* PANELS ROW 2 */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {/* 신호 탐지 */}
                  <div style={{ background: COLORS.bg2, border: `1px solid ${COLORS.border}`, borderRadius: 6, overflow: "hidden" }}>
                    <div style={{ padding: "11px 16px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span className="mono" style={{ fontSize: 10, color: COLORS.text2, letterSpacing: "0.1em", textTransform: "uppercase" }}>수급 신호 탐지</span>
                      <span className="mono" style={{ fontSize: 10, padding: "2px 7px", borderRadius: 3, background: `${COLORS.green}18`, color: COLORS.green }}>SIGNALS</span>
                    </div>
                    <div style={{ padding: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {(result.signals || []).map((s, i) => <SignalItem key={i} {...s} />)}
                    </div>
                  </div>

                  {/* 축적/분배 */}
                  <div style={{ background: COLORS.bg2, border: `1px solid ${COLORS.border}`, borderRadius: 6, overflow: "hidden" }}>
                    <div style={{ padding: "11px 16px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span className="mono" style={{ fontSize: 10, color: COLORS.text2, letterSpacing: "0.1em", textTransform: "uppercase" }}>축적·분배 국면</span>
                      <span className="mono" style={{ fontSize: 10, padding: "2px 7px", borderRadius: 3, background: `${COLORS.yellow}18`, color: COLORS.yellow }}>PHASE</span>
                    </div>
                    <div style={{ padding: 16 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                        {[["ACCUMULATION", result.accumulationPct, COLORS.green], ["DISTRIBUTION", result.distributionPct, COLORS.red]].map(([lbl, pct, col]) => (
                          <div key={lbl}>
                            <div className="mono" style={{ fontSize: 10, color: COLORS.text3, marginBottom: 6 }}>{lbl}</div>
                            <div className="mono" style={{ fontSize: 26, fontWeight: 700, color: col, lineHeight: 1 }}>{pct}%</div>
                            <MeterBar pct={pct} color={col} />
                          </div>
                        ))}
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <div className="mono" style={{ fontSize: 10, color: COLORS.text3, marginBottom: 6 }}>리스크 레벨 ({result.riskLevel}/5)</div>
                        <div style={{ display: "flex", gap: 4 }}>
                          {Array.from({ length: 5 }, (_, i) => {
                            const filled = i < result.riskLevel;
                            const col = result.riskLevel <= 2 ? COLORS.green : result.riskLevel <= 3 ? COLORS.yellow : COLORS.red;
                            return <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: filled ? col : COLORS.bg3, border: `1px solid ${filled ? col : COLORS.border2}` }} />;
                          })}
                        </div>
                      </div>
                      <div>
                        <div className="mono" style={{ fontSize: 10, color: COLORS.text3, marginBottom: 6, letterSpacing: "0.08em" }}>핵심 발견</div>
                        {(result.keyFindings || []).map((f, i) => (
                          <div key={i} style={{ padding: "7px 0", borderBottom: `1px solid rgba(30,45,61,0.4)`, fontSize: 12.5, color: COLORS.text2 }}>
                            <span className="mono" style={{ color: COLORS.green, marginRight: 8 }}>›</span>{f}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
