import React from 'react'
import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import NoteContext from '../context/NoteContext';
import "../Note.css"

export default function Note(props) {

    const context = useContext(NoteContext);

    let userEmail = localStorage.getItem("userEmail");

    let id = localStorage.getItem("id");

    let location = useLocation();
    const x = window.matchMedia("(max-width: 500px)");

    let count = 0,countLabel=0;

    const { notes, deleteNote, archiveNote, unArchiveNote, foreverDeleteNote, restoreNote, labelArchive, copyNote, collaborator, selectColor, bgcolor, clickLabelModalBtn } = props;
    // console.log(!x.matches);    
    
    return (
        <>
            <div id="cards" className={`card ${(context.mode === "white") ? "card" : "cardBlack"}`} style={{backgroundColor:bgcolor}}>
                <div className="card-body">
                    <h5 className="card-title">{notes.title}</h5>
                    <p className="card-text">{notes.description}</p>
                    
                    {(notes.label.length!==0 ) && 
                        // eslint-disable-next-line
                        notes.label.map((label) => {
                            if(label.userEmail === userEmail)
                            {
                                countLabel++;
                                if(countLabel<=2)
                                {
                                    return <span key={label.labelName} style={{backgroundColor:(context.mode === "white")?"gainsboro":"gainsboro",color:"black"}} className={`me-1 badge mb-2`}>{label.labelName}</span>
                                }
                            }
                        })                            
                    }
                    {
                        (countLabel-2 > 0)&&
                        <span style={{backgroundColor:(context.mode === "white")?"gainsboro":"gainsboro",color:"black"}} className={`me-1 badge mb-2`}>
                            <i style={{fontSize:"9px"}} className="fa-solid fa-plus"></i>
                            <i style={{ fontWeight: "bolder", fontSize: "12px" }} className={`fa-solid fa-${(countLabel-2) && countLabel-2}`} aria-hidden="true"></i>
                        </span>                        
                    }

                    {/* collaborators */}
                    <div className='d-flex justify-content-start'>
                        {
                            (notes.collaborators.length > 1) &&
                            // eslint-disable-next-line
                            notes.collaborators.map((collaboratorEmail) => {
                                let firstLetterOfCollaborator = collaboratorEmail.charAt(0).toLowerCase();
                                if (collaboratorEmail !== userEmail && count < 2) {
                                    count++;
                                    return <div key={collaboratorEmail} title={collaboratorEmail} className='collaboratorNameNote mb-3' onClick={(e) => { collaborator(notes); e.stopPropagation(); }}>
                                        <i id="" style={{ fontWeight: "bolder", fontSize: "12px" }} className={`fa-solid fa-${(firstLetterOfCollaborator) && firstLetterOfCollaborator.toLowerCase()}`} aria-hidden="true"></i>
                                    </div>
                                }
                            })
                        }
                        {
                            //ahi logged in user pote collborator che and 2 collaborator display karvana che etle total size mathi 3 minus karya che.
                            (notes.collaborators.length - 3 > 0) &&
                            <div className='collaboratorNameNote mb-3' style={{ backgroundColor: "gray" }}>
                                <i style={{fontSize:"9px"}} className="fa-solid fa-plus"></i>
                                <i id="" style={{ fontWeight: "bolder", fontSize: "12px" }} className={`fa-solid fa-${(notes.collaborators.length - 3) && notes.collaborators.length - 3}`} aria-hidden="true"></i>
                            </div>
                        }
                    </div>

                    {
                        (location.pathname !== "/trash") ?
                            (x.matches !== true) &&
                            <div className="d-flex justify-content-start">
                                {
                                    //if user has only one collaborator himself then display delete button 
                                    (notes.collaborators.length <= 1 || notes.userID === id) &&
                                    <div id="option" title="Delete" className='setArchive' onClick={(e) => { deleteNote(notes._id, notes.collaborators.length); e.stopPropagation(); }} >
                                        {/* <i style={{ cursor: "pointer", fontSize: "16px", color: (context.mode === "white") ? "black" : "white" }} id="delete" title="Delete" className="fa fa-trash-o" onClick={(e) => { deleteNote(notes._id, notes.collaborators.length); e.stopPropagation(); }} ></i> */}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" id="IconChangeColor"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" id="mainIconPathAttribute" strokeWidth="2" stroke="currentColor"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    </div>
                                }
                                {(location.pathname !== "/archive") ?
                                    (!labelArchive)
                                        ?
                                        <div title='Archive' id="option" className='setArchive' onClick={(e) => { archiveNote(notes._id); e.stopPropagation(); }}>
                                            <svg fill={`${(context.mode === "white") ? "black" : "white"}`} height="20px" viewBox="0 0 24 24" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="m21.706 5.292-2.999-2.999A.996.996 0 0 0 18 2H6a.996.996 0 0 0-.707.293L2.294 5.292A.994.994 0 0 0 2 6v13c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6a.994.994 0 0 0-.294-.708zM6.414 4h11.172l1 1H5.414l1-1zM4 19V7h16l.002 12H4z" /><path d="M14 9h-4v3H7l5 5 5-5h-3z" /></svg>
                                        </div>
                                        :
                                        //display unarchive in label archive
                                        <div title='Unarchive' id="option" className='setArchive' onClick={(e) => { unArchiveNote(notes._id); e.stopPropagation(); }}>
                                            <svg fill={`${(context.mode === "white") ? "black" : "white"}`} height="21px" viewBox="0 0 24 24" width="21px" xmlns="http://www.w3.org/2000/svg"><path d="m21.706 5.292-2.999-2.999A.996.996 0 0 0 18 2H6a.996.996 0 0 0-.707.293L2.294 5.292A.994.994 0 0 0 2 6v13c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6a.994.994 0 0 0-.294-.708zM6.414 4h11.172l1 1H5.414l1-1zM4 19V7h16l.002 12H4z" /><path d="M7 14h3v3h4v-3h3l-5-5z" /></svg>
                                        </div>
                                    : <div title='Unarchive' id="option" className='setArchive' onClick={(e) => { unArchiveNote(notes._id); e.stopPropagation(); }}>
                                        <svg fill={`${(context.mode === "white") ? "black" : "white"}`} height="21px" viewBox="0 0 24 24" width="21px" xmlns="http://www.w3.org/2000/svg"><path d="m21.706 5.292-2.999-2.999A.996.996 0 0 0 18 2H6a.996.996 0 0 0-.707.293L2.294 5.292A.994.994 0 0 0 2 6v13c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6a.994.994 0 0 0-.294-.708zM6.414 4h11.172l1 1H5.414l1-1zM4 19V7h16l.002 12H4z" /><path d="M7 14h3v3h4v-3h3l-5-5z" /></svg>
                                    </div>
                                }
                                <div id="option" className='setArchive' title="Copy Note" onClick={(e) => { copyNote(notes); e.stopPropagation(); }}>
                                    {/* <i style={{ cursor: "pointer", fontSize: "16px", color:(context.mode === "white")?"black":"white" }} id="copy" title="Copy Note" className="fa fa-clone" onClick={(e) => { copyNote(notes); e.stopPropagation(); }} ></i>                                                                                                       */}
                                    {/* <svg fill={`${(context.mode === "white")?"black":"white"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" id="IconChangeColor" height="16" width="16"> <path fill="var(--ci-primary-color, currentColor)" d="M472,16H160a24.027,24.027,0,0,0-24,24V352a24.027,24.027,0,0,0,24,24H472a24.027,24.027,0,0,0,24-24V40A24.027,24.027,0,0,0,472,16Zm-8,328H168V48H464Z" className="ci-primary" id="mainIconPathAttribute" strokeWidth="2" stroke="#000000"></path> <path fill="var(--ci-primary-color, currentColor)" d="M344,464H48V168h56V136H40a24.027,24.027,0,0,0-24,24V472a24.027,24.027,0,0,0,24,24H352a24.027,24.027,0,0,0,24-24V408H344Z" className="ci-primary" id="mainIconPathAttribute" stroke="#000000"></path> </svg> */}
                                    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" id="IconChangeColor" height="15" width="15"><path d="M6 6V2c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4v4a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h4zm2 0h4a2 2 0 0 1 2 2v4h4V2H8v4zM2 8v10h10V8H2z" id="mainIconPathAttribute" stroke="currentColor" strokeWidth="0"></path></svg>
                                </div>

                                {/* collaborator option */}
                                <div title='Collaborate' id="option" className='setArchive' onClick={(e) => { collaborator(notes); e.stopPropagation(); }}>
                                    <svg width="21px" height="21px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M8 11C10.2091 11 12 9.20914 12 7C12 4.79086 10.2091 3 8 3C5.79086 3 4 4.79086 4 7C4 9.20914 5.79086 11 8 11ZM8 9C9.10457 9 10 8.10457 10 7C10 5.89543 9.10457 5 8 5C6.89543 5 6 5.89543 6 7C6 8.10457 6.89543 9 8 9Z" fill="currentColor" /><path d="M11 14C11.5523 14 12 14.4477 12 15V21H14V15C14 13.3431 12.6569 12 11 12H5C3.34315 12 2 13.3431 2 15V21H4V15C4 14.4477 4.44772 14 5 14H11Z" fill="currentColor" /><path d="M18 7H20V9H22V11H20V13H18V11H16V9H18V7Z" fill="currentColor" /></svg>
                                    {/* <i style={{ cursor: "pointer", fontSize: "16px", color:(context.mode === "white")?"black":"white" }} id="copy" title="Collaborator" className="fas fa-user-plus" onClick={(e) => { e.stopPropagation(); }} ></i> */}
                                </div>

                                {/* color picker */}
                                <div title='Background Options' id="option" className='setArchive'>
                                    <svg onClick={(e) => {selectColor(notes,e.target); e.stopPropagation(); }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 512 512" id="IconChangeColor"><path d="M430.11,347.9c-6.6-6.1-16.3-7.6-24.6-9-11.5-1.9-15.9-4-22.6-10-14.3-12.7-14.3-31.1,0-43.8l30.3-26.9c46.4-41,46.4-108.2,0-149.2-34.2-30.1-80.1-45-127.8-45-55.7,0-113.9,20.3-158.8,60.1-83.5,73.8-83.5,194.7,0,268.5,41.5,36.7,97.5,55,152.9,55.4h1.7c55.4,0,110-17.9,148.8-52.4C444.41,382.9,442,359,430.11,347.9Z" stroke='currentColor' fill={`${(context.mode === "white") ? "none" : "currentColor"}`} strokeMiterlimit={10} strokeWidth={"32px"} id="mainIconPathAttribute"></path><circle cx="144" cy="208" r="32"></circle><circle cx="152" cy="311" r="32"></circle><circle cx="224" cy="144" r="32"></circle><circle cx="256" cy="367" r="48"></circle><circle cx="328" cy="144" r="32"></circle></svg>                                    
                                </div>

                                {/* add label */}
                                <div title='Add Label' id="option" className='setArchive' onClick={(e) => {clickLabelModalBtn(notes);e.stopPropagation()}} >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' viewBox="0 0 24 24" id="IconChangeColor" height="21" width="21"><path d="M21,12l-4.37,6.16C16.26,18.68,15.65,19,15,19h-3l0-6H9v-3H3V7c0-1.1,0.9-2,2-2h10c0.65,0,1.26,0.31,1.63,0.84L21,12z M10,15H7v-3H5v3H2v2h3v3h2v-3h3V15z" id="mainIconPathAttribute" strokeWidth="1"></path></svg>
                                </div>


                            </div>
                            :
                            (x.matches !== true) &&
                            <div className="d-flex justify-content-start">
                                <div id="option" className='setArchive'>
                                    {/* <i style={{ cursor: "pointer", fontSize: "16px", color: (context.mode === "white") ? "black" : "white" }} id="delete" title="Delete Forever" className="fa fa-trash-o" onClick={(e) => { foreverDeleteNote(notes._id); e.stopPropagation(); }} ></i> */}
                                    <svg onClick={(e) => { foreverDeleteNote(notes._id); e.stopPropagation(); }} xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" id="IconChangeColor"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" id="mainIconPathAttribute" strokeWidth="2" stroke="currentColor"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                </div>
                                <div id="option">
                                    <i style={{ cursor: "pointer", fontSize: "16px", color: (context.mode === "white") ? "black" : "white" }} id="restore" title="Restore Note" className="fa-solid fa-trash-arrow-up" onClick={(e) => { restoreNote(notes._id); e.stopPropagation(); }}></i>
                                </div>
                            </div>
                    }
                </div>
            </div>            

        </>
    )
}
