import { useRef, useState } from "react";
import Header from "./components/Header";
import LeftToolbar from "./components/LeftToolbar";
import AIPrompt from "./components/AIPrompt";
import RightPanel from "./components/RightPanel";
import Whiteboard from "./components/Whiteboard";
import { serializeAsJSON } from "@excalidraw/excalidraw";
import { aiToExcalidraw } from "./utils/aiToExcalidraw";

function App() {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [activeTool, setActiveTool] = useState("selection");
  const [selectedElement, setSelectedElement] = useState(null);
  const [canvasTheme, setCanvasTheme] = useState("light");
  const [shareMessage, setShareMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAIGenerate = async (prompt) => {
  if (!excalidrawAPI || isGenerating) return;

  setIsGenerating(true);

  try {
    console.log("Generating:", prompt);

    const response = await fetch(
      "http://localhost:5000/api/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      }
    );

    const result = await response.json();

    console.log("API response:", result);

    if (!result.success) {
      console.error(
        "AI generation failed:",
        result.error
      );
      return;
    }

    const elements = aiToExcalidraw(result.data);

    excalidrawAPI.updateScene({
      elements,
    });

  } catch (error) {
    console.error(
      "AI generation error:",
      error
    );
  } finally {
    setIsGenerating(false);
  }
};


  const historyRef = useRef([[]]);
  const historyIndexRef = useRef(0);
  const isHistoryActionRef = useRef(false);
  const handleElementsChange = (elements) => {
  if (isHistoryActionRef.current) return;

  const snapshot = elements.map((element) => ({
    ...element,
  }));
  
  const currentSnapshot = historyRef.current[
    historyIndexRef.current
  ];

  if (
    JSON.stringify(snapshot) ===
    JSON.stringify(currentSnapshot)
  ) {
    return;
  }

  const newHistory = historyRef.current.slice(
    0,
    historyIndexRef.current + 1
  );

  newHistory.push(snapshot);

  historyRef.current = newHistory;
  historyIndexRef.current = newHistory.length - 1;
};
  const handleShare = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);

    setShareMessage("Link copied!");

    setTimeout(() => {
      setShareMessage("");
    }, 2000);
  } catch (error) {
    console.error("Failed to copy link", error);
  }
};
  const toggleCanvasTheme = () => {
  setCanvasTheme((prev) =>
    prev === "light" ? "dark" : "light"
  );
};
  const updateSelectedElement = (updates) => {
  if (!excalidrawAPI || !selectedElement) return;

  const elements = excalidrawAPI.getSceneElements();

  const updatedElements = elements.map((element) =>
    element.id === selectedElement.id
      ? { ...element, ...updates }
      : element
  );

  excalidrawAPI.updateScene({
    elements: updatedElements,
  });

  setSelectedElement((prev) => ({
    ...prev,
    ...updates,
  }));
};
const handleUndo = () => {
  if (!excalidrawAPI) return;

  if (historyIndexRef.current <= 0) return;

  historyIndexRef.current -= 1;

  const previousElements =
    historyRef.current[historyIndexRef.current];

  isHistoryActionRef.current = true;

  excalidrawAPI.updateScene({
    elements: previousElements,
  });

  setTimeout(() => {
    isHistoryActionRef.current = false;
  }, 0);
};

const handleRedo = () => {
  if (!excalidrawAPI) return;

  if (
    historyIndexRef.current >=
    historyRef.current.length - 1
  ) {
    return;
  }

  historyIndexRef.current += 1;

  const nextElements =
    historyRef.current[historyIndexRef.current];

  isHistoryActionRef.current = true;

  excalidrawAPI.updateScene({
    elements: nextElements,
  });

  setTimeout(() => {
    isHistoryActionRef.current = false;
  }, 0);
};
const handleSave = () => {
  if (!excalidrawAPI) return;

  const elements = excalidrawAPI.getSceneElements();
  const appState = excalidrawAPI.getAppState();
  const files = excalidrawAPI.getFiles();

  const data = serializeAsJSON(
    elements,
    appState,
    files,
    "local"
  );

  const blob = new Blob([data], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "whiteboard-ai.excalidraw";

  link.click();

  URL.revokeObjectURL(url);
};
  return (
    <div className="w-screen h-screen bg-[#0B0B0D] flex flex-col">


      <Header
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={handleSave}
        onShare={handleShare}
        onToggleTheme={toggleCanvasTheme}
        canvasTheme={canvasTheme}
        shareMessage={shareMessage}
      />
      

      <div className="flex flex-1 overflow-hidden">

        <LeftToolbar
          excalidrawAPI={excalidrawAPI}
          activeTool={activeTool}
          setActiveTool={setActiveTool}
        />

        <main className="flex-1 flex flex-col min-w-0">

          <AIPrompt onGenerate={handleAIGenerate} isGenerating={isGenerating}/>

          {/* Actual Whiteboard */}
          <div className="flex-1 mx-5 mb-5 mt-2 rounded-xl border border-[#2a2a2f] bg-white overflow-hidden text-black">
            <Whiteboard 
              setExcalidrawAPI={setExcalidrawAPI} 
              setSelectedElement={setSelectedElement} 
              canvasTheme={canvasTheme}
              onElementsChange={handleElementsChange}

            />
          </div>

        </main>

        <RightPanel
          selectedElement={selectedElement}
          updateSelectedElement={updateSelectedElement}
        />

      </div>
      

      {/* Footer */}
      <footer className="h-10 border-t border-[#2a2a2f] bg-[#111113] flex items-center justify-center text-xs text-gray-500">

        <div className="flex items-center gap-6">
          <span>Whiteboard AI Agent</span>

          <span className="w-1 h-1 rounded-full bg-[#7F1D2D]" />

          <span>∞ Infinite Canvas</span>

          <span className="w-1 h-1 rounded-full bg-[#7F1D2D]" />

          <span>AI Powered Visual Thinking</span>
        </div>

      </footer>

    </div>
  );
}

export default App;