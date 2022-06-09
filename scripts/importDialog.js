import { importContent } from "./import.js";
import { moduleTitle } from "./constants.js";

export class ImportModuleDialog extends Dialog {
  constructor() {
    const diagOpts = {
      width: 500,
    };
    super(
      {
        title: `Import ${moduleTitle}`,
        content: `
<div>
<h1>Coriolis Djachroum and the Rimward Reach</h1>
<hr />
<p>This will import the content of the compendiums in <em>Coriolis Djachroum and the Rimward Reach</em> folders.</p>
</div>
`,
        buttons: {
          initialize: {
            label: "Import Compendium",
            callback: async () => {
              await importContent();
              ui.notifications.notify(
                "Coriolis Djachroum and the Rimward Reach imported successfully."
              );
            },
          },
          cancel: {
            label: "Cancel",
            callback: async () => {
              ui.notifications.notify("Import cancelled.");
            },
          },
        },
      },
      diagOpts
    );
  }
}
