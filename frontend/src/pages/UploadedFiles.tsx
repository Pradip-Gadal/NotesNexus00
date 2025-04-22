import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Download, 
  Eye, 
  ThumbsUp, 
  ThumbsDown, 
  BarChart2, 
  FileText,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '../contexts/UserContext';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import "../styles/luxury-theme.css";

// Mock data for uploaded notes
interface UploadedNote {
  id: string;
  title: string;
  subject: string;
  level: string;
  grade: string;
  uploadDate: string;
  views: number;
  downloads: number;
  likes: number;
  dislikes: number;
  status: 'published' | 'draft' | 'under review';
  tags: string[];
}

const mockUploadedNotes: UploadedNote[] = [
  {
    id: '1',
    title: 'Advanced Calculus Notes',
    subject: 'Mathematics',
    level: 'Higher Secondary Level',
    grade: 'Grade 12',
    uploadDate: '2023-11-15',
    views: 1245,
    downloads: 567,
    likes: 89,
    dislikes: 12,
    status: 'published',
    tags: ['Calculus', 'Mathematics', 'Differentiation', 'Integration'],
  },
  {
    id: '2',
    title: 'Organic Chemistry Formulas',
    subject: 'Chemistry',
    level: 'Bachelor\'s Degree Programs',
    grade: 'Year 1',
    uploadDate: '2023-10-22',
    views: 980,
    downloads: 432,
    likes: 76,
    dislikes: 8,
    status: 'published',
    tags: ['Chemistry', 'Organic', 'Formulas'],
  },
  {
    id: '3',
    title: 'Nepali Literature Analysis',
    subject: 'Nepali',
    level: 'Secondary Level',
    grade: 'Grade 10',
    uploadDate: '2023-09-05',
    views: 567,
    downloads: 189,
    likes: 45,
    dislikes: 5,
    status: 'published',
    tags: ['Nepali', 'Literature', 'Analysis'],
  },
  {
    id: '4',
    title: 'Computer Programming Basics',
    subject: 'Computer Science',
    level: 'Bachelor\'s Degree Programs',
    grade: 'Year 1',
    uploadDate: '2023-08-12',
    views: 2345,
    downloads: 1234,
    likes: 210,
    dislikes: 15,
    status: 'draft',
    tags: ['Programming', 'Computer Science', 'Basics'],
  },
];

// Statistics summary
interface StatsSummary {
  totalNotes: number;
  totalViews: number;
  totalDownloads: number;
  totalLikes: number;
  totalDislikes: number;
  mostViewedNote: string;
  mostDownloadedNote: string;
  mostLikedNote: string;
}

export default function UploadedFiles() {
  const navigate = useNavigate();
  const { user, profile } = useUser();
  const [activeTab, setActiveTab] = useState('all');

  // Calculate statistics
  const stats: StatsSummary = {
    totalNotes: mockUploadedNotes.length,
    totalViews: mockUploadedNotes.reduce((sum, note) => sum + note.views, 0),
    totalDownloads: mockUploadedNotes.reduce((sum, note) => sum + note.downloads, 0),
    totalLikes: mockUploadedNotes.reduce((sum, note) => sum + note.likes, 0),
    totalDislikes: mockUploadedNotes.reduce((sum, note) => sum + note.dislikes, 0),
    mostViewedNote: mockUploadedNotes.sort((a, b) => b.views - a.views)[0]?.title || 'None',
    mostDownloadedNote: mockUploadedNotes.sort((a, b) => b.downloads - a.downloads)[0]?.title || 'None',
    mostLikedNote: mockUploadedNotes.sort((a, b) => b.likes - a.likes)[0]?.title || 'None',
  };

  // Filter notes based on active tab
  const filteredNotes = mockUploadedNotes.filter(note => {
    if (activeTab === 'all') return true;
    if (activeTab === 'published') return note.status === 'published';
    if (activeTab === 'drafts') return note.status === 'draft';
    if (activeTab === 'review') return note.status === 'under review';
    return true;
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
          <h1 className="text-2xl font-bold text-gray-800">Your Uploaded Files</h1>
        </div>

        {/* Statistics Summary Card */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 mb-8 shadow-sm border border-indigo-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <BarChart2 className="mr-2 text-indigo-500" size={20} />
            Statistics Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Notes:</span>
                <span className="font-medium">{stats.totalNotes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Views:</span>
                <span className="font-medium">{stats.totalViews.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Downloads:</span>
                <span className="font-medium">{stats.totalDownloads.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Likes:</span>
                <span className="font-medium">{stats.totalLikes.toLocaleString()}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Most Viewed:</span>
                <span className="font-medium truncate ml-2">{stats.mostViewedNote}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Most Downloaded:</span>
                <span className="font-medium truncate ml-2">{stats.mostDownloadedNote}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Most Liked:</span>
                <span className="font-medium truncate ml-2">{stats.mostLikedNote}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Like/Dislike Ratio:</span>
                <span className="font-medium">
                  {(stats.totalLikes / (stats.totalDislikes || 1)).toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for filtering notes */}
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full mb-6"
        >
          <TabsList className="bg-gray-100 p-1 rounded-lg">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-2"
            >
              All Files
            </TabsTrigger>
            <TabsTrigger
              value="published"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-2"
            >
              Published
            </TabsTrigger>
            <TabsTrigger
              value="drafts"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-2"
            >
              Drafts
            </TabsTrigger>
            <TabsTrigger
              value="review"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-2"
            >
              Under Review
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {renderNotesList(filteredNotes)}
          </TabsContent>
          <TabsContent value="published" className="mt-6">
            {renderNotesList(filteredNotes)}
          </TabsContent>
          <TabsContent value="drafts" className="mt-6">
            {renderNotesList(filteredNotes)}
          </TabsContent>
          <TabsContent value="review" className="mt-6">
            {renderNotesList(filteredNotes)}
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );

  // Helper function to render the list of notes
  function renderNotesList(notes: UploadedNote[]) {
    if (notes.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No notes found</h3>
          <p className="text-gray-500 mb-4">You haven't uploaded any notes in this category yet.</p>
          <Button
            onClick={() => navigate('/profile')}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Upload a Note
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {notes.map((note) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{note.title}</h3>
                <p className="text-sm text-gray-500">
                  Uploaded on {new Date(note.uploadDate).toLocaleDateString()}
                </p>
              </div>
              <Badge
                className={`
                  ${note.status === 'published' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                  ${note.status === 'draft' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''}
                  ${note.status === 'under review' ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}
                `}
              >
                {note.status === 'published' ? 'Published' : 
                 note.status === 'draft' ? 'Draft' : 'Under Review'}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {note.subject}
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                {note.level}
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {note.grade}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {note.tags.map(tag => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{note.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  <Download className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{note.downloads.toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  <ThumbsUp className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{note.likes.toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  <ThumbsDown className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{note.dislikes.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} className="mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }
}
