import React, { useEffect, useState } from "react";

import { HelpIcon, RefreshIcon } from "./Icons";
import { WC } from "./WC";
import { getUsage, handle, removeBackground } from "../utils";
import { CommandController } from "../controllers/CommandController";
import { ErrorAlertDialog } from "./ErrorAlertDialog";
import Loader from "./Loader";
import { CreditsInformation } from "./CreditsInformation";
import { constants } from "../constants";

const styles = {
    loadingBackdrop: {
        position: "absolute",
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.9)",
        zIndex: 1,
        margin: "-1rem",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "2rem",
    },
    wrapper: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
        padding: "1rem",
    },
    footer: {
        marginTop: "2rem",
        display: "flex",
        flexDirection: "column",
    },
    actions: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "1rem",
        width: "100%",
        marginTop: "auto",
    },
    paramSection: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "1rem",
        width: "100%",
    },
    paramGap: { marginBottom: "6px" },
    form: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        margin: "-16px -12px",
        padding: "16px",
        borderRadius: "4px",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    helpIcon: {
        fill: "currentcolor",
        marginRight: "0.2rem",
        display: "inline-block",
    },
    helpLink: {
        display: "flex",
        alignItems: "center",
        color: "var(--uxp-host-text-color)",
        fontSize: "var(--uxp-host-font-size)",
    },
    productImage: { height: "28px" },
    resetButton: { padding: 0 },
    industryTypePicker: { width: "100%" },
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
        <div style={styles.wrapper}>
            {loading && (
                <div style={styles.loadingBackdrop}>
                    <Loader />
                </div>
            )}
            <header style={styles.header}>
                <a href={constants.urls.pluginHomePage}>
                    <img
                        style={styles.productImage}
                        src={constants.urls.pluginFullImage}
                    />
                </a>
                <a href={constants.urls.pluginDoc} style={styles.helpLink}>
                    <span style={styles.helpIcon}>
                        <HelpIcon />
                    </span>
                    How it works?
                </a>
            </header>
            <main id="erasebg-form" style={styles.form}>
                <WC onChange={handleIndustryTypeChange} style={styles.paramGap}>
                    <div style={styles.paramSection}>
                        <sp-label for="industry-type" size="m">
                            Industry type
                        </sp-label>
                        <sp-action-button
                            variant="secondary"
                            quiet
                            onClick={handleIndustryTypeResetClick}
                            style={styles.resetButton}
                        >
                            <span>Reset</span>
                        </sp-action-button>
                    </div>
                    <sp-picker
                        id="industry-type"
                        size="m"
                        label="Selection type"
                        style={styles.industryTypePicker}
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
                    <div style={styles.paramSection}>
                        <sp-checkbox
                            style={styles.paramGap}
                            checked={addShadow ? true : undefined}
                        >
                            Add shadow (cars only)
                        </sp-checkbox>
                        <sp-action-button
                            variant="secondary"
                            quiet
                            onClick={handleAddShadowResetClick}
                            style={styles.resetButton}
                        >
                            <span>Reset</span>
                        </sp-action-button>
                    </div>
                </WC>
                <WC onChange={handleRefineOutputChange}>
                    <div style={styles.paramSection}>
                        <sp-checkbox
                            style={styles.paramGap}
                            checked={refine ? true : undefined}
                        >
                            Refine output
                        </sp-checkbox>
                        <sp-action-button
                            variant="secondary"
                            quiet
                            onClick={handleRefineResetClick}
                            style={styles.resetButton}
                        >
                            <span>Reset</span>
                        </sp-action-button>
                    </div>
                </WC>
                <div style={styles.actions}>
                    <sp-action-button
                        variant="secondary"
                        onClick={handleResetAll}
                        quiet
                        style={styles.resetButton}
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

            <footer style={styles.footer}>
                <CreditsInformation
                    appOrgDetails={appOrgDetails}
                    usage={usage}
                />
            </footer>
        </div>
    );
};
