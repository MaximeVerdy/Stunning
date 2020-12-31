import React, {useState, useEffect } from 'react'
import {Redirect, useHistory} from 'react-router-dom'
import {connect} from 'react-redux'
import {Layout, 
        Row, 
        Col, 
        Form, 
        Button, 
        Typography, 
        Select, 
        DatePicker,
        InputNumber,
        Modal,
       } from 'antd';
    import moment from 'moment';
    import 'moment/locale/fr';

//composants
import Topnavbar from './navbar.js'
import Footer from './footer.js'

// style
import 'antd/dist/antd.css';
import '../css/other.css';


function Activity(props) {

    // const history = useHistory()

    // date du jour mise au format antd pour le date picker
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); // janvier est 0
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm  + '-' + dd;


// Etats

    const [token, setToken] = useState(props.token)
    
    const [date, setDate] = useState(today)
    function onChangeDate(value) {
        setDate(value);
    }

    const [distance, setDistance] = useState(0)
    function onChangeDistance(value) {
        setDistance(value);
    }

    const [chronoH, setChronoH] = useState(0)
    function onChangeChronoH(value) {
        setChronoH(value);
    }
    const [chronoM, setChronoM] = useState(0)
    function onChangeChronoM(value) {
        setChronoM(value);
    }
    const [chronoS, setChronoS] = useState(0)
    function onChangeChronoS(value) {
        setChronoS(value);
    }

    const [type, setType] = useState('varié')
    function onChangeType(value) {
        setType(value);
    }

    const [saved, setSaved] = useState(false)

    const [listErrorsSaving, setErrorsSaving] = useState([])

    const [form] = Form.useForm();

// condition de rediction en cas d'absence de token 
    // if(token == ''){
    //     return <Redirect to='/' />
    //     }   

    
// échange de données avec le back pour l'inscription
var handleSubmitSaving = async () => {
    
    const data = await fetch('/save-activity', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `tokenFromFront=${token}&distanceFromFront=${distance}&chronoHFromFront=${chronoH}&chronoMFromFront=${chronoM}&chronoSFromFront=${chronoS}&dateFromFront=${date}&typeFromFront=${type}`
    })
  
    const body = await data.json()
  
    if(body.result === true){
      setSaved(true)
    } else {
      setErrorsSaving(body.error)
    }

}

    useEffect(() => {
        if (saved == true) {
            Modal.success({
                content: 'Activité correctement enregistrée',
            });
            setSaved(false)
            setDate(today)
            setDistance(0)
            setChronoH(0)
            setChronoM(0)
            setChronoS(0)
            setType('varié')

            }
    },[saved])
        
    // mise en forme des titres antd
    const { Title } = Typography;

    // messages de non conformité pour les formulaires antd
    const validateMessages = {
        required: 'Saisissez votre ${label}',
    };

    // const config = {
    //     rules: [{ type: 'number', required: true, message: 'TEST' }],
    //   };

    // messages d'erreurs rencontrées en back-end lors de l'enregistrement
    var tabErrorsSaving = listErrorsSaving.map((error,i) => {
    return( <p className= "erreurs">
              {error}
            </p>
          )
  })


  const onSubmit = (values) => {
    form.resetFields();
  }
  
  
    return (
  
        <Layout className= "activityLayout">

            <Topnavbar/>

                   NOUVELLE ACTIVITE
                    <p>{token}</p>
                    
                <Row className="activityRow">
                  <Col className="ColForm" >

                        <Form 
                        form={form}
                          validateMessages= {validateMessages}
                          name="basic"
                        //   initialValues={{ remember: true }}
                          onFinish={onSubmit}
                          span= {5}
                        >

                          <Title level={3} className="title">
                            Entrez vos données de course
                          </Title>

                            <Form.Item 
                            label="Date"
                            name="date"
                            // rules={[{ required: true }]}
                            >
                                <DatePicker 
                                    defaultValue={moment(today, 'YYYY-MM-DD')}
                                    onChange={onChangeDate}
                                />
                            </Form.Item>

                            
                            <Form.Item 
                            label="Distance"
                            name="distance"
                            // rules={[{ type: 'number', required: true }]}
                            // {...config}
                            >
                                <InputNumber 
                                    min={0} 
                                    onChange={onChangeDistance}
                                />
                                <span> km </span>
                            </Form.Item>

                            <Form.Item label="Chrono"
                                name="duree"
                            // rules={[{ type: 'number', required: true }]}
                            >
                                <InputNumber 
                                    style={{ width: 60 }} min={0} pattern={"^[0-9]+$"}
                                    onChange={onChangeChronoH}
                                /> 
                                <span> h, </span>
                                <InputNumber 
                                    style={{ width: 60 }} min={0} max={60} pattern={"^[0-9]+$"}
                                    onChange={onChangeChronoM}
                                />
                                <span> m, </span>
                                <InputNumber 
                                    style={{ width: 60 }} min={0} max={60} pattern={"^[0-9]+$"}
                                    onChange={onChangeChronoS}
                                />
                                <span> s</span>
                            </Form.Item>

                            <Form.Item 
                            label="Type de course"
                            name="choix multiple"
                            >
                                <Select 
                                    defaultValue ={"varié"}
                                    placeholder="varié par défaut"
                                    onChange={onChangeType}
                                >
                                    <Select.Option value="varié" >Entraînement varié</Select.Option>
                                    <Select.Option value="fractionné">Entraînement fractionné</Select.Option>
                                    <Select.Option value="endurance">Entraînement d'endurance</Select.Option>
                                    <Select.Option value="compétition">Compétition</Select.Option>
                                </Select>
                            </Form.Item>
                        
                          <Form.Item>
                            <Button type="primary" htmlType="submit" block className="button"
                              onClick={() => handleSubmitSaving()}
                            //   onClick={onCheck}
                            >
                              Enregistrer
                            </Button>

                            {tabErrorsSaving}

                          </Form.Item>
                        </Form>


                        
                  </Col>
                
                </Row>
                

            <Footer/>

        </Layout>
  
    );
  }
  
function mapStateToProps(state){
return {token: state.token}
}

export default connect(
mapStateToProps,
null
)(Activity)