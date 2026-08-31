import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";

function Whiteboard({ setExcalidrawAPI, setSelectedElement, onElementsChange, canvasTheme }) {
  return (
    <div className="w-full h-full">
      <Excalidraw
  excalidrawAPI={(api) => setExcalidrawAPI(api)}
  initialData={{
    elements: [],
    appState: {
      viewBackgroundColor: "#ffffff",
    },
  }}
  theme={canvasTheme}
  gridModeEnabled={false}
  ui={false}
  onChange={(elements, appState) => {
    const selected = elements.find(
      (element) => appState.selectedElementIds[element.id]
    );

    setSelectedElement(selected || null);
    onElementsChange(elements);
  }}
/>
    </div>
  );
}

export default Whiteboard;