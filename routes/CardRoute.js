import express from "express";
import { 
    getCard,
    getCardById,
    saveCard,
    deleteCard,
    updateCard 
} from "../controllers/CardController.js";

const router = express.Router();

router.get('/cards', getCard);
router.get('/cards/:id', getCardById);
router.post('/cards', saveCard);
router.patch('/cards/:id', updateCard);
router.delete('/cards/:id', deleteCard);

export default router;