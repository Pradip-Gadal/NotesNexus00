import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AcademicLevel, Grade } from './AcademicLevels';
import { useNavigate } from 'react-router-dom';

interface GradeSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  academicLevel: AcademicLevel;
  onSelectGrades: (levelId: string, gradeIds: string[]) => void;
  initialSelectedGrades?: string[];
}

export function GradeSelectionDialog({
  isOpen,
  onClose,
  academicLevel,
  onSelectGrades,
  initialSelectedGrades = [],
}: GradeSelectionDialogProps) {
  const navigate = useNavigate();
  const [selectedGrades, setSelectedGrades] = useState<string[]>(initialSelectedGrades);
  const [selectAll, setSelectAll] = useState(false);

  // Reset selected grades when the dialog opens with new academic level
  useEffect(() => {
    if (isOpen) {
      setSelectedGrades(initialSelectedGrades);
      setSelectAll(initialSelectedGrades.length === academicLevel.grades.length);
    }
  }, [isOpen, academicLevel, initialSelectedGrades]);

  const handleGradeToggle = (gradeId: string) => {
    setSelectedGrades((prev) => {
      const newSelection = prev.includes(gradeId)
        ? prev.filter((id) => id !== gradeId)
        : [...prev, gradeId];

      // Update selectAll state based on whether all grades are selected
      setSelectAll(newSelection.length === academicLevel.grades.length);

      return newSelection;
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      // If all are selected, deselect all
      setSelectedGrades([]);
      setSelectAll(false);
    } else {
      // If not all are selected, select all
      setSelectedGrades(academicLevel.grades.map((grade) => grade.id));
      setSelectAll(true);
    }
  };

  const handleSubmit = () => {
    // Instead of saving the selection, navigate directly to the selected notes page
    if (selectedGrades.length > 0) {
      navigate(`/selected-notes/${academicLevel.id}/${selectedGrades.join(',')}`);
    }
    onClose();
  };

  // Get primary color from the academic level
  const primaryColor = academicLevel.color.split(' ')[0];
  const hoverColor = academicLevel.color.split(' ')[1] || 'hover:bg-opacity-90';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md mx-4 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-white">
                Select Grades in {academicLevel.name}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Select All */}
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <div
                className="flex items-center space-x-3 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSelectAll();
                }}
              >
                <Checkbox
                  id="select-all"
                  checked={selectAll}
                  className={`${primaryColor} border-gray-600`}
                />
                <label
                  className="text-sm font-medium text-white cursor-pointer"
                >
                  Select All
                </label>
              </div>
              <span className="text-sm text-gray-400">
                {selectedGrades.length} of {academicLevel.grades.length} selected
              </span>
            </div>

            {/* Grade List */}
            <div className="p-4 max-h-[300px] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                {academicLevel.grades.map((grade) => (
                  <div
                    key={grade.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border ${
                      selectedGrades.includes(grade.id)
                        ? `${primaryColor} border-opacity-50`
                        : 'bg-gray-700 border-gray-600'
                    } transition-colors cursor-pointer`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleGradeToggle(grade.id);
                    }}
                  >
                    <div
                      className="flex items-center space-x-3 flex-1"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleGradeToggle(grade.id);
                      }}
                    >
                      <Checkbox
                        id={grade.id}
                        checked={selectedGrades.includes(grade.id)}
                        className={`${primaryColor} border-gray-600`}
                      />
                      <label
                        className="text-sm font-medium text-white cursor-pointer flex-1"
                      >
                        {grade.name}
                      </label>
                    </div>
                    {selectedGrades.includes(grade.id) && (
                      <Check size={16} className="text-white" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-700 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className={`${primaryColor} ${hoverColor} text-white flex items-center space-x-2`}
                disabled={selectedGrades.length === 0}
              >
                <span>View Notes</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
