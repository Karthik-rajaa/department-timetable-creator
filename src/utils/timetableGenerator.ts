import { Subject, Timetable, DaySchedule, TimetableCell, TIME_SLOTS, DAYS } from '@/types/timetable';

// Get only class slots (not breaks)
const getClassSlots = () => TIME_SLOTS.filter(slot => slot.type === 'class');

// Get pairs of consecutive class slots for labs
const getLabSlotPairs = (): number[][] => {
  const classSlots = getClassSlots();
  const pairs: number[][] = [];
  
  for (let i = 0; i < classSlots.length - 1; i++) {
    const currentIndex = TIME_SLOTS.findIndex(s => s.id === classSlots[i].id);
    const nextIndex = TIME_SLOTS.findIndex(s => s.id === classSlots[i + 1].id);
    
    // Check if they're actually consecutive (no break in between)
    if (nextIndex === currentIndex + 1) {
      pairs.push([currentIndex, nextIndex]);
    }
  }
  
  return pairs;
};

// Shuffle array randomly
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Generate a single random timetable
export const generateTimetable = (
  department: string,
  year: string,
  subjects: Subject[]
): Timetable => {
  const theorySubjects = subjects.filter(s => s.type === 'theory');
  const labSubjects = subjects.filter(s => s.type === 'lab');
  
  // Initialize empty timetable
  const days: DaySchedule[] = DAYS.map(day => ({
    day,
    slots: TIME_SLOTS.map(slot => {
      if (slot.type === 'break' || slot.type === 'lunch') {
        return { isEmpty: false } as TimetableCell;
      }
      return { isEmpty: true } as TimetableCell;
    }),
  }));
  
  // Place labs first (one 2-slot block per lab, once per week)
  const labSlotPairs = getLabSlotPairs();
  const shuffledDays = shuffleArray([...Array(5).keys()]);
  const shuffledPairs = shuffleArray([...labSlotPairs]);
  
  labSubjects.forEach((lab, labIndex) => {
    let placed = false;
    const dayIndex = shuffledDays[labIndex % 5];
    
    for (const pair of shuffledPairs) {
      if (placed) break;
      
      const [slot1, slot2] = pair;
      if (days[dayIndex].slots[slot1].isEmpty && days[dayIndex].slots[slot2].isEmpty) {
        days[dayIndex].slots[slot1] = { subject: lab };
        days[dayIndex].slots[slot2] = { subject: lab, isLabContinuation: true };
        placed = true;
      }
    }
    
    // If couldn't place in preferred day, try other days
    if (!placed) {
      for (let d = 0; d < 5; d++) {
        if (placed) break;
        for (const pair of shuffledPairs) {
          if (placed) break;
          const [slot1, slot2] = pair;
          if (days[d].slots[slot1].isEmpty && days[d].slots[slot2].isEmpty) {
            days[d].slots[slot1] = { subject: lab };
            days[d].slots[slot2] = { subject: lab, isLabContinuation: true };
            placed = true;
          }
        }
      }
    }
  });
  
  // Calculate total theory slots needed
  const totalTheoryHours = theorySubjects.reduce((sum, s) => sum + (s.weeklyHours || 0), 0);
  
  // Create a pool of theory classes to distribute
  const theoryPool: Subject[] = [];
  theorySubjects.forEach(subject => {
    for (let i = 0; i < (subject.weeklyHours || 0); i++) {
      theoryPool.push(subject);
    }
  });
  
  // Shuffle the theory pool
  const shuffledTheory = shuffleArray(theoryPool);
  
  // Fill remaining empty slots with theory subjects
  let theoryIndex = 0;
  for (let d = 0; d < 5; d++) {
    for (let s = 0; s < TIME_SLOTS.length; s++) {
      if (days[d].slots[s].isEmpty && theoryIndex < shuffledTheory.length) {
        days[d].slots[s] = { subject: shuffledTheory[theoryIndex] };
        theoryIndex++;
      }
    }
  }
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    department,
    year,
    days,
  };
};

// Auto-distribute weekly hours for theory subjects
export const autoDistributeHours = (subjects: Subject[]): Subject[] => {
  const theoryCount = subjects.filter(s => s.type === 'theory').length;
  const labCount = subjects.filter(s => s.type === 'lab').length;
  
  // Total available class slots per week (7 slots * 5 days = 35)
  // Minus lab slots (2 slots per lab)
  const totalSlots = 35 - (labCount * 2);
  
  // Distribute evenly among theory subjects
  const baseHours = Math.floor(totalSlots / theoryCount);
  let remaining = totalSlots - (baseHours * theoryCount);
  
  return subjects.map(subject => {
    if (subject.type === 'lab') return subject;
    
    let hours = baseHours;
    if (remaining > 0) {
      hours++;
      remaining--;
    }
    
    return {
      ...subject,
      weeklyHours: Math.min(hours, 6), // Cap at 6 hours per subject
    };
  });
};

// Generate 3 different timetable options
export const generateTimetableOptions = (
  department: string,
  year: string,
  subjects: Subject[]
): Timetable[] => {
  return [
    generateTimetable(department, year, subjects),
    generateTimetable(department, year, subjects),
    generateTimetable(department, year, subjects),
  ];
};
