import React, {useState, } from 'react'
import {Layout, Row, Col, Form, Input, Button, Typography, Space, Card, } from 'antd';

import 'antd/dist/antd.css';
import '../css/style.css';

import Background from '../images/runner_background3.jpg';
import Logo from '../images/Stunning-logo.png';


function Sign() {

const { Title } = Typography;

// mise en forme des formulaires  
  const layout = {
    labelCol: {
      align:"middle"
    },
    wrapperCol: {
      align:"middle"
    },
  };
  const tailLayout = {
    wrapperCol: {
      align:"middle"
    },
  };
  
    const onFinish = (values) => {
      console.log('Success:', values);
    };
  
    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };
  

  return (

    <Layout
      style={{  
        backgroundImage: `url(${Background})`,
        backgroundPosition: 'right',
        backgroundSize: 'cover',
        backgroundRepeat: 'repeat-y',
        height: '100vh',
      }}
    >

          <div
              style={{  
                
              }}
          >

              <Row
                justify="center"
                align="middle"
                style = {{
                  marginTop: '3%'
                }}
              >
                  <Col
                      flex="700px"
                      style = {{
                        display:'flex',
                        justifyContent:'center',
                        alignItems: 'center',
                      }}
                  >
                    <img src={Logo} alt="Fusion de Stats et de Running" 
                      width="100%" 
                    />
                </Col>
              </Row>

              <Row
                justify="center"
                align="middle"
              >
                  <Col
                      flex="700px"
                      style = {{
                        display:'flex',
                        justifyContent:'center',
                        alignItems: 'center',
                        marginBottom: '20px',
                        textAlign: 'center',
                      }}
                  >
                    <h4
                    >Vous cherchez un site pour compiler vos statiques de running ? Il y a Stunning
                    </h4>
                  </Col>
                  
              </Row>

              <Row
                justify="center"
                align="middle"
              >
                  <Col
                      flex="350px"
                      style = {{
                        display:'flex',
                        justifyContent:'center',
                        alignItems: 'center',
                        height: '350px',
                        backgroundColor: 'rgba(255, 255, 255, .9)',
                      }}
                  >

                        <Form
                          {...layout}
                          name="basic"
                          initialValues={{ remember: true }}
                        >

                          <Title level={3}
                            style = {{
                              display:'flex',
                              justifyContent:'center',
                              marginTop:'20px',
                              marginBottom:'35px',
                            }}
                          >
                            Reconnexion
                          </Title>

                          <Form.Item
                            label="Email"
                            name="username"
                            rules={[{ required: true, message: 'Saisissez votre Email' }]}
                          >
                            <Input size="large"/>
                          </Form.Item>

                          <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Saisissez votre mot de passe' }]}
                          >
                            <Input.Password size="large"/>
                          </Form.Item>
                        
                          <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit" block
                                style = {{
                                  display:'flex',
                                  justifyContent:'center',
                                  alignItems:'center',
                                  height:'40px',
                                  marginTop:'20px',
                                }}
                            >
                              Connexion
                            </Button>
                          </Form.Item>
                        </Form>

                  </Col>

                  <Col
                      flex="350px"
                      style = {{
                        display:'flex',
                        justifyContent:'center',
                        alignItems: 'center',
                        height: '350px',
                        backgroundColor: 'rgba(255, 255, 255, .9)',
                        margin: "1px"
                      }}
                  >

                        <Form
                          {...layout}
                          name="basic"
                          initialValues={{ remember: true }}
                        >

                          <Title level={3}
                            style = {{
                              display:'flex',
                              justifyContent:'center',
                              marginTop:'20px',
                              marginBottom:'35px',
                            }}
                          >
                            Inscription
                          </Title>

                          <Form.Item
                            label="Email"
                            name="username"
                            rules={[{ required: true, message: 'Saisissez votre Email' }]}
                          >
                            <Input size="large"/>
                          </Form.Item>

                          <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Saisissez votre mot de passe' }]}
                          >
                            <Input.Password size="large"/>
                          </Form.Item>
                        
                          <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit" block
                                style = {{
                                  display:'flex',
                                  justifyContent:'center',
                                  alignItems:'center',
                                  height:'40px',
                                  marginTop:'20px',
                                }}
                            >
                              Connexion
                            </Button>
                          </Form.Item>
                        </Form>

                  </Col>

              </Row>

              </div>
    </Layout>

  );
}

export default Sign;