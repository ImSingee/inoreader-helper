async function get(key: string): Promise<string | null> {
    return localStorage.getItem(key);
}

async function set(key: string, value: string) {
    localStorage.setItem(key, value);
}

async function remove(key: string) {
    localStorage.removeItem(key);
}

const apis = {set, get, remove};

export default apis;
