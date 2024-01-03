import React from "react";
import { entrypoints, shell } from "uxp";

import "./styles.css";
import { PanelController } from "./controllers/PanelController.jsx";
import { RemoveBackground } from "./panels/RemoveBackground.jsx";

const removeBackgroundPanelController = new PanelController(() => <RemoveBackground />, {
    id: "removeBackground",
    menuItems: [
        {
            id: "reload",
            label: "Reload plugin",
            enabled: true,
            checked: false,
            onInvoke: () => location.reload(),
        },
        {
            id: "logout",
            label: "Logout",
            enabled: true,
            checked: false,
            onInvoke: () => {
                const apiKey = localStorage.getItem("apikey");

                if (apiKey) {
                    localStorage.removeItem("apikey");
                }

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
            await shell.openExternal("https://console.pixelbin.io/choose-org?redirectTo=storage"); // update to console home with orgId from token
        },
    },
    panels: {
        removeBackground: removeBackgroundPanelController,
    },
});
