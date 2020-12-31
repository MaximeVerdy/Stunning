
export default function(token = '', action){


    if(action.type == 'addToken'){
        console.log(' token dans  reducer ------->', action.token)
        return action.token
        // return ('fauxToken')
        
    } else {
        return token
    }

}

