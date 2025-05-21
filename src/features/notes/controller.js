import { ObjectId } from 'mongodb';
import NoteApp from './schema.js';
import payload from '@utils/returnStruct.js';

const NoteController = {
  async all(req, res) {
    try {
      const found = await NoteApp.find({})

      return res.send(payload({
        data: found
      }));

    } catch (error) {
      return res.status(500).send(`[/notes/all] Server error: ${error}`);
    }
  },

  async new(req, res){
    try {
      const note = new NoteApp(req.body);
      await note.save()

      return res.send(payload({
        message: "Saved new Note!",
        data: note
      }));

    } catch (error) {
      return res.status(500).send(`[/notes/new] Server error: ${error}`);
    }
  },

  async find(req, res){
    try {
      const objectId = new ObjectId(req.params.id);
      const found = await NoteApp.findOne({ _id: objectId })

      if (!found){
        return res.status(500).send(payload({
          success: false, status: 500,
          message: 'Non existent user, is this the correct id?',
          data: null
        }));
      }

      return res.send(payload({
        message: "Found!", 
        data: found, 
      }));

    } catch (error) {
      return res.status(500).send(`[/notes/find] Server error:  ${error}`);
    }

  },

  async delete(req, res){
    try {
      const objectId = new ObjectId(req.params.id);
      const found = await NoteApp.findOneAndDelete({ _id: objectId })

      if (!found){
        return res.status(500).send(payload({
          success: false, status: 500,
          message: 'No note were found for deletion',
          data: null
        }));
      }

      return res.send(payload({
        message: "Deleted!",
        data: found
      }));

    } catch (error) {
      return res.status(500).send(`[/notes/delete] Server error:  ${error}`);
    }
  },

  async modify(req, res){
    try {
      const objectId = new ObjectId(req.params.id);
      const data = req.body;

      Object.keys(data).forEach(key => {
        if (!data[key]) delete data[key];
      });

      const user = await NoteApp.updateOne(
        {_id: objectId}, {$set: data}
      )

      const answer = user.acknowledged;
      return res.send(payload({
        message: "Modified!",
        data: answer
      }));

    } catch (error) {
      return res.status(500).send(`[/notes/modify] Server error:  ${error}`);
    }

  }

}

export default NoteController;
