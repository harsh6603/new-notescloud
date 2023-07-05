const { validationResult } = require('express-validator');
const userModel = require("../models/userModel");
const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken");
SECRET = process.env.JWT_SECRET;

//To enter new user data in database
exports.createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let newErr = errors.array();
        // console.log(newErr);
        // console.log(newErr[0].msg)
        return res.status(400).json({ success: false, errors: newErr[0].msg });
    }

    try {

        hashPassword = await bcryptjs.hash(req.body.password, 10)

        //new user created
        userModel.User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashPassword,
        })
            .then((user) => {
                const data = {
                    id: user._id,
                    name:user.name,
                    email:user.email
                }
                const result = jwt.sign(data, SECRET);
                const responce = {
                    success: true,
                    token: result,
                    id: user._id,
                    name:user.name,
                    email:user.email
                }
                console.log(result);
                res.json(responce);
            })
    }
    //for database error
    catch (err) {
        console.log(err);
        res.status(500).json({
            success:false,
            errors:"Some error occure."
        });
    }
}

exports.findUserByEmail = (mail) => {
    return userModel.User.find({ email: mail });
}


exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let newErr = errors.array();
        // console.log(newErr);
        // console.log(newErr[0].msg)
        return res.status(400).json({success:false,errors: newErr[0].msg });
    }

    loginData = req.body;
    const result = await userModel.User.find({ email: loginData.email });
    if (result.length == 0) {
        res.status(400).json({
            success:false,
            errors :"Invalid login details."
        });
    }
    else {
        const checkPassword = await bcryptjs.compare(loginData.password, result[0].password);
        if (checkPassword == false)
            res.status(400).json({
                success:false,
                errors :"Invalid login details."
            });
        else {
            const load = {
                id: result[0]._id,
                name:result[0].name,
                email:result[0].email
            }
            const token = jwt.sign(load, SECRET)
            res.json({
                success:true,
                token: token,
                id: result[0]._id,
                name:result[0].name,
                email:result[0].email,
                labels:result[0].labels
            })
        }
    }
}

exports.getUser = async (req, res) => {
    try {
        userID = req.userID;
        const result = await userModel.User.findOne({ _id: userID });
        res.json(result.labels);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success:false,
            errors:"Some error occure."
        });
    }
}

exports.createLabel = async (req, res) => {
    try{
        let newlabelName = req.body.newLabelName;
        //when we want to upadte label at that time old name comes in oldName variable
        //When we want to delete that label at that time "Delete" come in oldName variable
        let oldName = req.body.oldName;
        const user = await userModel.User.findById(req.userID);
        if (user._id.toString() !== req.userID)
            return res.status(401).send("Not allowed to update.");

        if(oldName)
        {
            if(oldName === "Delete")
            {
                //in delete newlabelName is our old label name which store in database so we check for newlabelName wether it exist in user labels or not
                const labelIndex = user.labels.indexOf(newlabelName);
                if(labelIndex===-1)
                    return res.status(400).send("Label not found.")

                user.labels.splice(labelIndex,1);
                
                const result = await user.save();
                // const deleteLabel =await userModel.User.updateMany(
                //     { },
                //     { $pull: { labels: { $in: [ newlabelName ] } } }
                // )
                res.json(result);
            }
            else
            {
                // Check if the old label exists in the labels array
                const labelIndex = user.labels.indexOf(oldName);
                if(labelIndex===-1)
                    return res.status(400).send("Label not found.")

                const updateLabels = user.labels.map((label) => {
                    if(label === oldName)
                        return newlabelName;
                    else    
                        return label;
                })

                user.labels = updateLabels;

                const result = await user.save();
                res.json(result);
                // const updateLabel = await userModel.User.updateMany(
                //     {labels:oldName},
                //     {$set:{"labels.$":newlabelName}}
                // )
                // res.json(updateLabel);
            }
        }
        else
        {
            const addLabel = await userModel.User.findByIdAndUpdate(req.userID, { $push: { labels : newlabelName} }, { new: true });
            res.json(addLabel);
        }
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({
            success:false,
            errors:"Some error occure."
        });
    }
}