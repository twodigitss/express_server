//=============================================================
// MONGOOSE MONGOOSE MONGOOSE MONGOOSE MONGOOSE MONGOOSE
//=============================================================
//https://www.geeksforgeeks.org/how-to-connect-node-js-to-a-mongodb-database/

import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    op:       { type: String, required: true },
    message:  { type: String, required: true },
    timestamp:  { type: Date,   required: true, default: Date.now }
  }, { 
    collection: 'user_posts' 
  }
);

const Post = mongoose.model(
  "post_model", postSchema
);

export default Post;
export { postSchema };
