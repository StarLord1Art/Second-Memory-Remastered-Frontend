import React, {useState, useEffect, useContext} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Context} from "../Context";
import {Breadcrumb, Button, Input, Layout, List, theme, Typography, Modal} from 'antd';
import {ContainerOutlined, DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import HeaderAntd from "./UI/HeaderAntd";
import FooterAntd from "./UI/FooterAntd";

const { Content } = Layout;
const {Title} = Typography;

function Main() {
  const [bucketsList, setBucketsList] = useState([
      "Bucket 1",
      "Bucket 2",
      "Bucket 3",
      "Bucket 4",
      "Bucket 5",
  ]);
  const [bucketName, setBucketName] = useState("");
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const navigate = useNavigate();
  const {isUserAuthenticated} = useContext(Context);

  useEffect(() => {
    fetch("http://localhost:5432/api/v1/buckets")
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setBucketsList(response.result);
      })
        .catch((error) => console.log(error));
  }, [isUserAuthenticated, bucketsList]);

  function createBucket() {
      console.log(bucketName);
      setConfirmLoading(true);
      fetch(`http://localhost:5432/api/v1/buckets/${bucketName}`, {
          method: "POST",
      })
        .then((response) => response.json())
        .then((response) => {
            console.log(response)
            setBucketsList((bucketsList) => [...bucketsList, response.result]);
            setOpen(false);
            setConfirmLoading(false);
        }).catch((error) => {console.log(error)})
  }

  function deleteBucket(bucketName) {
      fetch(`http://localhost:5432/api/v1/buckets/${bucketName}`, {
          method: "DELETE",
      }).then((response) => response.json()).then((response) => {
          console.log(response);
          if (response.status === 200) {
              setBucketsList((bucketsList) => bucketsList.filter((bucket) => bucket !== bucketName));
          } else {
              alert("Что-то пошло не так, попробуйте снова позже")
          }
      }).catch((error) => {console.log(error)})
  }


  const handleCancel = () => {
      setOpen(false);
      setBucketName('');
  }

  const {
      token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
        <HeaderAntd bgColor={"#001529"} />
      <main>
        <Content style={{ padding: '0 48px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>
                    <Link to={{ pathname: '/' }}>Главная</Link>
                </Breadcrumb.Item>
            </Breadcrumb>
            <div
                style={{
                    padding: 24,
                    minHeight: 800,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                <Modal
                    title="Создать бакет"
                    open={open}
                    onOk={createBucket}
                    confirmLoading={confirmLoading}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Отменить
                        </Button>,
                        <Button key="submit" type="primary" loading={confirmLoading} onClick={createBucket}>
                            Создать
                        </Button>
                    ]}
                >
                    <Input type="text" value={bucketName} onChange={(event) => setBucketName(() => event.target.value)} placeholder="Введите название бакета"/>
                </Modal>
                <div style={{marginTop: "5%"}}>
                    <div style={{display: "flex", justifyContent: "space-evenly"}}>
                        <Title>Все бакеты</Title>
                        <Button type={'text'} style={{alignSelf: "center"}} icon={<PlusOutlined />} onClick={() => setOpen(true)}>Создать бакет</Button>
                    </div>
                    <List
                        style={{width:'50%', marginLeft: '25%'}}
                        bordered
                        dataSource={bucketsList}
                        renderItem={bucket => (
                            <List.Item key={bucket} style={{display: 'flex', justifyContent: 'left', cursor: 'pointer'}} onClick={() => {
                                navigate("root/directories", {
                                    state: {
                                        data: {
                                            bucketName: bucket,
                                        },
                                    },
                                });
                            }}>
                                <ContainerOutlined /> {bucket}
                                <Button type={'text'} style={{marginLeft: "80%"}} icon={<DeleteOutlined />} onClick={() => deleteBucket(bucket)}/>
                            </List.Item>
                        )}
                    />
                </div>
            </div>
        </Content>
      </main>
        <FooterAntd />
    </Layout>
  );
}

export default Main;
