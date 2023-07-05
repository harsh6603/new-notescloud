import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Home from './Home';

export default function Label() {

    const {labelName} = useParams();

    // console.log(labelName);

    const token = localStorage.getItem("token");
    const navigate = useNavigate();    

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log(token);
        if(!token)
        {               
            navigate("/");
        }
        else
        {                    
            let label = localStorage.getItem("labels");
            let labels = label.split(",");
        
            if(!labels.includes(labelName))navigate("/");
        }
        // eslint-disable-next-line
    },[])    
    
    return (   
        token?     
        <Home labelName={labelName} />
        :
        <Home/>
    )

}
