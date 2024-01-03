import React from "react";
import { entrypoints, shell } from "uxp";

import { ConfirmationDialog } from "./components/ConfirmationDialog";
import { CommandController } from "./controllers/CommandController";
import { PanelController } from "./controllers/PanelController";
import { App } from "./panels/App";
import "./styles.css";

const appPanelController = new PanelController(() => <App />, {
    id: "app",
    menuItems: [
        {
            id: "logout",
            label: "Logout",
            enabled: true,
            checked: false,
            onInvoke: async () => {
                const confirmationDialogController = new CommandController(
                    ({ dialog }) => <ConfirmationDialog dialog={dialog} />
                );

                const logout = await confirmationDialogController.run();

                if (logout === "YES") {
                    localStorage.clear();
                    location.reload();
                }
            },
        },
    ],
});

entrypoints.setup({
    plugin: {
        create(plugin) {
            console.clear();
            console.log("created", { plugin });
        },
        destroy() {
            console.log("destroyed");
        },
    },
    commands: {
        async goToDashboard() {
            await shell.openExternal(
                "https://console.pixelbin.io/choose-org?redirectTo=storage"
            );
        },
        async buyCredits() {
            await shell.openExternal(
                "https://console.pixelbin.io/choose-org?redirectTo=settings/billing/pricing"
            );
        },
        async howItWorks() {
            await shell.openExternal(
                "https://www.pixelbin.io/docs/integrations/photoshop/"
            );
        },
    },
    panels: {
        app: appPanelController,
    },
});
