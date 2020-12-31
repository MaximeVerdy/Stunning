import React, {useState, useEffect } from 'react'
import {Redirect, useHistory} from 'react-router-dom'
import {connect} from 'react-redux'
import {Layout, Row, Typography, Tag, } from 'antd';

//composants
import Topnavbar from './navbar.js'
import Footer from './footer.js'

// style
import 'antd/dist/antd.css';
import '../css/other.css';

// images
// import imageBG from '../images/runner_background.jpg';

// icônes
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

function History(props) {

// Etats

    const [token, setToken] = useState(props.token)
    // const [activityID, setToken] = useState(props.activityID)

    const [activitiesList, setActivitiesList] = useState([])

    const [deleted, setDeleted] = useState(0)

    const [listErrorsSaving, setErrorsSaving] = useState([])

    // const [bgColourTrash, setBgColourTrash] = useState("grey")

// condition de rediction en cas d'absence de token 
    // if(token == ''){
    //     return <Redirect to='/' />
    //     }   

    
// échange de données avec le back pour l'inscription

        useEffect(() => {
            const findActivities = async () => {
            const data = await fetch(`/2020?token=${token}`)
            const body = await data.json()

            setActivitiesList(body.sortedActivities)
            // props.saveActivities(body.activities)
            }

            findActivities()
        },[])


        var noActivity
        if(activitiesList == 0){
            noActivity = <h4 style={{display:'flex', margin:"30px", marginBottom:"50px", justifyContent:'center', color: 'red'}}>Aucune activité enregistrée</h4>
        }

        
    // mise en forme des titres antd
    const { Title } = Typography;

    // messages d'erreurs rencontrées en back-end lors de l'enregistrement
    var tabErrorsSaving = listErrorsSaving.map((error,i) => {
    return( <p className= "erreurs">
              {error}
            </p>
          )
  })

  
  
    return (
  
        <Layout className= "activityLayout">

            <Topnavbar/>

                   STATS
                    <p>{token}</p>
                    
                <Row className="historyRow">
                  <div className="ColStats" >

                    <Title level={3} className="title">
                    Statistiques
                    </Title>

                    {tabErrorsSaving}

                    {noActivity}

                        
                    {/* {activitiesList.map((activity,i) => (
                    <div key={i} style={{display:'flex',justifyContent:'center'}}>

                    </div>


              ))} */}

                        
                  </div>
                
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
)(History)