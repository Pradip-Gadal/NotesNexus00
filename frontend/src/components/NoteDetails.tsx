import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  BookOpen,
  Calendar,
  User,
  Eye,
  ThumbsUp,
  Download,
  Bookmark
} from 'lucide-react';

import { Button } from '@/components/ui/button';

// Define the Note interface
export interface Note {
  id: string;
  title: string;
  description: string;
  academicLevel: string;
  grade: string;
  subject: string;
  academicName?: string; // Name of the school/college
  uploadDate: string;
  uploadedBy: {
    name: string;
    id: string;
  };
  fileType: string;
  fileSize: string;
  coverImage?: string;
  views: number;
  likes: number;
  downloads: number;
  tags: string[];
}

interface NoteDetailsProps {
  note: Note;
  isSaved: boolean;
  onSave: (noteId: string) => void;
  onDownload: (noteId: string) => void;
  onView?: (noteId: string) => void; // Optional callback for viewing the note
  formatDate: (dateString: string) => string;
}

const NoteDetails: React.FC<NoteDetailsProps> = ({
  note,
  isSaved,
  onSave,
  onDownload,
  onView,
  formatDate
}) => {
  // Get file icon based on file type
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'ppt':
      case 'pptx':
        return <FileText className="h-5 w-5 text-orange-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <motion.div
      key={note.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        opacity: { duration: 0.2 },
        scale: { duration: 0.15 },
        layout: { duration: 0.2 }
      }}
      layout
      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onView && onView(note.id)}
    >
      {/* Cover image or placeholder */}
      <div className="relative h-40 bg-gray-100 overflow-hidden">
        {note.coverImage ? (
          <img
            src={note.coverImage}
            alt={note.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-indigo-50 to-blue-50">
            <BookOpen size={48} className="text-indigo-300" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent event bubbling
              onSave(note.id);
            }}
            className={`p-2 rounded-full ${
              isSaved
                ? 'bg-indigo-100 text-indigo-600'
                : 'bg-white/80 text-gray-600 hover:text-indigo-600'
            }`}
            aria-label={isSaved ? 'Unsave note' : 'Save note'}
          >
            <Bookmark
              size={18}
              className={isSaved ? 'fill-indigo-600' : ''}
            />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {getFileIcon(note.fileType)}
          <span className="text-xs text-gray-500 uppercase">{note.fileType} • {note.fileSize}</span>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{note.title}</h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{note.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 font-medium">
            Subject: {note.subject}
          </span>
          <span className="text-xs px-2 py-1 rounded-md bg-green-50 text-green-700 font-medium">
            {note.grade.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </div>
        <div>          
          {note.academicName && (
            <span className="text-xs px-2 py-1 rounded-md bg-purple-50 text-purple-700 font-medium">
              {note.academicName}
            </span>
          )}</div>  
       
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{formatDate(note.uploadDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>{note.uploadedBy.name}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Eye size={14} />
              <span>{note.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp size={14} />
              <span>{note.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download size={14} />
              <span>{note.downloads}</span>
            </div>
          </div>

          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation(); // Prevent event bubbling
              onDownload(note.id);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Download size={14} className="mr-1" />
            Download
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default NoteDetails;

