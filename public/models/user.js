import mongoose from "mongoose";

const userDetails = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        default: ""
    },
    email: {
        type: String,
        required: false,
        default: ""
    },
    isEmailVerify: {
        type: Number,
        required: false,
        default: 0
    },
    password: {
        type: String,
        required: false,
        default: ""
    },
    gender: {
        type: String,
        required: false,
        default: ""
    },
    age: {
        type: Number,
        required: false,
        default: ""
    },
    bodyType: {
        type: String,
        required: false,
        default: ""
    },
    image: {
        type: Array,
        required: false,
        default: []
    },
    country: {
        type: String,
        required: false,
        default: ""
    },
    city: {
        type: Array,
        required: false,
        default: []
    },
    aboutUser: {
        type: String,
        required: false,
        default: ""
    },
    language: {
        type: Array,
        required: false,
        default: []
    },
    favourite: {
        type: Array,
        required: false,
        default: []
    },
    visitors: {
        type: Array,
        required: false,
        default: []
    },
    isDeleted: {
        type: Number,
        required: false,
        default: 0
    },
    onBoarding: {
        type: Number,
        required: false,
        default: 0
    },
    profileImage: {
        type: String,
        required: false,
        default: ""
    },
    meta: {
        type: String,
        required: false,
        default: ""
    },
    role: {
        type: String,
        required: true,  // [User,Admin]
        default: "user"
    },
    device: {
        type: Number,
        required: false,
        default: 0     // [Web = 0, App = 1]
    },
    isGoogleLogin: {
        type: Number,
        required: false,
        default: 0
    },
    isActive: {
        type: Number,
        required: false,
        default: 0
    },
    isBlock: {
        type: Number,
        required: false,
        default: 0
    }
},
    {
        timestamps: true
    }
)
const User = new mongoose.model("User", userDetails)
export default User;