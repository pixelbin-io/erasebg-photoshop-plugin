import React, { useState } from "react";
import { PixelbinClient, PixelbinConfig } from "@pixelbin/admin";

import { handle } from "../utils";

export default function SetAPIKeyDialog({ dialog }) {
    const [errorMessage, setErrorMessage] = useState("");

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // const apiSecret = document.querySelector("[name='apiToken']").value;
try {
        const apiSecret = "a11a14e5-2671-42d3-bc42-bd0efaccbd52";

        const config = new PixelbinConfig({
            domain: "https://api.pixelbin.io",
            // apiSecret: "a11a14e5-2671-42d3-bc42-bd0efaccbd52",
            apiSecret,
            // domain: "https://api.pixelbinz0.de",
            // apiSecret: "098b0072-dd31-40b3-8617-679e749b0455",
        });

        const pixelbin = new PixelbinClient(config);

        const [, error] = await handle(
            pixelbin.assets.getDefaultAssetForPlayground()
        );

        if (error?.code === 401) {
            setErrorMessage(error.details.error);
            return;
        }

        localStorage.setItem("apikey", apiSecret);

        dialog.close("tokenValidated");
    } catch (err) {
        console.log(err)
    }
    };

    return (
        <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
            <div style={{ display: "flex", gap: "1rem", flexDirection: "column", alignItems: "center" }}>
                <form method="dialog" onSubmit={handleFormSubmit}>
                    <sp-heading style={{ marginTop: 0 }}>
                        <img className="icon" src="./assets/icon.png" />
                        Log in to use Erase.BG for Photoshop
                    </sp-heading>
                    <sp-divider style={{ margin: "1rem 0" }}></sp-divider>
                    <sp-textfield
                        name="apiToken"
                        placeholder="Enter API Token"
                    ></sp-textfield>
                    <sp-action-button style={{ marginLeft: "0.5rem" }} onClick={handleFormSubmit}>Validate</sp-action-button>
                </form>
                <a style={{ marginTop: "2rem" }} href="https://console.pixelbin.io/choose-org?redirectTo=settings/apps">
                    Get your API token
                </a>
            </div>

            {errorMessage && <sp-body>{errorMessage}</sp-body>}
        </div>
    );
}
