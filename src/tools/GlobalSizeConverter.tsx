import { useState } from "react";
import { Ruler, RefreshCw, Layers } from "lucide-react";

export default function GlobalSizeConverter() {
  const [activeTab, setActiveTab] = useState<"shoes" | "clothing" | "hats" | "rings">("shoes");

  // --- Shoes State ---
  const [shoesGender, setShoesGender] = useState<"men" | "women">("men");
  const [shoesSize, setShoesSize] = useState<number>(270);

  // --- Clothing State ---
  const [clothingType, setClothingType] = useState<"top" | "bottom">("top");
  const [clothingGender, setClothingGender] = useState<"men" | "women">("men");
  const [topsSize, setTopsSize] = useState<string>("100 (L)");
  const [bottomsSize, setBottomsSize] = useState<number>(30);

  // --- Hats State ---
  const [hatCircumference, setHatCircumference] = useState<number>(57.0);

  // --- Rings State ---
  const [ringCircumference, setRingCircumference] = useState<string>("52");

  // --- DATASETS ---
  const SHOE_DATA = [
    { mm: 230, us_m: 5.0, us_w: 6.0, uk: 4.0, eu: 37.5 },
    { mm: 235, us_m: 5.5, us_w: 6.5, uk: 4.5, eu: 38.0 },
    { mm: 240, us_m: 6.0, us_w: 7.0, uk: 5.0, eu: 38.5 },
    { mm: 245, us_m: 6.5, us_w: 7.5, uk: 5.5, eu: 39.0 },
    { mm: 250, us_m: 7.0, us_w: 8.0, uk: 6.0, eu: 40.0 },
    { mm: 255, us_m: 7.5, us_w: 8.5, uk: 6.5, eu: 40.5 },
    { mm: 260, us_m: 8.0, us_w: 9.0, uk: 7.0, eu: 41.0 },
    { mm: 265, us_m: 8.5, us_w: 9.5, uk: 7.5, eu: 42.0 },
    { mm: 270, us_m: 9.0, us_w: 10.0, uk: 8.0, eu: 42.5 },
    { mm: 275, us_m: 9.5, us_w: 10.5, uk: 8.5, eu: 43.0 },
    { mm: 280, us_m: 10.0, us_w: 11.0, uk: 9.0, eu: 44.0 },
    { mm: 290, us_m: 11.0, us_w: 12.0, uk: 10.0, eu: 45.0 },
    { mm: 300, us_m: 12.0, us_w: 13.0, uk: 11.0, eu: 46.0 },
  ];

  const CLOTH_TOPS_DATA = {
    men: [
      { kr: "95 (M)", us: "S", eu: "46" },
      { kr: "100 (L)", us: "M", eu: "48~50" },
      { kr: "105 (XL)", us: "L", eu: "52" },
      { kr: "110 (XXL)", us: "XL", eu: "54" },
      { kr: "115 (3XL)", us: "XXL", eu: "56" },
    ],
    women: [
      { kr: "44 (XS)", us: "0-2", eu: "32" },
      { kr: "55 (S)", us: "4-6", eu: "34-36" },
      { kr: "66 (M)", us: "8-10", eu: "38-40" },
      { kr: "77 (L)", us: "12", eu: "42" },
      { kr: "88 (XL)", us: "14", eu: "44" },
    ],
  };

  const CLOTH_BOTTOMS_DATA = [
    { waist: 26, kr: "26", us: "2", eu: "34" },
    { waist: 28, kr: "28", us: "4", eu: "36" },
    { waist: 30, kr: "30", us: "6", eu: "38" },
    { waist: 32, kr: "32", us: "8", eu: "40" },
    { waist: 34, kr: "34", us: "10", eu: "42" },
    { waist: 36, kr: "36", us: "12", eu: "44" },
    { waist: 38, kr: "38", us: "14", eu: "46" },
    { waist: 40, kr: "40", us: "16", eu: "48" },
  ];

  const HAT_DATA = [
    { cm: 55.8, us: "7", general: "S" },
    { cm: 56.8, us: "7 1/8", general: "M" },
    { cm: 57.7, us: "7 1/4", general: "M" },
    { cm: 58.7, us: "7 3/8", general: "L" },
    { cm: 59.6, us: "7 1/2", general: "L (Standard)" },
    { cm: 60.6, us: "7 5/8", general: "XL" },
    { cm: 61.5, us: "7 3/4", general: "XL" },
    { cm: 63.5, us: "8", general: "XXL" },
  ];

  const RING_DATA = [
    { mm: 50, kr: "7", us: "5.5" },
    { mm: 51, kr: "8", us: "5.75" },
    { mm: 52, kr: "9", us: "6.0" },
    { mm: 53, kr: "10", us: "6.5" },
    { mm: 54, kr: "11", us: "6.75" },
    { mm: 55, kr: "12", us: "7.25" },
    { mm: 56, kr: "13", us: "7.5" },
    { mm: 57, kr: "14", us: "8.0" },
    { mm: 58, kr: "15", us: "8.5" },
    { mm: 60, kr: "17", us: "9.0" },
    { mm: 62, kr: "19", us: "10.0" },
  ];

  // --- Computation Helpers ---
  const getShoeConversions = () => {
    const match = SHOE_DATA.find((s) => s.mm === shoesSize);
    if (!match) return [];
    return [
      { label: "Korea (mm)", value: `${match.mm} mm` },
      { label: "US (Men)", value: match.us_m.toString() },
      { label: "US (Women)", value: match.us_w.toString() },
      { label: "UK", value: match.uk.toString() },
      { label: "Europe (EU)", value: match.eu.toString() },
    ];
  };

  const getClothingConversions = () => {
    if (clothingType === "top") {
      const list = CLOTH_TOPS_DATA[clothingGender];
      const match = list.find((c) => c.kr === topsSize) || list[0];
      return [
        { label: "Korea Sizing", value: match.kr },
        { label: "US Sizing", value: match.us },
        { label: "Europe (EU)", value: match.eu || "-" },
      ];
    } else {
      const match = CLOTH_BOTTOMS_DATA.find((c) => c.waist === bottomsSize) || CLOTH_BOTTOMS_DATA[2];
      return [
        { label: "Waist Size", value: `${match.waist} in` },
        { label: "Korea Size", value: match.kr },
        { label: "US Size", value: match.us },
        { label: "Europe (EU)", value: match.eu },
      ];
    }
  };

  const getHatConversions = () => {
    // Find closest match based on circumference cm
    let closest = HAT_DATA[0];
    let minDiff = Math.abs(hatCircumference - closest.cm);
    for (const h of HAT_DATA) {
      const diff = Math.abs(hatCircumference - h.cm);
      if (diff < minDiff) {
        minDiff = diff;
        closest = h;
      }
    }
    return [
      { label: "Circumference", value: `${hatCircumference.toFixed(1)} cm` },
      { label: "US Fitted Size", value: closest.us },
      { label: "General Size", value: closest.general },
    ];
  };

  const getRingConversions = () => {
    const num = parseInt(ringCircumference);
    if (isNaN(num) || num < 44 || num > 70) {
      return [
        { label: "Circumference", value: `${ringCircumference || "0"} mm` },
        { label: "Korea Sizing", value: "-" },
        { label: "US Sizing", value: "-" },
      ];
    }

    // Find closest match or estimate
    let closest = RING_DATA[0];
    let minDiff = Math.abs(num - closest.mm);
    for (const r of RING_DATA) {
      const diff = Math.abs(num - r.mm);
      if (diff < minDiff) {
        minDiff = diff;
        closest = r;
      }
    }

    // Estimated formula if exact is not matched
    let estimatedKr = closest.kr;
    let estimatedUs = closest.us;
    if (minDiff > 0.5) {
      estimatedKr = String(Math.max(1, num - 43));
      estimatedUs = String(Math.max(1, Math.round((num - 38) / 2.5 * 2) / 2));
    }

    return [
      { label: "Circumference", value: `${num} mm` },
      { label: "Korea Size", value: `${estimatedKr} 호` },
      { label: "US Size", value: estimatedUs },
    ];
  };

  const getActiveConversions = () => {
    switch (activeTab) {
      case "shoes":
        return getShoeConversions();
      case "clothing":
        return getClothingConversions();
      case "hats":
        return getHatConversions();
      case "rings":
        return getRingConversions();
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-6">
      {/* Tool Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-lumora-highlight/20 flex items-center justify-center text-lumora-highlight">
            <Ruler className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">Global Size Converter</h3>
            <p className="text-[10px] text-white/30 font-display font-bold uppercase tracking-widest">Sizing Calculator V1.0</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-lumora-bg/60 p-1 rounded-xl border border-white/5">
          {(["shoes", "clothing", "hats", "rings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-1.5 px-3 text-[10px] font-display font-bold uppercase tracking-wider rounded-lg transition-all ${
                activeTab === tab
                  ? "bg-lumora-highlight text-black shadow"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 items-stretch">
        
        {/* Controls Column (Left) */}
        <div className="md:col-span-5 flex flex-col gap-5 bg-white/[0.01] border border-white/5 p-6 rounded-[24px]">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <RefreshCw className="h-4 w-4 text-lumora-highlight" />
            <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider">Inputs & Filters</h4>
          </div>

          {/* TAB 1: SHOES CONTROLS */}
          {activeTab === "shoes" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-display font-bold text-white/40 uppercase tracking-widest">Gender Target</label>
                <div className="grid grid-cols-2 gap-2 bg-lumora-bg/40 p-1 rounded-xl border border-white/5">
                  <button
                    onClick={() => setShoesGender("men")}
                    className={`py-2 px-3 text-[10px] font-display font-bold uppercase tracking-wider rounded-lg transition-all ${
                      shoesGender === "men" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
                    }`}
                  >
                    Men Standard
                  </button>
                  <button
                    onClick={() => setShoesGender("women")}
                    className={`py-2 px-3 text-[10px] font-display font-bold uppercase tracking-wider rounded-lg transition-all ${
                      shoesGender === "women" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
                    }`}
                  >
                    Women Standard
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-display font-bold text-white/40 uppercase tracking-widest">Korea Size (mm)</label>
                <select
                  value={shoesSize}
                  onChange={(e) => setShoesSize(parseInt(e.target.value))}
                  className="w-full bg-lumora-bg/85 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white/80 focus:outline-none"
                >
                  {SHOE_DATA.map((s) => (
                    <option key={s.mm} value={s.mm}>
                      {s.mm} mm
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* TAB 2: CLOTHING CONTROLS */}
          {activeTab === "clothing" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-display font-bold text-white/40 uppercase tracking-widest">Apparel Category</label>
                <div className="grid grid-cols-2 gap-2 bg-lumora-bg/40 p-1 rounded-xl border border-white/5">
                  <button
                    onClick={() => setClothingType("top")}
                    className={`py-2 px-3 text-[10px] font-display font-bold uppercase tracking-wider rounded-lg transition-all ${
                      clothingType === "top" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
                    }`}
                  >
                    Tops / Jackets
                  </button>
                  <button
                    onClick={() => setClothingType("bottom")}
                    className={`py-2 px-3 text-[10px] font-display font-bold uppercase tracking-wider rounded-lg transition-all ${
                      clothingType === "bottom" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
                    }`}
                  >
                    Bottoms / Jeans
                  </button>
                </div>
              </div>

              {clothingType === "top" ? (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-display font-bold text-white/40 uppercase tracking-widest">Gender Target</label>
                    <div className="grid grid-cols-2 gap-2 bg-lumora-bg/40 p-1 rounded-xl border border-white/5">
                      <button
                        onClick={() => {
                          setClothingGender("men");
                          setTopsSize(CLOTH_TOPS_DATA.men[1].kr);
                        }}
                        className={`py-2 px-3 text-[10px] font-display font-bold uppercase tracking-wider rounded-lg transition-all ${
                          clothingGender === "men" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
                        }`}
                      >
                        Men
                      </button>
                      <button
                        onClick={() => {
                          setClothingGender("women");
                          setTopsSize(CLOTH_TOPS_DATA.women[1].kr);
                        }}
                        className={`py-2 px-3 text-[10px] font-display font-bold uppercase tracking-wider rounded-lg transition-all ${
                          clothingGender === "women" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
                        }`}
                      >
                        Women
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-display font-bold text-white/40 uppercase tracking-widest">Korea Standard Size</label>
                    <select
                      value={topsSize}
                      onChange={(e) => setTopsSize(e.target.value)}
                      className="w-full bg-lumora-bg/85 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white/80 focus:outline-none"
                    >
                      {CLOTH_TOPS_DATA[clothingGender].map((c) => (
                        <option key={c.kr} value={c.kr}>
                          {c.kr}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-display font-bold text-white/40 uppercase tracking-widest">Waist Size (Inches)</label>
                  <select
                    value={bottomsSize}
                    onChange={(e) => setBottomsSize(parseInt(e.target.value))}
                    className="w-full bg-lumora-bg/85 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white/80 focus:outline-none"
                  >
                    {CLOTH_BOTTOMS_DATA.map((c) => (
                      <option key={c.waist} value={c.waist}>
                        {c.waist} in
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: HATS CONTROLS */}
          {activeTab === "hats" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-[10px] font-display font-bold text-white/40 uppercase tracking-widest">
                  <span>Head Circumference</span>
                  <span className="font-mono text-lumora-highlight">{hatCircumference.toFixed(1)} cm</span>
                </div>
                <input
                  type="range"
                  min="55.0"
                  max="64.0"
                  step="0.1"
                  value={hatCircumference}
                  onChange={(e) => setHatCircumference(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-lumora-highlight"
                />
                <span className="text-[9px] text-white/30">Measure circumference around your head, just above ears.</span>
              </div>
            </div>
          )}

          {/* TAB 4: RINGS CONTROLS */}
          {activeTab === "rings" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-display font-bold text-white/40 uppercase tracking-widest">Finger Circumference (mm)</label>
                <input
                  type="number"
                  min="44"
                  max="70"
                  value={ringCircumference}
                  onChange={(e) => setRingCircumference(e.target.value)}
                  placeholder="e.g. 52"
                  className="w-full bg-lumora-bg/85 border border-white/5 rounded-xl px-4 py-2 text-xs text-white/80 focus:outline-none"
                />
                <span className="text-[9px] text-white/30">Typically ranges from 44mm to 70mm. (E.g. wraps around paper slip)</span>
              </div>
            </div>
          )}
        </div>

        {/* Results Column (Right) */}
        <div className="md:col-span-7 flex flex-col gap-4 bg-white/[0.01] border border-white/5 p-6 rounded-[24px]">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Layers className="h-4 w-4 text-lumora-blue" />
            <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider">Converted Sizing Outputs</h4>
          </div>

          {/* Grid Layout of results cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 items-start content-start">
            {getActiveConversions().map((res) => (
              <div
                key={res.label}
                className="bg-lumora-bg/40 border border-white/5 p-5 rounded-2xl flex flex-col gap-1.5 hover:border-white/10 transition-colors"
              >
                <span className="text-[9px] font-display font-bold text-white/30 uppercase tracking-widest">
                  {res.label}
                </span>
                <span className="text-xl font-display font-bold text-lumora-blue">
                  {res.value}
                </span>
              </div>
            ))}
          </div>

          {/* Sizing Note / Disclaimer */}
          <div className="bg-lumora-highlight/5 border border-lumora-highlight/20 rounded-xl p-3.5 text-[11px] text-lumora-highlight/85 leading-relaxed">
            {activeTab === "shoes" && "💡 Shoes sizing charts may vary between athletic shoe manufacturers (like Nike/Adidas) and fashion shoe lines. These output values serve as standard conversion guidelines."}
            {activeTab === "clothing" && "💡 Western clothing (like US/EU) often runs one size larger than Asian/Korean counterparts. Relaxed fits may warrant down-sizing."}
            {activeTab === "hats" && "💡 Fitted size fractions refer to traditional US/UK head sizes (often matching New Era fitted caps). S/M/L categories represent flexible stretch-fit thresholds."}
            {activeTab === "rings" && "💡 Wrap a thin paper strip around the base of your finger. Mark where the paper overlaps and measure the length in mm to get circumference."}
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between gap-4 px-4 py-3 bg-white/[0.01] border border-white/5 rounded-xl text-[10px] font-display font-bold text-white/30 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <Ruler className="h-3.5 w-3.5 text-lumora-highlight" />
          <span>Local-first processing. Your data never leaves your browser.</span>
        </div>
        <span>Ready.</span>
      </div>
    </div>
  );
}
