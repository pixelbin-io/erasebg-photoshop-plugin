import React, { useRef, useState } from "react";
import { PixelbinClient, PixelbinConfig } from "@pixelbin/admin";

import { handle } from "../utils";

export default function Login({ setToken, setAppOrgDetails }) {
    const [errorMessage, setErrorMessage] = useState("");
    const [validateButtonDisabled, setValidateButtonDisabled] = useState(false);
    const tokenInputRef = useRef();

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        setValidateButtonDisabled(true);

        const token = tokenInputRef.current.value;

        const config = new PixelbinConfig({
            domain: "https://api.pixelbin.io",
            // apiSecret: "a11a14e5-2671-42d3-bc42-bd0efaccbd52",
            apiSecret: token,
            // domain: "https://api.pixelbinz0.de",
            // apiSecret: "098b0072-dd31-40b3-8617-679e749b0455",
        });

        const pixelbin = new PixelbinClient(config);

        const [appOrgDetails, error] = await handle(
            pixelbin.organization.getAppOrgDetails()
        );

        setValidateButtonDisabled(false);

        if (error?.code === 401) {
            setErrorMessage(error.details.error);
            return;
        }

        setToken(token);
        setAppOrgDetails(appOrgDetails);
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
                        ref={tokenInputRef}
                        name="token"
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
