import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Search, X } from 'lucide-react';
import NoteDetails, { Note } from '../components/NoteDetails';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { academicLevels } from '../components/AcademicLevels';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import "../styles/luxury-theme.css";

// Note interface is imported from NoteDetails component

// Mock data for notes
const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Mathematics: Algebra Fundamentals',
    description: 'Comprehensive notes covering basic algebraic operations, equations, and problem-solving techniques.',
    academicLevel: 'secondary',
    grade: 'grade-9',
    subject: 'Mathematics',
    academicName: 'Kathmandu Model School',
    uploadDate: '2023-10-15',
    uploadedBy: {
      name: 'Rajesh Sharma',
      id: 'user1'
    },
    fileType: 'pdf',
    fileSize: '2.4 MB',
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
    views: 1245,
    likes: 89,
    downloads: 320,
    tags: ['algebra', 'equations', 'mathematics', 'grade 9']
  },
  {
    id: '2',
    title: 'Science: Physics - Motion and Forces',
    description: 'Detailed notes on Newton\'s laws of motion, forces, and practical applications with diagrams.',
    academicLevel: 'secondary',
    grade: 'grade-10',
    subject: 'Science',
    academicName: 'Lalitpur Secondary School',
    uploadDate: '2023-09-28',
    uploadedBy: {
      name: 'Priya Patel',
      id: 'user2'
    },
    fileType: 'pdf',
    fileSize: '3.1 MB',
    views: 987,
    likes: 76,
    downloads: 245,
    tags: ['physics', 'motion', 'forces', 'newton laws', 'grade 10']
  },
  {
    id: '3',
    title: 'English: Essay Writing Techniques',
    description: 'Guide to writing effective essays, including structure, language use, and example essays.',
    academicLevel: 'higher-secondary',
    grade: 'grade-11',
    subject: 'English',
    academicName: 'Trinity International College',
    uploadDate: '2023-11-05',
    uploadedBy: {
      name: 'Anita Gurung',
      id: 'user3'
    },
    fileType: 'docx',
    fileSize: '1.8 MB',
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a',
    views: 756,
    likes: 62,
    downloads: 198,
    tags: ['english', 'essay writing', 'language', 'grade 11']
  },
  {
    id: '4',
    title: 'Social Studies: Nepali History',
    description: 'Comprehensive notes on the history of Nepal, covering major dynasties and historical events.',
    academicLevel: 'secondary',
    grade: 'grade-9',
    subject: 'Social Studies',
    academicName: 'Pokhara Secondary School',
    uploadDate: '2023-08-12',
    uploadedBy: {
      name: 'Binod Thapa',
      id: 'user4'
    },
    fileType: 'pdf',
    fileSize: '4.2 MB',
    views: 1089,
    likes: 94,
    downloads: 356,
    tags: ['history', 'nepal', 'social studies', 'grade 9']
  },
  {
    id: '5',
    title: 'Computer Science: Introduction to Programming',
    description: 'Beginner-friendly notes on programming concepts, algorithms, and basic coding examples.',
    academicLevel: 'higher-secondary',
    grade: 'grade-11',
    subject: 'Computer Science',
    academicName: 'St. Xavier\'s College',
    uploadDate: '2023-10-22',
    uploadedBy: {
      name: 'Sunil KC',
      id: 'user5'
    },
    fileType: 'pdf',
    fileSize: '2.9 MB',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
    views: 1567,
    likes: 128,
    downloads: 487,
    tags: ['programming', 'computer science', 'algorithms', 'grade 11']
  },
  {
    id: '6',
    title: 'Biology: Human Anatomy',
    description: 'Detailed notes on human body systems with labeled diagrams and explanations.',
    academicLevel: 'higher-secondary',
    grade: 'grade-12',
    subject: 'Biology',
    academicName: 'Budhanilkantha School',
    uploadDate: '2023-09-15',
    uploadedBy: {
      name: 'Manisha Rai',
      id: 'user6'
    },
    fileType: 'pdf',
    fileSize: '5.6 MB',
    views: 892,
    likes: 73,
    downloads: 267,
    tags: ['biology', 'anatomy', 'human body', 'grade 12']
  },
  {
    id: '7',
    title: 'Mathematics: Calculus Basics',
    description: 'Introduction to differential and integral calculus with solved examples.',
    academicLevel: 'higher-secondary',
    grade: 'grade-12',
    subject: 'Mathematics',
    academicName: 'Kathmandu Valley College',
    uploadDate: '2023-11-10',
    uploadedBy: {
      name: 'Arun Shrestha',
      id: 'user7'
    },
    fileType: 'pdf',
    fileSize: '3.8 MB',
    coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904',
    views: 1342,
    likes: 112,
    downloads: 398,
    tags: ['calculus', 'mathematics', 'differentiation', 'integration', 'grade 12']
  },
  {
    id: '8',
    title: 'Nepali: Literature and Grammar',
    description: 'Comprehensive notes on Nepali literature, grammar rules, and writing techniques.',
    academicLevel: 'secondary',
    grade: 'grade-10',
    subject: 'Nepali',
    academicName: 'Bhaktapur Secondary School',
    uploadDate: '2023-08-28',
    uploadedBy: {
      name: 'Sarita Tamang',
      id: 'user8'
    },
    fileType: 'pdf',
    fileSize: '2.2 MB',
    views: 765,
    likes: 58,
    downloads: 189,
    tags: ['nepali', 'literature', 'grammar', 'grade 10']
  },
  {
    id: '9',
    title: 'Chemistry: Periodic Table and Elements',
    description: 'Detailed notes on the periodic table, element properties, and chemical reactions.',
    academicLevel: 'higher-secondary',
    grade: 'grade-11',
    subject: 'Chemistry',
    academicName: 'Himalayan Higher Secondary School',
    uploadDate: '2023-10-05',
    uploadedBy: {
      name: 'Deepak Karki',
      id: 'user9'
    },
    fileType: 'pdf',
    fileSize: '3.5 MB',
    coverImage: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6',
    views: 987,
    likes: 81,
    downloads: 276,
    tags: ['chemistry', 'periodic table', 'elements', 'grade 11']
  },
  {
    id: '10',
    title: 'Economics: Microeconomics Principles',
    description: 'Comprehensive notes on microeconomic theories, market structures, and case studies.',
    academicLevel: 'bachelors',
    grade: 'year-1',
    subject: 'Economics',
    academicName: 'Tribhuvan University',
    uploadDate: '2023-09-18',
    uploadedBy: {
      name: 'Rajan Adhikari',
      id: 'user10'
    },
    fileType: 'pdf',
    fileSize: '4.1 MB',
    views: 678,
    likes: 52,
    downloads: 198,
    tags: ['economics', 'microeconomics', 'market', 'bachelor']
  },
  {
    id: '11',
    title: 'Primary Mathematics: Basic Arithmetic',
    description: 'Simple and easy-to-understand notes on addition, subtraction, multiplication, and division.',
    academicLevel: 'primary',
    grade: 'grade-3',
    subject: 'Mathematics',
    academicName: 'Sunrise Elementary School',
    uploadDate: '2023-10-10',
    uploadedBy: {
      name: 'Sita Sharma',
      id: 'user11'
    },
    fileType: 'pdf',
    fileSize: '1.5 MB',
    coverImage: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178',
    views: 845,
    likes: 67,
    downloads: 210,
    tags: ['mathematics', 'arithmetic', 'primary', 'grade 3']
  },
  {
    id: '12',
    title: 'Primary Science: Plants and Animals',
    description: 'Colorful notes on different types of plants and animals for young learners.',
    academicLevel: 'primary',
    grade: 'grade-4',
    subject: 'Science',
    academicName: 'Little Angels School',
    uploadDate: '2023-09-05',
    uploadedBy: {
      name: 'Ram Thapa',
      id: 'user12'
    },
    fileType: 'pdf',
    fileSize: '2.0 MB',
    views: 756,
    likes: 58,
    downloads: 189,
    tags: ['science', 'plants', 'animals', 'primary', 'grade 4']
  },
  {
    id: '13',
    title: 'Primary English: Basic Grammar',
    description: 'Simple grammar rules and exercises for primary level students.',
    academicLevel: 'primary',
    grade: 'grade-5',
    subject: 'English',
    academicName: 'Greenfield Elementary School',
    uploadDate: '2023-11-12',
    uploadedBy: {
      name: 'Maya Gurung',
      id: 'user13'
    },
    fileType: 'docx',
    fileSize: '1.2 MB',
    coverImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
    views: 623,
    likes: 45,
    downloads: 156,
    tags: ['english', 'grammar', 'primary', 'grade 5']
  },
  {
    id: '14',
    title: 'Lower Secondary: Algebra Introduction',
    description: 'Introduction to algebraic expressions and equations for lower secondary students.',
    academicLevel: 'lower-secondary',
    grade: 'grade-6',
    subject: 'Mathematics',
    academicName: 'Everest Middle School',
    uploadDate: '2023-08-20',
    uploadedBy: {
      name: 'Bikash Shrestha',
      id: 'user14'
    },
    fileType: 'pdf',
    fileSize: '2.3 MB',
    views: 912,
    likes: 76,
    downloads: 245,
    tags: ['mathematics', 'algebra', 'lower secondary', 'grade 6']
  },
  {
    id: '15',
    title: 'Lower Secondary: Basic Chemistry',
    description: 'Introduction to atoms, elements, and chemical reactions for grade 7 students.',
    academicLevel: 'lower-secondary',
    grade: 'grade-7',
    subject: 'Science',
    academicName: 'Himalaya Middle School',
    uploadDate: '2023-10-08',
    uploadedBy: {
      name: 'Nisha Poudel',
      id: 'user15'
    },
    fileType: 'pdf',
    fileSize: '2.7 MB',
    coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d',
    views: 834,
    likes: 62,
    downloads: 198,
    tags: ['science', 'chemistry', 'atoms', 'lower secondary', 'grade 7']
  },
  {
    id: '16',
    title: 'Lower Secondary: Geography of Nepal',
    description: 'Comprehensive notes on Nepal\'s geography, climate, and natural resources.',
    academicLevel: 'lower-secondary',
    grade: 'grade-8',
    subject: 'Social Studies',
    academicName: 'Kathmandu International School',
    uploadDate: '2023-09-22',
    uploadedBy: {
      name: 'Gopal Basnet',
      id: 'user16'
    },
    fileType: 'pdf',
    fileSize: '3.2 MB',
    views: 745,
    likes: 53,
    downloads: 187,
    tags: ['social studies', 'geography', 'nepal', 'lower secondary', 'grade 8']
  },
  {
    id: '17',
    title: 'Master\'s: Advanced Statistical Methods',
    description: 'Comprehensive notes on advanced statistical techniques for research and data analysis.',
    academicLevel: 'masters',
    grade: 'semester-2',
    subject: 'Mathematics',
    academicName: 'Kathmandu University',
    uploadDate: '2023-10-25',
    uploadedBy: {
      name: 'Dr. Prakash Sharma',
      id: 'user17'
    },
    fileType: 'pdf',
    fileSize: '4.8 MB',
    coverImage: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29',
    views: 567,
    likes: 48,
    downloads: 189,
    tags: ['statistics', 'research methods', 'data analysis', 'masters']
  },
  {
    id: '18',
    title: 'Master\'s: Artificial Intelligence Fundamentals',
    description: 'In-depth notes on AI algorithms, machine learning, and neural networks.',
    academicLevel: 'masters',
    grade: 'semester-3',
    subject: 'Computer Science',
    academicName: 'Pokhara University',
    uploadDate: '2023-11-08',
    uploadedBy: {
      name: 'Dr. Anuj Pant',
      id: 'user18'
    },
    fileType: 'pdf',
    fileSize: '5.2 MB',
    views: 789,
    likes: 67,
    downloads: 234,
    tags: ['artificial intelligence', 'machine learning', 'neural networks', 'masters']
  },
  {
    id: '19',
    title: 'Bachelor\'s: Introduction to Marketing',
    description: 'Comprehensive notes on marketing principles, consumer behavior, and market research.',
    academicLevel: 'bachelors',
    grade: 'year-2',
    subject: 'Business Studies',
    uploadDate: '2023-09-12',
    uploadedBy: {
      name: 'Sabina Karki',
      id: 'user19'
    },
    fileType: 'pdf',
    fileSize: '3.7 MB',
    coverImage: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec',
    views: 678,
    likes: 54,
    downloads: 198,
    tags: ['marketing', 'business', 'consumer behavior', 'bachelors']
  },
  {
    id: '20',
    title: 'Bachelor\'s: Organic Chemistry',
    description: 'Detailed notes on organic compounds, reactions, and laboratory techniques.',
    academicLevel: 'bachelors',
    grade: 'year-3',
    subject: 'Chemistry',
    uploadDate: '2023-10-18',
    uploadedBy: {
      name: 'Dipak Bhattarai',
      id: 'user20'
    },
    fileType: 'pdf',
    fileSize: '4.5 MB',
    views: 589,
    likes: 47,
    downloads: 176,
    tags: ['chemistry', 'organic chemistry', 'laboratory', 'bachelors']
  }
];

// Subjects for filtering
const subjects = [
  'All Subjects',
  'Mathematics',
  'Science',
  'English',
  'Nepali',
  'Social Studies',
  'Computer Science',
  'Physics',
  'Chemistry',
  'Biology',
  'Economics',
  'Business Studies',
  'Accounting'
];

// Sort options
const sortOptions = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'downloads', label: 'Most Downloaded' },
  { value: 'title-asc', label: 'Title (A-Z)' },
  { value: 'title-desc', label: 'Title (Z-A)' }
];

export default function NotesList() {
  const navigate = useNavigate();
  const { levelId, gradeIds } = useParams<{ levelId: string; gradeIds: string }>();

  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [sortBy, setSortBy] = useState('popular');
  const [savedNotes, setSavedNotes] = useState<string[]>([]);

  // Use a ref to track if data has been loaded to prevent multiple loads
  const dataLoadedRef = useRef(false);

  // Get academic level and grades information
  const academicLevel = academicLevels.find(level => level.id === levelId);
  const selectedGradeIds = gradeIds ? gradeIds.split(',') : [];
  const selectedGrades = academicLevel?.grades.filter(grade => selectedGradeIds.includes(grade.id)) || [];

  // Use useMemo to filter notes only when dependencies change
  const filteredByGradeNotes = useMemo(() => {
    // Filter mock notes based on academic level and grades
    return mockNotes.filter(note => {
      if (note.academicLevel !== levelId) return false;
      if (selectedGradeIds.length > 0 && !selectedGradeIds.includes(note.grade)) return false;
      return true;
    });
  }, [levelId, selectedGradeIds]);

  // Load notes only once when filteredByGradeNotes changes
  useEffect(() => {
    // Only set loading state if we haven't loaded data yet
    if (!dataLoadedRef.current) {
      setLoading(true);

      // Define the data loading function
      const loadData = () => {
        setNotes(filteredByGradeNotes);
        setFilteredNotes(filteredByGradeNotes);
        setLoading(false);
        // Mark that we've loaded data
        dataLoadedRef.current = true;
      };

      // Simulate API delay only once
      const timer = setTimeout(loadData, 1000);

      // Cleanup function
      return () => clearTimeout(timer);
    } else {
      // If we've already loaded data, just update the notes without loading state
      setNotes(filteredByGradeNotes);
      setFilteredNotes(filteredByGradeNotes);
    }
  }, [filteredByGradeNotes]);

  // Apply filters and search using memoization to prevent unnecessary re-renders
  const filteredAndSortedNotes = useMemo(() => {
    // Skip filtering if notes array is empty
    if (notes.length === 0) return [];

    // Create a new array to avoid mutating the original
    let result = [...notes];

    // Apply subject filter
    if (selectedSubject !== 'All Subjects') {
      result = result.filter(note => note.subject === selectedSubject);
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.description.toLowerCase().includes(query) ||
        note.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply sorting - create a new array to avoid mutation issues
    let sortedResult = [...result];
    switch (sortBy) {
      case 'recent':
        sortedResult.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
        break;
      case 'popular':
        sortedResult.sort((a, b) => b.views - a.views);
        break;
      case 'downloads':
        sortedResult.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'title-asc':
        sortedResult.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        sortedResult.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    return sortedResult;
  }, [notes, selectedSubject, searchQuery, sortBy]);

  // Update filtered notes when the memoized result changes
  useEffect(() => {
    // Only update if we have notes and the filtered result is different
    if (notes.length > 0 && filteredAndSortedNotes.length >= 0) {
      setFilteredNotes(filteredAndSortedNotes);
    }
  }, [filteredAndSortedNotes, notes.length]);

  // Toggle save note - memoized to prevent unnecessary re-renders
  const toggleSaveNote = useCallback((noteId: string) => {
    setSavedNotes(prev => {
      if (prev.includes(noteId)) {
        toast.success('Note removed from saved items');
        return prev.filter(id => id !== noteId);
      } else {
        toast.success('Note saved to your collection');
        return [...prev, noteId];
      }
    });
  }, []);

  // Handle download - memoized to prevent unnecessary re-renders
  const handleDownload = useCallback((noteId: string) => {
    // Using the noteId parameter to avoid the unused parameter warning
    console.log(`Starting download for note: ${noteId}`);
    toast.success('Download started');
    // In a real app, this would trigger the actual download
  }, []);

  // Format date - memoized to prevent unnecessary re-renders
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }, []);

  // Handle view note - memoized to prevent unnecessary re-renders
  const handleViewNote = useCallback((noteId: string) => {
    // Find the note
    const note = filteredNotes.find(n => n.id === noteId);
    if (note) {
      // In a real app, this would navigate to a note details page or open a viewer
      toast.info(`Viewing note: ${note.title}`);
      console.log(`Viewing note: ${noteId}`);
      // Example: navigate(`/notes/${noteId}`);
    }
  }, [filteredNotes]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white py-8 px-4"
    >
      <div className="container mx-auto max-w-6xl">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {academicLevel?.name || 'Educational Notes'}
            </h1>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedGrades.map(grade => (
                <Badge key={grade.id} variant="secondary" className="bg-indigo-100 text-indigo-700">
                  {grade.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search notes by title, description or tags..."
                className="pl-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] border-gray-300">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-[200px] border-gray-300">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>


        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} found
          </p>
          {(searchQuery || selectedSubject !== 'All Subjects') && (
            <Button
              variant="ghost"
              className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
              onClick={() => {
                setSearchQuery('');
                setSelectedSubject('All Subjects');
              }}
            >
              <X size={16} className="mr-2" />
              Clear filters
            </Button>
          )}
        </div>

        {/* Notes Grid */}
        {loading ? (
          // Loading skeletons
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredNotes.length === 0 ? (
          // No results
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full p-4 inline-block mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No notes found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We couldn't find any notes matching your criteria. Try adjusting your filters or search query.
            </p>
          </div>
        ) : (
          // Notes grid - using CSS grid with static positioning to prevent layout shifts
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative" style={{ minHeight: filteredNotes.length > 0 ? '200px' : '0' }}>
            <AnimatePresence>
              {filteredNotes.map(note => (
                <NoteDetails
                  key={note.id}
                  note={note}
                  isSaved={savedNotes.includes(note.id)}
                  onSave={toggleSaveNote}
                  onDownload={handleDownload}
                  onView={handleViewNote}
                  formatDate={formatDate}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
