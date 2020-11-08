import React, {useEffect, useState} from "react";
import {refreshAndGetSubscriptionInfo, UserSubscriptionInfo} from "../utils/subscription";
import {Col, Row, Select, Spin} from "antd";
import {SubscriptionCard} from "../components/Subscription";
import {InfoContext} from "../context/info";

export function SubCompare() {
    const [spinning, setSpinning] = useState(true);
    const [subInfo, setSubInfo] = useState<UserSubscriptionInfo | null>(null);
    const [compareFolders, setCompareFolders] = useState<[string, string]>(["", ""]);
    const [difference, setDifference] = useState<{ firstMore: string[], secondMore: string[] }>({
        firstMore: [],
        secondMore: [],
    });

    useEffect(() => {
        refreshAndGetSubscriptionInfo(setSubInfo).then(() => {
            setSpinning(false);
        });
    }, []);

    const onSelect = (index: 0 | 1, selectedKey: string) => {
        if (index === 0) {
            setCompareFolders([selectedKey, compareFolders[1]]);
        } else {
            setCompareFolders([compareFolders[0], selectedKey]);
        }
    };


    useEffect(() => {
        const firstMore: string[] = [];
        const secondMore: string[] = [];
        const result = {firstMore, secondMore};

        if (!subInfo || !compareFolders[0] || !compareFolders[1] || compareFolders[0] === compareFolders[1]) {
            setDifference(result);
            return;
        }

        const firstHas = new Set(subInfo.folders[compareFolders[0]].subscriptions.map(sub => sub.id));
        const secondHas = new Set(subInfo.folders[compareFolders[1]].subscriptions.map(sub => sub.id));

        firstHas.forEach(a => {
            if (!secondHas.has(a)) firstMore.push(a);
        });

        secondHas.forEach(b => {
            if (!firstHas.has(b)) secondMore.push(b);
        });


        setDifference(result);
    }, [compareFolders, subInfo]);

    return (
        <InfoContext.Provider value={{info: subInfo, setInfo: setSubInfo}}>
            <Spin spinning={spinning}>
                <div>
                    <Select style={{minWidth: "6rem"}} onChange={onSelect.bind(null, 0)}>
                        {
                            subInfo && Object.values(subInfo.folders).map(folder => <Select.Option
                                key={folder.id} value={folder.id}>{folder.title}</Select.Option>)
                        }
                    </Select>
                    <span style={{margin: "auto 1rem"}}>与</span>
                    <Select style={{minWidth: "6rem"}} onChange={onSelect.bind(null, 1)}>
                        {
                            subInfo && Object.values(subInfo.folders).map(folder => <Select.Option
                                key={folder.id} value={folder.id}>{folder.title}</Select.Option>)
                        }
                    </Select>
                    <span style={{margin: "auto 1rem"}}>比较</span>
                </div>
                {
                    !(!subInfo || !compareFolders[0] || !compareFolders[1] || compareFolders[0] === compareFolders[1]) && (<>
                        <h1 style={{marginTop: "3rem"}}>{subInfo.folders[compareFolders[0]].title} 比 {subInfo.folders[compareFolders[1]].title} 多了</h1>
                        <Row>

                            {
                                difference.firstMore.map(subId =>
                                    <Col span={8} key={subId}>
                                        <div style={{margin: "0.3rem"}}>
                                            <SubscriptionCard key={subId} sub={subInfo.subscriptions[subId]}/>
                                        </div>
                                    </Col>)
                            }
                        </Row>

                        <h1 style={{marginTop: "3rem"}}>{subInfo.folders[compareFolders[0]].title} 比 {subInfo.folders[compareFolders[1]].title} 少了</h1>
                        <Row>

                            {
                                difference.secondMore.map(subId =>
                                    <Col span={8} key={subId}>
                                        <div style={{margin: "0.3rem"}}>
                                            <SubscriptionCard key={subId} sub={subInfo.subscriptions[subId]}/>
                                        </div>
                                    </Col>)
                            }
                        </Row>
                    </>)
                }


            </Spin>
        </InfoContext.Provider>

    );
}
