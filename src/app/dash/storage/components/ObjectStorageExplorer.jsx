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
    // TODO: @tristanpoland We need to create an API endpoint for retrieving files from the volumes. We have all the mounting data in the storage_volumes table of the database.
    return {
        '/': {
            folders: ['images', 'documents', 'config', 'backups', 'logs'],
            files: [
                { name: 'README.md', type: 'markdown', size: '12 KB', lastModified: '2025-02-10', content: '# Project Documentation\n\nWelcome to the storage explorer. This is a sample README file.\n\n## Features\n\n- Browse files and folders\n- Upload and download files\n- Edit text files in the browser\n- Organize your storage efficiently' },
                { name: 'setup.json', type: 'json', size: '3 KB', lastModified: '2025-02-12', content: '{\n  "version": "1.0.0",\n  "environment": "production",\n  "features": {\n    "sharing": true,\n    "encryption": true,\n    "versioning": true\n  },\n  "limits": {\n    "maxFileSize": "5GB",\n    "maxBucketSize": "1TB"\n  }\n}' }
            ]
        },
        '/images/': {
            folders: ['avatars', 'products', 'banners'],
            files: [
                { name: 'logo.png', type: 'image', size: '245 KB', lastModified: '2025-02-18', content: null },
                { name: 'hero-image.jpg', type: 'image', size: '1.2 MB', lastModified: '2025-02-19', content: null },
                { name: 'icon-set.svg', type: 'image', size: '56 KB', lastModified: '2025-02-20', content: null }
            ]
        },
        '/documents/': {
            folders: ['reports', 'contracts', 'presentations'],
            files: [
                { name: 'annual-report.pdf', type: 'document', size: '3.4 MB', lastModified: '2025-02-21', content: null },
                { name: 'project-proposal.docx', type: 'document', size: '1.8 MB', lastModified: '2025-02-22', content: null },
                { name: 'data-analysis.xlsx', type: 'spreadsheet', size: '2.3 MB', lastModified: '2025-02-23', content: null }
            ]
        },
        '/config/': {
            folders: [],
            files: [
                { name: 'settings.yaml', type: 'yaml', size: '8 KB', lastModified: '2025-02-23', content: 'server:\n  port: 8080\n  host: 0.0.0.0\n\nsecurity:\n  ssl: true\n  cors: true\n\ndatabase:\n  host: db.example.com\n  port: 5432\n  username: admin\n  password: ********\n  name: production_db' },
                { name: 'env.config', type: 'config', size: '4 KB', lastModified: '2025-02-24', content: 'NODE_ENV=production\nPORT=3000\nAPI_URL=https://api.example.com\nDEBUG=false\nLOG_LEVEL=info\nCACHE_TTL=3600\nREDIS_HOST=redis.internal\nREDIS_PORT=6379' },
                { name: 'nginx.conf', type: 'config', size: '12 KB', lastModified: '2025-02-25', content: 'user www-data;\nworker_processes auto;\npid /run/nginx.pid;\ninclude /etc/nginx/modules-enabled/*.conf;\n\nevents {\n  worker_connections 1024;\n  multi_accept on;\n}\n\nhttp {\n  sendfile on;\n  tcp_nopush on;\n  tcp_nodelay on;\n  keepalive_timeout 65;\n  types_hash_max_size 2048;\n\n  include /etc/nginx/mime.types;\n  default_type application/octet-stream;\n\n  ssl_protocols TLSv1.2 TLSv1.3;\n  ssl_prefer_server_ciphers on;\n\n  access_log /var/log/nginx/access.log;\n  error_log /var/log/nginx/error.log;\n\n  include /etc/nginx/conf.d/*.conf;\n  include /etc/nginx/sites-enabled/*;\n}' }
            ]
        },
        '/backups/': {
            folders: ['daily', 'weekly', 'monthly'],
            files: [
                { name: 'backup-2025-02-01.tar.gz', type: 'archive', size: '245 MB', lastModified: '2025-02-01', content: null },
                { name: 'backup-2025-02-08.tar.gz', type: 'archive', size: '256 MB', lastModified: '2025-02-08', content: null },
                { name: 'backup-2025-02-15.tar.gz', type: 'archive', size: '278 MB', lastModified: '2025-02-15', content: null },
                { name: 'backup-2025-02-22.tar.gz', type: 'archive', size: '282 MB', lastModified: '2025-02-22', content: null }
            ]
        },
        '/logs/': {
            folders: ['app', 'system', 'security'],
            files: [
                { name: 'app-2025-02-24.log', type: 'log', size: '1.2 MB', lastModified: '2025-02-24', content: '[2025-02-24T08:12:45.123Z] INFO: Server started on port 3000\n[2025-02-24T08:15:22.456Z] INFO: User login: admin\n[2025-02-24T08:23:11.789Z] WARN: High memory usage detected: 85%\n[2025-02-24T09:01:33.246Z] INFO: Scheduled backup started\n[2025-02-24T09:04:12.789Z] INFO: Backup completed successfully\n[2025-02-24T10:15:22.456Z] ERROR: Connection to database failed\n[2025-02-24T10:15:45.123Z] INFO: Database connection restored' },
                { name: 'error-2025-02-24.log', type: 'log', size: '156 KB', lastModified: '2025-02-24', content: '[2025-02-24T10:15:22.456Z] ERROR: Connection to database failed - timeout after 30s\n[2025-02-24T13:22:15.789Z] ERROR: API rate limit exceeded for endpoint /api/users\n[2025-02-24T15:45:33.123Z] ERROR: Out of memory error in worker process\n[2025-02-24T18:12:05.456Z] ERROR: Failed to process image upload - invalid format\n[2025-02-24T20:33:12.789Z] ERROR: SSL certificate validation failed' },
                { name: 'access-2025-02-24.log', type: 'log', size: '3.4 MB', lastModified: '2025-02-24', content: '192.168.1.1 - - [24/Feb/2025:08:15:22 +0000] "GET /api/status HTTP/1.1" 200 1243 "-" "Mozilla/5.0"\n192.168.1.15 - - [24/Feb/2025:08:16:45 +0000] "POST /api/login HTTP/1.1" 200 532 "-" "Mozilla/5.0"\n192.168.1.22 - - [24/Feb/2025:08:18:12 +0000] "GET /api/users HTTP/1.1" 200 8721 "-" "Mozilla/5.0"\n192.168.1.15 - - [24/Feb/2025:08:22:33 +0000] "PUT /api/users/15 HTTP/1.1" 200 642 "-" "Mozilla/5.0"\n' }
            ]
        },
        '/images/avatars/': {
            folders: [],
            files: [
                { name: 'user1.jpg', type: 'image', size: '124 KB', lastModified: '2025-01-15', content: null },
                { name: 'user2.jpg', type: 'image', size: '118 KB', lastModified: '2025-01-18', content: null },
                { name: 'user3.jpg', type: 'image', size: '132 KB', lastModified: '2025-01-22', content: null }
            ]
        },
        '/images/products/': {
            folders: [],
            files: [
                { name: 'product1.jpg', type: 'image', size: '245 KB', lastModified: '2025-01-25', content: null },
                { name: 'product2.jpg', type: 'image', size: '278 KB', lastModified: '2025-01-28', content: null },
                { name: 'product3.jpg', type: 'image', size: '312 KB', lastModified: '2025-02-02', content: null }
            ]
        },
        '/images/banners/': {
            folders: [],
            files: [
                { name: 'homepage-banner.jpg', type: 'image', size: '1.2 MB', lastModified: '2025-02-05', content: null },
                { name: 'promo-banner.jpg', type: 'image', size: '1.4 MB', lastModified: '2025-02-08', content: null },
                { name: 'seasonal-banner.jpg', type: 'image', size: '1.1 MB', lastModified: '2025-02-12', content: null }
            ]
        },
        '/documents/reports/': {
            folders: [],
            files: [
                { name: 'q1-report.pdf', type: 'document', size: '2.3 MB', lastModified: '2025-04-15', content: null },
                { name: 'q2-report.pdf', type: 'document', size: '2.5 MB', lastModified: '2025-07-15', content: null },
                { name: 'q3-report.pdf', type: 'document', size: '2.2 MB', lastModified: '2025-10-15', content: null },
                { name: 'q4-report.pdf', type: 'document', size: '2.7 MB', lastModified: '2025-01-15', content: null }
            ]
        },
        '/documents/contracts/': {
            folders: [],
            files: [
                { name: 'vendor-agreement.pdf', type: 'document', size: '1.8 MB', lastModified: '2024-11-10', content: null },
                { name: 'employee-contract.pdf', type: 'document', size: '1.2 MB', lastModified: '2024-12-05', content: null },
                { name: 'service-agreement.pdf', type: 'document', size: '1.5 MB', lastModified: '2025-01-20', content: null }
            ]
        },
        '/documents/presentations/': {
            folders: [],
            files: [
                { name: 'company-overview.pptx', type: 'presentation', size: '4.5 MB', lastModified: '2025-01-10', content: null },
                { name: 'product-roadmap.pptx', type: 'presentation', size: '5.2 MB', lastModified: '2025-01-25', content: null },
                { name: 'investor-pitch.pptx', type: 'presentation', size: '6.8 MB', lastModified: '2025-02-15', content: null }
            ]
        },
        '/backups/daily/': {
            folders: [],
            files: [
                { name: 'backup-2025-02-20.tar.gz', type: 'archive', size: '85 MB', lastModified: '2025-02-20', content: null },
                { name: 'backup-2025-02-21.tar.gz', type: 'archive', size: '87 MB', lastModified: '2025-02-21', content: null },
                { name: 'backup-2025-02-22.tar.gz', type: 'archive', size: '86 MB', lastModified: '2025-02-22', content: null },
                { name: 'backup-2025-02-23.tar.gz', type: 'archive', size: '88 MB', lastModified: '2025-02-23', content: null },
                { name: 'backup-2025-02-24.tar.gz', type: 'archive', size: '84 MB', lastModified: '2025-02-24', content: null }
            ]
        },
        '/backups/weekly/': {
            folders: [],
            files: [
                { name: 'backup-week01.tar.gz', type: 'archive', size: '545 MB', lastModified: '2025-01-07', content: null },
                { name: 'backup-week02.tar.gz', type: 'archive', size: '562 MB', lastModified: '2025-01-14', content: null },
                { name: 'backup-week03.tar.gz', type: 'archive', size: '578 MB', lastModified: '2025-01-21', content: null },
                { name: 'backup-week04.tar.gz', type: 'archive', size: '582 MB', lastModified: '2025-01-28', content: null },
                { name: 'backup-week05.tar.gz', type: 'archive', size: '590 MB', lastModified: '2025-02-04', content: null },
                { name: 'backup-week06.tar.gz', type: 'archive', size: '605 MB', lastModified: '2025-02-11', content: null },
                { name: 'backup-week07.tar.gz', type: 'archive', size: '612 MB', lastModified: '2025-02-18', content: null }
            ]
        },
        '/backups/monthly/': {
            folders: [],
            files: [
                { name: 'backup-2024-11.tar.gz', type: 'archive', size: '2.3 GB', lastModified: '2024-11-30', content: null },
                { name: 'backup-2024-12.tar.gz', type: 'archive', size: '2.4 GB', lastModified: '2024-12-31', content: null },
                { name: 'backup-2025-01.tar.gz', type: 'archive', size: '2.5 GB', lastModified: '2025-01-31', content: null }
            ]
        },
        '/logs/app/': {
            folders: [],
            files: [
                { name: 'app-2025-02-20.log', type: 'log', size: '1.1 MB', lastModified: '2025-02-20', content: '[2025-02-20] Application logs...' },
                { name: 'app-2025-02-21.log', type: 'log', size: '1.2 MB', lastModified: '2025-02-21', content: '[2025-02-21] Application logs...' },
                { name: 'app-2025-02-22.log', type: 'log', size: '1.0 MB', lastModified: '2025-02-22', content: '[2025-02-22] Application logs...' },
                { name: 'app-2025-02-23.log', type: 'log', size: '1.3 MB', lastModified: '2025-02-23', content: '[2025-02-23] Application logs...' },
                { name: 'app-2025-02-24.log', type: 'log', size: '1.2 MB', lastModified: '2025-02-24', content: '[2025-02-24] Application logs...' }
            ]
        },
        '/logs/system/': {
            folders: [],
            files: [
                { name: 'system-2025-02-20.log', type: 'log', size: '850 KB', lastModified: '2025-02-20', content: '[2025-02-20] System logs...' },
                { name: 'system-2025-02-21.log', type: 'log', size: '920 KB', lastModified: '2025-02-21', content: '[2025-02-21] System logs...' },
                { name: 'system-2025-02-22.log', type: 'log', size: '880 KB', lastModified: '2025-02-22', content: '[2025-02-22] System logs...' },
                { name: 'system-2025-02-23.log', type: 'log', size: '910 KB', lastModified: '2025-02-23', content: '[2025-02-23] System logs...' },
                { name: 'system-2025-02-24.log', type: 'log', size: '940 KB', lastModified: '2025-02-24', content: '[2025-02-24] System logs...' }
            ]
        },
        '/logs/security/': {
            folders: [],
            files: [
                { name: 'security-2025-02-20.log', type: 'log', size: '450 KB', lastModified: '2025-02-20', content: '[2025-02-20] Security logs...' },
                { name: 'security-2025-02-21.log', type: 'log', size: '480 KB', lastModified: '2025-02-21', content: '[2025-02-21] Security logs...' },
                { name: 'security-2025-02-22.log', type: 'log', size: '420 KB', lastModified: '2025-02-22', content: '[2025-02-22] Security logs...' },
                { name: 'security-2025-02-23.log', type: 'log', size: '460 KB', lastModified: '2025-02-23', content: '[2025-02-23] Security logs...' },
                { name: 'security-2025-02-24.log', type: 'log', size: '490 KB', lastModified: '2025-02-24', content: '[2025-02-24] Security logs...' }
            ]
        }
    };
};

// Main Component
const ObjectStorageExplorer = ({ bucket }) => {
    const [currentPath, setCurrentPath] = useState('/');
    const [fileSystem, setFileSystem] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);

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

    // Handle file click
    const handleFileClick = (file) => {
        // Check if file is editable
        const editableTypes = ['markdown', 'json', 'yaml', 'config', 'log'];
        if (editableTypes.includes(file.type)) {
            setSelectedFile(file);
            console.log(`Opening editor for ${file.name}`);
            setIsEditorOpen(true);
        } else {
            // For non-editable files, we could implement a preview
            console.log(`File preview not implemented for ${file.type} files`);
        }
    };

    // Handle file save
    const handleFileSave = (fileName, newContent) => {
        const updatedFileSystem = { ...fileSystem };
        const fileToUpdate = updatedFileSystem[currentPath].files.find(f => f.name === fileName);

        if (fileToUpdate) {
            fileToUpdate.content = newContent;
            fileToUpdate.lastModified = new Date().toISOString().split('T')[0];
            setFileSystem(updatedFileSystem);
        }

        setIsEditorOpen(false);
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
            {isEditorOpen && selectedFile && (
                ReactDOM.createPortal(
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <FileEditorModal
                            file={selectedFile}
                            onSave={handleFileSave}
                            onClose={() => setIsEditorOpen(false)}
                        />
                    </div>,
                    document.body
                )
            )}
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