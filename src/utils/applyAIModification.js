import { aiToExcalidraw } from "./aiToExcalidraw";
export const applyAIModification = (
  currentElements,
  aiResponse
) => {
  const changes = aiResponse.changes;

  let elements = [...currentElements];

  // -------------------------
  // Remove elements
  // -------------------------

  if (changes.removeElementIds?.length) {
    elements = elements.filter(
      (element) =>
        !changes.removeElementIds.includes(
          element.id
        )
    );
  }

  // -------------------------
  // Update elements
  // -------------------------

  if (changes.updateElements?.length) {
    elements = elements.map((element) => {
      const update =
        changes.updateElements.find(
          (item) => item.id === element.id
        );

      if (!update) return element;

      return {
        ...element,
        ...update,
      };
    });
  }

  // -------------------------
  // Add new elements
  // -------------------------

  if (changes.addElements?.length) {
    const newElements =
      aiToExcalidraw(changes);

    elements.push(...newElements);
  }

  return elements;
};