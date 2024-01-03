import React from "react";
// import { AlertIcon } from "./Icons";

export function ErrorAlertDialog({ error }) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <sp-heading>
                {/* <AlertIcon /> */}
                <span>Transformation error</span>
            </sp-heading>
            <sp-body size="L">{error}</sp-body>
        </div>
    );
}
