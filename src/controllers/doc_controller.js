import { ObjectId } from 'mongodb';
import Post from '@schemas/schema_posts.js';
import json_struct from '@utils/returnStruct.js';

const document = {
  //USED FOR INSERTING GENERIC DOCUMENTS BASED ON SCHEMA
  async insert(req, res) {
    const document = new Post(req.body);
    try {
      await document.save()
      return res.send(json_struct({
        message: 'Data saved successfully',
      }));
    } catch (error) {
      return res.status(500).send(`[doc_controller] Error at:  ${error}`);
    }
  },

  //USED FOR GATHERING ALL DOCUMENTS
  async all(req, res) {
    try {
      const documents = await Post.find({})
      return res.send(json_struct({
        data: documents,
      }));
    } catch (error) {
      return res.status(500).send(`[fetch.coll] Something wrong at:  ${error}`);
    }
  },

  //USED TO DELETE A DOCUMENT BY IT MONGODB UID
  async delete(req, res) {
    const objectId = new ObjectId(req.params.id);
    try {
      await Post.deleteOne({ _id: objectId})
      return res.send(json_struct({
        message: 'Data deleted successfully',
      }));
    } catch (error) {
      return res.status(500).send(`[doc_controller] Delete method failed because:  ${error}`);
    }
  }
}

export default document;
