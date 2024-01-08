import React, { useState } from "react";
import { PixelbinClient, PixelbinConfig } from "@pixelbin/admin";

import { handle } from "../utils";
import { WC } from "./WC";
// import { VisibilityIcon, VisibilityOffIcon } from "./Icons";

export function Login({ setToken, setAppOrgDetails }) {
    const [errorMessage, setErrorMessage] = useState("");
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [tokenInputValue, setTokenInputValue] = useState("");
    // const [tokenInputVisible, setTokenInputVisible] = useState(true);

    const handleSubmitClick = async (e) => {
        e.preventDefault();

        setSubmitButtonDisabled(true);

        const config = new PixelbinConfig({
            domain: "https://api.pixelbin.io",
            apiSecret: tokenInputValue,
        });

        const pixelbin = new PixelbinClient(config);

        const [appOrgDetails, error] = await handle(
            pixelbin.organization.getAppOrgDetails()
        );

        setSubmitButtonDisabled(false);

        if (error?.code === 401) {
            setErrorMessage("Invalid Token");
            return;
        }

        setToken(tokenInputValue);
        setAppOrgDetails(appOrgDetails);
    };

    const handleTokenInputValueChange = (e) => {
        setTokenInputValue(e.target.value);
    };

    // const handleVisibilityToggleButtonClick = () => {
    //     setTokenInputVisible(!tokenInputVisible);
    // };

    return (
        <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
            <div
                style={{
                    display: "flex",
                    gap: "1rem",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <header
                    style={{
                        display: "flex",
                        alignItems: "center",
                        margin: "1rem 0",
                        color: "var(--uxp-host-text-color)",
                        fontSize: "20px",
                    }}
                >
                    <img
                        className="icon"
                        src="./icons/erasebg.png"
                        style={{ marginRight: "0.5rem", height: "32px" }}
                    />
                    Login
                </header>
                <WC onInput={handleTokenInputValueChange}>
                    <sp-textfield
                        name="token"
                        placeholder="Enter API Token"
                    ></sp-textfield>
                </WC>
                {/* <sp-action-button
                    quiet
                    onClick={handleVisibilityToggleButtonClick}
                >
                    <div slot="icon">
                        {tokenInputVisible ? (
                            <VisibilityIcon />
                        ) : (
                            <VisibilityOffIcon />
                        )}
                    </div>
                </sp-action-button> */}
                <sp-action-button
                    style={{ marginTop: "0.5rem" }}
                    disabled={
                        !tokenInputValue || submitButtonDisabled
                            ? true
                            : undefined
                    }
                    onClick={handleSubmitClick}
                >
                    Submit
                </sp-action-button>
                <sp-link
                    quiet
                    style={{ marginTop: "2rem" }}
                    href="https://console.pixelbin.io/choose-org?redirectTo=settings/apps"
                >
                    Get your API token
                </sp-link>
            </div>

            {errorMessage && (
                <sp-body
                    style={{
                        backgroundColor: "rgba(255, 0, 0, 0.4)",
                        borderRadius: "4px",
                        margin: "1rem",
                        padding: "1rem",
                        border: "4px solid darkred",
                    }}
                >
                    {errorMessage}
                </sp-body>
            )}
        </div>
    );
}
