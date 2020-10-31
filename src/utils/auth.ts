import store from "../store";
import axios from "axios";
import qs from "qs";

export class Credential {
    private username: string;
    private password: string;
    private valid?: true | false;
    private authHeaders = Object.create(null);

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }

    public isValid(): boolean { // 凭证有效
        return !!this.valid;
    }

    public isChecked(): boolean { // 进行过合法性检测
        return this.valid !== undefined;
    }

    public getUsername() {
        return this.username;
    }

    public getAuthHeaders() {
        return this.authHeaders;
    }

    async validate(): Promise<void> {
        this.valid = false;
        let result;

        try {
            result = await axios.post("https://www.inoreader.com/accounts/ClientLogin", qs.stringify({
                "Email": this.username,
                "Passwd": this.password,
            }), {
                validateStatus: status => status === 200,
            });
        } catch (error) {
            return;
        }


        const data = String(result.data).split("\n").map(line => {
            const [key, value] = line.split("=", 2);
            return {[key]: value};
        }).reduce((obj, current) => Object.assign(obj, current));

        if (!data.Auth) return;

        this.valid = true;
        this.authHeaders["AppId"] = "999999457";
        this.authHeaders["AppKey"] = "nS4teGYXtOeBX5Hw509oZ098bZAF68jk";
        this.authHeaders["Authorization"] = "GoogleLogin auth=" + data.Auth;

        return;
    }

}

export async function checkCredential(username: string, password: string): Promise<Credential> {
    const c = new Credential(username, password);
    await c.validate();
    return c;
}

export async function storeCredential(c: Credential): Promise<boolean> {
    if (!c.isChecked()) {
        await c.validate();
    }

    if (c.isValid()) {
        await store.set("auth-headers", JSON.stringify(c.getAuthHeaders()));
        await store.set("auth-user", c.getUsername());
        return true;
    } else {
        return false;
    }
}

export async function getAuthUser(): Promise<string | null> {
    return await store.get("auth-user");
}

export async function getAuthHeaders() {
    const headers = await store.get("auth-headers");
    if (!headers) return {};
    return JSON.parse(headers);
}
