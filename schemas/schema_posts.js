//=============================================================
// MONGOOSE MONGOOSE MONGOOSE MONGOOSE MONGOOSE MONGOOSE
//=============================================================
//https://www.geeksforgeeks.org/how-to-connect-node-js-to-a-mongodb-database/

import mongoose from 'mongoose';
const collection = 'user_posts'

const postSchema = new mongoose.Schema({
    op:       { type: String, required: true },
    message:  { type: String, required: true },
    timestamp:{ type: Date,   required: true, default: Date.now }
  }, { 
    collection: collection
  }
);

const Post = mongoose.model(
  "post_model", postSchema
);

export default Post;
export { postSchema };
