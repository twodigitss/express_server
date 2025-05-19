import { ObjectId } from 'mongodb';
import User from '@schemas/schema_users.js';
import json_struct from '@utils/returnStruct.js';

const user = {
  async all(req, res) {
    try {
      const users_found = await User.find({})
      //to make ALL the users modifiable
      const users_obj = users_found.map(user => user.toObject());

      for (let i = 0; i < users_obj.length; i++) {
        delete users_obj[i].password
      }

      return res.send(json_struct({
        data: users_obj
      }));
    } catch (error) {
      return res.status(500).send(`[usr_all] Something wrong at:  ${error}`);
    }
  },

  async login(req, res){
    try {
      const { email, password } = req.body;
      const found = await User.findOne({'email': email})

      if (!found || found.email !== email){
        //FIX: add the json_struct here and make a more complex response
        return res.status(401).send("User not found");
      }

      const isMatch = await Bun.password.verify(password, found.password);
      if (!isMatch) return res.status(401).send("Passwords does not match");

      //to make the thing modifiable
      const user = { ...found.toObject() };
      delete user.password;

      console.log('Active Session for:', user.email);

      return res.send(json_struct({
        message: "Logged in!", data: user
      }));

    } catch (error) {
      return res.status(500).send(`[usr_login] Something wrong at:  ${error}`);
    }

  },

  async register(req, res){
    try {
      //unprotected password comes here
      const new_user = req.body;
      const { email, password } = new_user;

      Object.keys(new_user).forEach(key => {
        if (!new_user[key]) delete new_user[key];
      });

      //checking non-existent users
      const found = await User.findOne({'email': email})
      if (found && found.email == email){
        //FIX: add the json_struct here
        return res.status(403).send('Email already taken, please use another one');
      }

      //hashed password comes generated
      const hash = await Bun.password.hash(password);
      new_user.password = hash

      //new real object based on scheme
      const user = new User(new_user);
      await user.save()

      return res.send(json_struct({
        message: "Registered!",
        data: email
      }));

    } catch (error) {
      return res.status(500).send(`[usr_new] Something wrong at:  ${error}`);
    }
  },

  async find(req, res){
    try {
      const objectId = new ObjectId(req.params.id);
      const found = await User.findOne({ _id: objectId })

      if (!found){
        //FIX: add the json_struct here
        return res.status(500).send('Non existent user, is this the correct id?');
      }

      const user = { ...found.toObject() };
      delete user.password;

      return res.send(json_struct({
        message: "Found!", data: user, 
      }));

    } catch (error) {
      return res.status(500).send(`[usr_find] Something wrong at:  ${error}`);
    }

  },

  async delete(req, res){
    try {
      const objectId = new ObjectId(req.params.id);
      const found = await User.findOneAndDelete({ _id: objectId })

      return res.send(json_struct({
        message: "Deleted!",
        data: found
      }));

    } catch (error) {
      return res.status(500).send(`[usr_del] Something wrong at:  ${error}`);
    }
  },

  async modify(req, res){
    try {
      const objectId = new ObjectId(req.params.id);
      const { data } = req.body;

      Object.keys(data).forEach(key => {
        if (!data[key]) delete data[key];
      });

      const user = await User.updateOne(
        {_id: objectId}, {$set: data}
      )

      const answer = user.acknowledged;
      return res.send(json_struct({
        message: "Modified!",
        data: answer
      }));

    } catch (error) {
      return res.status(500).send(`[usr_mod] Something wrong at:  ${error}`);
    }

  }

}

export default user;
