import React, {useEffect, useState} from "react";
import {Alert} from "antd";
import {getAuthUser} from "../utils/auth";
import {UserInfo} from "../components/UserInfo";

export function Home() {
    const [user, setUser] = useState<string | null>(null);

    useEffect(() => {
        getAuthUser().then(setUser);
    }, []);


    return (<>
        {
            user ?
                <Alert message={"当前登录用户：" + user} type="info"/> :
                <Alert message="尚未登录 Inoreader 账号，请点击上方菜单按钮登录" type="warning"/>
        }

        {
            user && <UserInfo/>
        }
    </>);
}
