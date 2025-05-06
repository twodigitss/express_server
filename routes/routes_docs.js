import { Router } from 'express';
import { ObjectId } from 'mongodb';
const router = Router();

//schemas
import Post from '../schemas/schema_posts.js';
import json_struct from '../schemas/returnStruct.js';

//middleware que agrega el header a cada ruta
router.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

router.post('/docs/insert', async (req, res) => {
  console.log('Body:', req.body);
  const newPost = new Post(req.body);
  try {
    await newPost.save()
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
    return res.send(json_struct({
      data: coll,
    }));
  } catch (error) {
    return res.status(500).send(`[fetch.coll] Something wrong at:  ${error}`);
  }

})


router.delete('/docs/delete/:id', async (req, res)=>{
  const objectId = new ObjectId(req.params.id);
  try {
    await Post.deleteOne({ _id: objectId})
    return res.send(json_struct({
      message: 'Data deleted successfully',
    }));
  } catch (error) {
    return res.status(500).send(`[del.coll] Something wrong at:  ${error}`);
  }
})

export default router;
