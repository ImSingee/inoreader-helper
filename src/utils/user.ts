import {get} from "./request";

export async function getUserInfo() {
    const response = await get("/user-info", {});
    if (!response) return null;

    return response.data as {
        userId: string,
        userName: string,
        userProfileId: string,
        userEmail: string,
    };
}
