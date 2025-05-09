import React, {useState, useEffect, useContext} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Context} from "../Context";
import {Breadcrumb, Button, Input, Layout, List, theme, Typography} from 'antd';
import {ContainerOutlined, DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import HeaderAntd from "./UI/HeaderAntd";
import FooterAntd from "./UI/FooterAntd";
import ModalAntd from "./UI/ModalAntd";

const { Content } = Layout;
const {Title} = Typography;

function Main() {
  const [bucketsList, setBucketsList] = useState([]);
  const [bucketName, setBucketName] = useState("");
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const navigate = useNavigate();
  const {isUserAuthenticated} = useContext(Context);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/buckets", {
        credentials: "include",
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setBucketsList(response);
      })
        .catch((error) => console.log(error));
  }, [isUserAuthenticated]);

  function createBucket() {
      console.log(bucketName);
      setConfirmLoading(true);
      fetch(`http://localhost:8080/api/v1/buckets/create/${bucketName}`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          }
      })
        .then((response) => response.json())
        .then((response) => {
            console.log(response)
            setBucketsList((bucketsList) => [...bucketsList, response]);
            setOpen(false);
            setConfirmLoading(false);
            setBucketName("");
        }).catch((error) => {console.log(error)})
  }

  function deleteBucket(bucketId) {
      console.log(bucketId);
      fetch(`http://localhost:8080/api/v1/buckets/delete/${bucketId}?prefix=%2F`, {
          method: "DELETE",
          credentials: "include",
      }).then((response) => {
          if (response.status === 200) {
              response.json().then((data) => {
                  console.log(data);
                  setBucketsList((bucketsList) => bucketsList.filter((bucket) => bucket !== bucketName));
              })
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
        <HeaderAntd bgColor={"#001529"}>
            <div className="demo-logo" />
        </HeaderAntd>
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
                <ModalAntd title={"Создать бакет"}
                           open={open}
                           onOK={createBucket}
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
                </ModalAntd>
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
                            <List.Item key={bucket.id} style={{display: 'flex', justifyContent: 'left', cursor: 'pointer'}} onClick={() => {
                                navigate(`bucket/${bucket.name}`, {
                                    state: {
                                        bucket: bucket,
                                    },
                                });
                            }}>
                                <ContainerOutlined /> {bucket.name}
                                <Button type={'text'} style={{marginLeft: "80%"}} icon={<DeleteOutlined />} onClick={() => deleteBucket(bucket.id)}/>
                            </List.Item>
                        )}
                    />
                </div>
            </div>
        </Content>
        <FooterAntd />
    </Layout>
  );
}

export default Main;
