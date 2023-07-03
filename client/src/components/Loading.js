import React, { useContext } from 'react'
import "../css/Loading.css"
import noteContext from '../context/NoteContext.js'

export default function Loading() {

    const context = useContext(noteContext);

    return (
        context.loading &&
        <div 
            style={{
                width:"100%",
                height:"100%",                                
                position:"fixed",
                zIndex:"5",
                backdropFilter:"blur(8px)",                                            
            }}        
        >
            <div className='centerDiv'>
                <div className="loader"></div>
            </div>
        </div>
    )
}
