import Meeting from '../models/Meeting.js';

class MeetingService {
  async createMeeting(bookingData) {
    try {
      // Calculate end time based on duration
      const startTime = new Date(bookingData.startTime);
      const endTime = new Date(startTime.getTime() + bookingData.duration * 60 * 60 * 1000);

      // Create meeting record in database
      const meeting = new Meeting({
        bookingId: bookingData.bookingId,
        startTime,
        endTime,
        duration: bookingData.duration,
        participants: [
          {
            userId: bookingData.developerId,
            role: 'developer'
          },
          {
            userId: bookingData.customerId,
            role: 'customer'
          }
        ]
      });

      await meeting.save();
      return meeting;
    } catch (err) {
      console.error('Error in meeting service:', err);
      throw err;
    }
  }

  async updateMeetingStatus(meetingId, status) {
    try {
      const meeting = await Meeting.findByIdAndUpdate(
        meetingId,
        { status },
        { new: true }
      );
      return meeting;
    } catch (err) {
      console.error('Error updating meeting status:', err);
      throw err;
    }
  }

  async recordParticipantJoin(meetingId, userId) {
    try {
      const meeting = await Meeting.findById(meetingId);
      const participant = meeting.participants.find(p => p.userId.toString() === userId);
      
      if (participant) {
        participant.joinedAt = new Date();
        await meeting.save();
      }
      
      return meeting;
    } catch (err) {
      console.error('Error recording participant join:', err);
      throw err;
    }
  }

  async recordParticipantLeave(meetingId, userId) {
    try {
      const meeting = await Meeting.findById(meetingId);
      const participant = meeting.participants.find(p => p.userId.toString() === userId);
      
      if (participant) {
        participant.leftAt = new Date();
        await meeting.save();
      }
      
      return meeting;
    } catch (err) {
      console.error('Error recording participant leave:', err);
      throw err;
    }
  }

  async getMeetingDetails(meetingId) {
    try {
      const meeting = await Meeting.findById(meetingId)
        .populate('bookingId')
        .populate('participants.userId');
      return meeting;
    } catch (err) {
      console.error('Error getting meeting details:', err);
      throw err;
    }
  }



  async getUpcomingMeetings(userId) {
    try {
      const now = new Date();
      const meetings = await Meeting.find({
        'participants.userId': userId,
        status: { $in: ['scheduled', 'ongoing'] },
      })
      .populate({
        path: 'bookingId',
        populate: [
          { path: 'developer', select: 'name imageUrl rating _id' }, // Returns developer's MongoDB _id
          { path: 'customer', select: 'name _id' } // Returns customer's MongoDB _id
        ]
      })
      .sort({ startTime: 1 });

      return meetings;
    } catch (err) {
      console.error('Error getting upcoming meetings:', err);
      throw err;
    }
  }

  async getMeetingByBookingId(bookingId) {
    try {
      const meeting = await Meeting.findOne({ bookingId })
        .populate({
          path: 'bookingId',
          populate: [
            { path: 'developer', select: 'name imageUrl rating' },
            { path: 'customer', select: 'name' }
          ]
        });
      return meeting;
    } catch (err) {
      console.error('Error getting meeting by booking ID:', err);
      throw err;
    }
  }


}

export default new MeetingService();