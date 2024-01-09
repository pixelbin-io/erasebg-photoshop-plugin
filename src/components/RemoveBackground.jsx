import React, { useEffect, useState } from "react";

import { HelpIcon, RefreshIcon } from "./Icons";
import { WC } from "./WC";
import { getUsage, handle, removeBackground } from "../utils";
import { CommandController } from "../controllers/CommandController";
import { ErrorAlertDialog } from "./ErrorAlertDialog";
import Loader from "./Loader";
import { CreditsInformation } from "./CreditsInformation";

const LoadingBackdrop = () => {
    return (
        <div
            style={{
                position: "absolute",
                height: "100%",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0, 0, 0, 0.9)",
                zIndex: 1,
                margin: "-1rem",
            }}
        >
            <Loader />
        </div>
    );
};

export const RemoveBackground = ({
    appOrgDetails,
    token,
    filters = {},
    setFilters,
}) => {
    const options = ["general", "ecommerce", "car (preview)", "human"];

    let initialIndustryType = filters.industryType || "general";
    let initialAddShadow = filters.addShadow || false;
    let initialRefine = filters.refine || true;

    const [industryType, setIndustryType] = useState(initialIndustryType);
    const [addShadow, setAddShadow] = useState(initialAddShadow);
    const [refine, setRefine] = useState(initialRefine);
    const [loading, setLoading] = useState(false);
    const [usage, setUsage] = useState({
        credits: { used: 0 },
        total: { credits: 0 },
    });

    const updateUsage = () => getUsage(token).then(setUsage);

    useEffect(() => {
        updateUsage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleApply = async (e) => {
        e.preventDefault();

        setLoading(true);

        const filters = {
            industryType,
            addShadow,
            refine,
        };

        const [, error] = await handle(
            removeBackground({
                appOrgDetails,
                filters,
                token,
            })
        );

        if (error) {
            const errorAlertDialogController = new CommandController(
                ({ dialog }) => (
                    <ErrorAlertDialog
                        dialog={dialog}
                        error={error?.message || "Something went wrong"}
                    />
                ),
                { id: "Transformation error" }
            );

            await errorAlertDialogController.run();
        }

        updateUsage();
        setFilters(filters);
        setLoading(false);
    };

    const handleIndustryTypeChange = (e) => setIndustryType(e.target.value);
    const handleAddShadowChange = (e) => setAddShadow(e.target.checked);
    const handleRefineOutputChange = (e) => setRefine(e.target.checked);

    const handleIndustryTypeResetClick = () =>
        setIndustryType(initialIndustryType);
    const handleAddShadowResetClick = () => setAddShadow(initialAddShadow);
    const handleRefineResetClick = () => setRefine(initialRefine);

    const handleResetAll = () => {
        handleIndustryTypeResetClick();
        handleAddShadowResetClick();
        handleRefineResetClick();
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                position: "relative",
                padding: "1rem",
            }}
        >
            {loading && <LoadingBackdrop />}
            <header
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "2rem",
                }}
            >
                <a href="https://www.erase.bg">
                    <img
                        style={{ height: "28px" }}
                        src="https://cdn.pixelbin.io/v2/dummy-cloudname/original/common_assets/logos/erasebg-logo.png"
                    />
                </a>
                <a
                    href="https://www.pixelbin.io/docs/integrations/photoshop/"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        color: "var(--uxp-host-text-color)",
                        fontSize: "var(--uxp-host-font-size)",
                    }}
                >
                    <span
                        style={{
                            fill: "currentcolor",
                            marginRight: "0.2rem",
                            display: "inline-block",
                        }}
                    >
                        <HelpIcon />
                    </span>
                    How it works?
                </a>
            </header>
            <main
                id="erasebg-form"
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    margin: "-16px -12px",
                    padding: "16px",
                    borderRadius: "4px",
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                }}
            >
                <WC
                    onChange={handleIndustryTypeChange}
                    style={{ marginBottom: "6px" }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "1rem",
                            width: "100%",
                        }}
                    >
                        <sp-label for="industry-type" size="m">
                            Industry type
                        </sp-label>
                        <sp-action-button
                            variant="secondary"
                            quiet
                            onClick={handleIndustryTypeResetClick}
                            style={{ padding: 0 }}
                        >
                            <span>Reset</span>
                        </sp-action-button>
                    </div>
                    <sp-picker
                        id="industry-type"
                        size="m"
                        label="Selection type"
                        style={{ width: "100%" }}
                    >
                        <sp-menu>
                            {options.map((option) => (
                                <sp-menu-item
                                    key={option}
                                    value={option}
                                    selected={
                                        option === industryType
                                            ? true
                                            : undefined
                                    }
                                >
                                    {option}
                                </sp-menu-item>
                            ))}
                        </sp-menu>
                    </sp-picker>
                </WC>
                <WC onChange={handleAddShadowChange}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "1rem",
                            width: "100%",
                        }}
                    >
                        <sp-checkbox
                            style={{ marginBottom: "6px" }}
                            checked={addShadow ? true : undefined}
                        >
                            Add shadow (cars only)
                        </sp-checkbox>
                        <sp-action-button
                            variant="secondary"
                            quiet
                            onClick={handleAddShadowResetClick}
                            style={{ padding: 0 }}
                        >
                            <span>Reset</span>
                        </sp-action-button>
                    </div>
                </WC>
                <WC onChange={handleRefineOutputChange}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "1rem",
                            width: "100%",
                        }}
                    >
                        <sp-checkbox
                            style={{ marginBottom: "6px" }}
                            checked={refine ? true : undefined}
                        >
                            Refine output
                        </sp-checkbox>
                        <sp-action-button
                            variant="secondary"
                            quiet
                            onClick={handleRefineResetClick}
                            style={{ padding: 0 }}
                        >
                            <span>Reset</span>
                        </sp-action-button>
                    </div>
                </WC>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "1rem",
                        width: "100%",
                        marginTop: "auto",
                    }}
                >
                    <sp-action-button
                        variant="secondary"
                        onClick={handleResetAll}
                        quiet
                        style={{ padding: 0 }}
                    >
                        <div slot="icon">
                            <RefreshIcon />
                        </div>
                        <span>Reset all</span>
                    </sp-action-button>
                    <sp-button
                        onClick={handleApply}
                        disabled={loading ? true : undefined}
                    >
                        Apply
                    </sp-button>
                </div>
            </main>

            <footer
                style={{
                    marginTop: "2rem",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <CreditsInformation
                    appOrgDetails={appOrgDetails}
                    usage={usage}
                />
            </footer>
        </div>
    );
};
