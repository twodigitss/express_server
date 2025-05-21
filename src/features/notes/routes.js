import { Router } from 'express';
import NoteController from './controller.js';

const router = Router();

router.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

router.get('/all', NoteController.all);

router.post('/new', NoteController.new);

router.post('/find/:id', NoteController.find);

router.patch('/modify/:id', NoteController.modify);

router.delete('/delete/:id', NoteController.delete);


export default router;
