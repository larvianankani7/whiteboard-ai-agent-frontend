import {
  MousePointer2,
  Square,
  Circle,
  ArrowRight,
  Type,
  Pencil,
  Minus,
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
];

function LeftToolbar({
  excalidrawAPI,
  activeTool,
  setActiveTool,
  onClearAll,
}) {
  const handleToolClick = (toolType) => {
    if (!excalidrawAPI) return;

    excalidrawAPI.setActiveTool({
      type: toolType,
      locked: true,
    });

    setActiveTool(toolType);
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