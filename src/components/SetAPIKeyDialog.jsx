import React, { useState } from "react";
import { PixelbinClient, PixelbinConfig } from "@pixelbin/admin";

import { handle } from "../utils";

export default function SetAPIKeyDialog({ dialog }) {
    const [errorMessage, setErrorMessage] = useState("");
    const [validateButtonDisabled, setValidateButtonDisabled] = useState(false);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        setValidateButtonDisabled(true);

        const apiSecret = document.querySelector("[name='apiToken']").value;

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

        setValidateButtonDisabled(false);

        if (error?.code === 401) {
            setErrorMessage(error.details.error);
            return;
        }

        localStorage.setItem("apikey", apiSecret);

        dialog.close("tokenValidated");
    };

    return (
        <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
            <div style={{ display: "flex", gap: "1rem", flexDirection: "column", alignItems: "center" }}>
                <sp-heading style={{ marginTop: 0 }}>
                    <img className="icon" src="./assets/icon.png" />
                    Log in to use Erase.bg for Photoshop
                </sp-heading>
                <sp-divider style={{ margin: "1rem 0" }}></sp-divider>
                <div style={{ display: "flex", gap: "1rem" }}>
                    <sp-textfield
                        name="apiToken"
                        placeholder="Enter API Token"
                    ></sp-textfield>
                    <sp-action-button style={{ marginLeft: "0.5rem" }} disabled={validateButtonDisabled ? true : undefined} onClick={handleFormSubmit}>Validate</sp-action-button>
                </div>
                <a style={{ marginTop: "2rem" }} href="https://console.pixelbin.io/choose-org?redirectTo=settings/apps">
                    Get your API token
                </a>
            </div>

            {errorMessage && <sp-body>{errorMessage}</sp-body>}
        </div>
    );
}
