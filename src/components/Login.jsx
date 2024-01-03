import React, { useRef, useState } from "react";
import { PixelbinClient, PixelbinConfig } from "@pixelbin/admin";

import { handle } from "../utils";

export function Login({ setToken, setAppOrgDetails }) {
    const [errorMessage, setErrorMessage] = useState("");
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const tokenInputRef = useRef();

    const handleSubmitClick = async (e) => {
        e.preventDefault();

        setSubmitButtonDisabled(true);

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

        setSubmitButtonDisabled(false);

        if (error?.code === 401) {
            setErrorMessage(error.details.error);
            return;
        }

        setToken(token);
        setAppOrgDetails(appOrgDetails);
    };

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
                <sp-body
                    style={{
                        display: "flex",
                        alignItems: "center",
                        margin: "1rem 0",
                    }}
                    size="XL"
                >
                    <img
                        className="icon"
                        src="./icons/erasebg.png"
                        style={{ marginRight: "1rem" }}
                    />
                    Log in
                </sp-body>
                <sp-textfield
                    ref={tokenInputRef}
                    name="token"
                    placeholder="Enter API Token"
                ></sp-textfield>
                <sp-action-button
                    style={{ marginTop: "0.5rem" }}
                    disabled={submitButtonDisabled ? true : undefined}
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
