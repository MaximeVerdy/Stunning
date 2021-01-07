import React, {useState, useEffect } from 'react'
import {Redirect, useHistory} from 'react-router-dom'
import {connect} from 'react-redux'
import {Layout, Row, Typography, Tag} from 'antd';

//composants
import Topnavbar from './navbar.js'
import Footer from './footer.js'

// style
import 'antd/dist/antd.css';
import '../css/other.css';

// icônes
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

function History(props) {

// Etats

    // état du token, récupéré du Redux Store
    const [token, setToken] = useState(props.token)
    const [activitiesList, setActivitiesList] = useState([])
    const [deleted, setDeleted] = useState(0)
    const [listErrorsSaving, setErrorsSaving] = useState([])


// échange de données avec le back pour la récuration des données à chaque changement de l'état deleted
    useEffect(() => {
        const findActivities = async () => {
        const data = await fetch(`/history?token=${token}`) // pour récupérer des données 
        const body = await data.json() // convertion des données reçues en objet JS (parsage)

        setActivitiesList(body.sortedActivities)
        setErrorsSaving(body.error)
        }

        findActivities()
    },[deleted])

    // fonction de suppression d'une activité en base de données
    var deleteActivity = async (activityID) => {
        const deleting = await fetch('/history', {
        method: 'DELETE', // méthode pour supprimer en BDD
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `activityID=${activityID}&token=${props.token}`
        })

        setDeleted(deleted + 1)
    }

    // message en cas d'absence de données enregistrée pour l'instant
    var noActivity
    if(activitiesList == 0 && listErrorsSaving.length == 0){
        noActivity = <h4 style={{display:'flex', margin:"30px", marginBottom:"50px", justifyContent:'center', color: 'red'}}>Aucune activité enregistrée</h4>
    }

        
    // mise en forme des titres antd
    const { Title } = Typography;

    // messages d'erreurs rencontrées en back-end lors de l'enregistrement
    var tabErrorsSaving = listErrorsSaving.map((error,i) => {
    return( <h4 style={{display:'flex', margin:"30px", marginBottom:"50px", justifyContent:'center', color: 'red'}}
            > 
            {error}
            </h4>
          )
    })

    // condition de rediction en cas d'absence de token 
    if(token == ''){
        return <Redirect to='/notlogged' />
        }   
  
    return (
    // le style de la page history est dans css/other.css
  
        <Layout className= "activityLayout">

            <Topnavbar/>
                    
                <Row className="historyRow">
                  <div className="ColForm" >

                    <Title level={3} className="title">
                    Historique d'activités
                    </Title>

                    {/* messages d'erreur */}
                    {tabErrorsSaving}

                    {/* messages d'absenced de données en BDD */}
                    {noActivity}

                    {/* map du tableau de données */}   
                    {activitiesList.map((activity,i) => (
                    <div key={i} style={{display:'flex',justifyContent:'center'}}>


                    <div className="mapContainer">
                            <div
                                style={{ 
                                paddingBottom: '5px',
                                }}
                            >
                                {/* formatage d'affichage de la date */}  
                                <span>Course du {activity.date.slice(8, 10)}</span>
                                {  activity.date.slice(5, 7) == 1 && <span> janvier </span> 
                                || activity.date.slice(5, 7) == 2 && <span> février </span>
                                || activity.date.slice(5, 7) == 3 && <span> mars </span>
                                || activity.date.slice(5, 7) == 4 && <span> avril </span>
                                || activity.date.slice(5, 7) == 5 && <span> mai </span>
                                || activity.date.slice(5, 7) == 6 && <span> juin </span>
                                || activity.date.slice(5, 7) == 7 && <span> juillet </span>
                                || activity.date.slice(5, 7) == 8 && <span> août </span>
                                || activity.date.slice(5, 7) == 9 && <span> septembe </span>
                                || activity.date.slice(5, 7) == 10 && <span> octobre </span> 
                                || activity.date.slice(5, 7) == 11 && <span> novembre </span>
                                || activity.date.slice(5, 7) == 12 && <span> décembre </span>
                                } 
                                <span>{activity.date.slice(0, 4)}</span>
                            </div>

                            <div
                                style={{ 
                                    display:'flex',
                                    flexDirection: 'row',
                                }}
                            >
                                <Tag color="#0AAF9C">{activity.distance} km</Tag>

                                { activity.chronoH > 0 &&
                                <Tag color="#3867DD">{activity.chronoH }h {activity.chronoM} m {activity.chronoS} s</Tag>
                                }
                                { activity.chronoH == 0 &&
                                <Tag color="#3867DD">{activity.chronoM} m {activity.chronoS} s</Tag>
                                }

                                <Tag color="#F26A65">{activity.type}</Tag>


                            </div>

                    </div>

                    <div className="trashBt">
                        <FontAwesomeIcon icon={faTrash} size="lg" color= "grey"
                                // au clic, suppression de l'activité en BDD
                                onClick={() => deleteActivity(activity.activityID)}
                            />
                    </div>

                </div>

                      ))}

                        
                  </div>
                
                </Row>

                <div className="endDiv"></div>
                

            <Footer/>

        </Layout>
  
    );
  }
  
// fonction de récupération de données dans le Redux Store 
function mapStateToProps(state){
return {token: state.token}
}

export default connect(
mapStateToProps,
null
)(History)