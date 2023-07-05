import React from 'react'
import "../css/Loading.css"

export default function LoadingFallback() {    

    return (        
        <div 
            style={{
                width:"100%",
                height:"100%",                                
                position:"fixed",
                zIndex:"1000",
                backdropFilter:"blur(8px)",                                            
            }}        
        >
            <div className='centerDiv'>
                <div className="loader"></div>
            </div>
        </div>
    )
}
