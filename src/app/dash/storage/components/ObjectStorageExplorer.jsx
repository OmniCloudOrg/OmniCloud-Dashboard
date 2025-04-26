import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    HardDrive,
    Folder,
    Camera,
    FileText,
    Upload,
    Download,
    Link,
    Trash,
    Settings,
    BarChart2,
    Code,
    X,
    Save,
    Eye,
    File,
    AlertTriangle
} from 'lucide-react';
import FileEditorModal from './MonacoEditor';
import ReactDOM from 'react-dom';

// API service for file system operations
const FileSystemService = {
    // Base API URL - would be configured based on environment
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
    
    // Get files and folders at specified path
    getItems: async (path) => {
        try {
            const response = await fetch(`${FileSystemService.baseUrl}/fs?path=${encodeURIComponent(path)}`);
            if (!response.ok) throw new Error('Failed to fetch items');
            return await response.json();
        } catch (error) {
            console.error('Error fetching file system items:', error);
            throw error;
        }
    },
    
    // Get file content
    getFileContent: async (path, fileName) => {
        try {
            const fullPath = `${path}${fileName}`.replace(/\/+/g, '/');
            const response = await fetch(`${FileSystemService.baseUrl}/fs/file?path=${encodeURIComponent(fullPath)}`);
            if (!response.ok) throw new Error('Failed to fetch file content');
            return await response.json();
        } catch (error) {
            console.error('Error fetching file content:', error);
            throw error;
        }
    },
    
    // Save file content
    saveFileContent: async (path, fileName, content) => {
        try {
            const fullPath = `${path}${fileName}`.replace(/\/+/g, '/');
            const response = await fetch(`${FileSystemService.baseUrl}/fs/file`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ path: fullPath, content })
            });
            if (!response.ok) throw new Error('Failed to save file');
            return await response.json();
        } catch (error) {
            console.error('Error saving file:', error);
            throw error;
        }
    },
    
    // Delete file or folder
    deleteItem: async (path, isFolder) => {
        try {
            const response = await fetch(`${FileSystemService.baseUrl}/fs`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ path, isFolder })
            });
            if (!response.ok) throw new Error('Failed to delete item');
            return await response.json();
        } catch (error) {
            console.error('Error deleting item:', error);
            throw error;
        }
    },
    
    // Upload file
    uploadFile: async (path, file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('path', path);
            
            const response = await fetch(`${FileSystemService.baseUrl}/fs/upload`, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) throw new Error('Failed to upload file');
            return await response.json();
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    },
    
    // Download file
    downloadFile: async (path, fileName) => {
        try {
            const fullPath = `${path}${fileName}`.replace(/\/+/g, '/');
            window.open(`${FileSystemService.baseUrl}/fs/download?path=${encodeURIComponent(fullPath)}`);
            return true;
        } catch (error) {
            console.error('Error downloading file:', error);
            throw error;
        }
    }
};

// Helper function to load sample filesystem from JSON file
const loadSampleFileSystem = async () => {
    // For immediate development/debugging, directly use the hardcoded sample data
    // instead of loading from external file which might be causing issues
    
    const sampleData = await import('./sample_fs.json').then(module => module.default);
    
    // First try to fetch from external file
    try {
        const response = await fetch('./sample_fs.json');
        if (response.ok) {
            const data = await response.json();
            console.log("Successfully loaded sample filesystem from external file");
            return data;
        } else {
            console.warn('Could not load sample_fs.json file, using hardcoded data instead');
            return sampleData;
        }
    } catch (error) {
        console.warn('Error loading sample filesystem from file:', error);
        console.log('Using hardcoded sample data instead');
        return sampleData;
    }
};

// Main Component
const ObjectStorageExplorer = ({ bucket, demoMode = true }) => {
    const [currentPath, setCurrentPath] = useState('/');
    const [fileSystem, setFileSystem] = useState({});
    const [openFiles, setOpenFiles] = useState([]);
    const [topZIndex, setTopZIndex] = useState(100);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});

    // Initialize and load file system
    useEffect(() => {
        const loadFileSystem = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                if (demoMode) {
                    // Load sample file system from JSON file
                    const sampleFs = await loadSampleFileSystem();
                    console.log("Loaded sample filesystem:", sampleFs); // Debug logging
                    setFileSystem(sampleFs);
                } else {
                    // Load from API
                    const apiData = await FileSystemService.getItems('/');
                    setFileSystem(apiData);
                }
            } catch (err) {
                console.error('Error loading file system:', err);
                setError('Failed to load file system. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        
        loadFileSystem();
    }, [demoMode]);

    // Fetch items when path changes
    useEffect(() => {
        if (currentPath === '/' && Object.keys(fileSystem).length > 0) {
            // Root path already loaded
            return;
        }
        
        const fetchItems = async () => {
            if (demoMode) {
                // In demo mode, we don't need to fetch again as we already have the full structure
                return;
            }
            
            setIsLoading(true);
            setError(null);
            
            try {
                const apiData = await FileSystemService.getItems(currentPath);
                
                // Update file system with new path data
                setFileSystem(prevFs => ({
                    ...prevFs,
                    [currentPath]: apiData[currentPath]
                }));
            } catch (err) {
                console.error('Error fetching items for path:', currentPath, err);
                setError(`Failed to load items for ${currentPath}`);
            } finally {
                setIsLoading(false);
            }
        };
        
        if (!demoMode) {
            fetchItems();
        }
    }, [currentPath, demoMode, fileSystem]);

    // Get items based on current path
    const getItemsForCurrentPath = () => {
        // If file system isn't loaded yet or path doesn't exist
        if (!fileSystem[currentPath]) {
            return { folders: [], files: [] };
        }

        return {
            folders: fileSystem[currentPath].folders || [],
            files: fileSystem[currentPath].files || []
        };
    };

    const { folders, files } = getItemsForCurrentPath();

    // Function to get icon based on file type
    const getFileIcon = (type) => {
        switch (type) {
            case 'folder':
                return <Folder size={16} className="text-blue-400" />;
            case 'image':
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
            case 'svg':
            case 'webp':
                return <Camera size={16} className="text-green-400" />;
            case 'document':
            case 'docx':
            case 'doc':
            case 'pdf':
            case 'presentation':
            case 'pptx':
            case 'ppt':
            case 'spreadsheet':
            case 'xlsx':
            case 'xls':
                return <FileText size={16} className="text-amber-400" />;
            case 'markdown':
            case 'md':
            case 'json':
            case 'yaml':
            case 'yml':
            case 'config':
            case 'js':
            case 'jsx':
            case 'ts':
            case 'tsx':
            case 'py':
            case 'rb':
            case 'php':
            case 'java':
            case 'c':
            case 'cpp':
            case 'cs':
            case 'go':
            case 'rs':
            case 'rust':
            case 'html':
            case 'css':
            case 'scss':
                return <Code size={16} className="text-purple-400" />;
            case 'log':
                return <File size={16} className="text-red-400" />;
            case 'archive':
            case 'zip':
            case 'tar':
            case 'gz':
            case 'rar':
                return <Save size={16} className="text-cyan-400" />;
            default:
                return <FileText size={16} className="text-slate-400" />;
        }
    };

    // Handle folder click
    const handleFolderClick = (folderName) => {
        const newPath = `${currentPath}${folderName}/`;
        setCurrentPath(newPath);
    };

    // Handle bringing a window to the front
    const bringToFront = (fileId) => {
        setTopZIndex(prevZIndex => prevZIndex + 1);
        setOpenFiles(prevOpenFiles => 
            prevOpenFiles.map(file => 
                file.id === fileId 
                    ? { ...file, zIndex: topZIndex + 1 } 
                    : file
            )
        );
    };

    // Get file content from server or demo filesystem
    const getFileContent = async (path, fileName) => {
        if (demoMode) {
            // In demo mode, get content from the local state
            const pathData = fileSystem[path];
            if (pathData && pathData.files) {
                const file = pathData.files.find(f => f.name === fileName);
                return file ? file.content : null;
            }
            return null;
        } else {
            // Get from API
            const response = await FileSystemService.getFileContent(path, fileName);
            return response.content;
        }
    };

    // Handle file click
    const handleFileClick = async (file) => {
        // Check if file is editable
        const editableTypes = [
            'markdown', 'json', 'yaml', 'config', 'log', 'txt', 'html', 'css', 'js', 'jsx', 
            'ts', 'tsx', 'py', 'java', 'c', 'cpp', 'cs', 'php', 'rb', 'swift', 'go', 'rust', 
            'sh', 'bat', 'xml', 'ini', 'env', 'md', 'toml', 'csv', 'tsv', 'sql', 'pl', 
            'lua', 'r', 'kt', 'dart', 'scala', 'vb', 'asm', 'h', 'hpp', 'scss', 'less',
            // File extensions without dot
            'md', 'js', 'py', 'html', 'css', 'json', 'yml', 'rs' 
        ];
        
        // Extract file extension if present
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const isEditable = editableTypes.includes(file.type) || editableTypes.includes(fileExtension);
        
        if (isEditable) {
            // Check if the file is already open
            const isFileAlreadyOpen = openFiles.some(openFile => 
                openFile.path === currentPath && openFile.file.name === file.name
            );

            if (!isFileAlreadyOpen) {
                // Calculate a position offset for cascading windows
                const offsetX = (openFiles.length * 30) % 200;
                const offsetY = (openFiles.length * 30) % 200;
                
                // Calculate base position with better viewport utilization
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                
                // Start windows at the very top of the viewport with minimal padding
                const baseX = Math.max(0, (viewportWidth - 900) / 2); // 900px is approximate modal width
                const baseY = 10; // Start just 10px from the top
                
                // Create position with offset and constrain to viewport
                const position = constrainWindowPosition(
                    baseX + offsetX, 
                    baseY + offsetY
                );
                
                // Increment z-index for the new window
                setTopZIndex(prevZIndex => prevZIndex + 1);
                
                // Create a unique ID for the file instance
                const fileId = `${Date.now()}-${file.name}`;
                
                try {
                    // Fetch content if not already available
                    let fileContent = file.content;
                    if (!fileContent) {
                        fileContent = await getFileContent(currentPath, file.name);
                    }
                    
                    // Add the file to open files
                    setOpenFiles(prevOpenFiles => [
                        ...prevOpenFiles, 
                        {
                            id: fileId,
                            file: { ...file, content: fileContent },
                            path: currentPath,
                            zIndex: topZIndex + 1,
                            position: position
                        }
                    ]);
                    
                    console.log(`Opening editor for ${file.name}`);
                } catch (err) {
                    console.error(`Error opening file ${file.name}:`, err);
                    setError(`Failed to open file ${file.name}`);
                }
            } else {
                // If the file is already open, just bring it to the front
                const existingFile = openFiles.find(openFile => 
                    openFile.path === currentPath && openFile.file.name === file.name
                );
                
                if (existingFile) {
                    bringToFront(existingFile.id);
                }
            }
        } else {
            // For non-editable files like images, we could implement a preview
            console.log(`File preview not implemented for ${file.type || fileExtension} files`);
            
            // Offer to download the file
            if (window.confirm(`Do you want to download ${file.name}?`)) {
                handleDownload(file);
            }
        }
    };

    // Handle file save
    const handleFileSave = async (fileId, newContent) => {
        // Find the open file by ID
        const openFile = openFiles.find(f => f.id === fileId);
        
        if (openFile) {
            try {
                const path = openFile.path;
                const fileName = openFile.file.name;
                
                if (demoMode) {
                    // Update the file system in demo mode
                    const updatedFileSystem = { ...fileSystem };
                    
                    if (updatedFileSystem[path] && 
                        updatedFileSystem[path].files) {
                        
                        const fileToUpdate = updatedFileSystem[path].files.find(f => f.name === fileName);
                        
                        if (fileToUpdate) {
                            fileToUpdate.content = newContent;
                            fileToUpdate.lastModified = new Date().toISOString().split('T')[0];
                            setFileSystem(updatedFileSystem);
                        }
                    }
                } else {
                    // Save via API
                    await FileSystemService.saveFileContent(path, fileName, newContent);
                }
                
                // Update the content in the open file
                setOpenFiles(prevOpenFiles => 
                    prevOpenFiles.map(f => 
                        f.id === fileId 
                            ? { ...f, file: { ...f.file, content: newContent, lastModified: new Date().toISOString().split('T')[0] }} 
                            : f
                    )
                );
                
                // Success notification could be added here
                console.log(`File ${openFile.file.name} saved successfully`);
            } catch (err) {
                console.error('Error saving file:', err);
                setError(`Failed to save file ${openFile.file.name}`);
            }
        }
    };

    // Handle file close
    const handleFileClose = (fileId) => {
        setOpenFiles(prevOpenFiles => prevOpenFiles.filter(f => f.id !== fileId));
    };
    
    // Ensure windows stay within viewport bounds
    const constrainWindowPosition = (x, y) => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Ensure the window doesn't go outside the viewport
        // Allow positioning very close to the top (10px minimum)
        const boundedX = Math.min(Math.max(x, 0), viewportWidth - 300);
        const boundedY = Math.min(Math.max(y, 10), viewportHeight - 200);
        
        return { x: boundedX, y: boundedY };
    };

    // Handle file delete
    const handleDelete = async (item, isFolder = false) => {
        if (!window.confirm(`Are you sure you want to delete ${item}?`)) {
            return;
        }
        
        try {
            const itemPath = isFolder ? `${currentPath}${item}/` : `${currentPath}${item}`;
            
            if (demoMode) {
                // Handle delete in demo mode
                const updatedFileSystem = { ...fileSystem };
                
                if (isFolder) {
                    // For folders, remove from folders array
                    updatedFileSystem[currentPath].folders = updatedFileSystem[currentPath].folders.filter(
                        f => f !== item
                    );
                    
                    // Also remove the folder's own entry
                    delete updatedFileSystem[itemPath];
                } else {
                    // For files, remove from files array
                    updatedFileSystem[currentPath].files = updatedFileSystem[currentPath].files.filter(
                        f => f.name !== item
                    );
                    
                    // Close file if open
                    const openFile = openFiles.find(f => f.path === currentPath && f.file.name === item);
                    if (openFile) {
                        handleFileClose(openFile.id);
                    }
                }
                
                setFileSystem(updatedFileSystem);
            } else {
                // Delete via API
                await FileSystemService.deleteItem(itemPath, isFolder);
                
                // Refresh the current path to get updated data
                const apiData = await FileSystemService.getItems(currentPath);
                setFileSystem(prevFs => ({
                    ...prevFs,
                    [currentPath]: apiData[currentPath]
                }));
                
                // Close file if open
                if (!isFolder) {
                    const openFile = openFiles.find(f => f.path === currentPath && f.file.name === item);
                    if (openFile) {
                        handleFileClose(openFile.id);
                    }
                }
            }
        } catch (err) {
            console.error('Error deleting item:', err);
            setError(`Failed to delete ${isFolder ? 'folder' : 'file'} ${item}`);
        }
    };

    // Handle file download
    const handleDownload = async (file) => {
        try {
            if (demoMode) {
                // For demo mode, simulate download by creating a file in memory
                // and triggering a download
                const fileContent = file.content || '';
                const blob = new Blob([fileContent], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                // Download via API
                await FileSystemService.downloadFile(currentPath, file.name);
            }
        } catch (err) {
            console.error('Error downloading file:', err);
            setError(`Failed to download file ${file.name}`);
        }
    };

    // Handle file upload
    const handleUpload = async (files) => {
        if (!files || files.length === 0) return;
        
        // Reset progress
        setUploadProgress({});
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            try {
                setUploadProgress(prev => ({ 
                    ...prev, 
                    [file.name]: { progress: 0, status: 'uploading' } 
                }));
                
                if (demoMode) {
                    // Simulate file upload in demo mode
                    // Read file content
                    const reader = new FileReader();
                    
                    // Create a promise to handle the file reading
                    const readFileContent = new Promise((resolve, reject) => {
                        reader.onload = (e) => resolve(e.target.result);
                        reader.onerror = (e) => reject(e);
                        reader.readAsText(file);
                    });
                    
                    // Simulate progress
                    for (let progress = 0; progress <= 100; progress += 10) {
                        setUploadProgress(prev => ({
                            ...prev,
                            [file.name]: { progress, status: 'uploading' }
                        }));
                        
                        // Wait a bit to simulate network latency
                        await new Promise(r => setTimeout(r, 200));
                    }
                    
                    // Get file content
                    const content = await readFileContent;
                    
                    // Add file to demo filesystem
                    const fileExtension = file.name.split('.').pop().toLowerCase();
                    const newFile = {
                        name: file.name,
                        type: fileExtension,
                        size: `${Math.round(file.size / 1024)} KB`,
                        lastModified: new Date().toISOString().split('T')[0],
                        content: content
                    };
                    
                    setFileSystem(prevFs => {
                        const updatedFs = { ...prevFs };
                        if (!updatedFs[currentPath]) {
                            updatedFs[currentPath] = { folders: [], files: [] };
                        }
                        
                        // Check if file already exists, update it if it does
                        const existingFileIndex = updatedFs[currentPath].files.findIndex(
                            f => f.name === file.name
                        );
                        
                        if (existingFileIndex !== -1) {
                            // Update existing file
                            updatedFs[currentPath].files[existingFileIndex] = newFile;
                        } else {
                            // Add new file
                            updatedFs[currentPath].files = [
                                ...updatedFs[currentPath].files,
                                newFile
                            ];
                        }
                        
                        return updatedFs;
                    });
                    
                    setUploadProgress(prev => ({
                        ...prev,
                        [file.name]: { progress: 100, status: 'completed' }
                    }));
                } else {
                    // Upload via API
                    await FileSystemService.uploadFile(currentPath, file);
                    
                    // Refresh the current path to get updated data
                    const apiData = await FileSystemService.getItems(currentPath);
                    setFileSystem(prevFs => ({
                        ...prevFs,
                        [currentPath]: apiData[currentPath]
                    }));
                    
                    setUploadProgress(prev => ({
                        ...prev,
                        [file.name]: { progress: 100, status: 'completed' }
                    }));
                }
            } catch (err) {
                console.error(`Error uploading file ${file.name}:`, err);
                setUploadProgress(prev => ({
                    ...prev,
                    [file.name]: { progress: 0, status: 'error', message: err.message }
                }));
                setError(`Failed to upload file ${file.name}`);
            }
        }
        
        // Close upload modal after all files are processed
        setTimeout(() => {
            setShowUploadModal(false);
            setSelectedFiles([]);
        }, 1000);
    };

    // Handle settings click
    const handleSettingsClick = () => {
        // Implement settings panel/modal
        console.log('Settings clicked - not implemented yet');
    };

    // Handle analytics click
    const handleAnalyticsClick = () => {
        // Implement analytics panel/modal
        console.log('Analytics clicked - not implemented yet');
    };

    // Navigation breadcrumb
    const renderBreadcrumb = () => {
        const segments = currentPath.split('/').filter(Boolean);

        return (
            <div className="flex items-center gap-1 overflow-x-auto">
                <button
                    onClick={() => setCurrentPath('/')}
                    className="text-sm text-blue-400 hover:text-blue-300"
                >
                    root
                </button>

                {segments.map((segment, index) => {
                    const pathToSegment = '/' + segments.slice(0, index + 1).join('/') + '/';

                    return (
                        <React.Fragment key={index}>
                            <span className="text-slate-400">/</span>
                            <button
                                onClick={() => setCurrentPath(pathToSegment)}
                                className="text-sm text-blue-400 hover:text-blue-300"
                            >
                                {segment}
                            </button>
                        </React.Fragment>
                    );
                })}
            </div>
        );
    };

    // Upload modal component
    const UploadModal = () => {
        const fileInputRef = useRef(null);

        const handleFileChange = (e) => {
            setSelectedFiles(Array.from(e.target.files));
        };

        const handleDragOver = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };

        const handleDrop = (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                setSelectedFiles(Array.from(e.dataTransfer.files));
            }
        };

        const handleUploadClick = () => {
            if (selectedFiles.length > 0) {
                handleUpload(selectedFiles);
            }
        };

        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1100]">
                <div className="bg-slate-800 rounded-lg w-full max-w-lg p-6 shadow-xl border border-slate-700">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-white">Upload Files</h3>
                        <button 
                            onClick={() => setShowUploadModal(false)}
                            className="text-slate-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    
                    <div
                        className="border-2 border-dashed border-slate-600 rounded-lg p-8 mb-4 text-center"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            multiple
                        />
                        
                        <Upload size={36} className="mx-auto mb-2 text-slate-400" />
                        
                        <p className="text-slate-300 mb-2">
                            Drag and drop files here, or
                        </p>
                        
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Browse Files
                        </button>
                    </div>
                    
                    {selectedFiles.length > 0 && (
                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-slate-300 mb-2">
                                Selected Files: {selectedFiles.length}
                            </h4>
                            
                            <div className="max-h-40 overflow-y-auto">
                                {selectedFiles.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between py-2 border-b border-slate-700">
                                        <div className="flex items-center gap-2">
                                            {getFileIcon(file.name.split('.').pop())}
                                            <span className="text-sm text-slate-300">{file.name}</span>
                                        </div>
                                        <span className="text-xs text-slate-400">
                                            {Math.round(file.size / 1024)} KB
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {Object.keys(uploadProgress).length > 0 && (
                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-slate-300 mb-2">
                                Upload Progress
                            </h4>
                            
                            {Object.entries(uploadProgress).map(([fileName, { progress, status, message }]) => (
                                <div key={fileName} className="mb-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs text-slate-300">{fileName}</span>
                                        <span className="text-xs text-slate-400">
                                            {status === 'completed' ? 'Complete' : `${progress}%`}
                                        </span>
                                    </div>
                                    
                                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${
                                                status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                                            }`}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    
                                    {status === 'error' && message && (
                                        <p className="text-xs text-red-400 mt-1">{message}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setShowUploadModal(false)}
                            className="px-4 py-2 text-white rounded bg-slate-700 hover:bg-slate-600"
                        >
                            Cancel
                        </button>
                        
                        <button
                            onClick={handleUploadClick}
                            disabled={selectedFiles.length === 0}
                            className={`px-4 py-2 text-white rounded ${
                                selectedFiles.length === 0 
                                    ? 'bg-blue-600/50 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            Upload
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Create folder modal component
    const CreateFolderModal = ({ isOpen, onClose, onConfirm }) => {
        const [folderName, setFolderName] = useState('');
        
        const handleSubmit = (e) => {
            e.preventDefault();
            if (folderName.trim()) {
                onConfirm(folderName.trim());
                setFolderName('');
            }
        };
        
        if (!isOpen) return null;
        
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1100]">
                <div className="bg-slate-800 rounded-lg w-full max-w-md p-6 shadow-xl border border-slate-700">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-white">Create New Folder</h3>
                        <button onClick={onClose} className="text-slate-400 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="folderName" className="block text-sm font-medium text-slate-300 mb-2">
                                Folder Name
                            </label>
                            <input
                                type="text"
                                id="folderName"
                                value={folderName}
                                onChange={(e) => setFolderName(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                                placeholder="Enter folder name"
                                required
                            />
                        </div>
                        
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-white rounded bg-slate-700 hover:bg-slate-600"
                            >
                                Cancel
                            </button>
                            
                            <button
                                type="submit"
                                className="px-4 py-2 text-white rounded bg-blue-600 hover:bg-blue-700"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    // State for create folder modal
    const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
    
    // Function to handle create folder
    const handleCreateFolder = async (folderName) => {
        try {
            if (demoMode) {
                // Update file system in demo mode
                setFileSystem(prevFs => {
                    const updatedFs = { ...prevFs };
                    
                    // Ensure current path exists
                    if (!updatedFs[currentPath]) {
                        updatedFs[currentPath] = { folders: [], files: [] };
                    }
                    
                    // Check if folder already exists
                    if (!updatedFs[currentPath].folders.includes(folderName)) {
                        // Add folder to current path
                        updatedFs[currentPath].folders = [
                            ...updatedFs[currentPath].folders,
                            folderName
                        ];
                        
                        // Create new folder path
                        const newFolderPath = `${currentPath}${folderName}/`;
                        updatedFs[newFolderPath] = { folders: [], files: [] };
                    }
                    
                    return updatedFs;
                });
            } else {
                // Create folder via API
                // Assuming the API endpoint would be something like:
                await fetch(`${FileSystemService.baseUrl}/fs/folder`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ path: currentPath, folderName })
                });
                
                // Refresh current path
                const apiData = await FileSystemService.getItems(currentPath);
                setFileSystem(prevFs => ({
                    ...prevFs,
                    [currentPath]: apiData[currentPath]
                }));
            }
            
            // Close modal
            setShowCreateFolderModal(false);
        } catch (err) {
            console.error('Error creating folder:', err);
            setError(`Failed to create folder ${folderName}`);
        }
    };
    
    // Reference for file input
    const fileInputRef = useRef(null);
    
    return (
        <>
            {/* Render all open file editors */}
            {openFiles.map((openFile) => (
                ReactDOM.createPortal(
                    <div 
                        key={openFile.id} 
                        style={{ 
                            position: 'fixed', // Use fixed instead of absolute to avoid scrolling issues
                            zIndex: openFile.zIndex + 1000, // Start with a high base z-index to ensure it's above page content
                            left: `${openFile.position.x}px`,
                            top: `${openFile.position.y}px`
                        }}
                        onClick={() => bringToFront(openFile.id)}
                    >
                        <FileEditorModal
                            isOpen={true}
                            file={openFile.file}
                            onSave={(fileName, content) => handleFileSave(openFile.id, content)}
                            onClose={() => handleFileClose(openFile.id)}
                        />
                    </div>,
                    document.body
                )
            ))}
            
            {/* Upload Modal */}
            {showUploadModal && <UploadModal />}
            
            {/* Create Folder Modal */}
            <CreateFolderModal 
                isOpen={showCreateFolderModal}
                onClose={() => setShowCreateFolderModal(false)}
                onConfirm={handleCreateFolder}
            />
            
            {/* Hidden file input for upload button */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                        setSelectedFiles(Array.from(e.target.files));
                        setShowUploadModal(true);
                    }
                }}
                className="hidden"
                multiple
            />
            
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
                {/* Error message if present */}
                {error && (
                    <div className="bg-red-900/50 border-b border-red-800 px-6 py-2 flex items-center gap-2">
                        <AlertTriangle size={16} className="text-red-400" />
                        <span className="text-sm text-red-300">{error}</span>
                        <button 
                            className="ml-auto text-red-400 hover:text-red-300"
                            onClick={() => setError(null)}
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}
                
                <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium text-white">{bucket.name}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {bucket.region}
                        </span>
                        {demoMode && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                Demo Mode
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            className="text-slate-400 hover:text-slate-300"
                            onClick={handleSettingsClick}
                        >
                            <Settings size={16} />
                        </button>
                        <button 
                            className="text-slate-400 hover:text-slate-300"
                            onClick={handleAnalyticsClick}
                        >
                            <BarChart2 size={16} />
                        </button>
                        <button 
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Upload
                        </button>
                    </div>
                </div>

                <div className="p-4 bg-slate-800/50 flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-slate-400">
                            <HardDrive size={14} />
                            <span className="text-sm">Path:</span>
                        </div>
                        {renderBreadcrumb()}
                    </div>
                    
                    <button 
                        className="flex items-center gap-1 text-sm bg-slate-700 text-white px-3 py-1 rounded hover:bg-slate-600"
                        onClick={() => setShowCreateFolderModal(true)}
                    >
                        <Folder size={14} />
                        <span>New Folder</span>
                    </button>
                </div>

                {isLoading ? (
                    <div className="p-12 flex flex-col items-center justify-center">
                        <div className="w-10 h-10 border-2 border-t-transparent border-blue-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-400">Loading file system...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-800/50">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Size</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Last Modified</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {/* Parent directory link if not at root */}
                                {currentPath !== '/' && (
                                    <tr className="hover:bg-slate-800/30">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Folder size={16} className="text-slate-400" />
                                                <button
                                                    className="text-sm text-slate-400 hover:text-slate-300"
                                                    onClick={() => {
                                                        const segments = currentPath.split('/').filter(Boolean);
                                                        segments.pop();
                                                        const parentPath = segments.length ? `/${segments.join('/')}/` : '/';
                                                        setCurrentPath(parentPath);
                                                    }}
                                                >
                                                    ../ (Parent Directory)
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-slate-300">-</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-slate-300">-</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="text-sm text-slate-300">-</div>
                                        </td>
                                    </tr>
                                )}
                                
                                {/* Folders */}
                                {folders.length === 0 && files.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                                            <div className="flex flex-col items-center">
                                                <Folder size={32} className="mb-3 text-slate-500" />
                                                <p className="mb-3">This folder is empty</p>
                                                <div className="flex gap-2">
                                                    <button 
                                                        className="px-3 py-1 text-sm bg-slate-700 text-white rounded-lg hover:bg-slate-600"
                                                        onClick={() => setShowCreateFolderModal(true)}
                                                    >
                                                        Create Folder
                                                    </button>
                                                    <button 
                                                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                        onClick={() => fileInputRef.current?.click()}
                                                    >
                                                        Upload Files
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    <>
                                        {folders.map((folderName, index) => (
                                            <tr key={`folder-${index}`} className="hover:bg-slate-800/30">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <Folder size={16} className="text-blue-400" />
                                                        <button
                                                            className="text-sm text-blue-400 hover:text-blue-300"
                                                            onClick={() => handleFolderClick(folderName)}
                                                        >
                                                            {folderName}
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-slate-300">-</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-slate-300">-</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button 
                                                            className="text-red-400 hover:text-red-300"
                                                            onClick={() => handleDelete(folderName, true)}
                                                        >
                                                            <Trash size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        
                                        {/* Files */}
                                        {files.map((file, index) => (
                                            <tr key={`file-${index}`} className="hover:bg-slate-800/30">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        {getFileIcon(file.type)}
                                                        <button
                                                            className="text-sm text-blue-400 hover:text-blue-300"
                                                            onClick={() => handleFileClick(file)}
                                                        >
                                                            {file.name}
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-slate-300">{file.size}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-slate-300">{file.lastModified}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button 
                                                            className="text-slate-400 hover:text-slate-300"
                                                            onClick={() => handleFileClick(file)}
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button 
                                                            className="text-slate-400 hover:text-slate-300"
                                                            onClick={() => handleDownload(file)}
                                                        >
                                                            <Download size={16} />
                                                        </button>
                                                        <button 
                                                            className="text-red-400 hover:text-red-300"
                                                            onClick={() => handleDelete(file.name)}
                                                        >
                                                            <Trash size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
};

export default ObjectStorageExplorer;