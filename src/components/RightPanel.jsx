import {
  Palette,
  Layers,
  Settings2,
  MousePointerClick,
} from "lucide-react";

function RightPanel({
  selectedElement,
  onOpenSettings,
  updateSelectedElement,
}) {
  const hasSelection = !!selectedElement;

  return (
    <aside className="w-64 border-l border-[#2a2a2f] bg-[#111113] p-6">

      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-[0.15em] mb-9">
        Properties
      </h2>

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
          {/* Selected Element */}
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

          {/* Appearance */}
          <div className="mb-12">

            <div className="flex items-center gap-2.5 text-sm text-white mb-5">
              <Palette size={17} className="text-[#B33A4B]" />
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

          {/* Element Info */}
          <div className="border-t border-[#2a2a2f] pt-9">

            <div className="flex items-center gap-2.5 text-sm text-white mb-5">
              <Layers size={17} className="text-[#B33A4B]" />
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

      {/* Settings */}
      <div className="border-t border-[#2a2a2f] mt-10 pt-9">

        <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-2.5 text-sm text-white cursor-pointer hover:text-[#d76a78] transition-colors"
            >
            <Settings2 size={17} className="text-[#B33A4B]" />
            Settings
        </button>

      </div>

    </aside>
  );
}

export default RightPanel;