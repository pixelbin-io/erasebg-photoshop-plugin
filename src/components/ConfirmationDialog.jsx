import React from "react";

export function ConfirmationDialog({ dialog }) {
    const handleNoClick = () => dialog.close("NO");
    const handleYesClick = () => dialog.close("YES");

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <sp-body size="XL">Are you sure you want to logout?</sp-body>
            <footer>
                <sp-button variant="primary" onClick={handleNoClick}>
                    No
                </sp-button>
                <sp-button
                    style={{ marginLeft: "1rem" }}
                    onClick={handleYesClick}
                >
                    Yes
                </sp-button>
            </footer>
        </div>
    );
}
