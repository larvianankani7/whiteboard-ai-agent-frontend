import { useCallback, useEffect, useRef, useState } from "react";
import {
  exportToCanvas,
} from "@excalidraw/excalidraw";
import { jsPDF } from "jspdf";

import Header from "./components/Header";
import LeftToolbar from "./components/LeftToolbar";
import AIPrompt from "./components/AIPrompt";
import RightPanel from "./components/RightPanel";
import Whiteboard from "./components/Whiteboard";

import { aiToExcalidraw } from "./utils/aiToExcalidraw";
import { loadBoard, saveBoard } from "./utils/boardStorage";

function App() {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [activeTool, setActiveTool] = useState("selection");
  const [selectedElement, setSelectedElement] = useState(null);
  const [canvasTheme, setCanvasTheme] = useState("dark");
  const [shareMessage, setShareMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState("Loading board...");
  const [initialData, setInitialData] = useState(null);
  const [boardReady, setBoardReady] = useState(false);
  const historyRef = useRef([[]]);
  const historyIndexRef = useRef(0);
  const isHistoryActionRef = useRef(false);
  const saveTimerRef = useRef(null);
  const currentSceneRef = useRef(null);
  const saveQueueRef = useRef(Promise.resolve());

  // Restore the saved board before mounting Excalidraw.
  useEffect(() => {
    let cancelled = false;

    async function restoreBoard() {
      try {
        const saved = await loadBoard();

        if (cancelled) return;

        const data = saved
          ? {
              elements: saved.elements || [],
              appState: saved.appState || {
                viewBackgroundColor: "#000000",
              },
              files: saved.files || {},
            }
          : {
              elements: [],
              appState: {
                viewBackgroundColor: "#ffffff",
              },
              files: {},
            };

        currentSceneRef.current = data;
        historyRef.current = [
          data.elements.map((element) => ({ ...element })),
        ];
        historyIndexRef.current = 0;

        setInitialData(data);
        setSaveStatus(saved ? "Restored" : "Ready");
        setBoardReady(true);
      } catch (error) {
        console.error("Failed to restore whiteboard:", error);

        if (!cancelled) {
          setInitialData({
            elements: [],
            appState: { viewBackgroundColor: "#000000" },
            files: {},
          });
          setSaveStatus("Local restore failed");
          setBoardReady(true);
        }
      }
    }

    restoreBoard();

    return () => {
      cancelled = true;
      clearTimeout(saveTimerRef.current);
    };
  }, []);

  const persistScene = useCallback((scene) => {
    if (!scene) return Promise.resolve();

    // Keep saves ordered so an older snapshot cannot overwrite a newer one.
    saveQueueRef.current = saveQueueRef.current
      .catch(() => {})
      .then(() =>
        saveBoard({
          elements: scene.elements,
          appState: scene.appState,
          files: scene.files,
        })
      );

    return saveQueueRef.current;
  }, []);

  const scheduleSave = useCallback(
    (scene) => {
      currentSceneRef.current = scene;
      setSaveStatus("Saving...");

      clearTimeout(saveTimerRef.current);

      saveTimerRef.current = setTimeout(async () => {
        try {
          await persistScene(scene);
          setSaveStatus("Saved");
        } catch (error) {
          console.error("Autosave failed:", error);
          setSaveStatus("Save failed");
        }
      }, 250);
    },
    [persistScene]
  );

  // Flush the latest scene when the user leaves the tab.
  useEffect(() => {
    const flushSave = () => {
      if (document.visibilityState === "hidden") {
        clearTimeout(saveTimerRef.current);

        const scene = currentSceneRef.current;
        if (scene) {
          persistScene(scene).catch((error) => {
            console.error("Final autosave failed:", error);
          });
        }
      }
    };

    document.addEventListener("visibilitychange", flushSave);

    return () => {
      document.removeEventListener("visibilitychange", flushSave);
    };
  }, [persistScene]);

  const handleSceneChange = useCallback(
    ({ elements, appState, files }) => {
      const scene = {
        elements,
        appState: {
          viewBackgroundColor:
            appState.viewBackgroundColor || "#ffffff",
          scrollX: appState.scrollX,
          scrollY: appState.scrollY,
          zoom: appState.zoom,
        },
        files: files || {},
      };

      scheduleSave(scene);

      if (isHistoryActionRef.current) return;

      const snapshot = elements.map((element) => ({ ...element }));
      const currentSnapshot =
        historyRef.current[historyIndexRef.current];

      if (
        JSON.stringify(snapshot) === JSON.stringify(currentSnapshot)
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
    },
    [scheduleSave]
  );

  const handleAIGenerate = async (prompt) => {
    if (!excalidrawAPI || isGenerating) return;

    setIsGenerating(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "AI generation failed");
      }

      const elements = aiToExcalidraw(result.data);

      excalidrawAPI.updateScene({ elements });
    } catch (error) {
      console.error("AI generation error:", error);
      window.alert(
        "Could not generate the diagram. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareMessage("Link copied!");
      setTimeout(() => setShareMessage(""), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
      setShareMessage("Could not copy link");
      setTimeout(() => setShareMessage(""), 2000);
    }
  };

  const toggleCanvasTheme = () => {
    setCanvasTheme((prev) => (prev === "light" ? "dark" : "light"));
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

    setSelectedElement((prev) =>
      prev ? { ...prev, ...updates } : prev
    );
  };

  const handleUndo = () => {
    if (!excalidrawAPI || historyIndexRef.current <= 0) return;

    historyIndexRef.current -= 1;

    const previousElements =
      historyRef.current[historyIndexRef.current];

    isHistoryActionRef.current = true;
    excalidrawAPI.updateScene({ elements: previousElements });

    setTimeout(() => {
      isHistoryActionRef.current = false;
    }, 0);
  };

  const handleRedo = () => {
    if (
      !excalidrawAPI ||
      historyIndexRef.current >= historyRef.current.length - 1
    ) {
      return;
    }

    historyIndexRef.current += 1;

    const nextElements = historyRef.current[historyIndexRef.current];

    isHistoryActionRef.current = true;
    excalidrawAPI.updateScene({ elements: nextElements });

    setTimeout(() => {
      isHistoryActionRef.current = false;
    }, 0);
  };

  const getExportCanvas = async () => {
    if (!excalidrawAPI) {
      throw new Error("Whiteboard is not ready yet.");
    }

    const elements = excalidrawAPI
      .getSceneElements()
      .filter((element) => !element.isDeleted);

    if (elements.length === 0) {
      window.alert("Your whiteboard is empty. Draw something first.");
      return null;
    }

    const appState = excalidrawAPI.getAppState();

    return exportToCanvas({
      elements,
      appState,
      files: excalidrawAPI.getFiles(),
      exportPadding: 32,
      exportBackground: true,
      viewBackgroundColor:
        appState.viewBackgroundColor || "#ffffff",
      maxWidthOrHeight: 4096,
    });
  };

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    link.click();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleDownloadPNG = async () => {
    try {
      const canvas = await getExportCanvas();
      if (!canvas) return;

      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob((result) => {
          if (result) resolve(result);
          else reject(new Error("Could not create PNG."));
        }, "image/png");
      });

      downloadBlob(blob, "whiteboard-ai.png");
    } catch (error) {
      console.error("PNG export failed:", error);
      window.alert("PNG export failed. Please try again.");
    }
  };

  const handleSavePDF = async () => {
    try {
      const canvas = await getExportCanvas();
      if (!canvas) return;

      const image = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: canvas.width >= canvas.height ? "landscape" : "portrait",
        unit: "pt",
        format: "a4",
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 24;

      const scale = Math.min(
        (pageWidth - margin * 2) / canvas.width,
        (pageHeight - margin * 2) / canvas.height
      );

      const width = canvas.width * scale;
      const height = canvas.height * scale;

      pdf.addImage(
        image,
        "PNG",
        (pageWidth - width) / 2,
        (pageHeight - height) / 2,
        width,
        height
      );

      pdf.save("whiteboard-ai.pdf");
    } catch (error) {
      console.error("PDF export failed:", error);
      window.alert("PDF export failed. Please try again.");
    }
  };

  if (!boardReady) {
    return (
      <div className="w-screen h-screen bg-[#0B0B0D] flex items-center justify-center text-gray-300">
        Restoring your whiteboard...
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-[#0B0B0D] flex flex-col">
      <Header
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={handleSavePDF}
        onDownloadPNG={handleDownloadPNG}
        onShare={handleShare}
        onToggleTheme={toggleCanvasTheme}
        canvasTheme={canvasTheme}
        shareMessage={shareMessage}
        saveStatus={saveStatus}
      />

      <div className="flex flex-1 overflow-hidden">
        <LeftToolbar
          excalidrawAPI={excalidrawAPI}
          activeTool={activeTool}
          setActiveTool={setActiveTool}
        />

        <main className="flex-1 flex flex-col min-w-0">
          <AIPrompt
            onGenerate={handleAIGenerate}
            isGenerating={isGenerating}
          />

          <div className="flex-1 mx-5 mb-5 mt-2 rounded-xl border border-[#2a2a2f] bg-white overflow-hidden text-black">
            <Whiteboard
              setExcalidrawAPI={setExcalidrawAPI}
              setSelectedElement={setSelectedElement}
              canvasTheme={canvasTheme}
              initialData={initialData}
              onSceneChange={handleSceneChange}
            />
          </div>
        </main>

        <RightPanel
          selectedElement={selectedElement}
          updateSelectedElement={updateSelectedElement}
        />
      </div>

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