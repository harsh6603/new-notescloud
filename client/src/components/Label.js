import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Home from './Home';

export default function Label() {

    const {labelName} = useParams();

    // console.log(labelName);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(!token)
            navigate("/login");
        // eslint-disable-next-line
    },[])

    const navigate = useNavigate();    

    if(!token)    
        navigate("/login");            
    else
    {        
        let label = localStorage.getItem("labels");
        let labels = label.split(",");
    
        if(!labels.includes(labelName))navigate("/");
    }
    console.log("Here2");
    return (   
        token?     
        <Home labelName={labelName} />
        :
        <Home/>
    )

}
