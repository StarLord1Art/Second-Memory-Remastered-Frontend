import React, {useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import FilesInDirectoryList from "./FilesInDirectoryList";
import {Breadcrumb, Input, Layout, List, theme} from 'antd';
import {ArrowLeftOutlined, FileOutlined} from '@ant-design/icons';
import { Button } from 'antd';
import FooterAntd from "./UI/FooterAntd";
import HeaderAntd from "./UI/HeaderAntd";

const { Content, Sider } = Layout;
const { Search } = Input;

function BucketPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [data, setData] = useState({folderId: state.bucket.rootFolderId, bucketId: state.bucket.id});
  const [collapsed, setCollapsed] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResult, setShowSearchResult] = useState(false);

  function searchFile(fileName) {
    console.log(fileName);
    fetch(`http://localhost:8080/api/v1/file-search?name=${fileName}`, {
      method: "POST",
    }).then((response) => {
      if (response.status === 200) {
        response.json().then(data => {
          console.log(data);
          setSearchResults(data);
          setShowSearchResult(true);
        })
      } else {
        alert("Что-то пошло не так, попробуйте снова позже")
      }
    }).catch((error) => console.log(error));
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
      }} collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}></Sider>
      <Layout>
        <HeaderAntd bgColor={colorBgContainer}>
          <Search
              placeholder="Введите название файла"
              allowClear
              enterButton="Поиск"
              size="middle"
              onSearch={(value, _e, info) => searchFile(value)}
              style={{ width: '20%' }}
          />
        </HeaderAntd>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <Breadcrumb style={{ marginBottom: '16px' }}>
            <Breadcrumb.Item>
              <Link to={{ pathname: '/' }}>Главная</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to={{ pathname: `/bucket/${state.bucket.name}` }} state={{bucket: state.bucket}}>Бакет</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
          <div style={{
            padding: 24,
            minHeight: 800,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}>
            {showSearchResult ? (
                <>
                  <div style={{display: 'flex', justifyContent: 'left'}}>
                    <Button type={'text'} icon={<ArrowLeftOutlined />} onClick={() => setShowSearchResult(false)}>Назад</Button>
                  </div>
                  <List
                      style={{width:'50%', margin: '3% 0 0 25%'}}
                      bordered
                      dataSource={searchResults}
                      renderItem={file => (
                          <List.Item key={file.fileId} style={{display: 'flex', justifyContent: 'left', cursor: 'pointer'}} onClick={() => {
                            navigate(`file/${file.fileId}`, {
                              state: {
                                fileId: file.fileId,
                                bucket: state.bucket,
                              },
                            });
                          }}>
                            <FileOutlined /> {file.fileName}
                          </List.Item>
                      )}
                  />
                </>
            ) : (
                <FilesInDirectoryList data={data} setData={setData} />
            )}
          </div>
        </Content>
        <FooterAntd/>
      </Layout>
    </Layout>
  );
}

export default BucketPage;
