import { Router } from 'express';
import UserController from './controller.js';

const router = Router();

router.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

router.get('/all', UserController.all);

router.post('/login', UserController.login);

router.post('/new', UserController.register);

router.post('/find/:id', UserController.find);

router.patch('/modify/:id', UserController.modify);

router.delete('/delete/:id', UserController.delete);


export default router;
