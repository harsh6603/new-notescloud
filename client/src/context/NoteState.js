import React from 'react';
import NoteContext from './NoteContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NoteState = (props) => {

    let location = useLocation()

    let navigate = useNavigate();

    const [mode,setMode] = useState("white");

    const [label, setLabel] = useState([]);

    const [navbarWidth, setNavbarWidth] = useState("unclick")

    const [note, setNote] = useState([]);

    const [initialFetchNotes, setInitialFetchNotes] = useState([]);

    const [initialFetchNotesForArchive, setInitialFetchNotesForArchive] = useState([]);

    //store archive notes of label
    const [labelArchiveNotes,setLabelArchiveNotes] = useState([]);

    const [loading,setLoading] = useState(false);

    const changeMode = () => {
        console.log(mode);
        if(mode === "white")
            setMode("dark");
        else
            setMode("white");
    }

    const changeSearchWords = (word) => {
        const find = initialFetchNotes.filter((storedNote) => {
            return (storedNote.title.toUpperCase().indexOf(word.toUpperCase())>=0 || storedNote.description.toUpperCase().indexOf(word.toUpperCase())>=0)?true:false;
        })
        // console.log(find);
        setNote(find);
    }

    const changeSearchWordsForLabelArchive = (word) => {
        const find = initialFetchNotesForArchive.filter((storedNote) => {
            return (storedNote.title.toUpperCase().indexOf(word.toUpperCase())>=0 || storedNote.description.toUpperCase().indexOf(word.toUpperCase())>=0)?true:false;
        })
        // console.log(find);
        setLabelArchiveNotes(find);
    }

    // const [withOutDelete, setWithOutDelete] = useState([]);
    // const [deletedNotes, setDeletedNotes] = useState([]);

    // const findWithOutDelete = (notes) => {
    //     const find = notes.filter((storedNote) => {
    //         return storedNote.deleted === false;
    //     })
    //     setWithOutDelete(find);
    // }

    // const findDeletedNotes = (notes) => {
    //     const find = notes.filter((storedNote) => {
    //         return storedNote.deleted === true;
    //     })
    //     setDeletedNotes(find);
    // }

    const changeNavbarWidth = () => {
        if (navbarWidth === "unclick")
            setNavbarWidth("click");
        else if (navbarWidth === "click")
            setNavbarWidth("unclick");
    }    

    const getNotes = (currentTab) => {
        setLoading(true);
        const url = (process.env.NODE_ENV === "development")?`http://192.168.101.178:5000/api/note/readnote?fetch=${currentTab}` : `/api/note/readnote?fetch=${currentTab}`;
        // const url = `/api/note/readnote`;
        fetch(url, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "token": localStorage.getItem("token")
            }
        }).then((res) => {
            return res.json();
        }).then((d) => {
            let notes = d;
            setNote(notes);
            setInitialFetchNotes(notes);
            setLoading(false);
            // findWithOutDelete(notes);
            // findDeletedNotes(notes);
        })
    }

    const getArchiveNotesOfLabel = (currentTab) => {
        setLoading(true);
        const url = (process.env.NODE_ENV === "development")?`http://192.168.101.178:5000/api/note/readArchiveNote?fetch=${currentTab}`:`/api/note/readArchiveNote?fetch=${currentTab}`;
        // const url = `/api/note/readnote`;
        fetch(url, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "token": localStorage.getItem("token")
            }
        }).then((res) => {
            return res.json();
        }).then((d) => {
            let notes = d;
            setLabelArchiveNotes(notes);
            setInitialFetchNotesForArchive(notes);
            setLoading(false);
            // findWithOutDelete(notes);
            // findDeletedNotes(notes);
        })
    }

    const addNotes = (noteData,currentTab) => {
        console.log(noteData);
        setLoading(true);
        const url = (process.env.NODE_ENV === "development")?"http://192.168.101.178:5000/api/note/createnote" : "/api/note/createnote";
        fetch(url, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "token": localStorage.getItem("token")
            },
            body: JSON.stringify(noteData)
        }).then((res) => {
            return res.json();
        }).then((d) => {
            console.log(d);
            getNotes(currentTab);
        })
    }

    const updateNote = (updatedData, noteId, currentTab) => {
        console.log(updatedData);
        console.log(noteId);
        setLoading(true);
        const url = (process.env.NODE_ENV === "development")?`http://192.168.101.178:5000/api/note/updatenote/${noteId}`:`/api/note/updatenote/${noteId}`;
        fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "token": localStorage.getItem("token")
            },
            body: JSON.stringify(updatedData)
        }).then((res) => {
            return res.json();
        }).then((d) => {
            console.log(d);
            getNotes(currentTab);
            getArchiveNotesOfLabel(currentTab);
        })
    }

    const updateManyNote = (updatedData,oldLabel,operation,currentTab) => {
        setLoading(true);
        console.log(updatedData);
        const updateDataInfo = {
            data:updatedData,
            oldLabel:oldLabel,
            operation:operation
        }
        const url = (process.env.NODE_ENV === "development")?`http://192.168.101.178:5000/api/note/updateManyNote`:`/api/note/updateManyNote`;
        fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "token": localStorage.getItem("token")
            },
            body: JSON.stringify(updateDataInfo)
        }).then((res) => {
            return res.json();
        }).then((d) => {
            console.log(d);
            getNotes(currentTab);
            getArchiveNotesOfLabel(currentTab);
        })
    }

    const deleteNote = (noteId,currentTab) => {
        setLoading(true);
        const url = (process.env.NODE_ENV === "development")?`http://192.168.101.178:5000/api/note/deletenote/${noteId}`:`/api/note/deletenote/${noteId}`;
        fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "token": localStorage.getItem("token")
            }
        }).then((res) => {
            return res.json();
        }).then((d) => {
            console.log(d);
            setLoading(false);
            getNotes(currentTab);
            getArchiveNotesOfLabel(currentTab);
        })
    }

    const addUser = (userData,first,second,third,fourth) => {
        setLoading(true);
        const url = (process.env.NODE_ENV === "development")?"http://192.168.101.178:5000/api/user/signup":"/api/user/signup";
        fetch(url, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData)
        }).then((res) => {
            return res.json();
        }).then((d) => {
            console.log(d);            
            if (d.success) {
                localStorage.setItem('token', d.token);
                localStorage.setItem("userName", d.name);
                localStorage.setItem("userEmail", d.email);
                localStorage.setItem("id", d.id);
                first.value=second.value=third.value=fourth.value="";
                navigate("/");
            }
            else
            {
                toast(d.errors,{
                    position: toast.POSITION.BOTTOM_LEFT
                });
                toast.clearWaitingQueue();
            }
            setLoading(false);
        })
    }

    const loginUser = (loginUserData,first,second) => {
        setLoading(true);
        const url = (process.env.NODE_ENV === "development")?"http://192.168.101.178:5000/api/user/login":"/api/user/login";
        fetch(url, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginUserData)
        }).then((res) => {
            return res.json();
        }).then((d) => {
            console.log(d);
            if(d.success)
            {
                first.value=second.value = "";
                localStorage.setItem("token", d.token);
                localStorage.setItem("userName", d.name);
                localStorage.setItem("userEmail", d.email);
                localStorage.setItem("id", d.id);
                localStorage.setItem("labels",d.labels);
                navigate("/");
            }
            else
            {
                toast(d.errors,{
                    position: toast.POSITION.BOTTOM_LEFT
                });
                toast.clearWaitingQueue();
            }
            setLoading(false);
        })
    }

    const addUserLabel = (labelName,oldName) => {
        setLoading(true);        
        const url = (process.env.NODE_ENV === "development")?"http://192.168.101.178:5000/api/user/createLabel":"/api/user/createLabel";
        const lName = {
            newLabelName: labelName,
            oldName:oldName
        }        
        console.log(lName);
        fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "token": localStorage.getItem("token")
            },
            body: JSON.stringify(lName)
        }).then((res) => {
            return res.json();
        }).then((d) => {
            console.log(d);
            getLabels();
            // console.log(location.pathname+" "+oldName);
            if(location.pathname === `/${oldName}`)
                navigate(`/${labelName}`);         
                
            if(location.pathname === `/label/${labelName.replace(/ /g,'%20')}` && oldName === "Delete")
                navigate(`/`);
        })
    }

    const getLabels = () => {
        setLoading(true);
        const url = (process.env.NODE_ENV === "development")?"http://192.168.101.178:5000/api/user/getuser":"/api/user/getuser";
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "token": localStorage.getItem("token")
            }
        }).then((res) => {
            return res.json();
        }).then((d) => {
            // console.log(d);
            localStorage.setItem("labels",d);
            setLabel(d);
            props.checkUserData();
            setLoading(false);
        })
    }

    //store note collaborators when note clicked
    const [collaborators,setCollaborators] = useState(null);   

    //store selected noteId for colloborator
    const [selectedNoteId,setselectedNoteId] = useState(null);

    //store selected note for colloborator
    const [selectedNote,setSelectedNote] = useState(null);

    const updateNoteCollaborators = (updatedData, currentTab) => {
        setLoading(true);
        console.log(updatedData);
        console.log(selectedNoteId);
        const url = (process.env.NODE_ENV === "development")?`http://192.168.101.178:5000/api/note/updatenote/${selectedNoteId}/collaborators`:`/api/note/updatenote/${selectedNoteId}/collaborators`;
        fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "token": localStorage.getItem("token")
            },
            body: JSON.stringify(updatedData)
        }).then((res) => {
            return res.json();
        }).then((d) => {
            console.log(d);
            setCollaborators(d.collaborators);
            getNotes(currentTab);
            getArchiveNotesOfLabel(currentTab);
        })
    }

    const removeNoteCollaborators = (updatedData, currentTab) => {
        setLoading(true);
        console.log(updatedData);
        console.log(selectedNoteId);
        const url = (process.env.NODE_ENV === "development")?`http://192.168.101.178:5000/api/note/updatenote/${selectedNoteId}/removeCol`:`/api/note/updatenote/${selectedNoteId}/removeCol`;
        fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "token": localStorage.getItem("token")
            },
            body: JSON.stringify(updatedData)
        }).then((res) => {
            return res.json();
        }).then((d) => {
            console.log(d);
            setCollaborators(d.collaborators);
            getNotes(currentTab);
            getArchiveNotesOfLabel(currentTab);
        })
    }

    // const [backgroundColor,setBa]

    const updateColor = (updatedData,currentTab) => {
        setLoading(true);
        const url = (process.env.NODE_ENV === "development")?`http://192.168.101.178:5000/api/note/updatenote/${selectedNoteId}`:`/api/note/updatenote/${selectedNoteId}`;
        console.log(updatedData);
        fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "token": localStorage.getItem("token")
            },
            body: JSON.stringify(updatedData)
        }).then((res) => {
            return res.json();
        }).then((d) => {
            console.log(d);            
            getNotes(currentTab);
            getArchiveNotesOfLabel(currentTab);
        })
    }

    return (
        <NoteContext.Provider value={{ loading, note, collaborators, selectedNote, selectedNoteId, setLoading, setSelectedNote, setselectedNoteId, setCollaborators, addNotes, getNotes, updateNote, updateNoteCollaborators, removeNoteCollaborators, deleteNote, updateColor, label, navbarWidth, changeNavbarWidth, addUser, loginUser, addUserLabel, getLabels, getArchiveNotesOfLabel, labelArchiveNotes, updateManyNote, changeSearchWords, changeSearchWordsForLabelArchive, changeMode, mode}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;