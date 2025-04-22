import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AcademicLevels } from '../components/AcademicLevels';
import { RecentNotes } from '../components/RecentNotes';

export default function BrowseNotes() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('academic-levels');

  // Check URL parameters for tab selection
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam === 'recent-notes') {
      setActiveTab('recent-notes');
    } else if (tabParam === 'academic-levels' || !tabParam) {
      setActiveTab('academic-levels');
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4">
      <div className="container mx-auto">
        <Tabs
          defaultValue="academic-levels"
          value={activeTab}
          onValueChange={(value) => {
          setActiveTab(value);
          // Update URL without reloading the page
          const searchParams = new URLSearchParams(location.search);
          if (value === 'academic-levels') {
            searchParams.delete('tab');
          } else {
            searchParams.set('tab', value);
          }
          navigate({ search: searchParams.toString() }, { replace: true });
        }}
          className="w-full mx-auto"
        >
          <div className="flex justify-center mb-8">
            <div className="max-w-4xl w-full">
              <TabsList className="bg-gray-800 border border-gray-700 w-full">
                <TabsTrigger
                  value="academic-levels"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex-1"
                >
                  Academic Levels
                </TabsTrigger>
                <TabsTrigger
                  value="recent-notes"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex-1"
                >
                  Recent Notes
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="academic-levels" className="mt-0">
            <AcademicLevels />
          </TabsContent>

          <TabsContent value="recent-notes" className="mt-0">
            <RecentNotes />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
