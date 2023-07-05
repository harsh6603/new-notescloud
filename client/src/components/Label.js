import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Home from './Home';

export default function Label() {

    const {labelName} = useParams();

    // console.log(labelName);

    const token = localStorage.getItem("token");

    const navigate = useNavigate();    
    
    if(!token)navigate("/");

    let label = localStorage.getItem("labels");
    let labels = label.split(",");

    if(!labels.includes(labelName))navigate("/");

    return (
        <Home labelName={labelName} />
    )
}
