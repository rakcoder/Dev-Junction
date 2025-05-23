import express from 'express';
import MeetingController from '../controllers/meetingController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();


router.post('/', MeetingController.createMeeting);
router.get('/:userId/upcoming', MeetingController.getUpcomingMeetings); // Add this new route
router.get('/booking/:bookingId', MeetingController.getMeetingByBookingId);
router.get('/:meetingId', MeetingController.getMeetingDetails);
router.patch('/:meetingId/status', MeetingController.updateMeetingStatus);
router.post('/:meetingId/join', MeetingController.joinMeeting);
router.post('/:meetingId/leave', MeetingController.leaveMeeting);

export default router;