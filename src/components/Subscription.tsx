import {Button, Card, Modal, Popconfirm} from "antd";
import React, {useContext, useState} from "react";
import {Subscription} from "../utils/subscription";
import {EditOutlined} from "@ant-design/icons";
import {InfoContext} from "../context/info";

export function SubscriptionCard({sub}: { sub: Subscription }) {
    const [modalVisible, setModalVisible] = useState(false);
    const {info, setInfo} = useContext(InfoContext);

    const deleteFromFolder = function (folderId: string) {
        // 确实删除

    };

    return (
        <>
            <Card title={sub.title} extra={<Button type="link" icon={<EditOutlined/>} onClick={() => {
                setModalVisible(true);
            }}/>}>
                <div style={{wordBreak: "break-all", minHeight: "6rem"}}>
                    <div>主页：<a target="_blank" rel="noreferrer" href={sub.htmlUrl}>{sub.htmlUrl}</a></div>
                    <div>RSS：<a target="_blank" rel="noreferrer" href={sub.url}>{sub.url}</a></div>
                </div>
            </Card>

            <Modal visible={modalVisible} title={`编辑 (${sub.title})`} footer={null} onCancel={() => {
                setModalVisible(false);
            }}>
                <div>该订阅属于</div>
                <ul>
                    {
                        sub.categories.map(c => (
                            <li>{info!.folders[c.id].title}
                                <Popconfirm title="是否确认从文件夹中删除该订阅？" onConfirm={() => {
                                    deleteFromFolder(c.id);
                                }}>
                                    <Button type="link">移除</Button>
                                </Popconfirm>
                            </li>
                        ))
                    }
                </ul>

            </Modal>
        </>
    );
}
