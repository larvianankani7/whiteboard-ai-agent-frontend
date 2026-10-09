const DB_NAME = "whiteboard-ai-local";
const STORE_NAME = "boards";
const BOARD_KEY = "current-board";

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveBoard(board) {
  const db = await openDatabase();

  try {
    await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");

      transaction.objectStore(STORE_NAME).put(
        {
          elements: board.elements,
          appState: board.appState,
          files: board.files,
          updatedAt: Date.now(),
        },
        BOARD_KEY
      );

      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally {
    db.close();
  }
}

export async function loadBoard() {
  const db = await openDatabase();

  try {
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const request = transaction.objectStore(STORE_NAME).get(BOARD_KEY);

      request.onsuccess = () => resolve(request.result ?? null);
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
}