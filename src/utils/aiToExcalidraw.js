import { convertToExcalidrawElements } from "@excalidraw/excalidraw";

const NODE_WIDTH = 180;
const NODE_HEIGHT = 70;

const HORIZONTAL_GAP = 120;
const VERTICAL_GAP = 100;

const getPositions = (elements) => {
  const positions = {};

  elements.forEach((element, index) => {
    positions[element.id] = {
      x:
        100 +
        (index % 3) * (NODE_WIDTH + HORIZONTAL_GAP),

      y:
        100 +
        Math.floor(index / 3) *
          (NODE_HEIGHT + VERTICAL_GAP),
    };
  });

  return positions;
};

export const aiToExcalidraw = (aiData) => {
  const {
    elements = [],
    connections = [],
  } = aiData;

  const positions = getPositions(elements);

  const rawElements = [];

  // -------------------------
  // Create shapes + text
  // -------------------------

  elements.forEach((element) => {
    const position = positions[element.id];

    if (element.type === "text") {
      rawElements.push({
        type: "text",
        x: position.x,
        y: position.y,
        text: element.text || "",
        fontSize: 20,
      });

      return;
    }

    rawElements.push({
      type: element.type,
      x: position.x,
      y: position.y,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      label: {
        text: element.text || "",
      },
    });
  });

  // -------------------------
  // Create arrows
  // -------------------------

  connections.forEach((connection) => {
    const from = positions[connection.from];
    const to = positions[connection.to];

    if (!from || !to) return;

    const startX = from.x + NODE_WIDTH / 2;
    const startY = from.y + NODE_HEIGHT;

    const endX = to.x + NODE_WIDTH / 2;
    const endY = to.y;

    rawElements.push({
      type: connection.type || "arrow",

      x: startX,
      y: startY,

      points: [
        [0, 0],
        [
          endX - startX,
          endY - startY,
        ],
      ],
    });
  });

  return convertToExcalidrawElements(rawElements);
};