
import { Sparkles, FileText, Moon, Sun } from "lucide-react";

function Header({ onSave, onToggleTheme, canvasTheme }) {
  const isLight = canvasTheme === "light";

  return (
    <header className="app-header shrink-0 border-b border-[#2a2a2f] bg-[#111113] flex items-center justify-between px-5">
      <div className="flex items-center gap-3 min-w-0">
        <div className="app-logo w-12 h-12 rounded-xl bg-linear-to-br from-[#A52A3A] via-[#7F1D2D] to-[#3D0A12] flex items-center justify-center border border-[#A52A3A]/30 shrink-0">
          <Sparkles size={23} className="text-white" />
        </div>

        <div className="min-w-0">
          <h1 className="text-base font-bold tracking-tight bg-linear-to-r from-white via-[#f0b7bd] to-[#A52A3A] bg-clip-text text-transparent whitespace-nowrap">
            Whiteboard AI
          </h1>
          <p className="desktop-subtitle text-[11px] tracking-wide text-gray-500">
            INTELLIGENT VISUAL AGENT
          </p>
        </div>
      </div>

      <div className="header-actions flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onSave}
          title="Save to PDF"
          aria-label="Save to PDF"
          className="header-action toolbar-button"
        >
          <FileText size={19} />
          <span className="mobile-pdf-label">PDF</span>
        </button>

        <button
          type="button"
          onClick={onToggleTheme}
          title={isLight ? "Switch to dark mode" : "Switch to light mode"}
          aria-label="Change canvas mode"
          className="header-action toolbar-button"
        >
          {isLight ? <Moon size={19} /> : <Sun size={19} />}
          <span className="mobile-mode-label">
            {isLight ? "Dark" : "Light"}
          </span>
        </button>
      </div>
    </header>
  );
}

export default Header;
