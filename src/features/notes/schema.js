//=============================================================
// MONGOOSE MONGOOSE MONGOOSE MONGOOSE MONGOOSE MONGOOSE
//=============================================================
//https://www.geeksforgeeks.org/how-to-connect-node-js-to-a-mongodb-database/

import mongoose from 'mongoose';
const collection = 'notes_app_web'

const schema = new mongoose.Schema({
  title:        { type: String,   required: false, default: "Untitled" },
  description:  { type: String,   required: false, default: "Description" },
  body:         { type: String,   required: false, default: "Body" },
  favorite:     { type: Boolean,  required: false, default: false},
  tag:          { type: String,   required: false, default: "none" },
  timestamp:    { type: Date,     required: true,  default: Date.now }
  }, { 
    collection: collection
  }
);

const NoteApp = mongoose.model(collection, schema);

export default NoteApp;
