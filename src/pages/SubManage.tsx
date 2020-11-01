import React, {useEffect, useState} from "react";
import {SubStatus} from "../components/SubStatus";
import {getUserSubscriptionInfo, UserSubscriptionInfo, Folder} from "../utils/subscription";
import {Card, Col, Row, Spin, Tree} from "antd";

export function SubManage() {
    const [spinning, setSpinning] = useState(false);
    const [subInfo, setSubInfo] = useState<UserSubscriptionInfo | null>(null);
    const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);

    useEffect(() => {
        getUserSubscriptionInfo().then(setSubInfo);
    }, []);

    const onSelect = ([selectedKey]: React.Key[]) => {
        console.log("select", selectedKey);
        setSelectedFolder(subInfo?.folders[selectedKey] || null);
    };

    return (
        <>
            <SubStatus spinning={spinning} setSpinning={setSpinning} subInfo={subInfo} setSubInfo={setSubInfo}/>

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
                                    <Card key={sub.id} title={sub.title}
                                          style={{margin: "0.3rem", wordBreak: "break-all"}}>
                                        <div>主页：<a href={sub.htmlUrl}>{sub.htmlUrl}</a></div>
                                        <div>RSS：<a href={sub.url}>{sub.url}</a></div>
                                    </Card>
                                </Col>)
                            }
                        </Row>
                    </Col>
                </Row>

            </Spin>
        </>

    );
}
