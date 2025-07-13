import {Router} from 'express';
import {statusChecker} from '../controllers/status.controllers.js';
const router = Router();

router.route('/').get(statusChecker);

export {router};
