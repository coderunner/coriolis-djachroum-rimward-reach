export const FOLDER_TYPES = {
  journal: "JournalEntry",
  item: "Item",
  actor: "Actor",
  playlist: "Playlist",
  table: "RollTable",
  scene: "Scene",
};

export async function createFolderPath(folderPath, type, color, sorting) {
  return _createFolderPath(null, folderPath, type, color, sorting);
}

async function _createFolderPath(parentId, folderPath, type, color, sorting) {
  const elements = folderPath.split("/");
  if (elements.length === 1) {
    if (!singleFolderExists(parentId, elements[0], type)) {
      return createSingleFolder(parentId, elements[0], type, color, sorting);
    }
    return getSingleFolder(parentId, elements[0], type);
  }

  const rootElement = elements.shift();
  const restOfPath = elements.join("/");
  let rootFolder = getSingleFolder(parentId, rootElement, type);
  if (rootFolder === undefined) {
    rootFolder = await createSingleFolder(parentId, rootElement, type, sorting);
  }
  return _createFolderPath(rootFolder.id, restOfPath, type, color, sorting);
}

function singleFolderExists(parentId, folderName, type) {
  return !!getSingleFolder(parentId, folderName, type);
}

export function getSingleFolder(parentId, folderName, type) {
  return game.folders.find((f) => {
    return (
      (f.parentFolder?.id ?? null) === parentId &&
      f.name === folderName &&
      f.type === type
    );
  });
}

async function createSingleFolder(parentId, folderName, type, color, sorting) {
  return Folder.create({
    name: folderName,
    type: type,
    color: color,
    parent: parentId,
    sorting: sorting,
  });
}
