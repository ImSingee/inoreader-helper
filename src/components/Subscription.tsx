import {Button, Card, message, Modal, Popconfirm, Select, Spin} from "antd";
import React, {useContext, useState} from "react";
import {deleteSubscriptionFromFolder, refreshAndGetSubscriptionInfo, Subscription} from "../utils/subscription";
import {EditOutlined} from "@ant-design/icons";
import {InfoContext} from "../context/info";

export function SubscriptionCard({sub}: { sub: Subscription }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [modelSpinning, setModelSpinning] = useState(false);
    const [selectedAddToFolderId, setSelectedAddToFolderId] = useState("");
    const {info, setInfo} = useContext(InfoContext);

    const deleteFromFolder = async function (folderId: string) {
        // 确实删除
        await deleteSubscriptionFromFolder(sub.id, folderId);

        // 刷新状态
        await refreshAndGetSubscriptionInfo(setInfo);
    };

    const handleChangeAddItem = (value: string) => {
        setSelectedAddToFolderId(value);
    };

    const handleOnClickAddItem = () => {
        if (!selectedAddToFolderId) {
            message.error("请选择要添加到的文件夹");
        } else {
            setModelSpinning(true);
            console.log(selectedAddToFolderId);
            setModelSpinning(false);
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
                                    setModelSpinning(true);
                                    deleteFromFolder(c.id).then(() => {
                                        setModelSpinning(false);
                                        message.success("删除成功");
                                    });
                                }}>
                                    <Button type="link">移除</Button>
                                </Popconfirm>
                            </li>
                        ))
                    }
                </ul>
                <div>想添加进其他文件夹？</div>
                <Select onChange={handleChangeAddItem} style={{minWidth: "10rem"}}>
                    {
                        Object.values(info!.folders).map(folder => <Select.Option key={folder.id}
                                                                                  value={folder.id}>{folder.title}</Select.Option>)
                    }
                </Select>
                <Button onClick={handleOnClickAddItem} style={{marginLeft: "1rem"}}>添加</Button>
            </Spin>


        </Modal>
    </>);


}
