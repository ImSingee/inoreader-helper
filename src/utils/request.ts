import {getAuthHeaders} from "./auth";
import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import {message} from "antd";
import qs from "qs";

export async function request(endpoint: string, method: "GET" | "POST", params: object): Promise<AxiosResponse | null> {
    const authHeaders = await getAuthHeaders();
    const url = "https://www.inoreader.com/reader/api/0" + endpoint;

    const config: AxiosRequestConfig = {
        headers: Object.assign({
            "content-type": "application/x-www-form-urlencoded",
        }, authHeaders),
    };

    let req;

    if (method === "GET") {
        req = axios.get(url, Object.assign({params}, config));
    } else {
        req = axios.post(url, qs.stringify(params), config);
    }

    req.catch(error => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);

            message.error("HTTP " + error.response.status);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
            console.log(error);

            message.error("No Response (maybe timeout)");
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
            console.log(error);
            message.error("Request Error: " + error.message);
        }

        console.log(error.config);
        return null;
    });

    return await req;
}

export async function get(endpoint: string, params: object) {
    return request(endpoint, "GET", params);
}

export async function post(endpoint: string, data: object) {
    return request(endpoint, "POST", data);
}
