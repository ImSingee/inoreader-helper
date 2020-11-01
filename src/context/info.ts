import React from "react";
import {UserSubscriptionInfo} from "../utils/subscription";

export const InfoContext = React.createContext<{ info: UserSubscriptionInfo | null, setInfo: (newInfo: UserSubscriptionInfo | null) => void }>({
    info: null, setInfo: () => {
    },
});
