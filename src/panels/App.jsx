import React, { useState } from "react";

import { Login } from "../components/Login";
import { RemoveBackground } from "../components/RemoveBackground";

const parseJSON = (value) => {
    try {
        return JSON.parse(value);
    } catch (error) {
        return value;
    }
};

const storage = {
    getItem(name) {
        const value = localStorage.getItem(name);
        return value ? parseJSON(value) : undefined;
    },
    setItem(name, value) {
        localStorage.setItem(name, JSON.stringify(value));
    },
};

export const App = () => {
    const [token, setToken] = useState(storage.getItem("token"));
    const [filters, setFilters] = useState(storage.getItem("filters"));
    const [appOrgDetails, setAppOrgDetails] = useState(
        storage.getItem("appOrgDetails")
    );

    const _setToken = (token) => {
        storage.setItem("token", token);
        setToken(token);
    };

    const _setFilters = (filters) => {
        storage.setItem("filters", filters);
        setFilters(filters);
    };

    const _setAppOrgDetails = (appOrgDetails) => {
        storage.setItem("appOrgDetails", appOrgDetails);
        setAppOrgDetails(appOrgDetails);
    };

    const isUserLoggedIn = Boolean(token);

    if (isUserLoggedIn) {
        return (
            <RemoveBackground
                appOrgDetails={appOrgDetails}
                token={token}
                filters={filters}
                setFilters={_setFilters}
            />
        );
    }

    return <Login setToken={_setToken} setAppOrgDetails={_setAppOrgDetails} />;
};
