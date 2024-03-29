const noteModel = require("../models/noteModel");
const { validationResult } = require('express-validator');
// const aws = require('aws-sdk');
const aws = require("@aws-sdk/client-s3");
const REGION = "ap-south-1";
const s3Client = new aws.S3Client({ region: REGION });
const path = require("path");
const fs = require("fs");
const S3 = require("aws-sdk/clients/s3");



exports.readNotes = async (req, res) => {
    try {
        let fetch = req.query.fetch;
        let archiveStatus, deleteStatus, labelStatus;
        if (fetch == "archive") {
            archiveStatus = true;
            deleteStatus = false;
            labelStatus = "false"
        }
        else if (fetch == "Home") {
            archiveStatus = false;
            deleteStatus = false;
            // labelStatus = "false";
        }
        else if (fetch == "trash") {
            archiveStatus = false;
            deleteStatus = true;
        }
        else {
            archiveStatus = false;
            deleteStatus = false;
            labelStatus = fetch;
        }
        console.log(fetch + " " + archiveStatus + " " + deleteStatus);
        if (fetch === "trash") {
            const result = await noteModel.Note.find({ userID: req.userID, deleted: true }).sort({ restoreDate: -1 });
            res.json(result);
        }
        else if (fetch == "archive") {
            const result = await noteModel.Note.find({ $or:[{userID: req.userID},{collaborators:req.email}], archive: archiveStatus, deleted: deleteStatus }).sort({ restoreDate: -1 });
            res.json(result);
        }
        else if(fetch == "Home"){
            const result = await noteModel.Note.find({ $or:[{userID: req.userID},{collaborators:req.email}], archive: archiveStatus, deleted: deleteStatus}).sort({ restoreDate: -1 });
            res.json(result);
        }
        else {
            const result = await noteModel.Note.find({ $or:[{userID: req.userID},{collaborators:req.email}], archive: archiveStatus, deleted: deleteStatus, 'label.labelName' : labelStatus, 'label.userEmail': req.email }).sort({ restoreDate: -1 });
            res.json(result);
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Some error occure.");
    }
}

//read archive notes of label
exports.readLabelArchiveNotes = async (req, res) => {
    try {
        let fetch = req.query.fetch;
        let archiveStatus, deleteStatus, labelStatus;
        archiveStatus = true;
        deleteStatus = false;
        labelStatus = fetch;
        console.log(fetch + " " + archiveStatus + " " + deleteStatus);
        const result = await noteModel.Note.find({ userID: req.userID, archive: archiveStatus, deleted: deleteStatus, 'label.labelName' : labelStatus, 'label.userEmail': req.email}).sort({ restoreDate: -1 });
        res.json(result);
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Some error occure.");
    }
}

//function for store notes in database
exports.createNotes = async (req, res) => {

    //Validation error checking
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let newErr = errors.array();
        // console.log(newErr);
        // console.log(newErr[0].msg)
        return res.status(400).json({ errors: newErr[0].msg });
    }

    try {
        //storing the note in database
        userNote = req.body;
        userNote.userID = req.userID;
        const doc = new noteModel.Note(userNote);
        const result = await doc.save();
        res.json(result);
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Some error occure.");
    }
}

//update note
exports.updateNotes = async (req, res) => {
    try {
        const note = await noteModel.Note.findById(req.params.id);
        //if note not found then do not allow user to go further
        if (!note)
            return res.status(404).send("Note not found");

        //if user is not logged in then do not permit user to update note
        // if (result.userID.toString() !== req.userID)
        //     return res.status(401).send("Not allowed to update.");

        // Check if the collaborator exists in the collaborators array
        if(note.collaborators.length!==0)
        {
            const collaboratorIndex = note.collaborators.indexOf(req.email);
            if(collaboratorIndex===-1)
                return res.status(400).send("Not alowed to update.")
        }

        data = req.body;
        // const updateData =await noteModel.Note.updateOne({_id:req.params.id},data,{new:true});
        const updateData = await noteModel.Note.findByIdAndUpdate(req.params.id, { $set: data }, { new: true });
        res.json(updateData);
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Some error occure.");
    }
}

//update note collaborators
exports.updateNoteCollaborators = async(req,res) => {
    try{

        const note = await noteModel.Note.findById(req.params.id);
        //if note not found then do not allow user to go further
        if(!note)
            return res.status(404).send("Note not found");

        // if user is not logged in then do not permit user to update note
        // if(note.userID.toString() !== req.userID)
        //     return res.status(401).send("Not alowed to update.");        
                
        // Check if the collaborator exists in the collaborators array
        const collaboratorIndex = note.collaborators.indexOf(req.email);
        if(collaboratorIndex===-1)
            return res.status(400).send("Not alowed to update.")
            
        const collaboratorEmail = req.body.email;
        // Check if the collaborator's email already exists in the collaborators array
        const isCollaboratorExist = note.collaborators.includes(collaboratorEmail);

        if (isCollaboratorExist) {
           return res.status(400).send('Collaborator already exists.');
        }

        note.collaborators.push(collaboratorEmail);

        const result = await note.save();
        res.json(result);
    }   
    catch(err)
    {
        console.log(err);
        res.status(500).send("Some error occure.");
    }
}

exports.removeNoteCollaborators = async(req,res) => {
    try{

        const note = await noteModel.Note.findById(req.params.id);
        //if note not found then do not allow user to go further
        if(!note)
            return res.status(404).send("Note not found");

        // if(note.userID.toString() !== req.userID)
        //     return res.status(401).send("Not allowed to update.");
            
        const collaboratorEmail = req.body.email;
        // Check if the collaborator exists in the collaborators array
        const collaboratorIndex = note.collaborators.indexOf(collaboratorEmail);

        if(collaboratorIndex===-1)
            return res.status(400).send("Collaborator not found.")

        note.collaborators.splice(collaboratorIndex,1);

        const result = await note.save();
        res.json(result);
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send("Some error occure.")
    }
}

//delete note
exports.deleteNote = async (req, res) => {
    try {
        const result = await noteModel.Note.findById(req.params.id);
        //if note not found then do not allow user to go further
        if (!result)
            return res.status(404).send("Note not found.");

        //if user is not logged in then do not permit user to delete note
        if (result.userID.toString() !== req.userID)
            return res.status(401).send("Not allowed to delete.");

        const deleteData = await noteModel.Note.findByIdAndDelete(req.params.id)
        res.json(deleteData);
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Some error occure.");
    }
}

exports.updateManyNotes = async (req, res) => {
    try {
        const dataOfUpdate = req.body.data;
        const oldLabel = req.body.oldLabel;
        const newLabel = req.body.data.label;
        const operation = req.body.operation;
        const filter = req.body.oldLabel;

        if(operation==="Update")
        {
            const updateLabels = await noteModel.Note.updateMany(
                {'label.labelName' : oldLabel, 'label.userEmail': req.email},
                {$set:{'label.$.labelName' : newLabel}}
            )
            res.json(updateLabels);
        }
        else
        {
            let email=req.email;
            let userID=req.userID;
            const deleteLabels = await noteModel.Note.updateMany(
                {'label.labelName' : oldLabel, 'label.userEmail': req.email},
                { $pull: { label: { labelName:oldLabel, userEmail:req.email } } }
            )

            res.json(deleteLabels);
        }

        // const updateLabel = await noteModel.Note.updateMany({ label: filter }, { $set: dataOfUpdate });
        // res.json(updateLabels);
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Some error occure.");
    }
}

const uploadInBucket = (file) => {
    const s3 = new S3({
        region: "ap-south-1",
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    })

    const fileStream = fs.createReadStream(file.path)

    const uploadParams = {
        Bucket: process.env.S3_BUCKET,
        Body: fileStream,
        Key: file.filename
    }

    return s3.upload(uploadParams).promise();
}

exports.uploadImage = async (req, res) => {
    const file = req.file
    console.log(file);
    uploadInBucket(file)
        .then((result) => {
            console.log(result);
            res.send(result);
        }).catch((err) => {
            res.send(err);
        })
}
