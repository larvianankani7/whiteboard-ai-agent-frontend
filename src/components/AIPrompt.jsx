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
    <section className="ai-prompt-container w-full px-10 pt-10 pb-7 shrink-0">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-6 h-6 rounded-md bg-[#7F1D2D]/20 flex items-center justify-center shrink-0">
            <Sparkles size={14} className="text-[#B33A4B]" />
          </div>
          <span className="text-sm text-gray-400">
            AI Canvas Generator
          </span>
        </div>

        <div className="ai-prompt-box flex items-center gap-5 bg-[#17171a] border border-[#34343a] rounded-2xl px-6 py-6 shadow-xl shadow-black/20">
          <Sparkles
            size={25}
            className="text-[#B33A4B] shrink-0 prompt-sparkle"
          />

          <input
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleGenerate();
            }}
            placeholder="Describe anything you want to create..."
            aria-label="Describe a diagram to generate"
            className="flex-1 min-w-0 bg-transparent outline-none text-[15px] text-white placeholder:text-gray-600"
          />

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="generate-button flex items-center justify-center gap-2 bg-linear-to-r from-[#7F1D2D] to-[#A52A3A] hover:from-[#942337] hover:to-[#B83246] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-6 py-4 rounded-xl transition-all duration-200 shrink-0"
          >
            <span>{isGenerating ? "Generating..." : "Generate"}</span>
            <Send size={18} />
          </button>
        </div>

        <p className="prompt-hint text-xs text-gray-600 mt-2.5 ml-1">
          Try: "Create a login flowchart with validation"
        </p>
      </div>
    </section>
  );
}

export default AIPrompt;