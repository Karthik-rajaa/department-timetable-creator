import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, BookOpen, FlaskConical, Trash2, ArrowLeft, Sparkles, Pencil } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Subject } from '@/types/timetable';
import { cn } from '@/lib/utils';

interface SubjectInputStepProps {
  subjects: Subject[];
  onAddSubject: (subject: Subject) => void;
  onRemoveSubject: (id: string) => void;
  onUpdateSubject: (subject: Subject) => void;
  onNext: () => void;
  onBack: () => void;
  manualHours: boolean;
  onManualHoursChange: (value: boolean) => void;
}

export const SubjectInputStep = ({
  subjects,
  onAddSubject,
  onRemoveSubject,
  onUpdateSubject,
  onNext,
  onBack,
  manualHours,
  onManualHoursChange,
}: SubjectInputStepProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [subjectType, setSubjectType] = useState<'theory' | 'lab'>('theory');
  const [name, setName] = useState('');
  const [weeklyHours, setWeeklyHours] = useState(4);
  const [venue, setVenue] = useState('');

  const resetForm = () => {
    setName('');
    setVenue('');
    setWeeklyHours(4);
    setSubjectType('theory');
    setEditingSubject(null);
    setShowForm(false);
  };

  const handleAddSubject = () => {
    if (!name.trim()) return;

    const newSubject: Subject = {
      id: editingSubject?.id || Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      type: subjectType,
      ...(subjectType === 'theory' && manualHours && { weeklyHours }),
      ...(subjectType === 'lab' && { venue: venue.trim() || 'Lab Room' }),
    };

    if (editingSubject) {
      onUpdateSubject(newSubject);
    } else {
      onAddSubject(newSubject);
    }
    resetForm();
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setName(subject.name);
    setSubjectType(subject.type);
    setWeeklyHours(subject.weeklyHours || 4);
    setVenue(subject.venue || '');
    setShowForm(true);
  };

  const theoryCount = subjects.filter(s => s.type === 'theory').length;
  const labCount = subjects.filter(s => s.type === 'lab').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
          Add Your Subjects
        </h2>
        <p className="text-muted-foreground text-sm">
          Add theory subjects and labs one by one
        </p>
      </div>

      {/* Manual Hours Toggle */}
      <Card variant="glass" className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-accent" />
            <div>
              <p className="text-sm font-medium">Auto-distribute hours</p>
              <p className="text-xs text-muted-foreground">
                {manualHours ? 'You specify weekly hours' : 'Hours balanced automatically'}
              </p>
            </div>
          </div>
          <Switch
            checked={!manualHours}
            onCheckedChange={(checked) => onManualHoursChange(!checked)}
          />
        </div>
      </Card>

      {/* Subject List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {theoryCount} Theory • {labCount} Labs
          </span>
        </div>

        <AnimatePresence>
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={cn(
                "p-3",
                subject.type === 'theory' ? 'border-l-4 border-l-primary' : 'border-l-4 border-l-accent'
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {subject.type === 'theory' ? (
                      <BookOpen className="w-4 h-4 text-primary" />
                    ) : (
                      <FlaskConical className="w-4 h-4 text-accent" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{subject.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {subject.type === 'theory' 
                          ? (subject.weeklyHours ? `${subject.weeklyHours} hrs/week` : 'Auto hours')
                          : subject.venue}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => handleEditSubject(subject)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onRemoveSubject(subject.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add/Edit Subject Form */}
      <AnimatePresence>
        {showForm ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card variant="glass" className="p-4 space-y-4">
              <div className="text-center text-sm font-medium text-foreground">
                {editingSubject ? 'Edit Subject' : 'Add New Subject'}
              </div>
              
              {/* Type Toggle - disabled when editing */}
              <div className="flex gap-2">
                <Button
                  variant={subjectType === 'theory' ? 'default' : 'secondary'}
                  size="sm"
                  onClick={() => setSubjectType('theory')}
                  className="flex-1"
                  disabled={!!editingSubject}
                >
                  <BookOpen className="w-4 h-4 mr-1" />
                  Theory
                </Button>
                <Button
                  variant={subjectType === 'lab' ? 'accent' : 'secondary'}
                  size="sm"
                  onClick={() => setSubjectType('lab')}
                  className="flex-1"
                  disabled={!!editingSubject}
                >
                  <FlaskConical className="w-4 h-4 mr-1" />
                  Lab
                </Button>
              </div>

              {/* Subject Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Subject Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Data Structures"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>

              {/* Weekly Hours (Theory only) */}
              {subjectType === 'theory' && manualHours && (
                <div className="space-y-2">
                  <Label htmlFor="hours">Weekly Hours</Label>
                  <Input
                    id="hours"
                    type="number"
                    min={1}
                    max={10}
                    value={weeklyHours}
                    onChange={(e) => setWeeklyHours(Number(e.target.value))}
                  />
                </div>
              )}

              {/* Venue (Lab only) */}
              {subjectType === 'lab' && (
                <div className="space-y-2">
                  <Label htmlFor="venue">Lab Venue</Label>
                  <Input
                    id="venue"
                    placeholder="e.g., Computer Lab 1"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
                <Button
                  variant="gradient"
                  className="flex-1"
                  onClick={handleAddSubject}
                  disabled={!name.trim()}
                >
                  {editingSubject ? 'Update Subject' : 'Add Subject'}
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Button
              variant="outline"
              className="w-full border-dashed"
              onClick={() => setShowForm(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Subject
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3 pt-4">
        <Button variant="secondary" onClick={onBack} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          variant="gradient"
          onClick={onNext}
          disabled={subjects.length === 0}
          className="flex-1"
        >
          Generate Timetables
        </Button>
      </div>
    </motion.div>
  );
};