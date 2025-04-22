import React, { useState, useCallback } from 'react';
import { supabase } from 'utils/supabaseClient';
import { useAuthStore } from 'utils/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress'; // For upload progress
import { toast } from 'sonner';
import { UploadCloud } from 'lucide-react';

interface Props {
    bucketName: string; // e.g., 'project_assets'
    // Optional path prefix, e.g., `${projectId}/` 
    // If provided, ensures files are uploaded within this folder
    pathPrefix?: string; 
    onUploadSuccess?: (filePath: string) => void; // Callback with the uploaded file path
    allowedFileTypes?: string[]; // e.g., ['image/png', 'image/jpeg']
    maxFileSize?: number; // Max file size in bytes
}

export function FileUpload({ 
    bucketName,
    pathPrefix = '', 
    onUploadSuccess,
    allowedFileTypes,
    maxFileSize = 5 * 1024 * 1024 // Default 5MB
}: Props) {
    const { user } = useAuthStore();
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setFileError(null); // Clear previous errors
        setSelectedFile(null);
        setUploadProgress(null);

        if (file) {
            // Validate file type
            if (allowedFileTypes && !allowedFileTypes.includes(file.type)) {
                setFileError(`Invalid file type. Allowed types: ${allowedFileTypes.join(', ')}`);
                return;
            }
            // Validate file size
            if (file.size > maxFileSize) {
                 setFileError(`File is too large. Max size: ${Math.round(maxFileSize / 1024 / 1024)}MB`);
                 return;
            }
            setSelectedFile(file);
        }
    };

    const handleUpload = useCallback(async () => {
        if (!selectedFile || !user) {
            toast.error("No file selected or user not logged in.");
            return;
        }

        setUploading(true);
        setUploadProgress(0);
        setFileError(null);

        // Construct the storage path: <user_id>/<pathPrefix><filename>
        // Ensure pathPrefix ends with '/' if provided and not empty
        const prefix = pathPrefix && pathPrefix.trim() !== '' 
                       ? (pathPrefix.endsWith('/') ? pathPrefix : `${pathPrefix}/`)
                       : '';
        const filePath = `${user.id}/${prefix}${selectedFile.name}`;
        
        console.log(`Uploading file to bucket: ${bucketName}, path: ${filePath}`);

        try {
            const { error } = await supabase.storage
                .from(bucketName)
                .upload(filePath, selectedFile, {
                    cacheControl: '3600', // Optional: Cache control
                    upsert: true, // Optional: Overwrite file if it exists
                    // Removed `contentType` - Supabase infers it
                });
                // Note: Supabase JS client v2 doesn't directly support progress callback in .upload()
                // For progress, you might need XHR or a library wrapping it if crucial.
                // Simulating progress completion for now.
                setUploadProgress(100);

            if (error) {
                console.error('Error uploading file:', error);
                throw error;
            }

            console.log('File uploaded successfully:', filePath);
            toast.success(`File "${selectedFile.name}" uploaded successfully!`);
            setSelectedFile(null); // Clear selection after upload
            if (onUploadSuccess) {
                onUploadSuccess(filePath); // Pass the full path
            }

        } catch (error: any) {
            console.error('Upload exception:', error);
            setFileError(`Upload failed: ${error.message}`);
            toast.error(`Upload failed: ${error.message}`);
        } finally {
            setUploading(false);
            // Keep progress at 100 or clear it after a delay?
            // setTimeout(() => setUploadProgress(null), 2000); 
        }
    }, [selectedFile, user, bucketName, pathPrefix, onUploadSuccess]);

    return (
        <div className="space-y-4 p-4 border rounded-lg bg-card">
            <Label htmlFor="file-upload" className="text-lg font-semibold">Upload File</Label>
            <Input 
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                disabled={uploading}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            {selectedFile && (
                <p className="text-sm text-muted-foreground">
                    Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                </p>
            )}
            {fileError && (
                <p className="text-sm text-red-600">{fileError}</p>
            )}
            {uploadProgress !== null && (
                <Progress value={uploadProgress} className="w-full" />
            )}
            <Button 
                onClick={handleUpload} 
                disabled={!selectedFile || uploading || !!fileError}
            >
                <UploadCloud className="mr-2 h-4 w-4" />
                {uploading ? `Uploading... ${uploadProgress !== null ? `${uploadProgress}%` : ''}` : 'Upload'}
            </Button>
        </div>
    );
}
