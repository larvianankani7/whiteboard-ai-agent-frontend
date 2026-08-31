export const excalidrawToAI = (elements) => {
const activeElements = elements.filter(
(element) => !element.isDeleted
);

const aiElements = activeElements.map(
(element) => ({
id: element.id,
type: element.type,
text: element.text || "",
})
);

return {
elements: aiElements,
};
};
