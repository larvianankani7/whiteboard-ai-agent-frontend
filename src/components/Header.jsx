import {
  Sparkles,
  Undo2,
  Redo2,
  Save,
  Moon,
  Sun,
  Share2,
} from "lucide-react";

function Header({ onUndo, onRedo, onToggleTheme, onSave, onShare, shareMessage,canvasTheme }) {
  return (
    <header className="h-16 border-b border-[#2a2a2f] bg-[#111113] flex items-center justify-between px-5">
      
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-15 h-15 rounded-xl bg-gradient-to-br from-[#A52A3A] via-[#7F1D2D] to-[#3D0A12] flex items-center justify-center shadow-lg shadow-[#7F1D2D]/30 border border-[#A52A3A]/30">
          <Sparkles size={25} className="text-white" />
        </div>

        <div>
          <h1 className="text-base font-bold tracking-tight bg-gradient-to-r from-white via-[#f0b7bd] to-[#A52A3A] bg-clip-text text-transparent">
            Whiteboard AI
          </h1>

          <p className="text-[11px] tracking-wide text-gray-500">
            INTELLIGENT VISUAL AGENT
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button onClick={onUndo} title="Undo" className="toolbar-button">
          <Undo2 size={17} />
        </button>

        <button onClick={onRedo} title="Redo" className="toolbar-button">
          <Redo2 size={17} />
        </button>

        <div className="w-px h-5 bg-[#2a2a2f] mx-1" />

        <button
            onClick={onSave}
            title="Save Board"
            className="toolbar-button"
            >
            <Save size={17} />
        </button>

        <div className="relative">
            <button
                onClick={onShare}
                title="Share"
                className="toolbar-button"
            >
                <Share2 size={17} />
            </button>

        {shareMessage && (
            <span className="absolute top-11 right-0 whitespace-nowrap bg-[#7F1D2D] text-white text-xs px-3 py-1.5 rounded-md">
            {shareMessage}
            </span>
        )}
        </div>

            <button
                onClick={onToggleTheme}
                title={
                    canvasTheme === "light"
                    ? "Dark Canvas"
                    : "Light Canvas"
                }
                className="toolbar-button"
                >
                {canvasTheme === "light" ? (
                    <Moon size={17} />
                ) : (
                    <Sun size={17} />
                )}
            </button>
      </div>
    </header>
  );
}

export default Header;