import React, {useEffect, useState} from "react";
import {SubStatus} from "../components/SubStatus";
import {refreshAndGetSubscriptionInfo, UserSubscriptionInfo} from "../utils/subscription";
import {Col, Row, Spin, Tree} from "antd";
import {SubscriptionCard} from "../components/Subscription";
import {InfoContext} from "../context/info";

export function SubManage() {
    const [spinning, setSpinning] = useState(true);
    const [subInfo, setSubInfo] = useState<UserSubscriptionInfo | null>(null);
    const [selectedFolderID, setSelectedFolderID] = useState<string | null>(null);

    useEffect(() => {
        refreshAndGetSubscriptionInfo(setSubInfo).then(() => {
            setSpinning(false);
        });
    }, []);

    const onSelect = ([selectedKey]: React.Key[]) => {
        setSelectedFolderID(selectedKey as string || null);
    };

    return (
        <InfoContext.Provider value={{info: subInfo, setInfo: setSubInfo}}>
            <SubStatus spinning={spinning} setSpinning={setSpinning}/>

            {subInfo && <Spin spinning={spinning}>
                <Row style={{marginTop: "3rem"}}>
                    <Col span={4}>
                        <Tree treeData={
                            [{
                                title: `ROOT ${Object.values(subInfo.noFolderSubscriptions).length}`, key: "/",
                            }].concat(Object.values(subInfo.folders).map(folder => ({
                                title: `${folder.title} (${folder.subscriptions.length})`,
                                key: folder.id,
                            })))}
                              defaultSelectedKeys={subInfo ? [Object.values(subInfo.folders)[0].id] : []}
                              onSelect={onSelect}>
                        </Tree>
                    </Col>
                    <Col span={20}>
                        <Row>
                            {
                                (selectedFolderID ? selectedFolderID === "/" ? Object.values(subInfo.noFolderSubscriptions) :
                                    subInfo.folders[selectedFolderID].subscriptions : Object.values(subInfo.subscriptions)).map(sub =>
                                    <Col span={8} key={sub.id}>
                                        <div style={{margin: "0.3rem"}}><SubscriptionCard key={sub.id} sub={sub}/></div>
                                    </Col>)
                            }
                        </Row>
                    </Col>
                </Row>

            </Spin>}
        </InfoContext.Provider>

    );
}
