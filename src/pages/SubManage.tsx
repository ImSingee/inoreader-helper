import React, {useEffect, useState} from "react";
import {SubStatus} from "../components/SubStatus";
import {refreshAndGetSubscriptionInfo, UserSubscriptionInfo, Folder} from "../utils/subscription";
import {Col, Row, Spin, Tree} from "antd";
import {SubscriptionCard} from "../components/Subscription";
import {InfoContext} from "../context/info";

export function SubManage() {
    const [spinning, setSpinning] = useState(true);
    const [subInfo, setSubInfo] = useState<UserSubscriptionInfo | null>(null);
    const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);

    useEffect(() => {
        refreshAndGetSubscriptionInfo(setSubInfo).then(() => {
            setSpinning(false);
        });
    }, []);

    const onSelect = ([selectedKey]: React.Key[]) => {
        console.log("select", selectedKey);
        setSelectedFolder(subInfo?.folders[selectedKey] || null);
    };

    return (
        <InfoContext.Provider value={{info: subInfo, setInfo: setSubInfo}}>
            <SubStatus spinning={spinning} setSpinning={setSpinning}/>

            <Spin spinning={spinning}>
                <Row style={{marginTop: "3rem"}}>
                    <Col span={4}>
                        <Tree treeData={
                            subInfo ? Object.values(subInfo.folders).map(folder => ({
                                title: `${folder.title} (${folder.subscriptions.length})`,
                                key: folder.id,
                            })) : []}
                              defaultSelectedKeys={subInfo ? [Object.values(subInfo.folders)[0].id] : []}
                              onSelect={onSelect}>
                        </Tree>
                    </Col>
                    <Col span={20}>
                        <Row>
                            {
                                selectedFolder?.subscriptions.map(sub => <Col span={8}>
                                    <div style={{margin: "0.3rem"}}><SubscriptionCard key={sub.id} sub={sub}/></div>
                                </Col>)
                            }
                        </Row>
                    </Col>
                </Row>

            </Spin>
        </InfoContext.Provider>

    );
}
