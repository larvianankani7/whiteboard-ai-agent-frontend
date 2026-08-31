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
    <div className="w-full px-10 pt-10 pb-7">

      <div className="max-w-5xl mx-auto">

        <div className="flex items-center gap-5 mb-3">
          <div className="w-6 h-6 rounded-md bg-[#7F1D2D]/20 flex items-center justify-center">
            <Sparkles size={14} className="text-[#B33A4B]" />
          </div>

          <span className="text-sm text-gray-400">
            AI Canvas Generator
          </span>
        </div>

        <div className="flex items-center gap-10 bg-[#17171a] border border-[#34343a] rounded-2xl px-10 py-10 shadow-xl shadow-black/20">

          <Sparkles
            size={31}
            className="text-[#B33A4B] shrink-0"
          />

          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleGenerate();
            }}
            placeholder="Describe anything you want to create..."
            className="flex-1 bg-transparent outline-none text-[15px] text-white placeholder:text-gray-600"
          />

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-1 bg-gradient-to-r from-[#7F1D2D] to-[#A52A3A] hover:from-[#942337] hover:to-[#B83246] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-8 py-5 rounded-xl transition-all duration-200 shadow-lg shadow-[#7F1D2D]/20 hover:scale-[1.02]"
          >
            {isGenerating ? "Generating..." : "Generate"}

            <Send size={25} />
        </button>

        </div>

        <p className="text-xs text-gray-600 mt-2.5 ml-1">
          Try: "Create a login flowchart with validation"
        </p>

      </div>

    </div>
  );
}

export default AIPrompt;