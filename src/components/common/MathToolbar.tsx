"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Copy, Check, HelpCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { copyToClipboard as copyUtil } from "@/lib/utils";

interface MathToolbarProps {
  onInsert: (snippet: string) => void;
  className?: string;
}

type SymbolCategory = "all" | "algebra" | "phys_chem" | "trig" | "calculus";

interface SymbolItem {
  label: string;
  snippet: string;
  title: string;
  category: "algebra" | "phys_chem" | "trig" | "calculus";
}

// ─── Complete Symbol Library ──────────────────────────────────────────────────
const ALL_SYMBOLS: SymbolItem[] = [
  // Algebra & Basic
  { label: "a/b", snippet: "$\\frac{a}{b}$", title: "Fraction: \\frac{a}{b}", category: "algebra" },
  { label: "x²", snippet: "$x^{2}$", title: "Square / Power: x^{2}", category: "algebra" },
  { label: "xⁿ", snippet: "$x^{n}$", title: "N-th Power: x^{n}", category: "algebra" },
  { label: "x₁", snippet: "$x_{1}$", title: "Subscript: x_{1}", category: "algebra" },
  { label: "√x", snippet: "$\\sqrt{x}$", title: "Square Root: \\sqrt{x}", category: "algebra" },
  { label: "ⁿ√x", snippet: "$\\sqrt[n]{x}$", title: "N-th Root: \\sqrt[n]{x}", category: "algebra" },
  { label: "|x|", snippet: "$|x|$", title: "Absolute Value: |x|", category: "algebra" },
  { label: "±", snippet: "$\\pm$", title: "Plus-Minus: \\pm", category: "algebra" },
  { label: "×", snippet: "$\\times$", title: "Multiply: \\times", category: "algebra" },
  { label: "·", snippet: "$\\cdot$", title: "Dot Multiply: \\cdot", category: "algebra" },
  { label: "÷", snippet: "$\\div$", title: "Divide: \\div", category: "algebra" },
  { label: "≠", snippet: "$\\neq$", title: "Not Equal: \\neq", category: "algebra" },
  { label: "≈", snippet: "$\\approx$", title: "Approximately Equal: \\approx", category: "algebra" },
  { label: "≤", snippet: "$\\leq$", title: "Less Than or Equal: \\leq", category: "algebra" },
  { label: "≥", snippet: "$\\geq$", title: "Greater Than or Equal: \\geq", category: "algebra" },
  { label: "∝", snippet: "$\\propto$", title: "Proportional To: \\propto", category: "algebra" },

  // Physics & Chemistry
  { label: "Δ", snippet: "$\\Delta$", title: "Delta / Change: \\Delta", category: "phys_chem" },
  { label: "λ", snippet: "$\\lambda$", title: "Lambda / Wavelength: \\lambda", category: "phys_chem" },
  { label: "μ", snippet: "$\\mu$", title: "Micro / Friction: \\mu", category: "phys_chem" },
  { label: "ρ", snippet: "$\\rho$", title: "Density: \\rho", category: "phys_chem" },
  { label: "Ω", snippet: "$\\Omega$", title: "Ohm (Resistance): \\Omega", category: "phys_chem" },
  { label: "ω", snippet: "$\\omega$", title: "Angular Velocity: \\omega", category: "phys_chem" },
  { label: "°C", snippet: "$^{\\circ}\\text{C}$", title: "Degree Celsius: ^{\\circ}\\text{C}", category: "phys_chem" },
  { label: "°", snippet: "$^{\\circ}$", title: "Degree Symbol: ^{\\circ}", category: "phys_chem" },
  { label: "→", snippet: "$\\rightarrow$", title: "Reaction Arrow: \\rightarrow", category: "phys_chem" },
  { label: "⇌", snippet: "$\\rightleftharpoons$", title: "Equilibrium Arrow: \\rightleftharpoons", category: "phys_chem" },
  { label: "H₂O", snippet: "$\\text{H}_2\\text{O}$", title: "Chemical Subscript example", category: "phys_chem" },
  { label: "e⁻", snippet: "$\\text{e}^-$", title: "Electron: \\text{e}^-", category: "phys_chem" },
  { label: "α", snippet: "$\\alpha$", title: "Alpha: \\alpha", category: "phys_chem" },
  { label: "β", snippet: "$\\beta$", title: "Beta: \\beta", category: "phys_chem" },
  { label: "γ", snippet: "$\\gamma$", title: "Gamma: \\gamma", category: "phys_chem" },

  // Trig & Functions
  { label: "π", snippet: "$\\pi$", title: "Pi: \\pi", category: "trig" },
  { label: "θ", snippet: "$\\theta$", title: "Theta: \\theta", category: "trig" },
  { label: "sin", snippet: "$\\sin(\\theta)$", title: "Sine function", category: "trig" },
  { label: "cos", snippet: "$\\cos(\\theta)$", title: "Cosine function", category: "trig" },
  { label: "tan", snippet: "$\\tan(\\theta)$", title: "Tangent function", category: "trig" },
  { label: "log", snippet: "$\\log_{10}(x)$", title: "Logarithm", category: "trig" },
  { label: "ln", snippet: "$\\ln(x)$", title: "Natural Logarithm", category: "trig" },
  { label: "lim", snippet: "$\\lim_{x \\to 0}$", title: "Limit: \\lim", category: "trig" },

  // Calculus & Sets
  { label: "∑", snippet: "$\\sum_{i=1}^{n}$", title: "Summation: \\sum", category: "calculus" },
  { label: "∫", snippet: "$\\int$", title: "Indefinite Integral: \\int", category: "calculus" },
  { label: "∫ₐᵇ", snippet: "$\\int_{a}^{b} f(x) dx$", title: "Definite Integral", category: "calculus" },
  { label: "∞", snippet: "$\\infty$", title: "Infinity: \\infty", category: "calculus" },
  { label: "∈", snippet: "$\\in$", title: "Element of (Set): \\in", category: "calculus" },
  { label: "∉", snippet: "$\\notin$", title: "Not Element of: \\notin", category: "calculus" },
  { label: "∪", snippet: "$\\cup$", title: "Union: \\cup", category: "calculus" },
  { label: "∩", snippet: "$\\cap$", title: "Intersection: \\cap", category: "calculus" },
  { label: "⇒", snippet: "$\\Rightarrow$", title: "Implies: \\Rightarrow", category: "calculus" },
];

// Quick bar items shown by default
const QUICK_BAR_LABELS = [
  "a/b", "x²", "xⁿ", "x₁", "√x", "±", "×", "÷", "≠", "≤", "≥", "π", "θ", "°", "→", "∑", "∫", "Δ", "Ω"
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function MathToolbar({ onInsert, className = "" }: MathToolbarProps) {
  const [showGuide, setShowGuide] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<SymbolCategory>("all");
  const [copiedExample, setCopiedExample] = useState<string | null>(null);

  const displayedSymbols = isExpanded
    ? selectedCategory === "all"
      ? ALL_SYMBOLS
      : ALL_SYMBOLS.filter((s) => s.category === selectedCategory)
    : ALL_SYMBOLS.filter((s) => QUICK_BAR_LABELS.includes(s.label));

  const copyToClipboard = async (text: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const success = await copyUtil(text);
    if (success) {
      setCopiedExample(text);
      toast.success(`Copied: ${text}`);
      setTimeout(() => setCopiedExample(null), 2000);
    } else {
      toast.error("Could not copy automatically. Please copy manually.");
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Main Toolbar Strip */}
      <div className="rounded-xl border border-[#dce7f2] bg-[#f4f8fc] p-2 text-xs shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-1.5 pb-1">
          <div className="flex items-center gap-1.5 font-semibold text-[#2f557a]">
            <Sparkles className="h-3.5 w-3.5 text-[#2563eb]" />
            <span className="text-xs font-bold">Math / Physics / Chemistry Symbols:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2563eb] hover:text-[#1d4ed8]"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5" /> Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5" /> More Symbols ({ALL_SYMBOLS.length})
                </>
              )}
            </button>

            <span className="text-[#c2d5e8]">|</span>

            <button
              type="button"
              onClick={() => setShowGuide(!showGuide)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2563eb] hover:text-[#1d4ed8]"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              {showGuide ? "Hide Guide" : "LaTeX & CSV Guide"}
            </button>
          </div>
        </div>

        {/* Category Tabs when expanded */}
        {isExpanded && (
          <div className="my-1.5 flex flex-wrap gap-1 border-t border-[#e1ecf6] pt-1.5">
            {[
              { id: "all", label: "All Symbols" },
              { id: "algebra", label: "Algebra & Arithmetic" },
              { id: "phys_chem", label: "Physics & Chemistry" },
              { id: "trig", label: "Trigonometry & Functions" },
              { id: "calculus", label: "Calculus & Sets" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id as SymbolCategory)}
                className={`rounded-md px-2 py-0.5 text-[10.5px] font-medium transition-colors ${
                  selectedCategory === tab.id
                    ? "bg-[#2563eb] text-white shadow-2xs"
                    : "bg-white text-[#4f6e8c] border border-[#dce7f2] hover:bg-[#edf5fc]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Symbols Grid */}
        <div className="flex flex-wrap items-center gap-1 pt-1">
          {displayedSymbols.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onInsert(item.snippet)}
              title={item.title}
              className="inline-flex h-6 min-w-6 items-center justify-center rounded border border-[#cbe1f5] bg-white px-1.5 text-[11px] font-medium text-[#2d4d68] transition-colors hover:border-[#2563eb] hover:bg-[#eef5fc] hover:text-[#2563eb] active:scale-95"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Comprehensive LaTeX & CSV Guide */}
      {showGuide && (
        <div className="rounded-xl border border-[#cbe1f5] bg-white p-4 text-xs text-[#3f5f7a] shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#eef3f8] pb-2">
            <div>
              <h4 className="font-bold text-[#1e3a5f] text-sm">
                Comprehensive Mathematical, Science &amp; CSV Syntax Guide
              </h4>
              <p className="text-[11px] text-[#6a849d]">
                Formulas can be typed directly in the dashboard editor or bulk uploaded via CSV.
              </p>
            </div>
            <span className="rounded bg-[#edf5fc] px-2 py-0.5 text-[10px] font-bold text-[#2563eb]">
              LaTeX / KaTeX Powered
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 1. Mathematics & Algebra */}
            <div className="rounded-lg border border-[#e3edf7] bg-[#fbfdff] p-3 space-y-2">
              <span className="font-bold text-xs text-[#2563eb] block">
                📐 Mathematics &amp; Algebra
              </span>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between gap-1 bg-white p-1 px-1.5 rounded border border-[#eef3f8] hover:border-[#c5dcf2]">
                  <span className="truncate flex-1 cursor-pointer" onClick={() => onInsert("$\\frac{7}{12}$")} title="Click to insert">
                    <code>$\frac{"{7}"}{"{12}"}$</code> <span className="text-[#889fb3] font-sans text-[10px]">&rarr; 7/12</span>
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onInsert("$\\frac{7}{12}$")}
                      className="rounded px-1.5 py-0.5 text-[10px] font-semibold text-[#2563eb] hover:bg-[#edf5fc]"
                      title="Insert into question text"
                    >
                      Insert
                    </button>
                    <button
                      type="button"
                      onClick={(e) => copyToClipboard("$\\frac{7}{12}$", e)}
                      className="rounded p-1 text-[#6b8299] hover:bg-[#edf5fc] hover:text-[#2563eb]"
                      title="Copy to clipboard"
                    >
                      {copiedExample === "$\\frac{7}{12}$" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-1 bg-white p-1 px-1.5 rounded border border-[#eef3f8] hover:border-[#c5dcf2]">
                  <span className="truncate flex-1 cursor-pointer" onClick={() => onInsert("$a^2 + b^2 = c^2$")} title="Click to insert">
                    <code>$a^2 + b^2 = c^2$</code>
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onInsert("$a^2 + b^2 = c^2$")}
                      className="rounded px-1.5 py-0.5 text-[10px] font-semibold text-[#2563eb] hover:bg-[#edf5fc]"
                      title="Insert into question text"
                    >
                      Insert
                    </button>
                    <button
                      type="button"
                      onClick={(e) => copyToClipboard("$a^2 + b^2 = c^2$", e)}
                      className="rounded p-1 text-[#6b8299] hover:bg-[#edf5fc] hover:text-[#2563eb]"
                      title="Copy to clipboard"
                    >
                      {copiedExample === "$a^2 + b^2 = c^2$" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-1 bg-white p-1 px-1.5 rounded border border-[#eef3f8] hover:border-[#c5dcf2]">
                  <span className="truncate flex-1 cursor-pointer" onClick={() => onInsert("$\\sqrt{16} = 4$")} title="Click to insert">
                    <code>$\sqrt{"{16}"} = 4$</code>
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onInsert("$\\sqrt{16} = 4$")}
                      className="rounded px-1.5 py-0.5 text-[10px] font-semibold text-[#2563eb] hover:bg-[#edf5fc]"
                      title="Insert into question text"
                    >
                      Insert
                    </button>
                    <button
                      type="button"
                      onClick={(e) => copyToClipboard("$\\sqrt{16} = 4$", e)}
                      className="rounded p-1 text-[#6b8299] hover:bg-[#edf5fc] hover:text-[#2563eb]"
                      title="Copy to clipboard"
                    >
                      {copiedExample === "$\\sqrt{16} = 4$" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-1 bg-white p-1 px-1.5 rounded border border-[#eef3f8] hover:border-[#c5dcf2]">
                  <span className="truncate flex-1 cursor-pointer" onClick={() => onInsert("$\\sqrt[3]{27} = 3$")} title="Click to insert">
                    <code>$\sqrt[3]{"{27}"} = 3$</code>
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onInsert("$\\sqrt[3]{27} = 3$")}
                      className="rounded px-1.5 py-0.5 text-[10px] font-semibold text-[#2563eb] hover:bg-[#edf5fc]"
                      title="Insert into question text"
                    >
                      Insert
                    </button>
                    <button
                      type="button"
                      onClick={(e) => copyToClipboard("$\\sqrt[3]{27} = 3$", e)}
                      className="rounded p-1 text-[#6b8299] hover:bg-[#edf5fc] hover:text-[#2563eb]"
                      title="Copy to clipboard"
                    >
                      {copiedExample === "$\\sqrt[3]{27} = 3$" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-1 bg-white p-1 px-1.5 rounded border border-[#eef3f8] hover:border-[#c5dcf2]">
                  <span className="truncate flex-1 cursor-pointer" onClick={() => onInsert("$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$")} title="Click to insert">
                    <code>$x = \frac{"{-b \\pm \\sqrt{b^2-4ac}}"}{"{2a}"}$</code>
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onInsert("$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$")}
                      className="rounded px-1.5 py-0.5 text-[10px] font-semibold text-[#2563eb] hover:bg-[#edf5fc]"
                      title="Insert into question text"
                    >
                      Insert
                    </button>
                    <button
                      type="button"
                      onClick={(e) => copyToClipboard("$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$", e)}
                      className="rounded p-1 text-[#6b8299] hover:bg-[#edf5fc] hover:text-[#2563eb]"
                      title="Copy to clipboard"
                    >
                      {copiedExample === "$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Physics & Chemistry */}
            <div className="rounded-lg border border-[#e3edf7] bg-[#fbfdff] p-3 space-y-2">
              <span className="font-bold text-xs text-[#059669] block">
                ⚡ Physics &amp; Chemistry
              </span>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between gap-1 bg-white p-1 px-1.5 rounded border border-[#eef3f8] hover:border-[#c5dcf2]">
                  <span className="truncate flex-1 cursor-pointer" onClick={() => onInsert("$F = G \\frac{m_1 m_2}{r^2}$")} title="Click to insert">
                    <code>$F = G \frac{"{m_1 m_2}"}{"{r^2}"}$</code>
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onInsert("$F = G \\frac{m_1 m_2}{r^2}$")}
                      className="rounded px-1.5 py-0.5 text-[10px] font-semibold text-[#059669] hover:bg-[#edfbf4]"
                      title="Insert into question text"
                    >
                      Insert
                    </button>
                    <button
                      type="button"
                      onClick={(e) => copyToClipboard("$F = G \\frac{m_1 m_2}{r^2}$", e)}
                      className="rounded p-1 text-[#6b8299] hover:bg-[#edf5fc] hover:text-[#059669]"
                      title="Copy to clipboard"
                    >
                      {copiedExample === "$F = G \\frac{m_1 m_2}{r^2}$" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-1 bg-white p-1 px-1.5 rounded border border-[#eef3f8] hover:border-[#c5dcf2]">
                  <span className="truncate flex-1 cursor-pointer" onClick={() => onInsert("$\\lambda = \\frac{v}{f}$")} title="Click to insert">
                    <code>$\lambda = \frac{"{v}"}{"{f}"}$</code>
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onInsert("$\\lambda = \\frac{v}{f}$")}
                      className="rounded px-1.5 py-0.5 text-[10px] font-semibold text-[#059669] hover:bg-[#edfbf4]"
                      title="Insert into question text"
                    >
                      Insert
                    </button>
                    <button
                      type="button"
                      onClick={(e) => copyToClipboard("$\\lambda = \\frac{v}{f}$", e)}
                      className="rounded p-1 text-[#6b8299] hover:bg-[#edf5fc] hover:text-[#059669]"
                      title="Copy to clipboard"
                    >
                      {copiedExample === "$\\lambda = \\frac{v}{f}$" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-1 bg-white p-1 px-1.5 rounded border border-[#eef3f8] hover:border-[#c5dcf2]">
                  <span className="truncate flex-1 cursor-pointer" onClick={() => onInsert("$2\\text{H}_2 + \\text{O}_2 \\rightarrow 2\\text{H}_2\\text{O}$")} title="Click to insert">
                    <code>$2\text{"{H}"}_2 + \text{"{O}"}_2 \rightarrow 2\text{"{H}"}_2\text{"{O}"}$</code>
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onInsert("$2\\text{H}_2 + \\text{O}_2 \\rightarrow 2\\text{H}_2\\text{O}$")}
                      className="rounded px-1.5 py-0.5 text-[10px] font-semibold text-[#059669] hover:bg-[#edfbf4]"
                      title="Insert into question text"
                    >
                      Insert
                    </button>
                    <button
                      type="button"
                      onClick={(e) => copyToClipboard("$2\\text{H}_2 + \\text{O}_2 \\rightarrow 2\\text{H}_2\\text{O}$", e)}
                      className="rounded p-1 text-[#6b8299] hover:bg-[#edf5fc] hover:text-[#059669]"
                      title="Copy to clipboard"
                    >
                      {copiedExample === "$2\\text{H}_2 + \\text{O}_2 \\rightarrow 2\\text{H}_2\\text{O}$" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-1 bg-white p-1 px-1.5 rounded border border-[#eef3f8] hover:border-[#c5dcf2]">
                  <span className="truncate flex-1 cursor-pointer" onClick={() => onInsert("$\\text{Ca}^{2+} + 2\\text{Cl}^-$")} title="Click to insert">
                    <code>$\text{"{Ca}"}^{"{2+}"} + 2\text{"{Cl}"}^-$</code>
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onInsert("$\\text{Ca}^{2+} + 2\\text{Cl}^-$")}
                      className="rounded px-1.5 py-0.5 text-[10px] font-semibold text-[#059669] hover:bg-[#edfbf4]"
                      title="Insert into question text"
                    >
                      Insert
                    </button>
                    <button
                      type="button"
                      onClick={(e) => copyToClipboard("$\\text{Ca}^{2+} + 2\\text{Cl}^-$", e)}
                      className="rounded p-1 text-[#6b8299] hover:bg-[#edf5fc] hover:text-[#059669]"
                      title="Copy to clipboard"
                    >
                      {copiedExample === "$\\text{Ca}^{2+} + 2\\text{Cl}^-$" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-1 bg-white p-1 px-1.5 rounded border border-[#eef3f8] hover:border-[#c5dcf2]">
                  <span className="truncate flex-1 cursor-pointer" onClick={() => onInsert("$R = 50\\ \\Omega,\\ T = 25^\\circ\\text{C}$")} title="Click to insert">
                    <code>$R = 50\ \Omega,\ T = 25^\circ\text{"{C}"}$</code>
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onInsert("$R = 50\\ \\Omega,\\ T = 25^\\circ\\text{C}$")}
                      className="rounded px-1.5 py-0.5 text-[10px] font-semibold text-[#059669] hover:bg-[#edfbf4]"
                      title="Insert into question text"
                    >
                      Insert
                    </button>
                    <button
                      type="button"
                      onClick={(e) => copyToClipboard("$R = 50\\ \\Omega,\\ T = 25^\\circ\\text{C}$", e)}
                      className="rounded p-1 text-[#6b8299] hover:bg-[#edf5fc] hover:text-[#059669]"
                      title="Copy to clipboard"
                    >
                      {copiedExample === "$R = 50\\ \\Omega,\\ T = 25^\\circ\\text{C}$" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. CSV File Import Rules */}
            <div className="rounded-lg border border-[#e3edf7] bg-[#fbfdff] p-3 space-y-2">
              <span className="font-bold text-xs text-[#7c3aed] block">
                📊 CSV / Excel Import Rules
              </span>
              <div className="text-[11px] text-[#4a637a] space-y-1.5 leading-relaxed font-sans">
                <p>
                  ✅ <strong>Exact Same Syntax:</strong> Write formulas inside <code>$...$</code> in your CSV file (e.g. <code>$\frac{"{7}"}{"{12}"}$</code>).
                </p>
                <p>
                  ✅ <strong>Works everywhere:</strong> In <code>questionText</code>, <code>optionA..D</code>, and <code>explanation</code>.
                </p>
                <p>
                  ✅ <strong>Quoting:</strong> Wrap the CSV cell in double quotes if it contains commas, e.g.:<br />
                  <code className="text-[10px] bg-white p-1 rounded border block mt-1 font-mono text-[#2563eb]">
                    &quot;Find $x$ in $\frac{"{x+1}"}{"{2}"} = 5$&quot;
                  </code>
                </p>
                <p>
                  ✅ <strong>Mobile App &amp; Dashboard:</strong> Both will render it identically as mathematical formulas.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
