import {get, post} from "./request";

export interface Subscription {
    id: string,
    title: string,
    categories: {
        id: string,
        label: string,
    }[],
    url: string,
    htmlUrl: string
}

export interface Folder {
    id: string,
    title: string,
    type: "folder",
    subscriptions: Subscription[],
}

export interface UserSubscriptionInfo {
    subscriptions: { [id: string]: Subscription }
    folders: { [id: string]: Folder }
    noFolderSubscriptions: { [id: string]: Subscription }
    updateAt: string,
    version: 1
}

// export async function getUserSubscriptionInfo(): Promise<UserSubscriptionInfo | null> {
//     const info = await store.get("subscription-info");
//     if (!info) return null;
//     return JSON.parse(info);
// }
//
// export async function storeUserSubscriptionInfo(info: UserSubscriptionInfo) {
//     await store.set("subscription-info", JSON.stringify(info));
// }

async function getNewestSubscriptionInfo(): Promise<UserSubscriptionInfo> {
    const result: UserSubscriptionInfo = {
        subscriptions: {},
        folders: {},
        noFolderSubscriptions: {},
        updateAt: (new Date()).toISOString(),
        version: 1,
    };

    const subscriptionsR = await get("/subscription/list", {});

    subscriptionsR?.data.subscriptions.forEach((sub: any) => {
        result.subscriptions[sub.id] = sub;
    });

    Object.values(result.subscriptions).forEach(sub => {
        if (!sub.categories || sub.categories.length === 0) {
            result.noFolderSubscriptions[sub.id] = sub;
        }
    });

    const foldersR = await get("/tag/list", {"types": 1});

    foldersR?.data?.tags.filter((t: any) => t.type === "folder").forEach((folder: { id: string, type: "folder" }) => {
        const paths = folder.id.split("/");

        const title = paths[paths.length - 1];

        const subscriptions = Object.values(result.subscriptions).filter(sub => {
            for (const c of sub.categories) {
                if (c.id === folder.id) return true;
            }
            return false;
        });

        result.folders[folder.id] = Object.assign(folder, {
            title,
            paths,
            subscriptions,
        });
    });

    return result;
}

async function editSubscription(action: "edit" | "subscribe" | "unsubscribe", subscriptionId: string,
                                {newTitle, addToFolder, removeFromFolder}: {
                                    newTitle?: string,
                                    addToFolder?: string,
                                    removeFromFolder?: string
                                }) {
    const response = await post("/subscription/edit", {
        "ac": action,
        "s": subscriptionId,
        "t": newTitle,
        "a": addToFolder,
        "r": removeFromFolder,
    });

    return !!response;
}

export async function deleteSubscriptionFromFolder(subscriptionId: string, folderId: string) {
    return await editSubscription("edit", subscriptionId, {removeFromFolder: folderId});
}

export async function addSubscriptionToFolder(subscriptionId: string, folderId: string) {
    return await editSubscription("edit", subscriptionId, {addToFolder: folderId});
}

export async function refreshAndGetSubscriptionInfo(setInfo: (newInfo: UserSubscriptionInfo) => void) {
    const info = await getNewestSubscriptionInfo();

    setInfo(info);
}
