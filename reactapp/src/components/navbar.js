import React from 'react';
import {Link} from 'react-router-dom'
import {Menu, } from 'antd'

// style
import 'antd/dist/antd.css';
import '../css/navbar.css';

// icônes
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartBar } from '@fortawesome/free-solid-svg-icons'
import { faPowerOff } from '@fortawesome/free-solid-svg-icons'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { faHistory } from '@fortawesome/free-solid-svg-icons'

// images
import RunnerNav from '../images/Runner-navbar.png';


export default function Topnavbar() {

  
  return (

    <div className="sticky">

      <div 
        style={{
          position: 'absolute',          
          top: 5,
          left: 10,
        }}
      >
          <img 
              src={RunnerNav} 
              alt="joggeuse" 
              height="40px" 
          />
          <span className="hiddenTextMenu" style={{color:'white' }}> Stunning </span>
      </div>
      
      <Menu style={{textAlign: 'center'}} mode="horizontal" theme="dark" > 


        <Menu.Item key="add">
          <Link to="/activite">
            <div style={{color:'white' }}>
              <FontAwesomeIcon icon={faPlusCircle} size="lg"/>
              <span className="hiddenTextMenu"> AJOUT D'ACTIVITÉ</span>
            </div>
          </Link>
        </Menu.Item>

        <Menu.Item key="add">
          <Link to="/historique">
            <div style={{color:'white' }}>
              <FontAwesomeIcon icon={faHistory} size="lg"/>
              <span className="hiddenTextMenu"> HISTORIQUE</span>
            </div>
          </Link>
        </Menu.Item>

        <Menu.Item key="stats">
          <Link to="/statistiques">
            <div style={{color:'white' }}>
                <FontAwesomeIcon icon={faChartBar} size="lg"/>
                <span className="hiddenTextMenu"> STATISTIQUES </span>
            </div>
          </Link>
        </Menu.Item>

      </Menu>


      <div 
            style={{
              position: 'absolute',          
              top: 1,
              right: 0,
              padding: '10px',
            }}
          >
            <Link to="/disconnected">
            <FontAwesomeIcon icon={faPowerOff} size="lg" color="white"/>
              <span className="hiddenTextMenu" style={{color:'white' }}> Déconnexion </span>
            </Link>
      </div>


    </div>


  );

}