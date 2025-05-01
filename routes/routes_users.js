import { Router } from 'express';
const router = Router();

//schemas
import User, { Score } from '../schemas/schema_users.js';


router.get('/user/all', async(_req, res) => {
  try {
    const users_found = await User.find({})
    const scores_found = await Score.find({})
    Promise.all([users_found, scores_found])

    const users_plain = users_found.map(user => user.toObject());

    for (let i = 0; i < users_found.length; i++) {
      // delete users_plain[i].password
      for (let j = 0; j < scores_found.length; j++) {
        if (users_plain[i].email == scores_found[j].email) {
          users_plain[i].score = scores_found[j].score
          users_plain[i].role = scores_found[j].role
        }
      }
    }

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(users_plain);
  } catch (error) {
    return res.status(500).send(`[find_users] Something wrong at:  ${error}`);
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
    
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(user);

  } catch (error) {
    return res.status(500).send(`[login] Something wrong at:  ${error}`);
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

    res.setHeader('Content-Type', 'application/json');
    return res.send('Registration done! Thanks for registering.' );
  } catch (error) {
    return res.status(500).send(`[register] Something wrong at:  ${error}`);
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

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send(`[f_s_u] Something wrong at:  ${error}`);
  }

});


router.delete('/user/delete', async (req, res)=>{
  try {
    const { email } = req.body;
    const scr = await Score.deleteOne({ email: email})
    const usr = await User.deleteOne({ email: email})
    Promise.all([usr, scr])

    res.setHeader('Content-Type', 'application/json');
    const answer = usr.acknowledged;
    return res.status(200).send(answer);

  } catch (error) {
    return res.status(500).send(`[del.coll] Something wrong at:  ${error}`);
  }
})


router.patch('/user/modify', async (req, res) => {
  try {
    const { query, data } = req.body;
    const { name, last_name, email, password, score, role } = data;

    Object.keys(data).forEach(key => {
      if (!data[key]) delete data[key];
    });

    delete data.score;
    delete data.role;

    const scores = await Score.updateOne(
      {email: query}, {$set: {score: score, role: role}}
    )
    const user = await User.updateOne(
      {email: query}, {$set: data}
    )

    Promise.all([scores, user])

    const answer = user.acknowledged;
    return res.status(200).send(answer);
    
  } catch (error) {
    return res.status(500).send(`[modify] Something wrong at:  ${error}`);
  }

});

export default router;
