import Masonry from 'react-masonry-css'
import React, { useContext, useEffect, useState, useRef } from 'react'
import NoteContext from '../context/NoteContext'
import Note from './Note';
import "../Home.css"
import { useLocation } from 'react-router-dom';
import Write from './Write';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import { Formik } from 'formik';
import { collaboratorSchema } from '../schemas';

export default function Home() {

    //Define location
    let location = useLocation()
    let currentTab = location.pathname;
    let onlyNameOfTab;
    if (currentTab === "/") {
        onlyNameOfTab = "Home";
    }
    else {
        onlyNameOfTab = currentTab.slice(1);
        onlyNameOfTab = onlyNameOfTab.replace(/%20/g,' ');
    }

    //reference of close button of modal in mobile view
    const backBtn = useRef(null);

    const currentDate = new Date();
    const Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const x = window.matchMedia("(max-width: 1000px)");

    // let navigate = useNavigate();

    //access context from NoteContext
    const context = useContext(NoteContext);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            context.getNotes(onlyNameOfTab);
            context.getArchiveNotesOfLabel(onlyNameOfTab);
            context.getLabels();
        }
        // eslint-disable-next-line
    }, [onlyNameOfTab])

    // //State for display all title,tag and description in note
    // const [toggle, setToggle] = useState("close");

    //store initial title,tag and descripton of note
    const [initialNote, setInitialNote] = useState({
        title: "",
        tag: "",
        description: ""
    })

    //State for storing note which want to update
    const [wantToUpdate, setWantToUpdate] = useState({
        editNoteId: "",
        userId: "",
        editTitle: "",
        editTag: "",
        editDescription: "",
        editDate: new Date(),
        editLabel: [],
        editArchive: false,
        editDeleted: false,
        editCollaborators: [],
        editBackground: "",
        editRestoreDate: new Date(),
    });

    //State for storing note which want to delete
    const [deletedNote, setDeletedNote] = useState({
        deletedNoteId: "",
        deletedTitle: "",
        deletedTag: "",
        deletedDescription: "",
        deletedDate: new Date()
    });

    //function call when user create a new note
    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     const elementTitle = document.getElementById("title");
    //     const elementTag = document.getElementById("tag");
    //     const elementDescription = document.getElementById("description");

    //     const title = elementTitle.value;
    //     const tag = elementTag.value;
    //     const description = elementDescription.value;

    //     elementTitle.value = elementTag.value = elementDescription.value = "";
    //     let noteData;
    //     if (onlyNameOfTab === "Home" || onlyNameOfTab === "trash" || onlyNameOfTab === "archive" || onlyNameOfTab === "about") {
    //         noteData = {
    //             title: title,
    //             tag: tag,
    //             description: description
    //         }
    //     }
    //     else {
    //         noteData = {
    //             title: title,
    //             tag: tag,
    //             description: description,
    //             label: onlyNameOfTab
    //         }
    //     }

    //     context.addNotes(noteData, onlyNameOfTab);
    //     document.getElementById('mainBox').classList.remove('mainBox1');
    //     document.getElementById('mainBox').classList.add('mainBox');
    //     // console.log(document.getElementById('mainBox'));
    //     setToggle("close");

    // }

    //function call when update button is press
    const handleUpdate = (e) => {
        const updatedTitle = document.getElementById("editTitle");
        const updatedTag = document.getElementById("editTag");
        const updatedDescription = document.getElementById("editDescription");
        const updatedData = {
            title: updatedTitle.value,
            tag: updatedTag.value,
            description: updatedDescription.value,
            date: Date.now()
        }
        context.updateNote(updatedData, wantToUpdate.editNoteId, onlyNameOfTab);
        if (x.matches)
            backBtn.current.click();
        else
            closeBtn.current.click();
    }

    //for open and close writeing note div
    // window.addEventListener('click', (e) => {
    //     if (document.getElementById('mainBox').contains(e.target)) {
    //         if (localStorage.getItem("token")) {
    //             document.getElementById('mainBox').classList.remove('mainBox');
    //             document.getElementById('mainBox').classList.add('mainBox1');
    //             // console.log(e.target.parentElement.parentElement);
    //             setToggle("open");
    //         }
    //         else {
    //             navigate("/login");
    //         }
    //     } else {
    //         document.getElementById('mainBox').classList.remove('mainBox1');
    //         document.getElementById('mainBox').classList.add('mainBox');
    //         // console.log(document.getElementById('mainBox'));
    //         setToggle("close");
    //     }
    // });

    //reference of button which open modal and for button display is none
    const ref = useRef(null);

    //reference of button which close modal and for button display is none
    const closeBtn = useRef(null);

    //function call when user clicked on div for update
    const updateNote = (clickedNote) => {
        console.log(clickedNote);
        setBackgroundColor(clickedNote.background);
        setInitialBackground(clickedNote.background);
        setInitialNote({
            title: clickedNote.title,
            tag: clickedNote.tag,
            description: clickedNote.description
        })
        setSelectedLabels(clickedNote.label);
        setInitialSelectedLabels(clickedNote.label);
        context.setselectedNoteId(clickedNote._id);
        setWantToUpdate({
            editNoteId: clickedNote._id,
            userId: clickedNote.userID,
            editTitle: clickedNote.title,
            editTag: clickedNote.tag,
            editDescription: clickedNote.description,
            editDate: new Date(clickedNote.date),
            editLabel: clickedNote.label,
            editDeleted: clickedNote.deleted,
            editCollaborators: clickedNote.collaborators,
            editBackground: clickedNote.background,
            editRestoreDate: new Date(),
            editArchive: clickedNote.archive
        });
        console.log(wantToUpdate);
        ref.current.click();
    }

    //update archive value to true for that note in database
    const archiveNote = (archiveNoteId) => {
        const updatedData = {
            archive: true,
            restoreDate: new Date()
        }
        context.updateNote(updatedData, archiveNoteId, onlyNameOfTab);
        x.matches && backBtn.current.click()
    }

    //update archive value to false for that note in database
    const unArchiveNote = (archiveNoteId) => {
        const updatedData = {
            archive: false,
            restoreDate: new Date()
        }
        context.updateNote(updatedData, archiveNoteId, onlyNameOfTab);
        x.matches && backBtn.current.click()
    }

    //update deleted value to true for that note in database
    const deleteAfterConfirm = (deleteNoteId) => {
        if (showUpdateEventModal) {
            handleHideDeleteNoteModal()
            handleHideUpdateModal()
        }
        else
            handleHideDeleteNoteModal();

        const updatedData = {
            collaborators: [userEmail],
            deleted: true
        }
        context.updateNote(updatedData, deleteNoteId, onlyNameOfTab);
        // x.matches && backBtn.current.click()
    }

    const [deleteNoteId, setDeleteNoteId] = useState(null);

    //check if more then 1 collaborator are there then ask conformation for delete
    const deleteNote = (deleteNoteId, length) => {
        setDeleteNoteId(deleteNoteId);
        //if there are more then 1 collaborator then open confirm delete modal
        if (length > 1)
            deleteNoteRef.current.click();
        else
            deleteAfterConfirm(deleteNoteId);

    }

    //delete note forever
    const deleteClickedNote = (deleteNoteID) => {
        context.deleteNote(deleteNoteID, onlyNameOfTab);
        x.matches && backBtn.current.click()
    }

    //function for restoring notes 
    const restoreNote = (restoreNoteId) => {
        const updatedData = {
            deleted: false,
            collaborators: [userEmail],
            restoreDate: new Date()
        }
        context.updateNote(updatedData, restoreNoteId, onlyNameOfTab);
        x.matches && backBtn.current.click()
    }

    //copy note
    const copyNote = (copyNoteData) => {
        console.log(copyNoteData);
        const data = {
            title: copyNoteData.title,
            description: copyNoteData.description,
            tag: copyNoteData.tag,
            deleted: copyNoteData.deleted,
            archive: copyNoteData.archive,
            label: copyNoteData.label,
            collaborators: [userEmail],
            date: new Date(),
            restoreDate: new Date()
        }
        const dataForMobileView = {
            title: copyNoteData.editTitle,
            description: copyNoteData.editDescription,
            tag: copyNoteData.editTag,
            deleted: copyNoteData.editDeleted,
            archive: copyNoteData.editArchive,
            label: copyNoteData.editLabel,
            collaborators: [userEmail],
            date: new Date(),
            restoreDate: new Date()
        }
        context.addNotes(data, onlyNameOfTab);
        if (x.matches) {
            context.addNotes(dataForMobileView, onlyNameOfTab);
            backBtn.current.click();
        }
    }

    //Display note in trash
    const displayNote = (clickedNote) => {
        console.log(clickedNote);
        setDeletedNote({
            deletedNoteId: clickedNote._id,
            deletedTitle: clickedNote.title,
            deletedTag: clickedNote.tag,
            deletedDescription: clickedNote.description,
            deletedDate: new Date(clickedNote.date)
        });
        console.log(deletedNote);
        ref.current.click();
    }

    const assignNewValue = (e) => {
        setWantToUpdate({ ...wantToUpdate, [e.target.name]: e.target.value });
    }


    // const setArea = () => {
    //     const tx = document.getElementById("description");
    //     tx.addEventListener("input", OnInput, false);
    // }
    //for not showing scrollbar in textearea
    // const tx = document.getElementsByTagName("textarea");
    // for (let i = 0; i < tx.length; i++) {
    //     if (tx[i].value === '') {
    //         tx[i].setAttribute("style", "height:60px;overflow-y:hidden;");
    //     } else {
    //         if(i===0)
    //         {
    //             console.log("Inside else");
    //             tx[i].setAttribute("style", "height:" + ((tx[i].scrollHeight) ? (tx[i].scrollHeight < 200) ? "200" : tx[i].scrollHeight : "200") + "px;overflow-y:hidden;");
    //         }
    //     }
    //     tx[i].addEventListener("input", OnInput, false);
    // }

    // function OnInput(e) {
    //     console.log(">>>>>" + this.scrollHeight);
    //     // this.style.height = "auto";
    //     this.style.height = (this.scrollHeight) + "px";
    // }

    const breakpointColumnsObj = {
        default: 5,
        1000: 4,
        500: 2,
        400: 2,
        200: 1
    };

    // const [state, setState] = useState({
    //     images: [],
    // })

    // const onFileChange = (e) => {
    //     Array.from(e.target.files).forEach(file => {
    //         const reader = new FileReader();
    //         console.log(reader)
    //         reader.onload = (e) => {
    //             setState({
    //                 images:state.images.concat(e.target.result),
    //             });
    //         };
    //         reader.readAsDataURL(file);
    //     })
    // }

    const displayAlert = () => {
        toast("Can not edit in Trash", {
            position: toast.POSITION.BOTTOM_LEFT,
            containerId: "outsideHome"
        })
    }

    //for note modal open and close

    const [showUpdateEventModal, setShowUpdateEventModal] = useState(false);

    const handleShowUpdateModal = () => {
        window.history.pushState({}, "", "#open-modal");
        setShowUpdateEventModal(true);
    }

    const handleHideUpdateModal = () => {
        //if title,tag or description update then run code which is written inside if statement

        let compareTitle = (initialNote.title).localeCompare(wantToUpdate.editTitle)
        let compareTag = (initialNote.tag).localeCompare(wantToUpdate.editTag)
        let compareDescription = (initialNote.description).localeCompare(wantToUpdate.editDescription)

        if (compareTitle || compareTag || compareDescription)
            handleUpdate();
        window.history.back();
    }

    // useEffect(() => {
    //     function handlePopState(event) {
    //         if (showUpdateEventModal)
    //             setShowUpdateEventModal(false);
    //     }

    //     window.addEventListener("popstate", handlePopState);

    //     return () => {
    //         window.removeEventListener("popstate", handlePopState);
    //     }
    // }, [showUpdateEventModal])

    //end of modal related code

    // let userName = localStorage.getItem("userName");
    let id = localStorage.getItem("id");
    let userEmail = localStorage.getItem("userEmail");

    //code for Collaborator       

    const collaboratorRef = useRef(null);

    const collaborator = (note) => {

        let selectNote = note;
        if (!note.collaborators) {
            selectNote = {
                _id: note.editNoteId,
                title: note.editTitle,
                tag: note.editTag,
                description: note.editDescription,
                date: note.editDate,
                label: note.editLabel,
                deleted: note.editDeleted,
                collaborators: note.editCollaborators,
                restoreDate: note.editRestoreDate,
                archive: note.editArchive,
            }
        }
        context.setSelectedNote(selectNote);
        context.setselectedNoteId(selectNote._id);
        context.setCollaborators(selectNote.collaborators);
        collaboratorRef.current.click();
    }

    const [showCollaboratorModal, setShowCollaboratorModal] = useState(false);

    const handleShowCollaboratorModal = () => {
        window.history.pushState({}, "", "/#open-modal/#open-collaborator");
        setShowCollaboratorModal(true);
    }

    const handleHideCollaboratorModal = () => {
        window.history.back();
    }

    //code for delete note modal
    const deleteNoteRef = useRef(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleShowDeleteNoteModal = () => {
        window.history.pushState({}, "", "/#open-modal/#open-deleteNote");
        setShowDeleteModal(true);
    }

    const handleHideDeleteNoteModal = () => {
        window.history.back();
    }

    //code related to select background color modal

    const colorOptions = ['red', 'orange', 'yellow', 'green', 'teal', 'blue', 'darkBlue', 'purple', 'pink', 'brown', 'gray'];

    const colors = new Map([
        ["dark", "#202124"],
        ["white", ""],
        ["red", `${(context.mode === "white") ? "#f28b82" : "#5c2b29"}`],
        ["orange", `${(context.mode === "white") ? "#fbbc04" : "#614a19"}`],
        ["yellow", `${(context.mode === "white") ? "#fff475" : "#635d19"}`],
        ["green", `${(context.mode === "white") ? "#ccff90" : "#345920"}`],
        ["teal", `${(context.mode === "white") ? "#a7ffeb" : "#16504b"}`],
        ["blue", `${(context.mode === "white") ? "#a7ffeb" : "#2d555e"}`],
        ["darkBlue", `${(context.mode === "white") ? "#aecbfa" : "#1e3a5f"}`],
        ["purple", `${(context.mode === "white") ? "#d7aefb" : "#42275e"}`],
        ["pink", `${(context.mode === "white") ? "#fdcfe8" : "#5b2245"}`],
        ["brown", `${(context.mode === "white") ? "#e6c9a8" : "#442f19"}`],
        ["gray", `${(context.mode === "white") ? "#e8eaed" : "#3c3f43"}`]
    ])

    const [backgroundColor, setBackgroundColor] = useState('default');

    const [initialBackground, setInitialBackground] = useState('default');

    const [card, setCard] = useState(null);

    //for desktop view(bahar option batave che amathi)
    const handleColorChange = (color) => {

        if (color !== "default")
            card.style.backgroundColor = colors.get(color);
        else
            card.style.backgroundColor = "";
        setBackgroundColor(color);
    };

    //change modal color
    const changeModalColor = (color) => {
        setBackgroundColor(color);
    }

    //note modal no color change karva useEfect lakhelu che
    useEffect(() => {

        const noteModal = document.getElementsByClassName("styleModal");
        if (noteModal[0]) {
            noteModal[0].childNodes[0].style.borderColor = (context.mode === "dark") ? "rgb(95, 99, 104)" : "";
            // console.log(noteModal[0].childNodes[0]);        
            if (backgroundColor === "default")
                noteModal[0].childNodes[0].style.backgroundColor = colors.get(context.mode);
            else
                noteModal[0].childNodes[0].style.backgroundColor = colors.get(backgroundColor);
        }
        // eslint-disable-next-line
    }, [backgroundColor, showUpdateEventModal])

    const colorModalBtnRef = useRef(null);

    //aa function note par hover karia tyare je option batave che amathi color no option select kar ena mate che
    const selectColor = (selectNote, target) => {
        // console.log(target.parentElement.parentElement.parentElement.parentElement);
        let cardElement = target;
        while (1) {
            if (cardElement.id) {
                if (cardElement.id === "cards") {
                    break;
                }
                else {
                    cardElement = cardElement.parentElement;
                }
            }
            else
                cardElement = cardElement.parentElement;
        }
        // cardElement = target.parentElement.parentElement.parentElement.parentElement;
        setCard(cardElement);
        setBackgroundColor(selectNote.background);
        setInitialBackground(selectNote.background);
        context.setselectedNoteId(selectNote._id);
        colorModalBtnRef.current.click();
    }

    const selectColorFromDropdown = (note) => {
        context.setselectedNoteId(note.editNoteId);
        colorModalBtnRef.current.click();
    }

    const [showColors, setShowColors] = useState(false);

    const handleShowColorsModal = () => {
        window.history.pushState({}, "", "/#open-modal/#open-color");
        setShowColors(true);
    }

    const handleHideColorsModal = () => {
        if (initialBackground !== backgroundColor) {
            context.updateColor({ background: backgroundColor }, onlyNameOfTab)
            setInitialBackground(backgroundColor);
        }
        window.history.back();
    }

    //code related to select label modal

    const [initialSelectedLabels, setInitialSelectedLabels] = useState([]);

    const [selectedLabels, setSelectedLabels] = useState([]);

    const labelModalBtnRef = useRef(null);

    const clickLabelModalBtn = (note) => {
        setInitialSelectedLabels(note.label);
        setSelectedLabels(note.label);
        context.setselectedNoteId(note._id)
        labelModalBtnRef.current.click();
    }

    const clickAddLabelInsideModal = () => {
        labelModalBtnRef.current.click();
    }

    const [showLabelModal, setShowLabelModal] = useState(false);

    const handleShowLabelModal = () => {
        window.history.pushState({}, "", "/#open-modal/#open-label");
        setShowLabelModal(true);
    }

    const compareArrays = (arr1, arr2) => {

        if (arr1.length !== arr2.length) {
            return false; // Arrays have different lengths, so they are not equal
        }
        
        arr1.sort();
        arr2.sort();

        for (let i = 0; i < arr1.length; i++) {
            let element1 = arr1[i];
            let element2 = arr2[i];

            if(element1.labelName !== element2.labelName || element1.userEmail !== element2.userEmail)
                return false;
        }

        // arr1.forEach((l)=>console.log(l));

        // arr2.forEach((l)=>console.log(l));

        return true;
    }

    const handleHideLabelModal = () => {
        console.log(selectedLabels);

        let checkSameArray = compareArrays(selectedLabels,initialSelectedLabels);

        console.log(checkSameArray);

        if (!checkSameArray) {
            const updatedData = {
                label: selectedLabels
            }
            context.updateNote(updatedData, context.selectedNoteId, onlyNameOfTab);
        }
        window.history.back();
    }

    const updateSelectedLabel = (e) => {
        // console.log(e);
        if (e.target.checked) {
            setSelectedLabels([
                ...selectedLabels,
                {
                    labelName: e.target.value,
                    userEmail: userEmail
                }
            ])
        }
        else {
            setSelectedLabels(
                selectedLabels.filter((label) => {
                    if (label.userEmail === userEmail && label.labelName === e.target.value)
                        return false;
                    else
                        return true;
                })
            )
        }
    }

    useEffect(() => {
        function handlePopState(event) {
            if (showDeleteModal) {
                setShowDeleteModal(false);
            }
            else if (showLabelModal) {
                setShowLabelModal(false);
            }
            else if (showColors) {
                setShowColors(false);
            }
            else if (showCollaboratorModal) {
                setShowCollaboratorModal(false);
            } else if (showUpdateEventModal) {
                setShowUpdateEventModal(false);
            }
        }

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        }
        // eslint-disable-next-line
    }, [showCollaboratorModal, showUpdateEventModal, showDeleteModal, showColors, showLabelModal])

    //remove collaborator
    const removeCollaborator = (email) => {

        if (email === userEmail) {
            if (showUpdateEventModal) {
                handleHideCollaboratorModal();
                handleHideUpdateModal();
            }
            else
                handleHideCollaboratorModal();
        }

        const data = {
            email: email
        }

        context.removeNoteCollaborators(data, onlyNameOfTab);
    }

    //code related to formik for collaborator add
    const initialEmail = {
        email: ""
    };

    const [err, setErr] = useState("");

    const onSubmit = (values, { resetForm }) => {
        // console.log(values);            
        let email = values.email;
        let isEmailExist = context.collaborators.includes(email);
        // console.log(isEmailExist);        

        if (!isEmailExist) {
            setErr("");
            context.updateNoteCollaborators(values, onlyNameOfTab);
            resetForm({ values: "" });
        }
        else {
            setErr("This email already exists.")
            setTimeout(() => {
                setErr("");
            }, 3000);
        }
    }

    //for dropdown menu in mobile view
    const displayDropdown = () => {

        const mydropdown = document.getElementById("mydropdown");
        mydropdown.style.display = "block";
    }

    const closeDropdown = () => {
        const mydropdown = document.getElementById("mydropdown");
        mydropdown.style.display = "none";
    }

    window.onclick = function (e) {
        const mydropdown = document.getElementById("mydropdown");
        const outsideOfDropdown = document.getElementById("outsideOfDropdown");

        if (e.target === outsideOfDropdown) {
            mydropdown.style.display = "none";
        }
    }

    return (
        <>
            {(location.pathname !== "/archive" && location.pathname !== "/trash") &&
                <Write />
                // <div className={`${(context.navbarWidth === "unclick") ? "" : "marginForNavbar"}`}>
                //     <div className='container afterNavbar'>
                //         <form action="http://localhost:5000/api/note/createnote" method='post' onSubmit={handleSubmit}>
                //             {/* <h2>Add Note</h2>
                //                 <div className="mb-3">
                //                 <label htmlFor="exampleInputEmail1" className="form-label">Title</label>
                //                 <input type="text" className="form-control" id="title" name="title" aria-describedby="emailHelp" />
                //                 </div>
                //                 <div className="mb-3">
                //                 <label htmlFor="exampleInputEmail1" className="form-label">Tag</label>
                //                 <input type="text" className="form-control" id="tag" name="tag" aria-describedby="emailHelp" />
                //                 </div>
                //                 <div className="mb-3">
                //                 <label htmlFor="exampleInputPassword1" className="form-label">Description</label>
                //                 <input type="text" className="form-control" id="description" name="description" />
                //             </div> */}
                //             <div className="mainBox mt-4" id="mainBox">
                //                 {/* <div className="images">
                //                     {state.images.map(image => (
                //                         <img className="imageItem" src={image} alt="preview"/>
                //                     ))}
                //                 </div> */}
                //                 <div className="mt-1">
                //                     <input type="text" className="form-control1" placeholder={`${(toggle === "close") ? "Take a note ..." : "Title"}`} id="title" name="title" />
                //                 </div>
                //                 <hr />
                //                 <div>
                //                     <input type="text" className="form-control1" placeholder="Tag" id="tag" name="tag" />
                //                 </div>
                //                 <hr />
                //                 <div>
                //                     <textarea type="text" className="form-control1" placeholder="Description" id="description" name="description" onInput={setArea}></textarea>
                //                 </div>
                //                 {/* <div>
                //                     <input onChange={onFileChange} type="file" multiple />
                //                 </div> */}
                //                 <button type="submit" className="btn btn-dark mx-2 mb-2">Submit</button>
                //             </div>
                //         </form>
                //     </div>
                // </div>
            }

            {/* Modal for select label */}
            <Button ref={labelModalBtnRef} className='d-none' onClick={handleShowLabelModal} />

            <Modal
                size="sm"
                show={showLabelModal}
                animation={false}
                onHide={handleHideLabelModal}
                fullscreen={"sm-down"}
                centered
            >
                <Modal.Body>
                    <p>Label note</p>
                    {
                        context.label.map((label) => {
                            let check = selectedLabels.findIndex((selectedLabel) => selectedLabel.labelName === label && selectedLabel.userEmail === userEmail)

                            return <div key={label} className='d-flex justify-content-start pt-1'>
                                <div>
                                    <input defaultChecked={(check !== -1) ? true : false} type="checkbox" id={label} name={label} value={label} onChange={(e) => { updateSelectedLabel(e) }} />
                                </div>
                                <div style={{ paddingLeft: "5%" }}>
                                    {label}
                                </div>
                            </div>
                        })
                    }
                </Modal.Body>
                <Modal.Footer style={{ cursor: "pointer", border: "none", padding: "4%", paddingTop: "0px" }} onClick={handleHideLabelModal}>
                    <p>Done</p>
                </Modal.Footer>
            </Modal>

            {/* Modal for select background color */}
            <Button ref={colorModalBtnRef} className='d-none' variant='primary' onClick={handleShowColorsModal} />

            <Modal
                show={showColors}
                animation={false}
                onHide={handleHideColorsModal}
                centered
            >
                <Modal.Body>
                    <div className='color-options'>
                        <button style={{ height: `${x.matches ? "25px" : "35px"}`, width: `${x.matches ? "25px" : "40px"}`, display: "flex", padding: (backgroundColor === "default") ? "4px" : "6px", border: (backgroundColor === "default") ? "3px solid rebeccapurple" : "" }} title='default' className='color-option' onClick={() => { (x.matches) ? changeModalColor("default") : handleColorChange("default") }}>
                            <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24" id="IconChangeColor" height={x.matches ? 13 : 25} width={x.matches ? 13 : 20}><path d="M21.71,20.29l-18-18A1,1,0,0,0,2.29,3.71l4,4a12.46,12.46,0,0,0-2,6.57A7.76,7.76,0,0,0,12,22a7.64,7.64,0,0,0,5.87-2.71l2.42,2.42a1,1,0,0,0,1.42,0A1,1,0,0,0,21.71,20.29ZM12,20a5.76,5.76,0,0,1-5.75-5.75A10.3,10.3,0,0,1,7.72,9.14l8.74,8.73A5.67,5.67,0,0,1,12,20ZM10.85,5.24c.45-.42.85-.75,1.15-1,1.43,1.12,5.13,4.43,5.68,8.88a1,1,0,0,0,1,.88h.12a1,1,0,0,0,.87-1.11c-.78-6.43-6.85-10.55-7.1-10.72a1,1,0,0,0-1.12,0A18.73,18.73,0,0,0,9.49,3.78a1,1,0,0,0,1.36,1.46Z" id="mainIconPathAttribute" strokeWidth="0" stroke="#ff0000"></path></svg>
                        </button>
                        {
                            colorOptions &&
                            colorOptions.map((color) => {
                                return <button
                                    title={color}
                                    key={color}
                                    className={`color-option ${color}`}
                                    style={{ border: (backgroundColor === color) ? "3px solid #a142f4" : "", backgroundColor: colors.get(color) }}
                                    onClick={() => { (x.matches || showUpdateEventModal) ? changeModalColor(color) : handleColorChange(color) }}
                                />
                            })
                        }
                    </div>
                </Modal.Body>
            </Modal>

            {/* modal for delete conformation if more than 1 collaborators are there */}
            <Button ref={deleteNoteRef} className='d-none' variant='primary' onClick={handleShowDeleteNoteModal} />

            <Modal
                show={showDeleteModal}
                animation={false}
                onHide={handleHideDeleteNoteModal}
                // fullscreen={"sm-down"}
                centered
            >
                <Modal.Body>
                    <p>Delete note?</p>
                    <p>Deleted note won't be visible to anyone that you shared the note with.</p>
                    <div className='d-flex justify-content-end'>
                        <p
                            style={{ cursor: "pointer", paddingRight: "5%" }}
                            onClick={handleHideDeleteNoteModal}
                        >
                            Cancel
                        </p>
                        <p
                            style={{ cursor: "pointer", paddingRight: "5%", color: "dodgerblue", fontWeight: "500" }}
                            onClick={() => { deleteAfterConfirm(deleteNoteId) }}
                        >
                            Delete
                        </p>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Modal for collaborator */}
            <Button ref={collaboratorRef} className='d-none' variant='primary' onClick={handleShowCollaboratorModal} >

            </Button>

            <Modal
                show={showCollaboratorModal}
                animation={false}
                onHide={handleHideCollaboratorModal}
                fullscreen={"sm-down"}
                centered
            >
                <Modal.Header>
                    <b>Collaborators</b>
                </Modal.Header>

                <Modal.Body>
                    <div className='d-grid gap-3'>
                        {/* <div className='d-flex justify-content-start '>
                            <div className='collaboratorName'>
                                <i id="" style={{fontWeight: "bolder", fontSize: "16px" }} className={`fa-solid fa-${(firstLetterOfUserName) && firstLetterOfUserName.toLowerCase()}`} aria-hidden="true"></i>
                            </div>
                            <div style={{paddingTop:'5px',fontSize:"14px"}}>
                                <b>{userEmail}</b>
                                <small> (owner)</small>
                            </div>
                        </div> */}
                        {
                            (context.selectedNoteId && context.collaborators) &&
                            context.collaborators.map((collaboratorEmail, index) => {

                                let firstLetterOfCollaborator = collaboratorEmail.charAt(0).toLowerCase();

                                if (index === 0) {
                                    return <div key={collaboratorEmail} className='d-flex justify-content-start '>
                                        <div className='collaboratorName'>
                                            <i id="" style={{ fontWeight: "bolder", fontSize: "16px" }} className={`fa-solid fa-${(firstLetterOfCollaborator) && firstLetterOfCollaborator.toLowerCase()}`} aria-hidden="true"></i>
                                        </div>
                                        <div style={{ paddingTop: '5px', fontSize: "14px" }}>
                                            <b>{collaboratorEmail}</b>
                                            <small> (owner)</small>
                                        </div>
                                    </div>
                                }
                                else {
                                    return <div key={collaboratorEmail} className='d-flex justify-content-start '>
                                        <div className='collaboratorName'>
                                            <i id="" style={{ fontWeight: "bolder", fontSize: "16px" }} className={`fa-solid fa-${(firstLetterOfCollaborator) && firstLetterOfCollaborator.toLowerCase()}`} aria-hidden="true"></i>
                                        </div>
                                        <div style={{ paddingTop: '5px', fontSize: "14px", width: "100%" }}>
                                            <div className='d-flex justify-content-start'>
                                                <div style={{ width: "100%" }}>
                                                    <b style={{ fontWeight: "normal" }}>{collaboratorEmail}</b>
                                                </div>
                                                <div>
                                                    <button style={{ border: "none", outline: "none", background: "none" }} type='submit' onClick={() => { removeCollaborator(collaboratorEmail) }}>
                                                        <i
                                                            style={{ color: "gray", fontSize: "14px" }}
                                                            className="fas fa-times"
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            })
                        }
                        <div className='d-flex justify-content-start'>
                            <div className='addCollaboratorIcon'>
                                {/* <svg width="21px" height="21px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 11C10.2091 11 12 9.20914 12 7C12 4.79086 10.2091 3 8 3C5.79086 3 4 4.79086 4 7C4 9.20914 5.79086 11 8 11ZM8 9C9.10457 9 10 8.10457 10 7C10 5.89543 9.10457 5 8 5C6.89543 5 6 5.89543 6 7C6 8.10457 6.89543 9 8 9Z" fill="currentColor" /><path d="M11 14C11.5523 14 12 14.4477 12 15V21H14V15C14 13.3431 12.6569 12 11 12H5C3.34315 12 2 13.3431 2 15V21H4V15C4 14.4477 4.44772 14 5 14H11Z" fill="currentColor" /><path d="M18 7H20V9H22V11H20V13H18V11H16V9H18V7Z" fill="currentColor" /></svg>                                 */}
                                <i style={{ fontSize: "16px", color: (context.mode === "white") ? "gray" : "gray" }} id="copy" title="Collaborator" className="fas fa-user-plus" onClick={(e) => { e.stopPropagation(); }} ></i>
                            </div>
                            <div style={{ paddingTop: "5px", width: "100%" }}>
                                <Formik
                                    initialValues={initialEmail}
                                    validationSchema={collaboratorSchema}
                                    validateOnChange={false}
                                    validateOnBlur={false}
                                    enableReinitialize
                                    onSubmit={onSubmit}
                                >
                                    {({
                                        values,
                                        errors,
                                        resetForm,
                                        handleBlur,
                                        handleChange,
                                        handleSubmit
                                    }) => (
                                        <form onSubmit={handleSubmit} noValidate>
                                            <div className='d-flex justify-content-start'>
                                                <div style={{ width: "100%" }}>
                                                    <input
                                                        type="email"
                                                        className="collaboratorEmail"
                                                        placeholder="Enter email to share with"
                                                        id="email"
                                                        name="email"
                                                        value={values.email}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                </div>
                                                {
                                                    values.email &&
                                                    <div>
                                                        <button style={{ border: "none", outline: "none", background: "none" }} type='submit'>
                                                            <i
                                                                style={{ cursor: "pointer", color: "gray", fontSize: "14px" }}
                                                                className="fas fa-check"
                                                            />
                                                        </button>
                                                    </div>
                                                }
                                            </div>
                                            {
                                                (values.email && (errors.email || err.length !== 0)) &&
                                                    (err.length === 0)
                                                    ?
                                                    <small id='emailError' style={{ position: "absolute", color: "red", fontSize: "12px" }}> {errors.email} </small>
                                                    :
                                                    <small id='emailError' style={{ position: "absolute", color: "red", fontSize: "12px" }}> {err} </small>
                                            }
                                        </form>
                                    )
                                    }
                                </Formik>
                            </div>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <div style={{ cursor: "pointer" }} onClick={handleHideCollaboratorModal}>
                        <div>Cancel</div>
                    </div>
                </Modal.Footer>

            </Modal>

            {/* Modal for note display */}
            <Button ref={ref} className='d-none' variant='primary' onClick={handleShowUpdateModal} >

            </Button>

            {/* <button ref={ref} style={{ display: "none" }} type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button> */}

            <Modal

                show={showUpdateEventModal}
                // keyboard={false}                                
                animation={false}
                dialogClassName='styleModal'
                onHide={handleHideUpdateModal}
                centered
                fullscreen={"sm-down"}
            >
                {
                    // x.matches &&
                    <Modal.Header style={{ display: "unset", border: "none", color: (context.mode === "white") ? "black" : "white", backgroundColor: (backgroundColor !== "default") ? colors.get(backgroundColor) : colors.get(context.mode) }}>
                        <div className='d-flex justify-content-between'>
                            {/* <div> */}
                            <i ref={backBtn} style={{ fontSize: "17px" }} data-bs-dismiss="modal" className="fa-solid fa-arrow-left" onClick={handleHideUpdateModal}></i>
                            {/* </div> */}
                            <div className='d-flex justify-content-start'>
                                {
                                    (onlyNameOfTab !== "trash") &&
                                    // <i style={{ cursor: "pointer", fontSize: "16px", margin: "0 10px" }} id="copy" title="Copy Note" className="fa-regular fa-clone" onClick={(e) => { copyNote(wantToUpdate); e.stopPropagation(); }} ></i>
                                    // <svg style={{ margin: "0px 10px" }} onClick={(e) => { copyNote(wantToUpdate); e.stopPropagation(); }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" id="IconChangeColor" height="18" width="18"> <path fill="var(--ci-primary-color, currentColor)" d="M472,16H160a24.027,24.027,0,0,0-24,24V352a24.027,24.027,0,0,0,24,24H472a24.027,24.027,0,0,0,24-24V40A24.027,24.027,0,0,0,472,16Zm-8,328H168V48H464Z" className="ci-primary" id="mainIconPathAttribute" strokeWidth="2" stroke="#000000"></path> <path fill="var(--ci-primary-color, currentColor)" d="M344,464H48V168h56V136H40a24.027,24.027,0,0,0-24,24V472a24.027,24.027,0,0,0,24,24H352a24.027,24.027,0,0,0,24-24V408H344Z" className="ci-primary" id="mainIconPathAttribute" stroke="#000000"></path> </svg>
                                    <svg style={{ margin: "0px 10px" }} fill="currentColor" onClick={(e) => { copyNote(wantToUpdate); e.stopPropagation(); }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" id="IconChangeColor" height="18" width="18"><path d="M6 6V2c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4v4a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h4zm2 0h4a2 2 0 0 1 2 2v4h4V2H8v4zM2 8v10h10V8H2z" id="mainIconPathAttribute" stroke="currentColor" strokeWidth="0"></path></svg>
                                }
                                {
                                    (onlyNameOfTab === "trash")
                                        ?
                                        // <i style={{ cursor: "pointer", fontSize: "18px", margin: "0 10px" }} id="delete" title="Delete Forever" className="fa fa-trash-o" onClick={(e) => { deleteClickedNote(wantToUpdate.editNoteId); e.stopPropagation(); }} ></i>
                                        <svg style={{ cursor: "pointer",marginTop: "-1px"}} onClick={(e) => { deleteClickedNote(wantToUpdate.editNoteId); e.stopPropagation(); }} title="Delete Forever" xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" id="IconChangeColor"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" id="mainIconPathAttribute" strokeWidth="2" stroke="currentColor"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                        :
                                        (wantToUpdate.editCollaborators.length <= 1 || wantToUpdate.userId === id) &&
                                        <i style={{ cursor: "pointer", fontSize: "18px", margin: "0 10px" }} id="delete" title="Delete" className="fa fa-trash-o" onClick={(e) => { deleteNote(wantToUpdate.editNoteId, wantToUpdate.editCollaborators.length); e.stopPropagation(); }} ></i>
                                }

                                {
                                    (onlyNameOfTab === "archive")
                                        ?
                                        <svg style={{ margin: "-3px 10px" }} onClick={(e) => { unArchiveNote(wantToUpdate.editNoteId); e.stopPropagation(); }} fill="currentColor" height="22px" viewBox="0 0 24 24" width="22px" xmlns="http://www.w3.org/2000/svg"><path d="m21.706 5.292-2.999-2.999A.996.996 0 0 0 18 2H6a.996.996 0 0 0-.707.293L2.294 5.292A.994.994 0 0 0 2 6v13c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6a.994.994 0 0 0-.294-.708zM6.414 4h11.172l1 1H5.414l1-1zM4 19V7h16l.002 12H4z" /><path d="M7 14h3v3h4v-3h3l-5-5z" /></svg>
                                        :
                                        (onlyNameOfTab === "trash")
                                            ?
                                            <i style={{ cursor: "pointer", fontSize: "16px", margin: "0 10px" }} id="restore" title="Restore Note" className="fa-solid fa-trash-arrow-up" onClick={(e) => { restoreNote(deletedNote.deletedNoteId); e.stopPropagation(); }}></i>
                                            :
                                            (wantToUpdate.editLabel !== "false" && wantToUpdate.editArchive === true)
                                                ?
                                                <svg style={{ margin: "-3px 10px" }} onClick={(e) => { unArchiveNote(wantToUpdate.editNoteId); e.stopPropagation(); }} fill="currentColor" height="22px" viewBox="0 0 24 24" width="22px" xmlns="http://www.w3.org/2000/svg"><path d="m21.706 5.292-2.999-2.999A.996.996 0 0 0 18 2H6a.996.996 0 0 0-.707.293L2.294 5.292A.994.994 0 0 0 2 6v13c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6a.994.994 0 0 0-.294-.708zM6.414 4h11.172l1 1H5.414l1-1zM4 19V7h16l.002 12H4z" /><path d="M7 14h3v3h4v-3h3l-5-5z" /></svg>
                                                :
                                                <svg style={{ margin: "-3px 10px" }} onClick={(e) => { archiveNote(wantToUpdate.editNoteId); e.stopPropagation(); }} fill="currentColor" height="22px" viewBox="0 0 24 24" width="22px" xmlns="http://www.w3.org/2000/svg"><path d="m21.706 5.292-2.999-2.999A.996.996 0 0 0 18 2H6a.996.996 0 0 0-.707.293L2.294 5.292A.994.994 0 0 0 2 6v13c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6a.994.994 0 0 0-.294-.708zM6.414 4h11.172l1 1H5.414l1-1zM4 19V7h16l.002 12H4z" /><path d="M14 9h-4v3H7l5 5 5-5h-3z" /></svg>
                                }
                                {
                                    (onlyNameOfTab !== "trash") &&
                                    <div className="dropdown">
                                        <i style={{ cursor: "pointer", fontSize: "20px", margin: "0 0 0 10px" }} onClick={displayDropdown} id="dropdownMenu" className="fa-solid fa-ellipsis-vertical"></i>
                                        {/* <span id="dropdownMenu">&#x22EE;</span> */}
                                        <div id="mydropdown" className='dropdownlist' style={{cursor:"pointer"}}>
                                            <div id={"outsideOfDropdown"} className='backOfModal'></div>
                                            <ul id="dropdown-menu" className="dropdown-menu" aria-labelledby="dropdownMenu" onClick={closeDropdown} >
                                                <li className="dropdown-item" >
                                                    <div className='d-flex justify-content-start' onClick={(e) => { collaborator(wantToUpdate); }}>
                                                        <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M8 11C10.2091 11 12 9.20914 12 7C12 4.79086 10.2091 3 8 3C5.79086 3 4 4.79086 4 7C4 9.20914 5.79086 11 8 11ZM8 9C9.10457 9 10 8.10457 10 7C10 5.89543 9.10457 5 8 5C6.89543 5 6 5.89543 6 7C6 8.10457 6.89543 9 8 9Z" fill="currentColor" /><path d="M11 14C11.5523 14 12 14.4477 12 15V21H14V15C14 13.3431 12.6569 12 11 12H5C3.34315 12 2 13.3431 2 15V21H4V15C4 14.4477 4.44772 14 5 14H11Z" fill="currentColor" /><path d="M18 7H20V9H22V11H20V13H18V11H16V9H18V7Z" fill="currentColor" /></svg>
                                                        <p style={{ paddingLeft: "6%" }}>Collaborators</p>
                                                    </div>
                                                </li>
                                                <li className="dropdown-item" >
                                                    <div className='d-flex justify-content-start' onClick={(e) => { selectColorFromDropdown(wantToUpdate) }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 512 512" id="IconChangeColor"><path d="M430.11,347.9c-6.6-6.1-16.3-7.6-24.6-9-11.5-1.9-15.9-4-22.6-10-14.3-12.7-14.3-31.1,0-43.8l30.3-26.9c46.4-41,46.4-108.2,0-149.2-34.2-30.1-80.1-45-127.8-45-55.7,0-113.9,20.3-158.8,60.1-83.5,73.8-83.5,194.7,0,268.5,41.5,36.7,97.5,55,152.9,55.4h1.7c55.4,0,110-17.9,148.8-52.4C444.41,382.9,442,359,430.11,347.9Z" stroke='currentColor' fill={"white"} strokeMiterlimit={10} strokeWidth={"32px"} id="mainIconPathAttribute"></path><circle cx="144" cy="208" r="32"></circle><circle cx="152" cy="311" r="32"></circle><circle cx="224" cy="144" r="32"></circle><circle cx="256" cy="367" r="48"></circle><circle cx="328" cy="144" r="32"></circle></svg>
                                                        {/* <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M8 11C10.2091 11 12 9.20914 12 7C12 4.79086 10.2091 3 8 3C5.79086 3 4 4.79086 4 7C4 9.20914 5.79086 11 8 11ZM8 9C9.10457 9 10 8.10457 10 7C10 5.89543 9.10457 5 8 5C6.89543 5 6 5.89543 6 7C6 8.10457 6.89543 9 8 9Z" fill="currentColor" /><path d="M11 14C11.5523 14 12 14.4477 12 15V21H14V15C14 13.3431 12.6569 12 11 12H5C3.34315 12 2 13.3431 2 15V21H4V15C4 14.4477 4.44772 14 5 14H11Z" fill="currentColor" /><path d="M18 7H20V9H22V11H20V13H18V11H16V9H18V7Z" fill="currentColor" /></svg> */}
                                                        <p style={{ paddingLeft: "6%" }}>Background Options</p>
                                                    </div>
                                                </li>
                                                <li className="dropdown-item" >
                                                    <div className='d-flex justify-content-start' onClick={(e) => { clickAddLabelInsideModal() }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' viewBox="0 0 24 24" id="IconChangeColor" height="25" width="25"><path d="M21,12l-4.37,6.16C16.26,18.68,15.65,19,15,19h-3l0-6H9v-3H3V7c0-1.1,0.9-2,2-2h10c0.65,0,1.26,0.31,1.63,0.84L21,12z M10,15H7v-3H5v3H2v2h3v3h2v-3h3V15z" id="mainIconPathAttribute" strokeWidth="1"></path></svg>
                                                        {/* <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M8 11C10.2091 11 12 9.20914 12 7C12 4.79086 10.2091 3 8 3C5.79086 3 4 4.79086 4 7C4 9.20914 5.79086 11 8 11ZM8 9C9.10457 9 10 8.10457 10 7C10 5.89543 9.10457 5 8 5C6.89543 5 6 5.89543 6 7C6 8.10457 6.89543 9 8 9Z" fill="currentColor" /><path d="M11 14C11.5523 14 12 14.4477 12 15V21H14V15C14 13.3431 12.6569 12 11 12H5C3.34315 12 2 13.3431 2 15V21H4V15C4 14.4477 4.44772 14 5 14H11Z" fill="currentColor" /><path d="M18 7H20V9H22V11H20V13H18V11H16V9H18V7Z" fill="currentColor" /></svg> */}
                                                        <p style={{ paddingLeft: "6%" }}>{(wantToUpdate.editLabel.length===0)?"Add label":"Change label"}</p>
                                                    </div>
                                                </li>
                                                {/* <li className="dropdown-item" >Add Color</li> */}
                                            </ul>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </Modal.Header>
                }
                <Modal.Body style={{ color: (context.mode === "white") ? "black" : "white", backgroundColor: (backgroundColor !== "default") ? colors.get(backgroundColor) : colors.get(context.mode) }}>
                    <form>
                        <div className="mt-1">
                            {
                                onlyNameOfTab !== "trash" ?
                                    <input type="text" style={{ fontWeight: "bold", backgroundColor: "inherit", color: "inherit" }} className="form-control1" value={wantToUpdate.editTitle} id="editTitle" name="editTitle" onInput={assignNewValue} />
                                    :
                                    <input type="text" style={{ fontWeight: "bold", backgroundColor: "inherit", color: "inherit" }} className="form-control1" value={deletedNote.deletedTitle} id="deletedTitle" name="deletedTitle" readOnly onClick={displayAlert} />
                            }
                        </div>
                        <hr />
                        <div>
                            {
                                onlyNameOfTab !== "trash" ?
                                    <input type="text" style={{ backgroundColor: "inherit", color: "inherit" }} className="form-control1" value={wantToUpdate.editTag} placeholder={(wantToUpdate.editTag) ? " " : "Tag"} id="editTag" name="editTag" onInput={assignNewValue} />
                                    :
                                    <input type="text" style={{ backgroundColor: "inherit", color: "inherit" }} className="form-control1" value={deletedNote.deletedTag} placeholder={(deletedNote.deletedTag) ? " " : "No Tag is given"} id="deletedTag" name="deletedTag" readOnly onClick={displayAlert} />
                            }
                        </div>
                        <hr />
                        <div className="mx-1 mb-2">
                            {
                                onlyNameOfTab !== "trash" ?
                                    <textarea type="text" style={{ backgroundColor: "inherit", color: "inherit" }} className="textControl" value={wantToUpdate.editDescription} id="editDescription" name="editDescription" onChange={assignNewValue}></textarea>
                                    :
                                    <textarea type="text" style={{ color: "inherit", height: "260px", backgroundColor: "inherit" }} className="textControl" value={deletedNote.deletedDescription} id="deletedDescription" name="deletedDescription" readOnly onClick={displayAlert}></textarea>
                            }
                            {/* <ToastContainer toastStyle={{backgroundColor:"black",color:"white"}} icon={false} hideProgressBar closeButton={false} /> */}
                        </div>
                        {/* <button type="submit" className="btn btn-dark mx-2 mb-2">Update</button> */}
                    </form>
                </Modal.Body>

                <Modal.Footer style={{ color: (context.mode === "white") ? "black" : "white", border: "none", display: "unset", backgroundColor: (backgroundColor !== "default") ? colors.get(backgroundColor) : colors.get(context.mode) }}>
                    {(selectedLabels && selectedLabels.length!==0 ) && 
                        // eslint-disable-next-line
                        selectedLabels.map((label) => {
                            if(label.userEmail === userEmail)                                                                                                                        
                                return <span key={label.labelName} style={{backgroundColor:(context.mode === "white")?"gainsboro":"gainsboro",color:"black"}} className={`me-1 badge mb-2`}>{label.labelName}</span>
                        })                            
                    }
                    <div className='d-flex justify-content-start'>
                        {
                            (context.collaborators && context.collaborators.length > 1) &&
                            // eslint-disable-next-line
                            context.collaborators.map((collaboratorEmail) => {
                                let firstLetterOfCollaborator = collaboratorEmail.charAt(0).toLowerCase();
                                if (collaboratorEmail !== userEmail) {                                    
                                    return <div key={collaboratorEmail} title={collaboratorEmail} className='collaboratorNameNote mb-3' onClick={(e) => { collaborator(wantToUpdate); e.stopPropagation(); }}>
                                        <i style={{ fontWeight: "bolder", fontSize: "12px" }} className={`fa-solid fa-${(firstLetterOfCollaborator) && firstLetterOfCollaborator.toLowerCase()}`} aria-hidden="true"></i>
                                    </div>
                                }
                            })
                        }
                    </div>
                    {
                        onlyNameOfTab !== "trash" ?
                            <div className="d-flex justify-content-between">
                                <div className=" d-flex justify-content-around">
                                    <button type="submit" style={{ color: `${(context.mode === "white") ? "green" : "lightgreen"}`, fontWeight: "500" }} className="myBtn btn mx-2" onClick={handleUpdate}>Update</button>
                                    {(!x.matches) && <button ref={closeBtn} style={{ color: (context.mode === "white") ? "black" : "white" }} type="button" className="myBtn btn" data-bs-dismiss="modal" onClick={handleHideUpdateModal} >Close</button>}
                                </div>
                                {/* <small>Edited {wantToUpdate.editDate.getHours() + ":" + ((wantToUpdate.editDate.getMinutes()<10)?"0"+wantToUpdate.editDate.getMinutes():wantToUpdate.editDate.getMinutes())}</small> */}
                                <small>Edited {(currentDate.getFullYear() > wantToUpdate.editDate.getFullYear()) ? Months[wantToUpdate.editDate.getMonth()] + " " + wantToUpdate.editDate.getFullYear() : (currentDate.getMonth() > wantToUpdate.editDate.getMonth()) ? wantToUpdate.editDate.getDate() + " " + Months[wantToUpdate.editDate.getMonth()] : (currentDate.getDate() > wantToUpdate.editDate.getDate()) ? wantToUpdate.editDate.getDate() + " " + Months[wantToUpdate.editDate.getMonth()] : ((wantToUpdate.editDate.getHours() > 12) ? (wantToUpdate.editDate.getHours() - 12) : wantToUpdate.editDate.getHours()) + ":" + ((wantToUpdate.editDate.getMinutes() < 10) ? "0" + wantToUpdate.editDate.getMinutes() : wantToUpdate.editDate.getMinutes()) + " " + ((wantToUpdate.editDate.getHours() > 11) ? "PM" : "AM")}</small>
                            </div>
                            :
                            <div className="d-flex justify-content-between">
                                <div className=" d-flex justify-content-around">
                                    {/* {!x.matches && <button type="submit" style={{ color: `${(context.mode === "white") ? "green" : "lightgreen"}`, fontWeight: "500" }} className="myBtn btn mx-2">Delete</button>} */}
                                    {/* <button type="submit" className="btn btn-dark mx-2">Restore</button> */}
                                    {/* <button ref={closeBtn} type="button" className="btn btn-dark" data-bs-dismiss="modal">Close</button> */}
                                </div>
                                {/* <small>Edited {deletedNote.deletedDate.getHours() + ":" + ((deletedNote.deletedDate.getMinutes()<10)?"0"+deletedNote.deletedDate.getMinutes():deletedNote.deletedDate.getMinutes())}</small> */}
                                <small>Note In Trash &bull; Edited {(currentDate.getFullYear() > wantToUpdate.editDate.getFullYear()) ? Months[wantToUpdate.editDate.getMonth()] + " " + wantToUpdate.editDate.getFullYear() : (currentDate.getMonth() > wantToUpdate.editDate.getMonth()) ? wantToUpdate.editDate.getDate() + " " + Months[wantToUpdate.editDate.getMonth()] : (currentDate.getDate() > wantToUpdate.editDate.getDate()) ? wantToUpdate.editDate.getDate() + " " + Months[wantToUpdate.editDate.getMonth()] : ((wantToUpdate.editDate.getHours() > 12) ? (wantToUpdate.editDate.getHours() - 12) : wantToUpdate.editDate.getHours()) + ":" + ((wantToUpdate.editDate.getMinutes() < 10) ? "0" + wantToUpdate.editDate.getMinutes() : wantToUpdate.editDate.getMinutes()) + " " + ((wantToUpdate.editDate.getHours() > 11) ? "PM" : "AM")}</small>
                            </div>
                    }
                </Modal.Footer>

            </Modal>

            {/* juno modal no code che. */}
            {/* <!-- Modal --> */}
            {/* <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg modal-fullscreen-sm-down"> */}
            {/* <div className="modal-content">
                        <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                        ...
                        </div>
                        <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div> */}
            {/* <div className="modal-content">
                        {x.matches &&
                            <div className="modal-header">
                                <div className='d-flex justify-content-between'>
                                    <i ref={backBtn} style={{fontSize:"17px"}} data-bs-dismiss="modal" className="fa-solid fa-arrow-left"></i>
                                    <div style={{ marginLeft: "196%" }} className='d-flex justify-content-start'>
                                        <i style={{ cursor: "pointer", fontSize: "16px", margin: "0 10px" }} id="copy" title="Copy Note" className="fa-regular fa-clone" onClick={(e) => { copyNote(wantToUpdate); e.stopPropagation(); }} ></i>
                                        {
                                            (onlyNameOfTab === "trash")
                                                ?
                                                <i style={{ cursor: "pointer", fontSize: "16px", margin: "0 10px" }} id="delete" title="Delete Forever" className="fa fa-trash-o" onClick={(e) => { deleteClickedNote(wantToUpdate.editNoteId); e.stopPropagation(); }} ></i>
                                                :
                                                <i style={{ cursor: "pointer", fontSize: "16px", margin: "0 10px" }} id="delete" title="Delete" className="fa fa-trash-o" onClick={(e) => { deleteNote(wantToUpdate.editNoteId); e.stopPropagation(); }} ></i>
                                        }

                                        {
                                            (onlyNameOfTab === "archive")
                                                ?
                                                <svg style={{ margin: "-3px 10px" }} onClick={(e) => { unArchiveNote(wantToUpdate.editNoteId); e.stopPropagation(); }} fill="black" height="22px" viewBox="0 0 24 24" width="22px" xmlns="http://www.w3.org/2000/svg"><path d="m21.706 5.292-2.999-2.999A.996.996 0 0 0 18 2H6a.996.996 0 0 0-.707.293L2.294 5.292A.994.994 0 0 0 2 6v13c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6a.994.994 0 0 0-.294-.708zM6.414 4h11.172l1 1H5.414l1-1zM4 19V7h16l.002 12H4z"/><path d="M7 14h3v3h4v-3h3l-5-5z"/></svg>
                                                :
                                                (onlyNameOfTab === "trash")
                                                    ?
                                                    <i style={{ cursor: "pointer", fontSize: "16px", margin: "0 10px" }} id="restore" title="Restore Note" className="fa-solid fa-trash-arrow-up" onClick={(e) => { restoreNote(wantToUpdate.editNoteId); e.stopPropagation(); }}></i>
                                                    :
                                                    (wantToUpdate.editLabel !== "false" && wantToUpdate.editArchive === true)
                                                        ?
                                                        <svg style={{ margin: "-3px 10px" }} onClick={(e) => { unArchiveNote(wantToUpdate.editNoteId); e.stopPropagation(); }} fill="black" height="22px" viewBox="0 0 24 24" width="22px" xmlns="http://www.w3.org/2000/svg"><path d="m21.706 5.292-2.999-2.999A.996.996 0 0 0 18 2H6a.996.996 0 0 0-.707.293L2.294 5.292A.994.994 0 0 0 2 6v13c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6a.994.994 0 0 0-.294-.708zM6.414 4h11.172l1 1H5.414l1-1zM4 19V7h16l.002 12H4z"/><path d="M7 14h3v3h4v-3h3l-5-5z"/></svg>
                                                        :
                                                        <svg style={{ margin: "-3px 10px" }} onClick={(e) => { archiveNote(wantToUpdate.editNoteId); e.stopPropagation(); }} fill="black" height="22px" viewBox="0 0 24 24" width="22px" xmlns="http://www.w3.org/2000/svg"><path d="m21.706 5.292-2.999-2.999A.996.996 0 0 0 18 2H6a.996.996 0 0 0-.707.293L2.294 5.292A.994.994 0 0 0 2 6v13c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6a.994.994 0 0 0-.294-.708zM6.414 4h11.172l1 1H5.414l1-1zM4 19V7h16l.002 12H4z" /><path d="M14 9h-4v3H7l5 5 5-5h-3z" /></svg>
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                        <div className="modal-body">
                            <form>
                                <div className="mt-1">
                                    {
                                        onlyNameOfTab !== "trash" ?
                                            <input type="text" style={{ fontWeight: "bold" }} className="form-control1" value={wantToUpdate.editTitle} id="editTitle" name="editTitle" onInput={assignNewValue} />
                                            :
                                            <input type="text" style={{ fontWeight: "bold" }} className="form-control1" value={deletedNote.deletedTitle} id="deletedTitle" name="deletedTitle" readOnly onClick={displayAlert} />
                                    }
                                </div>
                                <hr />
                                <div>
                                    {
                                        onlyNameOfTab !== "trash" ?
                                            <input type="text" className="form-control1" value={wantToUpdate.editTag} placeholder={(wantToUpdate.editTag) ? " " : "Tag"} id="editTag" name="editTag" onInput={assignNewValue} />
                                            :
                                            <input type="text" className="form-control1" value={deletedNote.deletedTag} placeholder={(deletedNote.deletedTag) ? " " : "No Tag is given"} id="deletedTag" name="deletedTag" readOnly onClick={displayAlert} />
                                    }
                                </div>
                                <hr />
                                <div className="mx-1 mb-2">
                                    {
                                        onlyNameOfTab !== "trash" ?
                                            <textarea type="text" className="textControl" value={wantToUpdate.editDescription} id="editDescription" name="editDescription" onChange={assignNewValue}></textarea>
                                            :
                                            <textarea type="text" style={{ height: "260px" }} className="textControl" value={deletedNote.deletedDescription} id="deletedDescription" name="deletedDescription" readOnly onClick={displayAlert}></textarea>
                                    } */}
            {/* <ToastContainer toastStyle={{backgroundColor:"black",color:"white"}} icon={false} hideProgressBar closeButton={false} /> */}
            {/* </div> */}
            {/* <button type="submit" className="btn btn-dark mx-2 mb-2">Update</button> */}
            {/* </form>
                        </div> */}
            {/* {
                            onlyNameOfTab !== "trash" ?
                                <div className="modal-footer d-flex justify-content-between">
                                    <div className=" d-flex justify-content-around">
                                        <button type="submit" className="btn btn-dark mx-2" onClick={handleUpdate}>Update</button>
                                        {(!x.matches) && <button ref={closeBtn} type="button" className="btn btn-dark" data-bs-dismiss="modal">Close</button>}
                                    </div> */}
            {/* <small>Edited {wantToUpdate.editDate.getHours() + ":" + ((wantToUpdate.editDate.getMinutes()<10)?"0"+wantToUpdate.editDate.getMinutes():wantToUpdate.editDate.getMinutes())}</small> */}
            {/* <small>Edited {(currentDate.getFullYear() > wantToUpdate.editDate.getFullYear()) ? Months[wantToUpdate.editDate.getMonth()] + " " + wantToUpdate.editDate.getFullYear() : (currentDate.getMonth() > wantToUpdate.editDate.getMonth()) ? wantToUpdate.editDate.getDate() + " " + Months[wantToUpdate.editDate.getMonth()] : (currentDate.getDate() > wantToUpdate.editDate.getDate()) ? wantToUpdate.editDate.getDate() + " " + Months[wantToUpdate.editDate.getMonth()] : ((wantToUpdate.editDate.getHours() > 12) ? (wantToUpdate.editDate.getHours() - 12) : wantToUpdate.editDate.getHours()) + ":" + ((wantToUpdate.editDate.getMinutes() < 10) ? "0" + wantToUpdate.editDate.getMinutes() : wantToUpdate.editDate.getMinutes()) + " " + ((wantToUpdate.editDate.getHours() > 11) ? "PM" : "AM")}</small>
                                </div>
                                :
                                <div className="modal-footer d-flex justify-content-between">
                                    <div className=" d-flex justify-content-around">
                                        {!x.matches && <button type="submit" className="btn btn-dark mx-2">Delete</button>} */}
            {/* <button type="submit" className="btn btn-dark mx-2">Restore</button> */}
            {/* <button ref={closeBtn} type="button" className="btn btn-dark" data-bs-dismiss="modal">Close</button> */}
            {/* </div> */}
            {/* <small>Edited {deletedNote.deletedDate.getHours() + ":" + ((deletedNote.deletedDate.getMinutes()<10)?"0"+deletedNote.deletedDate.getMinutes():deletedNote.deletedDate.getMinutes())}</small> */}
            {/* <small>Note In Trash &bull; Edited {(currentDate.getFullYear() > wantToUpdate.editDate.getFullYear()) ? Months[wantToUpdate.editDate.getMonth()] + " " + wantToUpdate.editDate.getFullYear() : (currentDate.getMonth() > wantToUpdate.editDate.getMonth()) ? wantToUpdate.editDate.getDate() + " " + Months[wantToUpdate.editDate.getMonth()] : (currentDate.getDate() > wantToUpdate.editDate.getDate()) ? wantToUpdate.editDate.getDate() + " " + Months[wantToUpdate.editDate.getMonth()] : ((wantToUpdate.editDate.getHours() > 12) ? (wantToUpdate.editDate.getHours() - 12) : wantToUpdate.editDate.getHours()) + ":" + ((wantToUpdate.editDate.getMinutes() < 10) ? "0" + wantToUpdate.editDate.getMinutes() : wantToUpdate.editDate.getMinutes()) + " " + ((wantToUpdate.editDate.getHours() > 11) ? "PM" : "AM")}</small>
                                </div>
                        }
                    </div>
                </div>
            </div> */}
            {/* juno modal no code pati gayo. */}

            <ToastContainer enableMultiContainer containerId={"outsideHome"} pauseOnFocusLoss={false} limit={1} toastStyle={{ backgroundColor: "black", color: "white" }} icon={false} hideProgressBar />
            <div className={`${(context.mode === "white") ? "lightTheme" : "darkTheme"} ${(context.navbarWidth === "unclick") ? "marginForNavbarBefore" : "marginForNavbar"}`}>
                <div className={`blankDiv1 ${(context.mode === "white") ? "lightTheme" : "darkTheme"}`}>

                </div>
                <div className={`${(location.pathname === "/archive" || location.pathname === "/trash") ? "afterNavbarWithoutTakeNote" : (context.mode === "white") ? "container1" : "containerBlack"}`}>
                    {/* <h2 className='text-center mb-4' >Your Notes</h2> */}
                    {/* {console.log(onlyNameOfTab)} */}
                    {(localStorage.getItem("token") && (context.note.length !== 0 || context.labelArchiveNotes.length !== 0))
                        ?
                        (onlyNameOfTab === "Home" || onlyNameOfTab === "trash" || onlyNameOfTab === "about" || onlyNameOfTab === "archive")
                            ?
                            <Masonry
                                breakpointCols={breakpointColumnsObj}
                                className="my-masonry-grid"
                                columnClassName="my-masonry-grid_column"
                            >
                                {
                                    context.note.map((storedNote) => {
                                        return <div className='getDiv' key={storedNote._id} style={{ cursor: "default" }} onClick={(onlyNameOfTab !== "trash") ? () => { updateNote(storedNote) } : () => { displayNote(storedNote) }} >
                                            <Note
                                                notes={storedNote}
                                                deleteNote={deleteNote}
                                                archiveNote={archiveNote}
                                                unArchiveNote={unArchiveNote}
                                                foreverDeleteNote={deleteClickedNote}
                                                restoreNote={restoreNote}
                                                copyNote={copyNote}
                                                collaborator={collaborator}
                                                selectColor={selectColor}
                                                clickLabelModalBtn={clickLabelModalBtn}
                                                bgcolor={(storedNote.background && storedNote.background !== "default") ? colors.get(storedNote.background) : ""}
                                            />
                                            {/* <Note notes={a} updateNote={updateNote}  */}
                                        </div>
                                    })
                                }
                            </Masonry>
                            :
                            //Display content inside label
                            <div>
                                <Masonry
                                    breakpointCols={breakpointColumnsObj}
                                    className="my-masonry-grid"
                                    columnClassName="my-masonry-grid_column"
                                >
                                    {
                                        context.note.map((storedNote) => {
                                            return <div key={storedNote._id} style={{ cursor: "default" }} onClick={(onlyNameOfTab !== "trash") ? () => { updateNote(storedNote) } : () => { displayNote(storedNote) }} >
                                                <Note
                                                    label={onlyNameOfTab}
                                                    notes={storedNote}
                                                    deleteNote={deleteNote}
                                                    archiveNote={archiveNote}
                                                    unArchiveNote={unArchiveNote}
                                                    foreverDeleteNote={deleteClickedNote}
                                                    restoreNote={restoreNote}
                                                    copyNote={copyNote}
                                                    collaborator={collaborator}
                                                    selectColor={selectColor}
                                                    clickLabelModalBtn={clickLabelModalBtn}
                                                    bgcolor={(storedNote.background && storedNote.background !== "default") ? colors.get(storedNote.background) : ""}
                                                />
                                            </div>
                                        })
                                    }
                                </Masonry>
                                <div className='mx-4'>
                                    <p style={{ fontWeight: "bold", color: (context.mode === "white") ? "black" : "white" }}>Archive</p>
                                </div>
                                <Masonry
                                    breakpointCols={breakpointColumnsObj}
                                    className="my-masonry-grid"
                                    columnClassName="my-masonry-grid_column"
                                >
                                    {
                                        context.labelArchiveNotes.map((storedNote) => {
                                            return <div key={storedNote._id} style={{ cursor: "default" }} onClick={(onlyNameOfTab !== "trash") ? () => { updateNote(storedNote) } : () => { displayNote(storedNote) }} >
                                                <Note
                                                    labelArchive={true}
                                                    label={onlyNameOfTab}
                                                    notes={storedNote}
                                                    deleteNote={deleteNote}
                                                    archiveNote={archiveNote}
                                                    unArchiveNote={unArchiveNote}
                                                    foreverDeleteNote={deleteClickedNote}
                                                    restoreNote={restoreNote}
                                                    copyNote={copyNote}
                                                    collaborator={collaborator}
                                                    clickLabelModalBtn={clickLabelModalBtn}
                                                    selectColor={selectColor}
                                                    bgcolor={(storedNote.background && storedNote.background !== "default") ? colors.get(storedNote.background) : ""}
                                                />
                                            </div>
                                        })
                                    }
                                </Masonry>
                            </div>
                        :
                        (location.pathname === "/archive") ?
                            <div className='text-center centerHome'>
                                <svg fill="rgb(136, 136, 136,0.42)" height="250px" viewBox="0 0 24 24" width="250px" xmlns="http://www.w3.org/2000/svg"><path d="m21.706 5.292-2.999-2.999A.996.996 0 0 0 18 2H6a.996.996 0 0 0-.707.293L2.294 5.292A.994.994 0 0 0 2 6v13c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6a.994.994 0 0 0-.294-.708zM6.414 4h11.172l1 1H5.414l1-1zM4 19V7h16l.002 12H4z" /><path d="M14 9h-4v3H7l5 5 5-5h-3z" /></svg>
                                <h3 style={{ color: "rgb(136, 136, 136,0.90)" }}>Your archived notes are appear here</h3>
                            </div>
                            :
                            (location.pathname === "/trash") ?
                                <div className='text-center centerDelete'>
                                    <i style={{ color: "rgb(136, 136, 136,0.42)", fontSize: "200px" }} className="fa fa-trash-o"></i>
                                    <h3 style={{ color: "rgb(136, 136, 136,0.90)", paddingTop: "20px" }}>No notes in trash</h3>
                                </div>
                                :
                                (location.pathname === "/") ?
                                    <div className='text-center centerHome'>
                                        <svg enableBackground="new 0 0 64 64" height="250px" version="1.1" viewBox="0 0 64 64" width="250px" xmlns="http://www.w3.org/2000/svg"><g id="important_note"><g><polygon fill="rgb(136, 136, 136,0.42)" points="15,27 28.586,27 29.586,26 15,26   " /><polygon fill="rgb(136, 136, 136,0.42)" points="44.586,11 15,11 15,12 43.586,12   " /><polygon fill="rgb(136, 136, 136,0.42)" points="39.586,16 15,16 15,17 38.586,17   " /><polygon fill="rgb(136, 136, 136,0.42)" points="33.713,21.873 34.586,21 15,21 15,22 33.586,22   " /><path d="M57.172,18.173l-6.344-6.344c-0.777-0.778-1.803-1.167-2.828-1.167s-2.051,0.389-2.828,1.167L44,13.001    L32.228,24.773L20,37.001l-2,2c0,0,1.958,5.042-3,10l0.5,0.5l-2,1.999C11.567,53.434,11.791,55,14,55h3.001    c0.552,0,1.315-0.316,1.706-0.707l0.793-0.792l0.5,0.5c2.77-2.77,5.566-3.381,7.495-3.381c1.523,0,2.505,0.381,2.505,0.381l2-2    l12.505-12.505L52,29.001V58H10V6h42v5.587l1,1V5H9v54h44V28.001l3-3l1.172-1.172C58.728,22.273,58.728,19.729,57.172,18.173z     M18,53.586C17.799,53.787,17.285,54,17.001,54H14c-0.632,0-0.807-0.158-0.812-0.158c-0.029-0.092,0.06-0.675,1.019-1.634l2-2    l2.586,2.586L18,53.586z M29.713,49.874c-0.5-0.122-1.264-0.254-2.218-0.254c-1.9,0-4.676,0.539-7.472,2.989l-3.631-3.631    c3.608-4.109,3.114-8.147,2.735-9.69L20,38.415l10.586,10.586L29.713,49.874z M31.293,48.294L20.707,37.708L44,14.415    l10.586,10.586L31.293,48.294z M56.465,23.122l-1.172,1.172L44.707,13.708l1.172-1.172c0.563-0.563,1.316-0.874,2.121-0.874    s1.558,0.311,2.121,0.874l6.344,6.344C57.635,20.05,57.635,21.952,56.465,23.122z" fill="rgb(136, 136, 136,0.42)" /></g><rect fill="rgb(136, 136, 136,0.42)" height="30.552" transform="matrix(0.7071 0.7071 -0.7071 0.7071 36.6311 -18.9567)" width="1" x="40.698" y="19.463" /></g></svg>
                                        <h3 style={{ color: "rgb(136, 136, 136,0.90)" }}>Your notes are appear here</h3>
                                    </div>
                                    :
                                    <div className='text-center centerHome'>
                                        {/* <svg enableBackground="new 0 0 32 32" height="250px" version="1.1" viewBox="0 0 32 32" width="250px" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="M31.697,15.287  c-0.011-0.011-6.947-6.993-6.947-6.993c-0.203-0.203-0.47-0.298-0.735-0.291c-0.008,0-0.015-0.005-0.023-0.005h-23  c-0.88,0-1.32,1.109-0.705,1.727l6.242,6.295l-6.169,6.222C-0.305,22.859-0.009,24,1.203,23.998h22.78  c0.278,0.018,0.561-0.07,0.774-0.284l6.94-6.999C32.09,16.321,32.09,15.681,31.697,15.287z M23.626,21.991L3.439,21.997l5.21-5.254  c0.199-0.2,0.295-0.462,0.293-0.724c0.003-0.262-0.094-0.524-0.293-0.724L3.396,9.998h20.204l5.959,6.01L23.626,21.991z" fill="rgb(136, 136, 136,0.42)" fillRule="evenodd" id="Vintage_Luxury_Arrow_Right" /><g /><g /><g /><g /><g /><g /></svg> */}
                                        <svg width="250" height="250" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" id="IconChangeColor"> <path d="M3 17.4V6.6C3 6.26863 3.26863 6 3.6 6H16.6789C16.8795 6 17.0668 6.10026 17.1781 6.26718L20.7781 11.6672C20.9125 11.8687 20.9125 12.1313 20.7781 12.3328L17.1781 17.7328C17.0668 17.8997 16.8795 18 16.6789 18H3.6C3.26863 18 3 17.7314 3 17.4Z" stroke="rgb(136, 136, 136,0.42)" strokeWidth="2" id="mainIconPathAttribute"></path> </svg>
                                        <h3 style={{ color: "rgb(136, 136, 136,0.90)" }}>No notes with this label yet</h3>
                                    </div>
                    }
                </div>
            </div>
        </>
    )
}
