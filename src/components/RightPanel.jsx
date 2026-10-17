import {
  Palette,
  Layers,
  Settings2,
  MousePointerClick,
  X,
} from "lucide-react";

function RightPanel({
  selectedElement,
  onOpenSettings,
  updateSelectedElement,
  mobileOpen = false,
  onCloseMobile,
}) {
  const hasSelection = !!selectedElement;

  return (
    <aside
      className={`
        right-properties-panel
        w-64
        border-l
        border-[#2a2a2f]
        bg-[#111113]
        p-6
        ${mobileOpen ? "mobile-open" : ""}
      `}
    >
      <div className="right-panel-header">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-[0.15em]">
          Properties
        </h2>

        <button
          onClick={onCloseMobile}
          className="right-panel-close toolbar-button"
          title="Close properties"
        >
          <X size={17} />
        </button>
      </div>

      {!hasSelection ? (
        <div className="flex flex-col items-center justify-center text-center pt-10">
          <div className="w-12 h-12 rounded-xl bg-[#7F1D2D]/15 border border-[#7F1D2D]/30 flex items-center justify-center mb-4">
            <MousePointerClick
              size={20}
              className="text-[#B33A4B]"
            />
          </div>

          <p className="text-sm text-gray-400">
            No element selected
          </p>

          <p className="text-xs leading-5 text-gray-600 mt-2">
            Select an element on the canvas to edit its properties.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-10">
            <p className="text-xs text-gray-500 mb-2">
              Selected Element
            </p>

            <div className="px-3 py-2.5 rounded-lg bg-[#18181b] border border-[#2a2a2f]">
              <span className="text-sm text-gray-300 capitalize">
                {selectedElement.type}
              </span>
            </div>
          </div>

          <div className="mb-12">
            <div className="flex items-center gap-2.5 text-sm text-white mb-5">
              <Palette
                size={17}
                className="text-[#B33A4B]"
              />
              Appearance
            </div>

            <div className="space-y-8">
              <div>
                <label className="text-xs text-gray-500">
                  Stroke
                </label>

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() =>
                      updateSelectedElement({
                        strokeColor: "#000000",
                      })
                    }
                    className="w-7 h-7 rounded-md border border-white bg-white cursor-pointer"
                  />

                  <button
                    onClick={() =>
                      updateSelectedElement({
                        strokeColor: "#7F1D2D",
                      })
                    }
                    className="w-7 h-7 rounded-md bg-[#7F1D2D] cursor-pointer"
                  />

                  <button
                    onClick={() =>
                      updateSelectedElement({
                        strokeColor: "#3B82F6",
                      })
                    }
                    className="w-7 h-7 rounded-md bg-[#3B82F6] cursor-pointer"
                  />

                  <button
                    onClick={() =>
                      updateSelectedElement({
                        strokeColor: "#22C55E",
                      })
                    }
                    className="w-7 h-7 rounded-md bg-[#22C55E] cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500">
                  Fill
                </label>

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() =>
                      updateSelectedElement({
                        backgroundColor: "transparent",
                      })
                    }
                    className="w-7 h-7 rounded-md border border-gray-200 cursor-pointer"
                  />

                  <button
                    onClick={() =>
                      updateSelectedElement({
                        backgroundColor: "#7F1D2D",
                      })
                    }
                    className="w-7 h-7 rounded-md bg-[#7F1D2D] cursor-pointer"
                  />

                  <button
                    onClick={() =>
                      updateSelectedElement({
                        backgroundColor: "#1E293B",
                      })
                    }
                    className="w-7 h-7 rounded-md bg-[#1E293B] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#2a2a2f] pt-9">
            <div className="flex items-center gap-2.5 text-sm text-white mb-5">
              <Layers
                size={17}
                className="text-[#B33A4B]"
              />
              Element
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Width</span>

                <span className="text-gray-300">
                  {Math.round(selectedElement.width)} px
                </span>
              </div>

              <div className="flex justify-between text-gray-500">
                <span>Height</span>

                <span className="text-gray-300">
                  {Math.round(selectedElement.height)} px
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="border-t border-[#2a2a2f] mt-10 pt-9">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-2.5 text-sm text-white cursor-pointer hover:text-[#d76a78] transition-colors"
        >
          <Settings2
            size={17}
            className="text-[#B33A4B]"
          />
          Settings
        </button>
      </div>

      <style>{`
        .right-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .right-panel-close {
          display: none;
        }

        @media (max-width: 640px) {
          .right-properties-panel {
            position: absolute;
            z-index: 100;
            left: 6px;
            right: 6px;
            bottom: 6px;

            width: auto !important;

            max-height: min(70vh, 520px);
            overflow-y: auto;

            padding: 18px !important;

            border: 1px solid #2a2a2f !important;
            border-radius: 16px;

            box-shadow:
              0 -10px 40px rgba(0, 0, 0, 0.45),
              0 10px 30px rgba(0, 0, 0, 0.3);

            transform: translateY(calc(100% + 20px));
            opacity: 0;
            pointer-events: none;

            transition:
              transform 0.22s ease,
              opacity 0.22s ease;
          }

          .right-properties-panel:focus-within,
          .right-properties-panel.mobile-open {
            transform: translateY(0);
            opacity: 1;
            pointer-events: auto;
          }

          .right-panel-header {
            margin-bottom: 22px;
          }

          .right-panel-close {
            display: flex;
          }
        }
      `}</style>

      <div
        className={`mobile-panel-state ${
          mobileOpen ? "mobile-open" : ""
        }`}
      />
    </aside>
  );
}

export default RightPanel;
