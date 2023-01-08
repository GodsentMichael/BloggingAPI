const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify') 

const Schema = mongoose.Schema

const postModel = new Schema({
    title:{
        type: String,
        required: true,
        unique: true
    },

    description:{
        type: String,
        required: false
    },

    author:{
        type: String,
        required: true,
    },
    //Implementing the one to many mongoose relationship.
    owner:{
        type: Schema.Types.ObjectId,
        ref: "users"
    },

    body:{
        type:String,
        required: true
    },

    state:{
        type: String,   
        enum:['draft', 'published'],
        default: 'draft'
    },
  
    readCount:{
        type: Number,
        default:0
    },
     readTime:{
        type: Number
     },
    tags: [String],
   
     
   
},  {timestamps: true})

// postModel.index({name: 'text', 'profile.something': 'text'});

postModel.pre('validate', function(next){
    if(this.title){
        this.slug = slugify(this.title,{lower:true,strict:true })
    }

    next()
})

module.exports = mongoose.model('Posts', postModel)
