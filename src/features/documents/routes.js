import { Router } from 'express';
import DocumentController from "./controller.js";

const router = Router();

router.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});


router.get('/all', DocumentController.all)

router.post('/insert', DocumentController.insert);

router.delete('/delete/:id', DocumentController.delete)


export default router;
