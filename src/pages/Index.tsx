import { motion } from 'framer-motion';
import { Calendar, Sparkles } from 'lucide-react';

import { TimetableGenerator } from '@/components/TimetableGenerator';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/10 rounded-full blur-3xl" />
        
        <div className="relative container py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
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
      </header>

      {/* Main Content */}
      <main className="pb-12">
        <TimetableGenerator />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>AI Powered Timetable Scheduler</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;