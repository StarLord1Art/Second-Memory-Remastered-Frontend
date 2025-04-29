import React, {useState, useEffect, useContext} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Context} from "../Context";
import FilesInDirectoryList from "./FilesInDirectoryList";
import {Breadcrumb, Layout, Menu, theme, Typography} from 'antd';
import {FolderOutlined, PlusOutlined, UploadOutlined} from '@ant-design/icons';
import { Button, Upload } from 'antd';
import FooterAntd from "./UI/FooterAntd";
import HeaderAntd from "./UI/HeaderAntd";

const { Content, Sider } = Layout;
const {Title} = Typography;

function BucketPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [file, setFile] = useState(null);
  const [data, setData] = useState({});
  const [collapsed, setCollapsed] = useState(false);
  const [bucketRootDirectoriesList, setBucketRootDirectoriesList] = useState(
    [
      {
        id: 1,
        name: "Directory 1",
        path: "G/dir1",
      },
      {
        id: 2,
        name: "Directory 2",
        path: "G/dir2",
      },
      {
        id: 3,
        name: "Directory 3",
        path: "G/dir3",
      },
    ]
  );
  const {isUserAuthenticated} = useContext(Context);

  useEffect(() => {
    fetch("http://localhost:5432/api/v1/root/directories", {
      method: "GET",
      headers: {
        contentType: "application/json",
      },
      body: JSON.stringify({ bucketName: `${state.data.bucketName}` }),
    })
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
          setBucketRootDirectoriesList(response.result);
        })
        .catch((error) => console.log(error));
  }, [isUserAuthenticated, state.data.bucketName]);

  function uploadFile(file) {
    console.log(file);
    fetch(`http://localhost:5432/api/v1/files/upload/${state.data.bucketName}`, {
      method: "POST",
      headers: {
        contentType: "application/json",
      },
      body: JSON.stringify({file: file}),
    }).then((response) => response.json()).then((response) => {
      console.log(response);
      if (response.status === 200) {
        console.log(response.result); // Доделать
      } else {
        alert("Что-то пошло не так, попробуйте снова позже")
      }
    }).catch((error) => {console.log(error)})
  }

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout hasSider>
      <Sider style={{
        overflow: 'auto',
        height: '100vh',
        position: 'sticky',
        insetInlineStart: 0,
        top: 0,
        bottom: 0,
        scrollbarWidth: 'thin',
        scrollbarGutter: 'stable',
      }} collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
        <Menu theme="dark" mode="inline" items={bucketRootDirectoriesList.map((directory) => {
          return {
            key: `${directory.id}`,
            icon: <FolderOutlined />,
            label: `${directory.name}`
          }
        })} onClick={() => setData({
          bucketName: state.data.bucketName // Доделать
        })}/>
      </Sider>
      <main>
        <Layout>
          <HeaderAntd bgColor={colorBgContainer} />
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <Breadcrumb style={{ marginBottom: '16px' }}>
              <Breadcrumb.Item>
                <Link to={{ pathname: '/' }}>Главная</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to={{ pathname: '/root/directories' }}>Бакет</Link>
              </Breadcrumb.Item>
            </Breadcrumb>
            <div style={{
              padding: 24,
              minHeight: 800,
              width: '83.5vw',
              textAlign: 'center',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}>
              {/*<div id="upload">*/}
              {/*  <input type="file" onChange={(event) => setFile(() => event.target.files[0])} />*/}
              {/*  <button id="uploadFile" onClick={() => uploadFile(file)}>Загрузить файл</button>*/}
              {/*</div>*/}
              <Upload customRequest={(options) => uploadFile(options.file)}>
                <Button icon={<UploadOutlined />}>Загрузить файл</Button>
              </Upload>
              <Button type={'text'} icon={<PlusOutlined />}>Создать папку</Button>
              {data ? <FilesInDirectoryList data={data} /> : <Title>Папка не выбрана</Title>}
            </div>
          </Content>
          <FooterAntd/>
        </Layout>
      </main>
    </Layout>
  );
}

export default BucketPage;
