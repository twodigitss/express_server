import { Router } from 'express';
const router = Router();
import user from '@controllers/user_controller';

router.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

router.get('/user/all', user.all);

router.post('/user/login', user.login);

router.post('/user/new', user.register);

router.post('/user/find/:id', user.find);

router.patch('/user/modify/:id', user.modify);

router.delete('/user/delete/:id', user.delete);


export default router;
