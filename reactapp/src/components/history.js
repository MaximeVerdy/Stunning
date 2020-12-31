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
            const data = await fetch(`/history?token=${token}`)
            const body = await data.json()

            setActivitiesList(body.sortedActivities)
            // props.saveActivities(body.activities)
            }

            findActivities()
        },[deleted])

        var deleteActivity = async (activityID) => {
            // props.deleteToWishList(title)

            const deleting = await fetch('/history', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `activityID=${activityID}&token=${props.token}`
            })

            setDeleted(deleted + 1)
        }

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

                   HISTORIQUE
                    <p>{token}</p>
                    
                <Row className="historyRow">
                  <div className="ColForm" 
                //    overflow= 'scroll'
                //    style = {{
                //        height: '500px'
                //    }}
                  >

                    <Title level={3} className="title">
                    Historique d'activités
                    </Title>

                    {tabErrorsSaving}

                    {noActivity}

                        
                    {activitiesList.map((activity,i) => (
                    <div key={i} style={{display:'flex',justifyContent:'center'}}>


                    <div
                        
                        style={{ 
                        display:'flex',
                        flexDirection: 'column',
                        width: '300px', 
                        backgroundColor: 'white',
                        paddingTop: '5px',
                        paddingBottom: '5px',
                        paddingRight: '10px',
                        paddingLeft: '10px',
                        marginTop:'1px', 
                        marginBottom:'1px', 

                        // justifyContent:'space-between',
                        // backgroundImage: "url("+imageBG+")",
                        // backgroundSize: '100%',
                        // backgroundColor: 'white',
                        // backgroundPositionY: 'bottom',
                        // opacity:'0.4',
                        
                        }}
                        
                        actions={[
                            // <Icon type="read" key="ellipsis2" onClick={() => showModal(article.title,article.content)} />,
                            // <Icon type="delete" key="ellipsis" onClick={() => deleteActivity(activity.activityID)} />
                            // 

                        ]}
                        >
                            <div
                                style={{ 
                                paddingBottom: '5px',
                                }}
                            >
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
                                    // justifyContent:'space-between',
                                    }}
                            >
                                <Tag color="#87d068">{activity.distance} km</Tag>
                                <Tag color="#2db7f5">{activity.chronoH }h {activity.chronoM} m {activity.chronoS} s</Tag>
                                <Tag color="#f50">{activity.type}</Tag>


                            </div>

                    </div>

                    <div
                        style={{ 
                            display:'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '10px',
                            backgroundColor: 'white',
                            marginTop:'1px', 
                            marginBottom:'1px', 
                            }}
                    >
                        <FontAwesomeIcon icon={faTrash} size="lg" color="grey"
                                onClick={() => deleteActivity(activity.activityID)}
                                // onMouseEnter={() => setBgColourTrash("black")}
                                // onMouseLeave={() => setBgColourTrash("grey")}
                            />
                    </div>

                </div>

              ))}

                        
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