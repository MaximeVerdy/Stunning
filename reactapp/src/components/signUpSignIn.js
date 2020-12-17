import React, {useState, } from 'react'
import {Redirect} from 'react-router-dom'
import {Layout, Row, Col, Form, Input, Button, Typography} from 'antd';

import 'antd/dist/antd.css';
import '../css/style.css';

import Logo from '../images/Stunning-logo.png';


function Sign() {

const [signUpEmail, setSignUpEmail] = useState('')
const [signUpPassword, setSignUpPassword] = useState('')

const [signInEmail, setSignInEmail] = useState('')
const [signInPassword, setSignInPassword] = useState('')

const [userExists, setUserExists] = useState(false)

const [listErrorsSignin, setErrorsSignin] = useState([])
const [listErrorsSignup, setErrorsSignup] = useState([])


var handleSubmitSignup = async () => {
    
  const data = await fetch('/sign-up', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: `emailFromFront=${signUpEmail}&passwordFromFront=${signUpPassword}`
  })

  const body = await data.json()

  if(body.result === true){
    setUserExists(true)
  } else {
    setErrorsSignup(body.error)
  }
}

var handleSubmitSignin = async () => {

  const data = await fetch('/sign-in', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: `emailFromFront=${signInEmail}&passwordFromFront=${signInPassword}`
  })

  const body = await data.json()

  if(body.result === true){
    setUserExists(true)
  }  else {
    setErrorsSignin(body.error)
  }
}

if(userExists){
  return <Redirect to='/accueil' />
}

// mise en forme des titres antd
const { Title } = Typography;

// messages de non conformité pour les formulaires antd
const validateMessages = {
  required: 'Saisissez votre ${label}',
  types: {
    email: 'Arobase et extension nécessaires',
  },
  string: {
    // min: '8 caractères avec min, maj, chiffre et caractère spécial',
    min: '8 caractères minimum',
  },
};

// messages d'erreurs rencontrées en back-end lors de l'identification
var tabErrorsSignin = listErrorsSignin.map((error,i) => {
  return( <p className= "erreurs">
            {error}
          </p>
        )
})

// messages d'erreurs rencontrées en back-end lors de l'enregistrement
var tabErrorsSignup = listErrorsSignup.map((error,i) => {
  return( <p className= "erreurs">
            {error}
          </p>
        )
})


  return (

    <Layout className= "loginLayout">


              <Row className="loginRow">
                  <Col className="loginColImg">
                      <img 
                          src={Logo} 
                          alt="Stats et Running fusionnés" 
                          width="100%" 
                      />
                  </Col>
              </Row>

              <Row className="loginRow">
                  <Col className="loginColSlog">
                    <h4>Vous cherchez un site pour enregistrer et analyser vos statistiques de running ? Stunning est là pour ça !</h4>
                  </Col>
              </Row>

              <Row className="loginRow">
                  <Col className="loginColForm">

                        <Form 
                          validateMessages= {validateMessages}
                          name="basic"
                          initialValues={{ remember: true }}
                        >

                          <Title level={3} className="title">
                            Reconnexion
                          </Title>

                          <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true }]}
                          >
                            <Input 
                              size="large"
                              onChange={(e) => setSignInEmail(e.target.value)}
                            />
                          </Form.Item>

                          <Form.Item
                            label="Mot de passe"
                            name="password"
                            rules={[{ required: true },
                                    {min: 8},
                            ]}
                          >
                            <Input.Password 
                              size="large"
                              onChange={(e) => setSignInPassword(e.target.value)}
                            />
                          </Form.Item>
                        
                          <Form.Item>
                            <Button type="primary" htmlType="submit" block className="button"
                              onClick={() => handleSubmitSignin()}
                            >
                              Connexion
                            </Button>

                            {tabErrorsSignin}

                          </Form.Item>
                        </Form>
                        
                  </Col>

                  <Col className="loginColForm">

                        <Form
                          validateMessages={validateMessages}
                          name="basic"
                          initialValues={{ remember: true }}
                        >

                          <Title level={3}className="title">                          
                            Inscription
                          </Title>

                          <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ type: 'email', required: true }]}
                          >
                            <Input 
                              size="large"
                              onChange={(e) => setSignUpEmail(e.target.value)}
                            />
                          </Form.Item>

                          <Form.Item
                            label="Mot de passe"
                            name="password"
                            rules={[{ type: 'string', required: true }, {min: 6},
                            ]}
                          >
                            <Input.Password 
                              size="large"
                              onChange={(e) => setSignUpPassword(e.target.value)}
                            />
                          </Form.Item>
                        
                          <Form.Item>
                            <Button type="primary" htmlType="submit" block className="button"
                              onClick={() => handleSubmitSignup()}
                            >
                              Connexion
                            </Button>

                            {tabErrorsSignup}

                          </Form.Item>
                        </Form>

                  </Col>

              </Row>

    </Layout>

  );
}

export default Sign;