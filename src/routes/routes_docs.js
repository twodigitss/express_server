import { Router } from 'express';
import document from "@controllers/doc_controller";
const router = Router();

router.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

router.get('/docs/all', document.all)

router.post('/docs/insert', document.insert);

router.delete('/docs/delete/:id', document.delete)

export default router;
