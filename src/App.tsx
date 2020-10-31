import React from "react";
import {
    HashRouter as Router,
    Switch,
    Route,
    Link,
    useLocation,
} from "react-router-dom";
import "./App.css";
import {Menu} from "antd";
import {Home} from "./pages/Home";
import {Login} from "./pages/Login";

const pages = [
    {
        path: "/",
        name: "首页",
        component: <Home/>,
    },
    {
        path: "/login",
        name: "登录",
        component: <Login/>,
    },
    {
        path: "/subscribe/add",
        name: "添加订阅",
        component: <div>add subscribe</div>,
    },
];

function PageMenu() {
    const location = useLocation();

    return (
        <Menu mode="horizontal" selectedKeys={[location.pathname]}>
            {
                pages.map(page => <Menu.Item key={page.path}><Link to={page.path}>{page.name}</Link></Menu.Item>)
            }
        </Menu>
    );
}

function App() {
    return (
        <Router>
            <PageMenu/>
            <Switch>
                {
                    pages.map(page => (
                        <Route exact path={page.path} key={page.path}>
                            <div className="Container">{page.component}</div>
                        </Route>
                    ))
                }

            </Switch>
        </Router>
    );
}

export default App;
