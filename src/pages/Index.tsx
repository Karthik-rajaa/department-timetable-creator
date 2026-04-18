import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

import { TimetableGenerator } from '@/components/TimetableGenerator';
import { AppLayout } from '@/lms/AppLayout';

const Index = () => {
  return (
    <AppLayout title="Timetable Scheduler" subtitle="Generate AI-powered weekly timetables">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative container py-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI Powered</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-3">
              <span className="gradient-text">Timetable</span>{' '}
              <span className="text-foreground">Scheduler</span>
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto text-sm sm:text-base">
              Create beautiful, AI-powered weekly timetables for your department in seconds
            </p>
          </motion.div>
        </div>
      </div>

      <main className="pb-12">
        <TimetableGenerator />
      </main>
    </AppLayout>
  );
};

export default Index;
