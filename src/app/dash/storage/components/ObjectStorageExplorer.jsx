import React, { useState, useEffect } from 'react';
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
    File
} from 'lucide-react';
import FileEditorModal from './MonacoEditor';
import ReactDOM from 'react-dom';

// Mock file system data structure
const createMockFileSystem = () => {
    // Existing mock file system implementation
    return {
        '/': {
            folders: ['images', 'documents', 'config', 'backups', 'logs'],
            files: [
                { name: 'README.md', type: 'markdown', size: '12 KB', lastModified: '2025-02-10', content: '# Project Documentation\n\nWelcome to the storage explorer. This is a sample README file.\n\n## Features\n\n- Browse files and folders\n- Upload and download files\n- Edit text files in the browser\n- Organize your storage efficiently' },
                { name: 'setup.json', type: 'json', size: '3 KB', lastModified: '2025-02-12', content: '{\n  "version": "1.0.0",\n  "environment": "production",\n  "features": {\n    "sharing": true,\n    "encryption": true,\n    "versioning": true\n  },\n  "limits": {\n    "maxFileSize": "5GB",\n    "maxBucketSize": "1TB"\n  }\n}' },
                { name: 'build.rs', type: 'rust', size: '1.2 MB', lastModified: '2025-02-15', content: 'use std::fs;\nuse std::path::Path;\n\nfn main() {\n    let path = Path::new("src/main.rs");\n    if path.exists() {\n        println!("File exists!");\n    } else {\n        println!("File does not exist!");\n    }\n\n    fs::copy("src/main.rs", "build/main.rs").expect("Failed to copy file");\n}\n' }
            ]
        },
        // ... rest of the mock file system structure
    };
};

// Main Component
const ObjectStorageExplorer = ({ bucket }) => {
    const [currentPath, setCurrentPath] = useState('/');
    const [fileSystem, setFileSystem] = useState({});
    // Replace single file state with an array of open files
    const [openFiles, setOpenFiles] = useState([]);
    // Add Z-index tracking to handle window stacking
    const [topZIndex, setTopZIndex] = useState(100);

    // Initialize file system
    useEffect(() => {
        setFileSystem(createMockFileSystem());
    }, []);

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
                return <Camera size={16} className="text-green-400" />;
            case 'document':
            case 'presentation':
            case 'spreadsheet':
                return <FileText size={16} className="text-amber-400" />;
            case 'markdown':
            case 'json':
            case 'yaml':
            case 'config':
                return <Code size={16} className="text-purple-400" />;
            case 'log':
                return <File size={16} className="text-red-400" />;
            case 'archive':
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

    // Handle file click
    const handleFileClick = (file) => {
        // Check if file is editable
        const editableTypes = [
            'markdown', 'json', 'yaml', 'config', 'log', 'txt', 'html', 'css', 'js', 'jsx', 
            'ts', 'tsx', 'py', 'java', 'c', 'cpp', 'cs', 'php', 'rb', 'swift', 'go', 'rust', 
            'sh', 'bat', 'xml', 'ini', 'env', 'md', 'toml', 'csv', 'tsv', 'sql', 'pl', 
            'lua', 'r', 'kt', 'dart', 'scala', 'vb', 'asm', 'h', 'hpp', 'scss', 'less'
        ];
        
        if (editableTypes.includes(file.type)) {
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
                
                // Add the file to open files
                setOpenFiles(prevOpenFiles => [
                    ...prevOpenFiles, 
                    {
                        id: fileId,
                        file: { ...file },
                        path: currentPath,
                        zIndex: topZIndex + 1,
                        position: position
                    }
                ]);
                
                console.log(`Opening editor for ${file.name}`);
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
            // For non-editable files, we could implement a preview
            console.log(`File preview not implemented for ${file.type} files`);
        }
    };

    // Handle file save
    const handleFileSave = (fileId, newContent) => {
        // Find the open file by ID
        const openFile = openFiles.find(f => f.id === fileId);
        
        if (openFile) {
            // Update the file system
            const updatedFileSystem = { ...fileSystem };
            const path = openFile.path;
            const fileName = openFile.file.name;
            
            if (updatedFileSystem[path] && 
                updatedFileSystem[path].files) {
                
                const fileToUpdate = updatedFileSystem[path].files.find(f => f.name === fileName);
                
                if (fileToUpdate) {
                    fileToUpdate.content = newContent;
                    fileToUpdate.lastModified = new Date().toISOString().split('T')[0];
                    setFileSystem(updatedFileSystem);
                    
                    // Also update the content in the open file
                    setOpenFiles(prevOpenFiles => 
                        prevOpenFiles.map(f => 
                            f.id === fileId 
                                ? { ...f, file: { ...f.file, content: newContent, lastModified: new Date().toISOString().split('T')[0] }} 
                                : f
                        )
                    );
                }
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
            
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium text-white">{bucket.name}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {bucket.region}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="text-slate-400 hover:text-slate-300">
                            <Settings size={16} />
                        </button>
                        <button className="text-slate-400 hover:text-slate-300">
                            <BarChart2 size={16} />
                        </button>
                        <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Upload
                        </button>
                    </div>
                </div>

                <div className="p-4 bg-slate-800/50 flex items-center gap-2 border-b border-slate-800">
                    <div className="flex items-center gap-1 text-slate-400">
                        <HardDrive size={14} />
                        <span className="text-sm">Path:</span>
                    </div>
                    {renderBreadcrumb()}
                </div>

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
                            {/* Folders */}
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
                                            <button className="text-slate-400 hover:text-slate-300">
                                                <Upload size={16} />
                                            </button>
                                            <button className="text-slate-400 hover:text-slate-300">
                                                <Download size={16} />
                                            </button>
                                            <button className="text-red-400 hover:text-red-300">
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
                                            <button className="text-slate-400 hover:text-slate-300">
                                                <Upload size={16} />
                                            </button>
                                            <button className="text-slate-400 hover:text-slate-300">
                                                <Download size={16} />
                                            </button>
                                            <button className="text-red-400 hover:text-red-300">
                                                <Trash size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default ObjectStorageExplorer;