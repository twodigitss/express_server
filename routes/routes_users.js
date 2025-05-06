import { Router } from 'express';
import { ObjectId } from 'mongodb';
const router = Router();

//schemas
import User, { Score } from '../schemas/schema_users.js';
import json_struct from '../schemas/returnStruct.js';

//middleware que agrega el header a cada ruta
router.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

router.get('/user/all', async(_req, res) => {
  try {
    const users_found = await User.find({})
    const scores_found = await Score.find({})
    Promise.all([users_found, scores_found])

    const users_plain = users_found.map(user => user.toObject());

    for (let i = 0; i < users_found.length; i++) {
      delete users_plain[i].password //do i really need to have the password?
      for (let j = 0; j < scores_found.length; j++) {
        if (users_plain[i].email == scores_found[j].email) {
          users_plain[i].score = scores_found[j].score
          users_plain[i].role = scores_found[j].role
        }
      }
    }

    return res.send(json_struct({
      data: users_plain
    }));
  } catch (error) {
    return res.status(500).send(`[usr_all] Something wrong at:  ${error}`);
  }
});


router.post('/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    //regresa null si no existe el correo
    const found = await User.findOne({'email': email})

    if (!found || (found.email !== email || found.password !== password)){
        return res.send(null);
    }

    // load other user info
    const scores = await Score.findOne({'email': found.email})

    //to make the thing modifiable
    const user = { ...found.toObject() };
    
    delete user.password;
    user.score = scores.score;
    user.role = scores.role;

    console.log('User:', user);
    
    return res.send(json_struct({
      message: "Logged in!", data: user
    }));

  } catch (error) {
    return res.status(500).send(`[usr_login] Something wrong at:  ${error}`);
  }

});


router.post('/user/new', async (req, res) => {
  try {
    const { email } = req.body;
    const user = new User(req.body);

    const user_scores = new Score({
      email: email , score: 500 
    });

    //lit no regresa nada si no existe el correo
    const found = await User.findOne(
      {'email': email}
    )

    if (found && found.email == email){
      return res.status(403).send('Email already taken, please use another one');
    }

    await user.save()
    await user_scores.save()
    Promise.all([user.save(), user_scores.save()])

    return res.send(json_struct({
      message: "Registered!",
      data: email
    }));

  } catch (error) {
    return res.status(500).send(`[usr_new] Something wrong at:  ${error}`);
  }
});


router.post('/user/find', async (req, res) => {
  // asignarlos a una variable de autenticacion a traves de un hook o algo...
  try {
    const { email } = req.body;
    const found = await User.findOne({'email': email})

    if (!found){
      return res.status(500).send('Non existent user, is this the correct id?');
    }

    const scores = await Score.findOne({'email': email})

    const user = { ...found.toObject() };
    
    delete user.password;
    user.score = scores.score;
    user.role = scores.role;

    return res.send(json_struct({
      data: user, message: "Found!"
    }));
  } catch (error) {
    return res.status(500).send(`[usr_find] Something wrong at:  ${error}`);
  }

});


//NOTE: you should be using the uid as a parameter
router.delete('/user/delete/:id', async (req, res)=>{
  try {
    const objectId = new ObjectId(req.params.id);
    
    const found = await User.findOneAndDelete({ _id: objectId})
    const scr = await Score.deleteOne({ email: found.email})
    Promise.all([scr, found])

    return res.send(json_struct({
      message: "Deleted!",
      data: src.acknowledged
    }));

  } catch (error) {
    return res.status(500).send(`[usr_del] Something wrong at:  ${error}`);
  }
})


router.patch('/user/modify', async (req, res) => {
  try {
    const { query, data } = req.body;
    const { score, role } = data;

    delete data.score;
    delete data.role;

    Object.keys(data).forEach(key => {
      if (!data[key]) delete data[key];
    });

    const scores = await Score.updateOne(
      {email: query}, {$set: {score: score, role: role}}
    )
    const user = await User.updateOne(
      {email: query}, {$set: data}
    )

    Promise.all([scores, user])

    const answer = user.acknowledged;
    return res.send(json_struct({
      message: "Modified!",
      data: answer
    }));
    
  } catch (error) {
    return res.status(500).send(`[usr_mod] Something wrong at:  ${error}`);
  }

});

export default router;
