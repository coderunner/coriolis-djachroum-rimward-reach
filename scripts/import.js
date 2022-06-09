import { moduleScopeKey } from "./constants.js";
import { getSingleFolder, createFolderPath, FOLDER_TYPES } from "./folders.js";

const ROOT_DIR_FOLDER_NAME = "Coriolis Djachroum and the Rimward Reach";
const SUB_FOLDERS = [{ code: "rimward", folder: "The Rimward Reach" }];

export async function importContent() {
  let errors = [];

  let journalFolder = getSingleFolder(
    null,
    ROOT_DIR_FOLDER_NAME,
    FOLDER_TYPES.journal
  );

  if (!!journalFolder) {
    errors.push(
      `Journal folder ${ROOT_DIR_FOLDER_NAME} already exists. Skipping import.`
    );
  } else {
    const folder = await createFolderPath(
      ROOT_DIR_FOLDER_NAME,
      FOLDER_TYPES.journal,
      undefined,
      "m"
    );

    for (const n of SUB_FOLDERS) {
      console.log("ici");
      const f = await createFolderPath(
        `${ROOT_DIR_FOLDER_NAME}/${n.folder}`,
        FOLDER_TYPES.journal,
        undefined,
        "m"
      );
      await importPack(
        `${moduleScopeKey}.${n.code.toLowerCase()}_journals`,
        game.journal,
        f.id,
        false
      );
    }
    // await importPack(
    //   `${moduleScopeKey}.credits_journals`,
    //   game.journal,
    //   folder.id
    // );
  }

  // let sceneFolder = getSingleFolder(
  //   null,
  //   ROOT_DIR_FOLDER_NAME,
  //   FOLDER_TYPES.scene
  // );
  // if (!!sceneFolder) {
  //   errors.push(
  //     `Scene folder ${ROOT_DIR_FOLDER_NAME} already exists. Skipping import.`
  //   );
  // } else {
  //   await createFolderPath(ROOT_DIR_FOLDER_NAME, FOLDER_TYPES.scene);

  //   for (const n of SUB_FOLDERS) {
  //     const folderName = n === "Pillar" ? "The Quadrant of the Pillar" : n;
  //     const f = await createFolderPath(
  //       `${ROOT_DIR_FOLDER_NAME}/${folderName}`,
  //       FOLDER_TYPES.scene
  //     );
  //     await importPack(
  //       `${moduleScopeKey}.${n.toLowerCase()}_scenes`,
  //       game.scenes,
  //       f.id
  //     );
  //   }
  // }

  for (const e of errors) {
    ui.notifications.notify(e);
  }
}

async function importPack(packName, importer, targetFolderId, clearSort) {
  const pack = game.packs.get(packName);
  if (!pack) {
    ui.notifications.notify(`${packName} pack not found`);
    return;
  }

  const pIndex = await pack.getIndex();
  for await (const entity of pIndex.map((e) => pack.getDocument(e._id))) {
    importer.importFromCompendium(
      pack,
      entity.id,
      {
        folder: targetFolderId,
      },
      { clearSort: clearSort, keepId: true }
    );
  }
}
