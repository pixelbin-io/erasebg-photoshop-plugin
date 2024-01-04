import React from "react";

export function ErrorAlertDialog({ error }) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
            }}
        >
            <sp-body size="L">{error}</sp-body>
        </div>
    );
}
