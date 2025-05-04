//=============================================================
// MONGOOSE MONGOOSE MONGOOSE MONGOOSE MONGOOSE MONGOOSE
//=============================================================
//https://www.geeksforgeeks.org/how-to-connect-node-js-to-a-mongodb-database/

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:       { type: String, required: true },
    last_name:  { type: String, required: false },
    email:      { type: String, required: true },
    password:   { type: String, required: true },
    timestamp:  { type: Date,   required: true, default: Date.now }
  }, { 
    collection: 'user_accounts' 
  }
);

//TODO: de verdad necesito esto? se parchear, pero no se si esto ahorre memoria
const scoreSchema = new mongoose.Schema({
  email:      { type: String, required: true, ref: 'user_model', },
  score:      { type: Number, required: true, default: 300 },
  role:       { type: String, required: true, default: 'client'},
  timestamp:  { type: Date,   required: true, default: Date.now }
  }, { 
    collection: 'user_scores' 
});

const User = mongoose.model("user_model", userSchema);
const Score = mongoose.model("user_scores", scoreSchema);

export default User;
export { Score };
