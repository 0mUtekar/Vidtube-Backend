import { Router } from 'express';
import { verifyJWT } from '../middleware/verifyJWT.js';
import { createPlaylist, getPlaylist, addVideoToPlaylist, deletePlaylist, removeVideoFromPlaylist, viewPlaylist } from '../controllers/playlists.controllers.js';

const router = Router();

router.route('/').post(verifyJWT, createPlaylist);
router.route('/:playlist_id').get(getPlaylist);
router.route('/:playlist_id/video').post(verifyJWT, addVideoToPlaylist);
router.route('/:playlist_id').delete(verifyJWT, deletePlaylist);
router.route('/:playlist_id/video/:video_id').delete(verifyJWT, removeVideoFromPlaylist);
router.route('/:playlist_id/view').get(viewPlaylist);

export { router };


