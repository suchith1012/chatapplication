import express from "express";

import { addfriend ,requestfriend,friendlist} from "../controllers/friendlistController";
import verifyAuth from "../middlewares/verifyAuth";

const router = express.Router();


router.post('/friendrequest', addfriend);
router.put('/addfriend',requestfriend);
router.get('/friendlist/:id',friendlist);
export default router;