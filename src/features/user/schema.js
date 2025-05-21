//=============================================================
// MONGOOSE MONGOOSE MONGOOSE MONGOOSE MONGOOSE MONGOOSE
//=============================================================
//https://www.geeksforgeeks.org/how-to-connect-node-js-to-a-mongodb-database/

import mongoose from 'mongoose';
const collection = 'user_accounts'

const userSchema = new mongoose.Schema({
    name:       { type: String, required: true },
    last_name:  { type: String, required: false },
    email:      { type: String, required: true },
    password:   { type: String, required: true },
    role:       { type: String, required: true, default: "customer" },
    credits:    { type: Number, required: true, default: 100 },
    timestamp:  { type: Date,   required: true, default: Date.now }
  }, { 
    collection: collection
  }
);

const User = mongoose.model("user_model", userSchema);

export default User;
