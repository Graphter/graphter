import ManageConfig from "./components/ManageConfig";
import React, { useState } from "react";
import { Layout, Menu } from 'antd'

const { Header, Sider, Content, Footer } = Layout

const { SubMenu } = Menu

export default function App(){
  const [ menuCollapsed, setMenuCollapsed ] = useState(false)
  return (
    <Layout style={{ minHeight: '100vh'}}>
      <Sider collapsible collapsed={menuCollapsed} onCollapse={setMenuCollapsed}>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1">
            Option 1
          </Menu.Item>
          <Menu.Item key="2">
            Option 2
          </Menu.Item>
          <SubMenu key="sub1" title="User">
            <Menu.Item key="3">Tom</Menu.Item>
            <Menu.Item key="4">Bill</Menu.Item>
            <Menu.Item key="5">Alex</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" title="Team">
            <Menu.Item key="6">Team 1</Menu.Item>
            <Menu.Item key="8">Team 2</Menu.Item>
          </SubMenu>
          <Menu.Item key="9">
            Files
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header>header</Header>
        <Content>

          <ManageConfig />

        </Content>
        <Footer>footer</Footer>
      </Layout>
      <Sider>right sidebar</Sider>
    </Layout>
  )
}