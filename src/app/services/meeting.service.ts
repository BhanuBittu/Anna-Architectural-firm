import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Meeting } from '../models/meeting.model';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private meetings: Meeting[] = [];

  private meetingsSubject = new BehaviorSubject<Meeting[]>(this.meetings);

  getMeetings(): Observable<Meeting[]> {
    return this.meetingsSubject.asObservable();
  }

  getMeetingById(id: number): Meeting | undefined {
    return this.meetings.find(meeting => meeting.id === id);
  }

  getMeetingsByClient(clientId: number): Meeting[] {
    return this.meetings.filter(meeting => meeting.clientId === clientId);
  }

  addMeeting(meeting: Omit<Meeting, 'id'>): void {
    const newMeeting: Meeting = {
      ...meeting,
      id: this.meetings.length > 0 ? Math.max(...this.meetings.map(m => m.id)) + 1 : 1
    };
    this.meetings.push(newMeeting);
    this.meetingsSubject.next([...this.meetings]);
  }

  updateMeeting(updatedMeeting: Meeting): void {
    const index = this.meetings.findIndex(m => m.id === updatedMeeting.id);
    if (index !== -1) {
      this.meetings[index] = updatedMeeting;
      this.meetingsSubject.next([...this.meetings]);
    }
  }

  deleteMeeting(id: number): void {
    this.meetings = this.meetings.filter(m => m.id !== id);
    this.meetingsSubject.next([...this.meetings]);
  }

  getUpcomingMeetings(): Meeting[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.meetings
      .filter(meeting => {
        const meetingDate = new Date(meeting.date);
        meetingDate.setHours(0, 0, 0, 0);
        return meetingDate >= today && meeting.status === 'scheduled';
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  getTodaysMeetings(): Meeting[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.meetings.filter(meeting => {
      const meetingDate = new Date(meeting.date);
      return meetingDate >= today && meetingDate < tomorrow && meeting.status === 'scheduled';
    });
  }

  getMeetingsByDateRange(startDate: Date, endDate: Date): Meeting[] {
    return this.meetings.filter(meeting => {
      const meetingDate = new Date(meeting.date);
      return meetingDate >= startDate && meetingDate <= endDate;
    });
  }
}
