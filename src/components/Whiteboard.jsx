
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";

function Whiteboard({
  setExcalidrawAPI,
  setSelectedElement,
  onSceneChange,
  canvasTheme,
  initialData,
}) {
  return (
    <div className="w-full h-full">
      <Excalidraw
        excalidrawAPI={setExcalidrawAPI}
        initialData={initialData}
        theme={canvasTheme}
        gridModeEnabled={false}
        ui={false}
        onChange={(elements, appState, files) => {
          const selected = elements.find(
            (element) =>
              appState.selectedElementIds?.[element.id]
          );

          setSelectedElement(selected || null);

          onSceneChange({
            elements,
            appState,
            files: files || {},
          });
        }}
      />
    </div>
  );
}

export default Whiteboard;