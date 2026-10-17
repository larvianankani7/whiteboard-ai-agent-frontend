
import { useState } from "react";
import {
  MousePointer2,
  Square,
  Circle,
  ArrowRight,
  Type,
  Pencil,
  Minus,
  Eraser,
  Lock,
  Unlock,
  Trash2,
} from "lucide-react";

const tools = [
  { type: "selection", icon: MousePointer2, label: "Select" },
  { type: "rectangle", icon: Square, label: "Rectangle" },
  { type: "ellipse", icon: Circle, label: "Ellipse" },
  { type: "arrow", icon: ArrowRight, label: "Arrow" },
  { type: "text", icon: Type, label: "Text" },
  { type: "freedraw", icon: Pencil, label: "Draw" },
  { type: "line", icon: Minus, label: "Line" },
  { type: "eraser", icon: Eraser, label: "Eraser" },
];

function LeftToolbar({
  excalidrawAPI,
  activeTool,
  setActiveTool,
  onClearAll,
}) {
  const [toolLocked, setToolLocked] = useState(true);

  const handleToolClick = (toolType) => {
    if (!excalidrawAPI) return;

    excalidrawAPI.setActiveTool({
      type: toolType,
      locked: toolLocked,
    });

    setActiveTool(toolType);
  };

  const handleToggleLock = () => {
    if (!excalidrawAPI) return;

    const nextLocked = !toolLocked;
    setToolLocked(nextLocked);

    excalidrawAPI.setActiveTool({
      type: activeTool,
      locked: nextLocked,
    });
  };

  return (
    <aside className="left-toolbar shrink-0 border-r border-[#2a2a2f] bg-[#111113] flex flex-col items-center py-3 gap-2">
      {tools.map((tool) => {
        const Icon = tool.icon;
        const isActive = activeTool === tool.type;

        return (
          <button
            key={tool.type}
            type="button"
            title={tool.label}
            aria-label={tool.label}
            aria-pressed={isActive}
            onClick={() => handleToolClick(tool.type)}
            className={`tool-button ${
              isActive
                ? "bg-[#7F1D2D] text-white"
                : "text-gray-400 hover:text-white hover:bg-[#7F1D2D]"
            }`}
          >
            <Icon size={19} />
          </button>
        );
      })}

      <div className="toolbar-separator" />

      <button
        type="button"
        title={toolLocked ? "Unlock active tool" : "Lock active tool"}
        aria-label={toolLocked ? "Unlock active tool" : "Lock active tool"}
        aria-pressed={toolLocked}
        onClick={handleToggleLock}
        className={`tool-button ${
          toolLocked
            ? "bg-[#27272a] text-white"
            : "text-gray-400 hover:text-white hover:bg-[#7F1D2D]"
        }`}
      >
        {toolLocked ? <Lock size={18} /> : <Unlock size={18} />}
      </button>

      <button
        type="button"
        title="Clear entire whiteboard"
        aria-label="Clear entire whiteboard"
        onClick={onClearAll}
        className="tool-button clear-all-button text-red-400 hover:bg-red-900/40 hover:text-red-300"
      >
        <Trash2 size={19} />
      </button>
    </aside>
  );
}

export default LeftToolbar;
