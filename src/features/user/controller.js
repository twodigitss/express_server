import { ObjectId } from 'mongodb';
import User from './schema.js';
import payload from '@utils/returnStruct.js';

const UserController = {
  async all(req, res) {
    try {
      const users_found = await User.find({})
      //to make ALL the users modifiable
      const users_obj = users_found.map(user => user.toObject());

      for (let i = 0; i < users_obj.length; i++) {
        delete users_obj[i].password
      }

      return res.send(payload({
        data: users_obj
      }));

    } catch (error) {
      return res.status(500).send(`[user/all] Server error:  ${error}`);
    }
  },

  async login(req, res){
    try {
      const { email, password } = req.body;
      const found = await User.findOne({'email': email})

      if (!found || found.email !== email){
        return res.status(401).send(payload({
          success: false, status: 401,
          message: 'User not found',
          data: null
        }));
      }

      const isMatch = await Bun.password.verify(password, found.password);

      if (!isMatch) {
        return res.status(401).send(payload({
          success: false, status: 401,
          message: 'Passwords does not match',
          data: null
        }));
      }

      //to make the thing modifiable
      const user = { ...found.toObject() };
      delete user.password;

      console.log('Active Session for:', user.email);

      return res.send(payload({
        message: "Logged in!", data: user
      }));

    } catch (error) {
      return res.status(500).send(`[user/login] Server error:  ${error}`);
    }

  },

  async register(req, res){
    try {
      //unprotected password comes here
      const new_user = req.body;
      const { email, password } = new_user;

      //checking non-existent users
      const found = await User.findOne({'email': email})

      if (found && found.email == email){
        return res.status(403).send(payload({
          success: false, status: 500,
          message: 'Email already taken, please use another one',
          data: null
        }));
      }

      //hashed password comes generated
      const hash = await Bun.password.hash(password);
      new_user.password = hash

      //new real object based on scheme
      const user = new User(new_user);
      await user.save()

      return res.send(payload({
        message: "Registered!",
        data: email
      }));

    } catch (error) {
      return res.status(500).send(`[user/register] Server error:  ${error}`);
    }
  },

  async find(req, res){
    try {
      const objectId = new ObjectId(req.params.id);
      const found = await User.findOne({ _id: objectId })

      if (!found){
        return res.status(500).send(payload({
          success: false, status: 500,
          message: 'Non existent user, is this the correct id?',
          data: null
        }));
      }

      const user = { ...found.toObject() };
      delete user.password;

      return res.send(payload({
        message: "Found!", data: user, 
      }));

    } catch (error) {
      return res.status(500).send(`[user/find] Server error:  ${error}`);
    }

  },

  async delete(req, res){
    try {
      const objectId = new ObjectId(req.params.id);
      //FIX: must be a use case where it does not find the id, but, wouldnt be that odd?
      const found = await User.findOneAndDelete({ _id: objectId })

      return res.send(payload({
        message: "Deleted!",
        data: found
      }));

    } catch (error) {
      return res.status(500).send(`[user/delete] Server error:  ${error}`);
    }
  },

  async modify(req, res){
    try {
      const objectId = new ObjectId(req.params.id);
      const data = req.body;

      Object.keys(data).forEach(key => {
        if (!data[key]) delete data[key];
      });

      const user = await User.updateOne(
        {_id: objectId}, {$set: data}
      )

      const answer = user.acknowledged;
      return res.send(payload({
        message: "Modified!",
        data: answer
      }));

    } catch (error) {
      return res.status(500).send(`[user/modify] Server error:  ${error}`);
    }

  }

}

export default UserController;
