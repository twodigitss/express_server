import { Router } from 'express';
import { ObjectId } from 'mongodb';
const router = Router();

//schemas
import Post from '../schemas/schema_posts.js';
import json_struct from '../schemas/returnStruct.js';

router.post('/docs/insert', async (req, res) => {
  console.log('Body:', req.body);
  const newPost = new Post(req.body);
  try {
    await newPost.save()
    res.setHeader('Content-Type', 'application/json');
    return res.send(json_struct({
      message: 'Data saved successfully',
    }));

  } catch (error) {
    return res.status(500).send(`[ins.coll] Something wrong at:  ${error}`);
  }

});


router.get('/docs/all', async (_req, res)=>{
  try {
    const coll = await Post.find({})
    res.setHeader('Content-Type', 'application/json');
    return res.send(json_struct({
      data: coll,
    }));
  } catch (error) {
    return res.status(500).send(`[fetch.coll] Something wrong at:  ${error}`);
  }

})


router.delete('/docs/delete', async (req, res)=>{
  const objectId = new ObjectId(req.body.key);
  try {
    await Post.deleteOne({ _id: objectId})
    res.setHeader('Content-Type', 'application/json');
    return res.send(json_struct({
      message: 'Data deleted successfully',
    }));
  } catch (error) {
    return res.status(500).send(`[del.coll] Something wrong at:  ${error}`);
  }
})

export default router;
