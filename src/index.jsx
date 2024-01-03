import React from "react";
import { entrypoints, shell } from "uxp";

import "./styles.css";
import { PanelController } from "./controllers/PanelController.jsx";
import { App } from "./panels/App.jsx";

const appPanelController = new PanelController(() => <App />, {
    id: "app",
    menuItems: [
        {
            id: "logout",
            label: "Logout",
            enabled: true,
            checked: false,
            onInvoke: () => {
                localStorage.clear();
                location.reload();
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
            await shell.openExternal("https://console.pixelbin.io/choose-org?redirectTo=storage");
        },
        async buyCredits() {
            await shell.openExternal("https://console.pixelbin.io/choose-org?redirectTo=settings/billing/pricing");
        },
        async howItWorks() {
            await shell.openExternal("https://www.pixelbin.io/docs/integrations/photoshop/");
        },
    },
    panels: {
        app: appPanelController,
    },
});
