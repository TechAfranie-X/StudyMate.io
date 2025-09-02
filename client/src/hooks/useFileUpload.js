import { useState, useCallback, useRef } from 'react';

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  // File validation
  const validateFile = useCallback((file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'text/csv'
    ];

    const errors = [];

    if (file.size > maxSize) {
      errors.push(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push('File type not supported. Please upload images, documents, or text files.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  // Single file upload
  const uploadFile = useCallback(async (file, onProgress) => {
    const validation = validateFile(file);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate file upload with progress
      const uploadPromise = new Promise((resolve, reject) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 20;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Simulate successful upload
            const uploadedFile = {
              id: Date.now() + Math.random(),
              name: file.name,
              size: file.size,
              type: file.type,
              url: URL.createObjectURL(file), // In real app, this would be the server URL
              uploadedAt: new Date(),
              originalFile: file
            };
            
            resolve(uploadedFile);
          }
          
          setUploadProgress(progress);
          if (onProgress) onProgress(progress);
        }, 100);
      });

      const uploadedFile = await uploadPromise;
      
      setUploadedFiles(prev => [...prev, uploadedFile]);
      setUploadProgress(0);
      
      return uploadedFile;
    } catch (error) {
      setUploadProgress(0);
      throw error;
    } finally {
      setUploading(false);
    }
  }, [validateFile]);

  // Multiple file upload
  const uploadMultipleFiles = useCallback(async (files, onProgress) => {
    const validFiles = Array.from(files).filter(file => {
      const validation = validateFile(file);
      return validation.isValid;
    });

    if (validFiles.length === 0) {
      throw new Error('No valid files to upload');
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = validFiles.map((file, index) => {
        return uploadFile(file, (progress) => {
          const overallProgress = (progress / validFiles.length) + (index / validFiles.length) * 100;
          setUploadProgress(overallProgress);
          if (onProgress) onProgress(overallProgress);
        });
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setUploadProgress(100);
      
      return uploadedFiles;
    } catch (error) {
      setUploadProgress(0);
      throw error;
    } finally {
      setUploading(false);
    }
  }, [uploadFile, validateFile]);

  // Remove file
  const removeFile = useCallback((fileId) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove && fileToRemove.url.startsWith('blob:')) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return prev.filter(f => f.id !== fileId);
    });
  }, []);

  // Remove all files
  const removeAllFiles = useCallback(() => {
    setUploadedFiles(prev => {
      prev.forEach(file => {
        if (file.url.startsWith('blob:')) {
          URL.revokeObjectURL(file.url);
        }
      });
      return [];
    });
  }, []);

  // Get file preview
  const getFilePreview = useCallback((file) => {
    if (file.type.startsWith('image/')) {
      return file.url;
    }
    
    // Return appropriate icon for different file types
    const fileIcons = {
      'application/pdf': '📄',
      'application/msword': '📝',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
      'application/vnd.ms-excel': '📊',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
      'text/plain': '📄',
      'text/csv': '📊'
    };
    
    return fileIcons[file.type] || '📎';
  }, []);

  // Format file size
  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // Get file extension
  const getFileExtension = useCallback((filename) => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  }, []);

  // Check if file is image
  const isImage = useCallback((file) => {
    return file.type.startsWith('image/');
  }, []);

  // Check if file is document
  const isDocument = useCallback((file) => {
    return file.type.includes('pdf') || 
           file.type.includes('word') || 
           file.type.includes('excel') || 
           file.type.includes('text');
  }, []);

  // Get file type category
  const getFileCategory = useCallback((file) => {
    if (isImage(file)) return 'image';
    if (isDocument(file)) return 'document';
    return 'other';
  }, [isImage, isDocument]);

  // Group files by category
  const getFilesByCategory = useCallback(() => {
    const grouped = {
      image: [],
      document: [],
      other: []
    };

    uploadedFiles.forEach(file => {
      const category = getFileCategory(file);
      grouped[category].push(file);
    });

    return grouped;
  }, [uploadedFiles, getFileCategory]);

  // Open file picker
  const openFilePicker = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  // Handle file input change
  const handleFileInputChange = useCallback(async (event, onSuccess, onError) => {
    const files = event.target.files;
    if (files.length === 0) return;

    try {
      if (files.length === 1) {
        const uploadedFile = await uploadFile(files[0]);
        if (onSuccess) onSuccess(uploadedFile);
      } else {
        const uploadedFiles = await uploadMultipleFiles(files);
        if (onSuccess) onSuccess(uploadedFiles);
      }
    } catch (error) {
      if (onError) onError(error);
    }

    // Reset input
    event.target.value = '';
  }, [uploadFile, uploadMultipleFiles]);

  // Drag and drop handlers
  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (event, onSuccess, onError) => {
    event.preventDefault();
    event.stopPropagation();

    const files = Array.from(event.dataTransfer.files);
    if (files.length === 0) return;

    try {
      if (files.length === 1) {
        const uploadedFile = await uploadFile(files[0]);
        if (onSuccess) onSuccess(uploadedFile);
      } else {
        const uploadedFiles = await uploadMultipleFiles(files);
        if (onSuccess) onSuccess(uploadedFiles);
      }
    } catch (error) {
      if (onError) onError(error);
    }
  }, [uploadFile, uploadMultipleFiles]);

  // Get upload status
  const getUploadStatus = useCallback(() => {
    if (uploading) {
      return {
        status: 'uploading',
        message: `Uploading... ${Math.round(uploadProgress)}%`,
        progress: uploadProgress
      };
    }

    if (uploadedFiles.length > 0) {
      return {
        status: 'success',
        message: `${uploadedFiles.length} file(s) uploaded successfully`,
        progress: 100
      };
    }

    return {
      status: 'idle',
      message: 'No files uploaded',
      progress: 0
    };
  }, [uploading, uploadProgress, uploadedFiles.length]);

  return {
    // State
    uploading,
    uploadProgress,
    uploadedFiles,
    
    // Refs
    fileInputRef,
    
    // Actions
    uploadFile,
    uploadMultipleFiles,
    removeFile,
    removeAllFiles,
    openFilePicker,
    handleFileInputChange,
    handleDragOver,
    handleDrop,
    
    // Utilities
    validateFile,
    getFilePreview,
    formatFileSize,
    getFileExtension,
    isImage,
    isDocument,
    getFileCategory,
    getFilesByCategory,
    getUploadStatus,
  };
};





