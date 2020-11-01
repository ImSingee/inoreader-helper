import React from "react";
import {Alert, Button, Descriptions, Col, Row, Spin} from "antd";
import dayjs from "dayjs";
import {
    storeUserSubscriptionInfo,
    getNewestSubscriptionInfo,
    UserSubscriptionInfo,
} from "../utils/subscription";

export function SubStatus({spinning, setSpinning, subInfo, setSubInfo}: {
    spinning: boolean,
    setSpinning: (newSpinning: boolean) => void,
    subInfo: UserSubscriptionInfo | null,
    setSubInfo: (newSubInfo: UserSubscriptionInfo | null) => void,
}) {


    const refreshUserSubscriptionInfo = async () => {
        setSpinning(true);

        const info = await getNewestSubscriptionInfo();
        await storeUserSubscriptionInfo(info);

        setSubInfo(info);
        setSpinning(false);
    };

    if (subInfo) {
        return (
            <Spin spinning={spinning}>
                <Alert message={
                    <>
                        <Row align="middle">
                            <Col span={18}>
                                <Descriptions column={1}>
                                    <Descriptions.Item
                                        label="最后更新时间">{dayjs(subInfo.updateAt).format("YYYY-MM-DD HH:mm:ss")}</Descriptions.Item>
                                    <Descriptions.Item label="订阅数量">{Object.values(subInfo.subscriptions).length}</Descriptions.Item>
                                    <Descriptions.Item label="文件夹数量">{Object.values(subInfo.folders).length}</Descriptions.Item>
                                </Descriptions>
                            </Col>
                            <Col span={6}><Button onClick={refreshUserSubscriptionInfo}>刷新</Button></Col>
                        </Row>
                    </>
                }/>
            </Spin>

        );
    } else {
        return (
            <Spin spinning={spinning}>
                <Alert message={
                    <>
                        还没有加载过订阅数据 <Button onClick={refreshUserSubscriptionInfo}>加载</Button>
                    </>
                }/>
            </Spin>
        );
    }


}
