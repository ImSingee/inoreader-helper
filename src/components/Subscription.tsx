import {Button, Card, message, Modal, Popconfirm, Select, Spin} from "antd";
import React, {useContext, useState} from "react";
import {
    addSubscriptionToFolder,
    deleteSubscriptionFromFolder,
    refreshAndGetSubscriptionInfo,
    Subscription,
} from "../utils/subscription";
import {EditOutlined} from "@ant-design/icons";
import {InfoContext} from "../context/info";

export function SubscriptionCard({sub}: { sub: Subscription }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [modelSpinning, setModelSpinning] = useState(false);
    const [selectedAddToFolderId, setSelectedAddToFolderId] = useState("");
    const {info, setInfo} = useContext(InfoContext);

    const handleOnClickDeleteFromFolder = (folderId: string) => {
        setModelSpinning(true);
        // 调用 API 删除
        deleteSubscriptionFromFolder(sub.id, folderId)
            // 刷新最新状态
            .then(() => refreshAndGetSubscriptionInfo(setInfo))
            .then(() => {
                setModelSpinning(false);
                message.success("删除成功");
            });
    };

    const handleChangeAddFolder = (value: string) => {
        setSelectedAddToFolderId(value);
    };

    const handleOnClickAddToFolder = async () => {
        if (!selectedAddToFolderId) {
            message.error("请选择要添加到的文件夹");
        } else {
            setModelSpinning(true);
            addSubscriptionToFolder(sub.id, selectedAddToFolderId)
                .then(() => refreshAndGetSubscriptionInfo(setInfo))
                .then(() => {
                    setModelSpinning(false);
                    message.success("添加成功");
                });
        }
    };

    return (<>
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
            <Spin spinning={modelSpinning}>
                <div>该订阅属于</div>
                <ul>
                    {
                        sub.categories.map(c => (
                            <li key={c.id}>{info!.folders[c.id].title}
                                <Popconfirm title="是否确认从文件夹中删除该订阅？" onConfirm={() => {
                                    handleOnClickDeleteFromFolder(c.id);
                                }}>
                                    <Button type="link">移除</Button>
                                </Popconfirm>
                            </li>
                        ))
                    }
                </ul>
                <div>想添加进其他文件夹？</div>
                <Select onChange={handleChangeAddFolder} style={{minWidth: "10rem"}}>
                    {
                        Object.values(info!.folders).map(folder => <Select.Option key={folder.id}
                                                                                  value={folder.id}>{folder.title}</Select.Option>)
                    }
                </Select>
                <Button onClick={handleOnClickAddToFolder} style={{marginLeft: "1rem"}}>添加</Button>
            </Spin>


        </Modal>
    </>);


}
