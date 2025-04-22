import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Image, FileUp, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define the academic levels and subjects for the dropdown
const academicLevels = [
  { id: 'primary', name: 'Primary Level' },
  { id: 'lower-secondary', name: 'Lower Secondary Level' },
  { id: 'secondary', name: 'Secondary Level' },
  { id: 'higher-secondary', name: 'Higher Secondary Level' },
  { id: 'bachelors', name: 'Bachelor\'s Degree' },
  { id: 'masters', name: 'Master\'s Degree' },
];

const subjects = [
  'Mathematics',
  'Science',
  'English',
  'Nepali',
  'Social Studies',
  'Computer Science',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Geography',
  'Economics',
  'Business Studies',
  'Accounting',
  'Other'
];

export function UploadNoteButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    academicLevel: '',
    grade: '',
    tags: '',
    file: null as File | null,
    coverImage: null as File | null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverImageRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleCloseModal();
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    // Reset form state when opening modal
    setCurrentStep(1);
    setUploadSuccess(false);
    setUploadError(false);
    setFormData({
      title: '',
      description: '',
      subject: '',
      academicLevel: '',
      grade: '',
      tags: '',
      file: null,
      coverImage: null,
    });
  };

  const handleCloseModal = () => {
    if (isUploading) return; // Prevent closing during upload

    setIsModalOpen(false);
    // Reset after animation completes
    setTimeout(() => {
      setCurrentStep(1);
      setUploadSuccess(false);
      setUploadError(false);
    }, 300);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        file: e.target.files[0]
      });
    }
  };

  const handleCoverImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        coverImage: e.target.files[0]
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsUploading(true);

    // Simulate upload process
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUploadSuccess(true);
      setIsUploading(false);
    } catch (error) {
      setUploadError(true);
      setIsUploading(false);
    }
  };

  // Get grades based on selected academic level
  const getGrades = () => {
    switch (formData.academicLevel) {
      case 'primary':
        return Array.from({ length: 5 }, (_, i) => ({ id: `grade-${i+1}`, name: `Grade ${i+1}` }));
      case 'lower-secondary':
        return Array.from({ length: 3 }, (_, i) => ({ id: `grade-${i+6}`, name: `Grade ${i+6}` }));
      case 'secondary':
        return Array.from({ length: 2 }, (_, i) => ({ id: `grade-${i+9}`, name: `Grade ${i+9}` }));
      case 'higher-secondary':
        return Array.from({ length: 2 }, (_, i) => ({ id: `grade-${i+11}`, name: `Grade ${i+11}` }));
      case 'bachelors':
        return Array.from({ length: 4 }, (_, i) => ({ id: `year-${i+1}`, name: `Year ${i+1}` }));
      case 'masters':
        return Array.from({ length: 4 }, (_, i) => ({ id: `semester-${i+1}`, name: `Semester ${i+1}` }));
      default:
        return [];
    }
  };

  // Validate current step
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return !!formData.file;
      case 2:
        return !!formData.title && !!formData.description;
      case 3:
        return !!formData.subject && !!formData.academicLevel && !!formData.grade;
      default:
        return true;
    }
  };

  // Get file icon based on file type
  const getFileIcon = () => {
    if (!formData.file) return null;

    const fileType = formData.file.name.split('.').pop()?.toLowerCase();

    switch (fileType) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'ppt':
      case 'pptx':
        return <FileText className="h-6 w-6 text-orange-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <Image className="h-6 w-6 text-green-500" />;
      default:
        return <FileUp className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200 luxury-hover-effect flex items-center space-x-2"
      >
        <span className="text-blue-500">
          <FileText className="h-4 w-4" />
        </span>
        <span>Upload Note</span>
      </button>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm" onClick={handleOutsideClick}>
            <motion.div
              ref={modalRef}
              className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md mx-4"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
                <button
                  onClick={handleCloseModal}
                  className="absolute right-4 top-4 text-white hover:text-gray-200 transition-colors"
                  disabled={isUploading}
                >
                  <X className="h-5 w-5" />
                </button>
                <h3 className="text-xl font-semibold">Upload Educational Note</h3>
                <p className="text-blue-100 text-sm">Share your knowledge with students across Nepal</p>

                {/* Progress Steps */}
                <div className="flex justify-between mt-4 mb-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                          currentStep === step
                            ? 'bg-white text-blue-600 shadow-lg'
                            : currentStep > step
                              ? 'bg-green-500 text-white'
                              : 'bg-blue-400 bg-opacity-50 text-white'
                        }`}
                      >
                        {currentStep > step ? <Check className="h-4 w-4" /> : step}
                      </div>
                      <div className="text-xs mt-1 text-blue-100">
                        {step === 1 ? 'File' : step === 2 ? 'Details' : step === 3 ? 'Category' : 'Review'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Step 1: File Upload */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Select Your Note File</h4>

                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
                        formData.file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                      }`}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {formData.file ? (
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-3">
                            {getFileIcon()}
                          </div>
                          <p className="text-sm font-medium text-gray-900">{formData.file.name}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {(formData.file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                          <button
                            className="mt-3 text-xs text-blue-600 hover:text-blue-800 font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData({...formData, file: null});
                            }}
                          >
                            Change File
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="w-16 h-16 rounded-full bg-blue-100 mx-auto flex items-center justify-center mb-3">
                            <FileUp className="h-8 w-8 text-blue-600" />
                          </div>
                          <p className="text-sm font-medium text-gray-900">Drag and drop your file here</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Supports PDF, DOC, PPT, and image files (max 20MB)
                          </p>
                          <button className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
                            Browse Files
                          </button>
                        </>
                      )}
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                      onChange={handleFileSelect}
                    />

                    <p className="text-xs text-gray-500 mt-3">
                      By uploading, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and confirm this content doesn't violate copyright laws.
                    </p>
                  </motion.div>
                )}

                {/* Step 2: Note Details */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Note Details</h4>

                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Enter a descriptive title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe what this note covers..."
                        value={formData.description}
                        onChange={handleInputChange}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[120px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input
                        id="tags"
                        name="tags"
                        placeholder="e.g., algebra, equations, mathematics"
                        value={formData.tags}
                        onChange={handleInputChange}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="coverImage">Cover Image (optional)</Label>
                      <div
                        className={`border border-gray-300 rounded-lg p-4 text-center cursor-pointer transition-all hover:border-blue-500 ${
                          formData.coverImage ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => coverImageRef.current?.click()}
                      >
                        {formData.coverImage ? (
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded bg-gray-200 overflow-hidden">
                              <img
                                src={URL.createObjectURL(formData.coverImage)}
                                alt="Cover preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-medium text-gray-900">{formData.coverImage.name}</p>
                              <p className="text-xs text-gray-500">
                                {(formData.coverImage.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                            </div>
                            <button
                              className="ml-auto text-xs text-blue-600 hover:text-blue-800 font-medium"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFormData({...formData, coverImage: null});
                              }}
                            >
                              Change
                            </button>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">
                            <Image className="h-5 w-5 mx-auto mb-1" />
                            Click to add a cover image
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        ref={coverImageRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleCoverImageSelect}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Categorization */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Categorize Your Note</h4>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select
                        value={formData.subject}
                        onValueChange={(value) => handleSelectChange('subject', value)}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="academicLevel">Academic Level</Label>
                      <Select
                        value={formData.academicLevel}
                        onValueChange={(value) => {
                          handleSelectChange('academicLevel', value);
                          // Reset grade when academic level changes
                          setFormData(prev => ({...prev, grade: ''}));
                        }}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select academic level" />
                        </SelectTrigger>
                        <SelectContent>
                          {academicLevels.map((level) => (
                            <SelectItem key={level.id} value={level.id}>
                              {level.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="grade">Grade/Year</Label>
                      <Select
                        value={formData.grade}
                        onValueChange={(value) => handleSelectChange('grade', value)}
                        disabled={!formData.academicLevel}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder={formData.academicLevel ? "Select grade/year" : "Select academic level first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {getGrades().map((grade) => (
                            <SelectItem key={grade.id} value={grade.id}>
                              {grade.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Review & Submit */}
                {currentStep === 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {uploadSuccess ? (
                      <div className="text-center py-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                          <Check className="h-8 w-8 text-green-600" />
                        </div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">Upload Successful!</h4>
                        <p className="text-gray-600 mb-6">Your note has been uploaded and is now available for students.</p>
                        <Button
                          onClick={handleCloseModal}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Done
                        </Button>
                      </div>
                    ) : uploadError ? (
                      <div className="text-center py-6">
                        <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4">
                          <AlertCircle className="h-8 w-8 text-red-600" />
                        </div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">Upload Failed</h4>
                        <p className="text-gray-600 mb-6">There was an error uploading your note. Please try again.</p>
                        <div className="flex space-x-3 justify-center">
                          <Button
                            onClick={handleCloseModal}
                            variant="outline"
                            className="border-gray-300 text-gray-700"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => {
                              setUploadError(false);
                              handleSubmit();
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Try Again
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Review Your Upload</h4>

                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <div className="flex items-start">
                            <div className="bg-white rounded-md border border-gray-200 p-2 mr-3">
                              {getFileIcon()}
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900">{formData.title}</h5>
                              <p className="text-sm text-gray-500 mt-1">
                                {formData.file?.name} ({(formData.file?.size || 0 / (1024 * 1024)).toFixed(2)} MB)
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div className="flex">
                            <span className="font-medium text-gray-700 w-1/3">Subject:</span>
                            <span className="text-gray-900">{formData.subject}</span>
                          </div>
                          <div className="flex">
                            <span className="font-medium text-gray-700 w-1/3">Academic Level:</span>
                            <span className="text-gray-900">
                              {academicLevels.find(l => l.id === formData.academicLevel)?.name}
                            </span>
                          </div>
                          <div className="flex">
                            <span className="font-medium text-gray-700 w-1/3">Grade/Year:</span>
                            <span className="text-gray-900">
                              {getGrades().find(g => g.id === formData.grade)?.name}
                            </span>
                          </div>
                          <div className="flex">
                            <span className="font-medium text-gray-700 w-1/3">Tags:</span>
                            <span className="text-gray-900">{formData.tags || 'None'}</span>
                          </div>
                          <div className="pt-2">
                            <span className="font-medium text-gray-700 block mb-1">Description:</span>
                            <p className="text-gray-900 bg-gray-50 p-2 rounded">{formData.description}</p>
                          </div>
                        </div>

                        <div className="mt-6 text-center">
                          <p className="text-sm text-gray-600 mb-4">
                            Ready to share your note with students across Nepal?
                          </p>

                          {isUploading ? (
                            <div className="flex items-center justify-center space-x-3">
                              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                              <span className="text-blue-600 font-medium">Uploading...</span>
                            </div>
                          ) : (
                            <Button
                              onClick={handleSubmit}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                            >
                              Upload Note
                            </Button>
                          )}
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              {currentStep < 4 && !uploadSuccess && !uploadError && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={currentStep === 1 ? handleCloseModal : handlePrevStep}
                    className="border-gray-300 text-gray-700"
                    disabled={isUploading}
                  >
                    {currentStep === 1 ? 'Cancel' : 'Back'}
                  </Button>

                  <Button
                    onClick={handleNextStep}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!isCurrentStepValid() || isUploading}
                  >
                    {currentStep === 3 ? 'Review' : 'Continue'}
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
