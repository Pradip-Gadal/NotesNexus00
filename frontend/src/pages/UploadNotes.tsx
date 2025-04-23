import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  FileText,
  Upload,
  Image,
  Check,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser } from '../contexts/UserContext';
import { supabase } from '../utils/supabaseClient';
import { toast } from 'sonner';
import "../styles/luxury-theme.css";

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

const faculties = [
  { id: 'science', name: 'Science' },
  { id: 'management', name: 'Management' },
  { id: 'humanities', name: 'Humanities & Social Sciences' },
  { id: 'education', name: 'Education' },
  { id: 'engineering', name: 'Engineering' },
  { id: 'medicine', name: 'Medicine & Health Sciences' },
  { id: 'law', name: 'Law' },
  { id: 'agriculture', name: 'Agriculture' },
  { id: 'forestry', name: 'Forestry' },
  { id: 'other', name: 'Other' },
];

export default function UploadNotes() {
  const navigate = useNavigate();
  const { user } = useUser(); // We need the user for the upload process
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
    faculty: '',
    subjectCode: '',
    file: null as File | null,
    coverImage: null as File | null,
    tags: '' // Add tags field to state
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverImageRef = useRef<HTMLInputElement>(null);

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

    // Reset grade when academic level changes
    if (name === 'academicLevel') {
      setFormData(prev => ({...prev, grade: ''}));
    }
  };

  const handleNextStep = () => {
    if (isCurrentStepValid()) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    setIsUploading(true);
    setUploadError(false);

    try {
      // Create a new FormData object with a different name to avoid conflict
      const uploadFormData = new FormData();

      // Append all form fields
      uploadFormData.append('title', formData.title);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('academic_level', formData.academicLevel);
      uploadFormData.append('grade', formData.grade);
      uploadFormData.append('subject', formData.subject);
      uploadFormData.append('subject_code', formData.subjectCode);

      if (formData.faculty) {
        uploadFormData.append('faculty', formData.faculty);
      }

      // Append files
      if (formData.file) {
        uploadFormData.append('file', formData.file);
      }
      if (formData.coverImage) {
        uploadFormData.append('cover_image', formData.coverImage);
      }

      // Append tags if they exist
      if (formData.tags) {
        const tags = formData.tags.split(',').map((tag: string) => tag.trim());
        tags.forEach((tag: string) => uploadFormData.append('tags', tag));
      }

      // Add user ID to the form data if user is logged in
      if (user?.id) {
        uploadFormData.append('user_id', user.id);
      }

      // Get the current session for authentication token
      const { data: { session } } = await supabase.auth.getSession();

      // Prepare headers
      const headers: Record<string, string> = {};

      // Add authorization header if session exists
      if (session && session.access_token) {
        console.log('Using access token:', session.access_token);
        headers['Authorization'] = `Bearer ${session.access_token}`;
      } else {
        console.log('No active session, proceeding without authentication');
      }

      // Note: Do not set Content-Type when sending FormData
      // The browser will automatically set the correct Content-Type with boundary

      // Send to backend with or without authentication token
      const response = await fetch('/api/notes/upload', {
        method: 'POST',
        headers,
        body: uploadFormData,
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed with status:', response.status, errorText);
        throw new Error(`Upload failed: ${response.status} ${errorText || response.statusText}`);
      }

      setUploadSuccess(true);
      toast.success("Note uploaded successfully!");

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(true);
      toast.error(`Failed to upload note: ${error instanceof Error ? error.message : 'Unknown error'}`);

      // Check if the error is related to authentication
      if (error instanceof Error && error.message.includes('401')) {
        // Suggest the user to log in again
        toast.error('Authentication failed. Please log in again.');
      }
    } finally {
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
        return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white py-8 px-4"
    >
      <div className="container mx-auto max-w-3xl">
        {/* Header with back button */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Upload Educational Note</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    currentStep === step
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : currentStep > step
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step ? <Check className="h-5 w-5" /> : step}
                </div>
                <div className="text-xs mt-2 text-gray-600">
                  {step === 1 ? 'File' : step === 2 ? 'Details' : step === 3 ? 'Category' : 'Review'}
                </div>
              </div>
            ))}
          </div>
          <div className="relative h-2 bg-gray-200 rounded-full mt-2">
            <div
              className="absolute top-0 left-0 h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep - 1) * 33.33}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Step 1: File Upload */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Select Your Note File</h2>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
                  formData.file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-indigo-500 hover:bg-indigo-50'
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
                      className="mt-3 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
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
                    <div className="w-16 h-16 rounded-full bg-indigo-100 mx-auto flex items-center justify-center mb-3">
                      <Upload className="h-8 w-8 text-indigo-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Drag and drop your file here</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Supports PDF, DOC, PPT, and image files (max 20MB)
                    </p>
                    <button className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors">
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

              <p className="text-xs text-gray-500 mt-4">
                By uploading, you agree to our <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and confirm this content doesn't violate copyright laws.
              </p>
            </motion.div>
          )}

          {/* Step 2: Note Details */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6 space-y-6"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Note Details</h2>

              <div className="space-y-2">
                <Label htmlFor="note-title" className="text-gray-700">Title <span className="text-red-500">*</span></Label>
                <Input
                  id="note-title"
                  name="title"
                  placeholder="Enter a descriptive title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="note-description" className="text-gray-700">Description <span className="text-red-500">*</span></Label>
                <Textarea
                  id="note-description"
                  name="description"
                  placeholder="Describe what this note covers..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="note-subject-code" className="text-gray-700">Subject Code</Label>
                <Input
                  id="note-subject-code"
                  name="subjectCode"
                  placeholder="e.g., MATH101, CS201, PHYS301"
                  value={formData.subjectCode}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
                <p className="text-xs text-gray-500">Enter a subject code to categorize your notes more precisely</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note-cover-image" className="text-gray-700">Cover Image (optional)</Label>
                <div
                  className={`border border-gray-300 rounded-lg p-4 text-center cursor-pointer transition-all hover:border-indigo-500 ${
                    formData.coverImage ? 'bg-indigo-50' : ''
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
                        className="ml-auto text-xs text-indigo-600 hover:text-indigo-800 font-medium"
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
                  id="note-cover-image"
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6 space-y-6"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Categorize Your Note</h2>

              <div className="space-y-2">
                <Label htmlFor="note-subject" className="text-gray-700">Subject <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.subject}
                  onValueChange={(value) => handleSelectChange('subject', value)}
                >
                  <SelectTrigger id="note-subject" className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
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
                <Label htmlFor="note-academic-level" className="text-gray-700">Academic Level <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.academicLevel}
                  onValueChange={(value) => handleSelectChange('academicLevel', value)}
                >
                  <SelectTrigger id="note-academic-level" className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
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
                <Label htmlFor="note-grade" className="text-gray-700">Grade/Year <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.grade}
                  onValueChange={(value) => handleSelectChange('grade', value)}
                  disabled={!formData.academicLevel}
                >
                  <SelectTrigger id="note-grade" className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
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

              <div className="space-y-2">
                <Label htmlFor="note-faculty" className="text-gray-700">Faculty (for higher education)</Label>
                <Select
                  value={formData.faculty}
                  onValueChange={(value) => handleSelectChange('faculty', value)}
                  disabled={!['bachelors', 'masters'].includes(formData.academicLevel)}
                >
                  <SelectTrigger id="note-faculty" className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                    <SelectValue placeholder={['bachelors', 'masters'].includes(formData.academicLevel) ? "Select faculty" : "Only for higher education"} />
                  </SelectTrigger>
                  <SelectContent>
                    {faculties.map((faculty) => (
                      <SelectItem key={faculty.id} value={faculty.id}>
                        {faculty.name}
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              {uploadSuccess ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-6">
                    <Check className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Upload Successful!</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">Your note has been uploaded and is now available for students across Nepal.</p>
                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={() => navigate('/profile/uploaded-files')}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      View My Uploads
                    </Button>
                    <Button
                      onClick={() => navigate('/browse-notes')}
                      variant="outline"
                      className="border-gray-300 text-gray-700"
                    >
                      Browse Notes
                    </Button>
                  </div>
                </div>
              ) : uploadError ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-6">
                    <AlertCircle className="h-10 w-10 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Upload Failed</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">There was an error uploading your note. Please try again.</p>
                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={() => {
                        setUploadError(false);
                        handleSubmit();
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      Try Again
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(1)}
                      variant="outline"
                      className="border-gray-300 text-gray-700"
                    >
                      Start Over
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Review Your Upload</h2>

                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
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

                  <div className="space-y-4 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="font-medium text-gray-700 block">Subject:</span>
                        <span className="text-gray-900 block bg-gray-50 p-2 rounded">{formData.subject}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-gray-700 block">Academic Level:</span>
                        <span className="text-gray-900 block bg-gray-50 p-2 rounded">
                          {academicLevels.find(l => l.id === formData.academicLevel)?.name}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="font-medium text-gray-700 block">Grade/Year:</span>
                        <span className="text-gray-900 block bg-gray-50 p-2 rounded">
                          {getGrades().find(g => g.id === formData.grade)?.name}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-gray-700 block">Faculty:</span>
                        <span className="text-gray-900 block bg-gray-50 p-2 rounded">
                          {formData.faculty ? faculties.find(f => f.id === formData.faculty)?.name : 'Not applicable'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="font-medium text-gray-700 block">Subject Code:</span>
                      <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-md text-sm inline-block">
                        {formData.subjectCode ? formData.subjectCode : 'Not specified'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="font-medium text-gray-700 block">Description:</span>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded">{formData.description}</p>
                    </div>

                    {formData.coverImage && (
                      <div className="space-y-1">
                        <span className="font-medium text-gray-700 block">Cover Image:</span>
                        <div className="bg-gray-50 p-2 rounded">
                          <img
                            src={URL.createObjectURL(formData.coverImage)}
                            alt="Cover preview"
                            className="h-32 object-cover rounded"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600 mb-4">
                      Ready to share your note with students across Nepal?
                    </p>

                    {isUploading ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-indigo-600 font-medium">Uploading...</span>
                      </div>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2"
                      >
                        Upload Note
                      </Button>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* Footer */}
          {currentStep < 4 && !uploadSuccess && !uploadError && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              <Button
                variant="outline"
                onClick={currentStep === 1 ? () => navigate(-1) : handlePrevStep}
                className="border-gray-300 text-gray-700"
                disabled={isUploading}
              >
                {currentStep === 1 ? 'Cancel' : 'Back'}
              </Button>

              <Button
                onClick={handleNextStep}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={!isCurrentStepValid() || isUploading}
              >
                {currentStep === 3 ? 'Review' : 'Continue'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}



