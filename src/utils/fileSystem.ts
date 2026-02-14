import type { FileNode } from '../types';

export function findFileByPath(root: FileNode, path: string): FileNode | null {
  const normalizedPath = path.replace(/\\/g, '/').replace(/^\/+/, '');
  const parts = normalizedPath.split('/').filter(Boolean);
  
  let current: FileNode = root;
  
  for (const part of parts) {
    if (current.type !== 'directory' || !current.children) {
      return null;
    }
    const found = current.children.find(child => child.name === part);
    if (!found) return null;
    current = found;
  }
  
  return current;
}

export function getDirectoryContents(root: FileNode, path: string): FileNode[] {
  const target = findFileByPath(root, path);
  if (!target || target.type !== 'directory' || !target.children) {
    return [];
  }
  return target.children;
}

export function resolvePath(currentPath: string, targetPath: string): string {
  if (targetPath.startsWith('/') || targetPath.match(/^[A-Za-z]:/)) {
    return targetPath.replace(/\\/g, '/');
  }
  
  if (targetPath === '..') {
    const parts = currentPath.replace(/\\/g, '/').split('/').filter(Boolean);
    parts.pop();
    return parts.length === 0 ? '/' : '/' + parts.join('/');
  }
  
  if (targetPath === '.') {
    return currentPath;
  }
  
  const base = currentPath.replace(/\\/g, '/').replace(/\/$/, '');
  return `${base}/${targetPath}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDate(date: Date): string {
  return date.toISOString().replace('T', ' ').substring(0, 19);
}

export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
}

export function isEvidenceFile(path: string, evidencePaths: string[]): boolean {
  const normalizedPath = path.replace(/\\/g, '/').toLowerCase();
  return evidencePaths.some(ep => normalizedPath.includes(ep.toLowerCase()));
}

export function createWindowsFileSystem(): FileNode {
  return {
    name: 'C:',
    type: 'directory',
    children: [
      {
        name: 'Windows',
        type: 'directory',
        children: [
          {
            name: 'System32',
            type: 'directory',
            children: [
              {
                name: 'config',
                type: 'directory',
                children: [
                  { name: 'SYSTEM', type: 'file', content: '[Registry Hive]', metadata: { size: '24576 KB' } },
                  { name: 'SECURITY', type: 'file', content: '[Registry Hive]', metadata: { size: '16384 KB' } },
                  { name: 'SAM', type: 'file', content: '[Registry Hive]', metadata: { size: '4096 KB' } },
                ]
              },
              {
                name: 'drivers',
                type: 'directory',
                children: []
              }
            ]
          },
          {
            name: 'Logs',
            type: 'directory',
            children: [
              {
                name: 'IIS',
                type: 'directory',
                children: [
                  { name: 'access.log', type: 'file', content: '', metadata: { size: '124 KB' } },
                  { name: 'error.log', type: 'file', content: '', metadata: { size: '12 KB' } }
                ]
              }
            ]
          }
        ]
      },
      {
        name: 'Users',
        type: 'directory',
        children: [
          {
            name: 'jsmith',
            type: 'directory',
            children: [
              {
                name: 'Desktop',
                type: 'directory',
                children: [
                  { name: 'suspicious_email.eml', type: 'file', content: '', metadata: { size: '4 KB' } },
                  { name: 'screenshot.png', type: 'file', content: '[Image Data]', metadata: { size: '156 KB' } }
                ]
              },
              {
                name: 'Documents',
                type: 'directory',
                children: [
                  {
                    name: 'work',
                    type: 'directory',
                    children: [
                      { name: 'project_alpha.docx', type: 'file', content: '[Document Data]', metadata: { size: '45 KB' } },
                      { name: 'budget_q1.xlsx', type: 'file', content: '[Spreadsheet Data]', metadata: { size: '28 KB' } }
                    ]
                  }
                ]
              },
              {
                name: 'AppData',
                type: 'directory',
                children: [
                  {
                    name: 'Local',
                    type: 'directory',
                    children: [
                      {
                        name: 'Google',
                        type: 'directory',
                        children: [
                          {
                            name: 'Chrome',
                            type: 'directory',
                            children: [
                              { name: 'History', type: 'file', content: '[SQLite Database]', metadata: { size: '512 KB' } },
                              { name: 'Login Data', type: 'file', content: '[Encrypted Data]', metadata: { size: '64 KB' } }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: 'admin',
            type: 'directory',
            children: [
              {
                name: 'Desktop',
                type: 'directory',
                children: []
              },
              {
                name: 'Documents',
                type: 'directory',
                children: []
              }
            ]
          }
        ]
      },
      {
        name: 'Program Files',
        type: 'directory',
        children: []
      },
      {
        name: 'Program Files (x86)',
        type: 'directory',
        children: []
      }
    ]
  };
}
