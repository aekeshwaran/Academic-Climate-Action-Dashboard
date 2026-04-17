import { Router } from 'express';
import { postData, getData, deleteData } from '../controllers/climateController';

const router = Router();

router.post('/', postData);
router.get('/', getData);
router.delete('/:id', deleteData);

export default router;
