const mongoose = require("mongoose")

const noteSchema = new mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    tag:{
        type:String,
        default:"Genral"
    },
    date:{
        type:Date,
        default:Date.now
    },
    deleted:{
        type:Boolean,
        default:false
    },
    restoreDate:{
        type:Date,
        default:Date.now  
    },
    archive:{
        type:Boolean,
        default:false
    },
    label:{
        type:[{
            labelName:{
                type:String,                
            },
            userEmail:{
                type:String,                
            }
        }],        
    },
    background:{
        type:String,
        default:"default"
    },
    collaborators:{
        type:[String],
        default:[]
    }
});

exports.Note = new mongoose.model("Note",noteSchema);