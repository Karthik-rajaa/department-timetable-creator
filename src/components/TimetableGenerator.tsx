import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { StepIndicator } from './StepIndicator';
import { DepartmentYearStep } from './DepartmentYearStep';
import { SubjectInputStep } from './SubjectInputStep';
import { TimetableOptionsStep } from './TimetableOptionsStep';
import { Subject, Timetable } from '@/types/timetable';
import { generateTimetableOptions, autoDistributeHours } from '@/utils/timetableGenerator';

const STEPS = ['Setup', 'Subjects', 'Generate'];

export const TimetableGenerator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [manualHours, setManualHours] = useState(false);
  const [timetables, setTimetables] = useState<Timetable[]>([]);

  const handleAddSubject = (subject: Subject) => {
    setSubjects([...subjects, subject]);
  };

  const handleRemoveSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  const handleGenerateTimetables = () => {
    let finalSubjects = subjects;
    
    // Auto-distribute hours if not manual
    if (!manualHours) {
      finalSubjects = autoDistributeHours(subjects);
    }

    const options = generateTimetableOptions(department, year, finalSubjects);
    setTimetables(options);
    setCurrentStep(2);
  };

  const handleRegenerate = () => {
    let finalSubjects = subjects;
    if (!manualHours) {
      finalSubjects = autoDistributeHours(subjects);
    }
    const options = generateTimetableOptions(department, year, finalSubjects);
    setTimetables(options);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setDepartment('');
    setYear('');
    setSubjects([]);
    setTimetables([]);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6">
      <StepIndicator steps={STEPS} currentStep={currentStep} />

      <AnimatePresence mode="wait">
        {currentStep === 0 && (
          <DepartmentYearStep
            key="step-0"
            department={department}
            year={year}
            onDepartmentChange={setDepartment}
            onYearChange={setYear}
            onNext={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 1 && (
          <SubjectInputStep
            key="step-1"
            subjects={subjects}
            onAddSubject={handleAddSubject}
            onRemoveSubject={handleRemoveSubject}
            onNext={handleGenerateTimetables}
            onBack={() => setCurrentStep(0)}
            manualHours={manualHours}
            onManualHoursChange={setManualHours}
          />
        )}

        {currentStep === 2 && (
          <TimetableOptionsStep
            key="step-2"
            timetables={timetables}
            onBack={() => setCurrentStep(1)}
            onRegenerate={handleRegenerate}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
