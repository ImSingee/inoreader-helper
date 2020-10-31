import React, {useState} from "react";
import {Form, Input, Button, Spin} from "antd";
import {checkCredential, storeCredential} from "../utils/auth";
import {useHistory} from "react-router-dom";
import {notification} from "antd";

const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
};
const InputLayout = {
    wrapperCol: {span: 8},
};
const tailLayout = {
    wrapperCol: {offset: 8, span: 16},
};


export function Login() {
    const [form] = Form.useForm();
    const history = useHistory();
    const [spinning, setSpinning] = useState(false);

    const onSubmit = async function ({username, password}: { username: string, password: string }) {
        setSpinning(true);
        const credential = await checkCredential(username, password);

        if (credential.isValid()) { // 登录成功
            notification.success({message: "登录成功"});
            await storeCredential(credential);

            setSpinning(false);
            history.push("/");
        } else {
            notification.error({message: "登录失败，请重试"});
            setSpinning(false);
        }
    };

    return (
        <Spin spinning={spinning}>
            <Form
                {...layout}
                name="basic"
                onFinish={onSubmit}
                // onFinish={onFinish}
                // onFinishFailed={onFinishFailed}
                form={form}
            >
                <Form.Item {...InputLayout}
                           label="邮箱"
                           name="username"
                           rules={[{required: true, message: "请输入 Inoreader 的登录邮箱"}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item {...InputLayout}
                           label="密码"
                           name="password"
                           rules={[{required: true, message: "请输入 Inoreader 的密码"}]}
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    );
}
