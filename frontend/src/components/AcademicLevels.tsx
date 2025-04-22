import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, School, ListFilter } from 'lucide-react';
import { GradeSelectionDialog } from './GradeSelectionDialog';
import { Badge } from '@/components/ui/badge';

// Define the academic level structure
export interface Grade {
  id: string;
  name: string;
}

export interface AcademicLevel {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  grades: Grade[];
}

export const academicLevels: AcademicLevel[] = [
  {
    id: 'primary',
    name: 'Primary Level',
    icon: <School className="h-5 w-5" />,
    color: 'bg-emerald-600 hover:bg-emerald-700',
    grades: [
      { id: 'grade-1', name: 'Grade 1' },
      { id: 'grade-2', name: 'Grade 2' },
      { id: 'grade-3', name: 'Grade 3' },
      { id: 'grade-4', name: 'Grade 4' },
      { id: 'grade-5', name: 'Grade 5' },
    ],
  },
  {
    id: 'lower-secondary',
    name: 'Lower Secondary Level',
    icon: <School className="h-5 w-5" />,
    color: 'bg-blue-600 hover:bg-blue-700',
    grades: [
      { id: 'grade-6', name: 'Grade 6' },
      { id: 'grade-7', name: 'Grade 7' },
      { id: 'grade-8', name: 'Grade 8' },
    ],
  },
  {
    id: 'secondary',
    name: 'Secondary Level',
    icon: <School className="h-5 w-5" />,
    color: 'bg-indigo-600 hover:bg-indigo-700',
    grades: [
      { id: 'grade-9', name: 'Grade 9' },
      { id: 'grade-10', name: 'Grade 10' },
    ],
  },
  {
    id: 'higher-secondary',
    name: 'Higher Secondary Level',
    icon: <School className="h-5 w-5" />,
    color: 'bg-purple-600 hover:bg-purple-700',
    grades: [
      { id: 'grade-11', name: 'Grade 11' },
      { id: 'grade-12', name: 'Grade 12' },
    ],
  },
  {
    id: 'bachelors',
    name: 'Bachelor\'s Degree Programs',
    icon: <GraduationCap className="h-5 w-5" />,
    color: 'bg-orange-600 hover:bg-orange-700',
    grades: [
      { id: 'year-1', name: 'Year 1' },
      { id: 'year-2', name: 'Year 2' },
      { id: 'year-3', name: 'Year 3' },
      { id: 'year-4', name: 'Year 4' },
    ],
  },
  {
    id: 'masters',
    name: 'Master\'s Degree Programs',
    icon: <GraduationCap className="h-5 w-5" />,
    color: 'bg-red-600 hover:bg-red-700',
    grades: [
      { id: 'semester-1', name: 'Semester 1' },
      { id: 'semester-2', name: 'Semester 2' },
      { id: 'semester-3', name: 'Semester 3' },
      { id: 'semester-4', name: 'Semester 4' },
    ],
  },
];

export function AcademicLevels() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<AcademicLevel | null>(null);

  const openGradeSelection = (level: AcademicLevel, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentLevel(level);
    setDialogOpen(true);
  };

  // This function is still needed for the GradeSelectionDialog props
  // but we don't need to save the selection anymore
  const handleSelectGrades = (levelId: string, gradeIds: string[]) => {
    // No longer saving the selection
    console.log(`Selected grades for ${levelId}:`, gradeIds);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-white">Browse Educational Content</h2>
      <p className="text-center text-gray-300 mb-10">
        Explore subjects, courses, and notes across all educational levels in Nepal
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {academicLevels.map((level) => (
          <motion.div
            key={level.id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 hover:border-gray-500 transition-all duration-300 cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => openGradeSelection(level)}
          >
            <div className="p-5 flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${level.color.split(' ')[0]}`}>
                    {level.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{level.name}</h3>
                  </div>
                </div>
                <div
                  className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    openGradeSelection(level, e);
                  }}
                >
                  <ListFilter size={18} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Grade Selection Dialog */}
      {currentLevel && (
        <GradeSelectionDialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          academicLevel={currentLevel}
          onSelectGrades={handleSelectGrades}
          initialSelectedGrades={[]}
        />
      )}
    </div>
  );
}
