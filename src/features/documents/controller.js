import { ObjectId } from 'mongodb';
import Post from './schema.js';
import payload from '@utils/returnStruct.js';

const DocumentController = {
  //USED FOR INSERTING GENERIC DOCUMENTS BASED ON SCHEMA
  async insert(req, res) {
    const document = new Post(req.body);
    try {
      await document.save()
      return res.send(payload({
        message: 'Data saved successfully',
      }));
    } catch (error) {
      return res.status(500).send(`[docs/insert] Error at:  ${error}`);
    }
  },

  //USED FOR GATHERING ALL DOCUMENTS
  async all(req, res) {
    try {
      const documents = await Post.find({})
      return res.send(payload({
        data: documents,
      }));
    } catch (error) {
      return res.status(500).send(`[docs/all] Something wrong at:  ${error}`);
    }
  },

  //USED TO DELETE A DOCUMENT BY IT MONGODB UID
  async delete(req, res) {
    const objectId = new ObjectId(req.params.id);
    try {
      await Post.deleteOne({ _id: objectId})
      return res.send(payload({
        message: 'Data deleted successfully',
      }));
    } catch (error) {
      return res.status(500).send(`[docs/delete] Delete method failed because:  ${error}`);
    }
  }
}

export default DocumentController;
