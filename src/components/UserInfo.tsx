import React, {useEffect, useState} from "react";
import {Descriptions, Spin} from "antd";
import {getUserInfo} from "../utils/user";
import {Await} from "../utils/typing";


export function UserInfo() {
    const [userInfo, setUserInfo] = useState<Await<ReturnType<typeof getUserInfo>>>(null);

    useEffect(() => {
        getUserInfo().then(setUserInfo);
    }, []);

    return (
        <Spin spinning={!userInfo}>
            <Descriptions column={1} style={{marginTop: "3rem"}}>
                <Descriptions.Item label="UserID">{userInfo?.userId}</Descriptions.Item>
                <Descriptions.Item label="UserName">{userInfo?.userName}</Descriptions.Item>
                <Descriptions.Item label="UserEmail">{userInfo?.userEmail}</Descriptions.Item>
                <Descriptions.Item label="UserProfile">{userInfo?.userProfileId}</Descriptions.Item>
            </Descriptions>
        </Spin>
    );
}
