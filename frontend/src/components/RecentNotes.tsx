import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, Star, Download, Eye, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

// Mock data for recent notes
interface Note {
  id: string;
  title: string;
  subject: string;
  level: string;
  grade: string;
  author: string;
  uploadDate: string;
  views: number;
  downloads: number;
  likes: number;
  rating: number;
  tags: string[];
}

const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Introduction to Algebra',
    subject: 'Mathematics',
    level: 'Secondary Level',
    grade: 'Grade 9',
    author: 'Aarav Sharma',
    uploadDate: '2023-10-15',
    views: 1245,
    downloads: 567,
    likes: 89,
    rating: 4.7,
    tags: ['Algebra', 'Equations', 'Mathematics'],
  },
  {
    id: '2',
    title: 'Nepali Literature Overview',
    subject: 'Nepali',
    level: 'Higher Secondary Level',
    grade: 'Grade 11',
    author: 'Sita Thapa',
    uploadDate: '2023-10-10',
    views: 980,
    downloads: 432,
    likes: 76,
    rating: 4.5,
    tags: ['Literature', 'Poetry', 'Nepali'],
  },
  {
    id: '3',
    title: 'Cell Biology Fundamentals',
    subject: 'Biology',
    level: 'Higher Secondary Level',
    grade: 'Grade 12',
    author: 'Rohan Poudel',
    uploadDate: '2023-10-05',
    views: 1567,
    downloads: 789,
    likes: 120,
    rating: 4.8,
    tags: ['Biology', 'Cells', 'Science'],
  },
  {
    id: '4',
    title: 'Basic English Grammar',
    subject: 'English',
    level: 'Primary Level',
    grade: 'Grade 5',
    author: 'Priya Gurung',
    uploadDate: '2023-09-28',
    views: 2345,
    downloads: 1234,
    likes: 210,
    rating: 4.9,
    tags: ['Grammar', 'English', 'Language'],
  },
  {
    id: '5',
    title: 'Introduction to Programming',
    subject: 'Computer Science',
    level: 'Bachelor\'s Degree Programs',
    grade: 'Year 1',
    author: 'Anish KC',
    uploadDate: '2023-09-20',
    views: 1890,
    downloads: 876,
    likes: 156,
    rating: 4.6,
    tags: ['Programming', 'Computer Science', 'Coding'],
  },
  {
    id: '6',
    title: 'Nepali History: Ancient Period',
    subject: 'History',
    level: 'Secondary Level',
    grade: 'Grade 10',
    author: 'Binod Adhikari',
    uploadDate: '2023-09-15',
    views: 1120,
    downloads: 543,
    likes: 87,
    rating: 4.4,
    tags: ['History', 'Nepal', 'Ancient'],
  },
];

// Filter options
const subjects = ['All Subjects', 'Mathematics', 'Nepali', 'English', 'Science', 'Computer Science', 'History', 'Biology'];
const levels = ['All Levels', 'Primary Level', 'Lower Secondary Level', 'Secondary Level', 'Higher Secondary Level', 'Bachelor\'s Degree Programs', 'Master\'s Degree Programs'];
const sortOptions = ['Most Recent', 'Most Popular', 'Highest Rated', 'Most Downloaded'];

export function RecentNotes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [sortBy, setSortBy] = useState('Most Recent');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort notes based on user selections
  const filteredNotes = mockNotes
    .filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSubject = selectedSubject === 'All Subjects' || note.subject === selectedSubject;
      const matchesLevel = selectedLevel === 'All Levels' || note.level === selectedLevel;

      return matchesSearch && matchesSubject && matchesLevel;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'Most Recent':
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        case 'Most Popular':
          return b.views - a.views;
        case 'Highest Rated':
          return b.rating - a.rating;
        case 'Most Downloaded':
          return b.downloads - a.downloads;
        default:
          return 0;
      }
    });

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-white">Recent Notes</h2>
      <p className="text-center text-gray-300 mb-10">
        Discover the latest study materials uploaded by students across Nepal
      </p>

      {/* Search and Filter Bar */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search notes by title, subject, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2 border-gray-700 text-gray-300"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            Filters
          </Button>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
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
            className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700"
          >
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Academic Level</label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                  {levels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        )}
      </div>

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNotes.map((note) => (
            <motion.div
              key={note.id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 hover:border-gray-500 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-white">{note.title}</h3>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-white">{note.rating}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-700">
                    {note.subject}
                  </Badge>
                  <Badge variant="outline" className="bg-purple-900/30 text-purple-300 border-purple-700">
                    {note.level}
                  </Badge>
                  <Badge variant="outline" className="bg-green-900/30 text-green-300 border-green-700">
                    {note.grade}
                  </Badge>
                </div>

                <div className="flex items-center text-gray-400 text-sm mb-4">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Uploaded on {new Date(note.uploadDate).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <span>by {note.author}</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {note.tags.map(tag => (
                    <span key={tag} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{note.views}</span>
                    </div>
                    <div className="flex items-center">
                      <Download className="h-4 w-4 mr-1" />
                      <span>{note.downloads}</span>
                    </div>
                    <div className="flex items-center">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      <span>{note.likes}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="default" className="bg-blue-600 hover:bg-blue-700">
                    View Note
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-2">No notes found</h3>
          <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300"
            onClick={() => {
              setSearchQuery('');
              setSelectedSubject('All Subjects');
              setSelectedLevel('All Levels');
              setSortBy('Most Recent');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
