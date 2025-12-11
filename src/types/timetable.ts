export interface Subject {
  id: string;
  name: string;
  type: 'theory' | 'lab';
  weeklyHours?: number;
  venue?: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  startTime: string;
  endTime: string;
  type: 'class' | 'break' | 'lunch';
  label?: string;
}

export interface TimetableCell {
  subject?: Subject;
  isLabContinuation?: boolean;
  isEmpty?: boolean;
}

export interface DaySchedule {
  day: string;
  slots: TimetableCell[];
}

export interface Timetable {
  id: string;
  department: string;
  year: string;
  days: DaySchedule[];
}

export const TIME_SLOTS: TimeSlot[] = [
  { id: 'slot1', time: '09:30 – 10:15', startTime: '09:30', endTime: '10:15', type: 'class' },
  { id: 'slot2', time: '10:15 – 11:00', startTime: '10:15', endTime: '11:00', type: 'class' },
  { id: 'break1', time: '11:00 – 11:15', startTime: '11:00', endTime: '11:15', type: 'break', label: 'Morning Break' },
  { id: 'slot3', time: '11:15 – 12:00', startTime: '11:15', endTime: '12:00', type: 'class' },
  { id: 'slot4', time: '12:00 – 12:45', startTime: '12:00', endTime: '12:45', type: 'class' },
  { id: 'lunch', time: '12:45 – 01:45', startTime: '12:45', endTime: '13:45', type: 'lunch', label: 'Lunch Break' },
  { id: 'slot5', time: '01:45 – 02:30', startTime: '13:45', endTime: '14:30', type: 'class' },
  { id: 'slot6', time: '02:30 – 03:15', startTime: '14:30', endTime: '15:15', type: 'class' },
  { id: 'break2', time: '03:15 – 03:30', startTime: '15:15', endTime: '15:30', type: 'break', label: 'Evening Break' },
  { id: 'slot7', time: '03:30 – 04:15', startTime: '15:30', endTime: '16:15', type: 'class' },
];

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const DEPARTMENTS = [
  'Computer Science',
  'Electronics',
  'Mechanical',
  'Civil',
  'Electrical',
  'Information Technology',
  'Chemical',
  'Biotechnology',
];

export const YEARS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
];
