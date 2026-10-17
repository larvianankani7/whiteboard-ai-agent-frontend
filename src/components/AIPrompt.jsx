import { useState } from "react";
import { Sparkles, Send } from "lucide-react";

function AIPrompt({ onGenerate, isGenerating }) {
  const [prompt, setPrompt] = useState("");

  const handleGenerate = () => {
    if (!prompt.trim() || isGenerating) return;

    onGenerate(prompt);

    setPrompt("");
  };

  return (
    <div className="w-full px-10 pt-10 pb-7 ai-prompt-container">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-5 mb-3 ai-prompt-label">
          <div className="w-6 h-6 rounded-md bg-[#7F1D2D]/20 flex items-center justify-center shrink-0">
            <Sparkles
              size={14}
              className="text-[#B33A4B]"
            />
          </div>

          <span className="text-sm text-gray-400">
            AI Canvas Generator
          </span>
        </div>

        <div className="flex items-center gap-10 bg-[#17171a] border border-[#34343a] rounded-2xl px-10 py-10 shadow-xl shadow-black/20 ai-prompt-box">
          <Sparkles
            size={31}
            className="text-[#B33A4B] shrink-0 ai-prompt-icon"
          />

          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleGenerate();
            }}
            placeholder="Describe anything you want to create..."
            className="flex-1 min-w-0 bg-transparent outline-none text-[15px] text-white placeholder:text-gray-600 ai-prompt-input"
          />

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center justify-center gap-1 bg-gradient-to-r from-[#7F1D2D] to-[#A52A3A] hover:from-[#942337] hover:to-[#B83246] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-8 py-5 rounded-xl transition-all duration-200 shadow-lg shadow-[#7F1D2D]/20 hover:scale-[1.02] shrink-0 ai-prompt-button"
          >
            {isGenerating ? "Generating..." : "Generate"}

            <Send size={25} />
          </button>
        </div>

        <p className="text-xs text-gray-600 mt-2.5 ml-1 ai-prompt-hint">
          Try: "Create a login flowchart with validation"
        </p>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .ai-prompt-container {
            padding: 10px 8px 8px !important;
            flex-shrink: 0;
          }

          .ai-prompt-label {
            gap: 8px !important;
            margin-bottom: 7px !important;
          }

          .ai-prompt-label span {
            font-size: 12px;
          }

          .ai-prompt-box {
            gap: 8px !important;
            padding: 9px !important;
            border-radius: 12px !important;
          }

          .ai-prompt-icon {
            width: 20px;
            height: 20px;
          }

          .ai-prompt-input {
            width: 100%;
            min-width: 0;
            font-size: 13px !important;
          }

          .ai-prompt-input::placeholder {
            font-size: 12px;
          }

          .ai-prompt-button {
            padding: 9px 11px !important;
            min-height: 38px;
            border-radius: 9px !important;
            font-size: 12px !important;
          }

          .ai-prompt-button svg {
            width: 17px;
            height: 17px;
          }

          .ai-prompt-hint {
            display: none;
          }
        }

        @media (max-width: 390px) {
          .ai-prompt-container {
            padding: 7px 6px 6px !important;
          }

          .ai-prompt-box {
            padding: 7px !important;
          }

          .ai-prompt-icon {
            width: 18px;
            height: 18px;
          }

          .ai-prompt-input {
            font-size: 12px !important;
          }

          .ai-prompt-button {
            padding: 8px 9px !important;
            min-height: 36px;
          }

          .ai-prompt-button svg {
            width: 15px;
            height: 15px;
          }
        }
      `}</style>
    </div>
  );
}

export default AIPrompt;
