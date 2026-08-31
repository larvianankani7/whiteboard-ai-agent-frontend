import {
  MousePointer2,
  Square,
  Circle,
  ArrowRight,
  Type,
  Pencil,
  Minus,
} from "lucide-react";

const tools = [
  {
    type: "selection",
    icon: MousePointer2,
    label: "Select",
  },
  {
    type: "rectangle",
    icon: Square,
    label: "Rectangle",
  },
  {
    type: "ellipse",
    icon: Circle,
    label: "Ellipse",
  },
  {
    type: "arrow",
    icon: ArrowRight,
    label: "Arrow",
  },
  {
    type: "text",
    icon: Type,
    label: "Text",
  },
  {
    type: "freedraw",
    icon: Pencil,
    label: "Draw",
  },
  {
    type: "line",
    icon: Minus,
    label: "Line",
  },
];

function LeftToolbar({ excalidrawAPI, activeTool, setActiveTool }) {
  
  const handleToolClick = (toolType) => {
    if (!excalidrawAPI) return;

    excalidrawAPI.setActiveTool({
      type: toolType,
    });

    setActiveTool(toolType);
  };

  return (
    <aside className="w-16 border-r border-[#2a2a2f] bg-[#111113] flex flex-col items-center py-4 gap-3">

      {tools.map((tool) => {
        const Icon = tool.icon;

        const isActive = activeTool === tool.type;

        return (
          <button
            key={tool.type}
            title={tool.label}
            onClick={() => handleToolClick(tool.type)}
            className={`
              w-10 h-10 rounded-lg flex items-center justify-center 
              transition-all duration-200
              ${
                isActive
                  ? "bg-[#7F1D2D] text-white shadow-md shadow-[#7F1D2D]/30"
                  : "text-gray-400 hover:text-white hover:bg-[#7F1D2D]"
              }
            `}
          >
            <Icon size={19} />
          </button>
        );
      })}

    </aside>
  );
}

export default LeftToolbar;