import React from 'react';
import {Link} from 'react-router-dom'

import '../css/footer.css';

export default function Footer() {

  
return (
  


    <div className="footer"
        style={{ 
          // display: 'flex',
          // position: 'absolute',          
          // bottom: 0,
          // right: 7
        }}
    >
            <Link to="/MentionsLegales">
            <p style={{ 
                color: 'grey',
                }}>
                  Mentions légales
            </p>
            </Link>

    </div>

)

}
