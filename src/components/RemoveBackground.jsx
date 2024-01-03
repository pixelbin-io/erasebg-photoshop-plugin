import React, { useState } from "react";
import { RefreshIcon } from "./Icons";
import { WC } from "./WC";
import { removeBackground } from "../utils";

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
    const [applyButtonDisabled, setApplyButtonDisabled] = useState(false);

    // useEffect(() => {
    //     axios.get(
    //         "https://api.pixelbin.io/service/platform/assets/v1.0/playground/plugins",
    //         {
    //             headers: {
    //                 "X-Ebg-Param": "MjAyMzEyMjNUMTA1ODU4Wg==",
    //                 "X-Ebg-Signature":
    //                     "v1:38efdf0ed5142d4bdf5e56d4a32565efe1cea5cd309d0963b4ff31dfd05091a5",
    //                 Authorization:
    //                     "Bearer YTExYTE0ZTUtMjY3MS00MmQzLWJjNDItYmQwZWZhY2NiZDUy",
    //             }
    //         }
    //     ).then((res) => {
    //         console.log(res);
    //     });
    // }, []);

    const handleApply = async (e) => {
        e.preventDefault();

        setApplyButtonDisabled(true);

        const filters = {
            industryType,
            addShadow,
            refine,
        };

        await removeBackground({ appOrgDetails, filters, token });

        setFilters(filters);
        setApplyButtonDisabled(false);
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
            <main>
                <WC onChange={handleIndustryTypeChange}>
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
                        <sp-checkbox checked={addShadow ? true : undefined}>
                            Add Shadow (Cars Only)
                        </sp-checkbox>
                        <sp-action-button
                            variant="secondary"
                            quiet
                            onClick={handleAddShadowResetClick}
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
                        <sp-checkbox checked={refine ? true : undefined}>
                            Refine Output
                        </sp-checkbox>
                        <sp-action-button
                            variant="secondary"
                            quiet
                            onClick={handleRefineResetClick}
                        >
                            <span>Reset</span>
                        </sp-action-button>
                    </div>
                </WC>
            </main>
            <footer
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
                >
                    <div slot="icon">
                        <RefreshIcon />
                    </div>
                    <span>Reset all</span>
                </sp-action-button>
                <sp-button
                    onClick={handleApply}
                    disabled={applyButtonDisabled ? true : undefined}
                >
                    Apply
                </sp-button>
            </footer>
        </div>
    );
};
