import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Download, 
  Eye, 
  Heart, 
  Search, 
  Filter,
  BookOpen,
  Clock,
  Star,
  Bookmark,
  BookmarkX
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '../contexts/UserContext';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import "../styles/luxury-theme.css";

// Mock data for saved files
interface SavedFile {
  id: string;
  title: string;
  subject: string;
  level: string;
  grade: string;
  author: string;
  savedDate: string;
  uploadDate: string;
  views: number;
  downloads: number;
  rating: number;
  tags: string[];
}

const mockSavedFiles: SavedFile[] = [
  {
    id: '1',
    title: 'Quantum Physics Fundamentals',
    subject: 'Physics',
    level: 'Bachelor\'s Degree Programs',
    grade: 'Year 3',
    author: 'Dr. Rajesh Sharma',
    savedDate: '2023-12-10',
    uploadDate: '2023-10-05',
    views: 3245,
    downloads: 1267,
    rating: 4.9,
    tags: ['Quantum', 'Physics', 'Advanced'],
  },
  {
    id: '2',
    title: 'Nepali Grammar and Composition',
    subject: 'Nepali',
    level: 'Secondary Level',
    grade: 'Grade 10',
    author: 'Sita Adhikari',
    savedDate: '2023-11-22',
    uploadDate: '2023-09-15',
    views: 1890,
    downloads: 945,
    rating: 4.7,
    tags: ['Grammar', 'Nepali', 'Composition'],
  },
  {
    id: '3',
    title: 'Data Structures and Algorithms',
    subject: 'Computer Science',
    level: 'Bachelor\'s Degree Programs',
    grade: 'Year 2',
    author: 'Anish Thapa',
    savedDate: '2023-11-05',
    uploadDate: '2023-08-20',
    views: 4567,
    downloads: 2189,
    rating: 4.8,
    tags: ['DSA', 'Algorithms', 'Programming'],
  },
  {
    id: '4',
    title: 'Organic Chemistry Reactions',
    subject: 'Chemistry',
    level: 'Higher Secondary Level',
    grade: 'Grade 12',
    author: 'Dr. Priya Poudel',
    savedDate: '2023-10-18',
    uploadDate: '2023-07-30',
    views: 2345,
    downloads: 1123,
    rating: 4.6,
    tags: ['Chemistry', 'Organic', 'Reactions'],
  },
  {
    id: '5',
    title: 'Calculus Problem Solving',
    subject: 'Mathematics',
    level: 'Higher Secondary Level',
    grade: 'Grade 11',
    author: 'Rohan KC',
    savedDate: '2023-09-30',
    uploadDate: '2023-06-15',
    views: 3120,
    downloads: 1567,
    rating: 4.5,
    tags: ['Calculus', 'Mathematics', 'Problems'],
  },
];

// Filter options
const subjects = ['All Subjects', 'Physics', 'Nepali', 'Computer Science', 'Chemistry', 'Mathematics'];
const levels = ['All Levels', 'Primary Level', 'Lower Secondary Level', 'Secondary Level', 'Higher Secondary Level', 'Bachelor\'s Degree Programs', 'Master\'s Degree Programs'];
const sortOptions = ['Recently Saved', 'Highest Rated', 'Most Downloaded', 'Most Viewed'];

export default function SavedFiles() {
  const navigate = useNavigate();
  const { user, profile } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [sortBy, setSortBy] = useState('Recently Saved');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort files based on user selections
  const filteredFiles = mockSavedFiles
    .filter(file => {
      const matchesSearch = file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSubject = selectedSubject === 'All Subjects' || file.subject === selectedSubject;
      const matchesLevel = selectedLevel === 'All Levels' || file.level === selectedLevel;

      return matchesSearch && matchesSubject && matchesLevel;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'Recently Saved':
          return new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime();
        case 'Highest Rated':
          return b.rating - a.rating;
        case 'Most Downloaded':
          return b.downloads - a.downloads;
        case 'Most Viewed':
          return b.views - a.views;
        default:
          return 0;
      }
    });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white py-8 px-4"
    >
      <div className="container mx-auto max-w-4xl">
        {/* Header with back button */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/profile')}
            className="mr-4 p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Your Saved Files</h1>
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-xl p-6 mb-8 shadow-sm border border-pink-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Heart className="mr-2 text-pink-500" size={20} />
            Saved Files Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-pink-100 flex flex-col items-center">
              <div className="text-3xl font-bold text-pink-600 mb-1">{mockSavedFiles.length}</div>
              <div className="text-sm text-gray-600">Total Saved Files</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-pink-100 flex flex-col items-center">
              <div className="text-3xl font-bold text-pink-600 mb-1">
                {mockSavedFiles.reduce((sum, file) => sum + file.downloads, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Downloads</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-pink-100 flex flex-col items-center">
              <div className="text-3xl font-bold text-pink-600 mb-1">
                {(mockSavedFiles.reduce((sum, file) => sum + file.rating, 0) / mockSavedFiles.length).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search saved files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 text-gray-800"
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-gray-300 text-gray-700"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              Filters
            </Button>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200 text-gray-800">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 text-gray-800">
                {sortOptions.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="bg-white border-gray-200 text-gray-800">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 text-gray-800">
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Academic Level</label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="bg-white border-gray-200 text-gray-800">
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 text-gray-800">
                    {levels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}
        </div>

        {/* Files Grid */}
        {filteredFiles.length > 0 ? (
          <div className="space-y-4">
            {filteredFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{file.title}</h3>
                    <p className="text-sm text-gray-500">
                      By {file.author} • Saved on {new Date(file.savedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-gray-700 font-medium">{file.rating}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {file.subject}
                  </Badge>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    {file.level}
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {file.grade}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {file.tags.map(tag => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{file.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Download className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{file.downloads.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-400" />
                      <span>Uploaded {new Date(file.uploadDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      <Download size={16} className="mr-1" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <BookmarkX size={16} className="mr-1" />
                      Unsave
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <Bookmark className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No saved files found</h3>
            <p className="text-gray-500 mb-4">You haven't saved any files yet or your search filters don't match any saved files.</p>
            <Button
              onClick={() => navigate('/browse-notes')}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <BookOpen size={16} className="mr-2" />
              Browse Notes
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
