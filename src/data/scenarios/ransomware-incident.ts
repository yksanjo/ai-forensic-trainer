import type { Case } from '../../types';

export const ransomwareIncidentScenario: Case = {
  id: 'ransomware-incident-001',
  title: 'Ransomware Outbreak - Metro Hospital',
  description: 'Investigate a ransomware attack that encrypted critical hospital systems',
  requestor: 'IT Director, Metro Hospital',
  date: '2024-02-28',
  difficulty: 'Intermediate',
  category: 'Incident Response',
  timeLimit: 45,
  xpReward: 800,
  briefing: `CASE BRIEFING
==============

Date: February 28, 2024
Requestor: IT Director, Metro Hospital

INCIDENT SUMMARY:
At 03:45 AM, the hospital's IT team received multiple alerts from endpoint protection
software. By the time they logged in, several critical servers had been encrypted.
The ransomware variant appears to be LockBit 3.0. A ransom note was left on affected systems.

The hospital is running without their patient records system and email server.
Backup servers are offline for maintenance. This is a critical situation.

YOUR MISSION:
1. Identify the initial infection vector
2. Determine the scope of the infection
3. Find the ransomware executable or payload
4. Identify any data exfiltration
5. Document the attack timeline for the incident report

SYSTEM DETAILS:
- Domain: METRO-HOSPITAL.local
- Affected Systems: 12 servers, 45 workstations
- Ransomware: LockBit 3.0 (suspected)
- Encryption: AES-256 + RSA-4096

WARNING: Do not attempt to decrypt files. Focus on forensic analysis only.`,
  objectives: [
    {
      id: 'obj-1',
      description: 'Find the initial infection vector',
      isCompleted: false,
      xpReward: 150,
    },
    {
      id: 'obj-2',
      description: 'Locate the ransomware executable',
      isCompleted: false,
      xpReward: 150,
    },
    {
      id: 'obj-3',
      description: 'Identify the attack timeline',
      isCompleted: false,
      xpReward: 200,
    },
    {
      id: 'obj-4',
      description: 'Determine if data was exfiltrated',
      isCompleted: false,
      xpReward: 200,
    },
    {
      id: 'obj-5',
      description: 'Identify persistence mechanisms',
      isCompleted: false,
      xpReward: 100,
    },
  ],
  evidence: [
    {
      id: 'ev-1',
      path: '/Users/admin/Desktop/ransom_note.txt',
      name: 'ransom_note.txt',
      type: 'file',
      description: 'Ransom note left by the attackers',
      isFound: false,
    },
    {
      id: 'ev-2',
      path: '/Windows/System32/config/SYSTEM',
      name: 'SYSTEM',
      type: 'registry',
      description: 'Windows Registry SYSTEM hive - contains run keys',
      isFound: false,
    },
    {
      id: 'ev-3',
      path: '/Windows/Logs/System.evtx',
      name: 'System.evtx',
      type: 'log',
      description: 'Windows System Event Log',
      isFound: false,
    },
    {
      id: 'ev-4',
      path: '/Windows/Temp/ransomware.exe',
      name: 'ransomware.exe',
      type: 'file',
      description: 'The ransomware payload (suspected)',
      isFound: false,
    },
    {
      id: 'ev-5',
      path: '/ProgramData/Microsoft/Windows/Cron/schedule.xml',
      name: 'schedule.xml',
      type: 'file',
      description: 'Scheduled task configuration',
      isFound: false,
    },
  ],
  fileSystem: {
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
                  { 
                    name: 'SYSTEM', 
                    type: 'file', 
                    content: `[Registry]
HKLM\\SYSTEM\\CurrentControlSet\\Services\\EventLog\\System
Type: 0x10
Start: 0x2
ErrorControl: 0x1
ImagePath: %SystemRoot%\\system32\\services.exe
DisplayName: Windows Event Log
LastWrite: 2024-02-28 03:50:00

[Run Keys - Persistence]
HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run
  "WindowsUpdate" = "C:\\\\Windows\\\\Temp\\\\ransomware.exe -silent"
LastWrite: 2024-02-28 03:48:22

[Services]
HKLM\\SYSTEM\\CurrentControlSet\\Services\\WinDefend
  Start: 0x4 (Disabled - 2024-02-28 03:47:15)
HKLM\\SYSTEM\\CurrentControlSet\\Services\\wuauserv
  Start: 0x4 (Disabled - 2024-02-28 03:47:18)`,
                    metadata: { size: '24576 KB', modified: '2024-02-28 04:00:00' }
                  },
                  { 
                    name: 'SECURITY', 
                    type: 'file', 
                    content: '[Registry Hive - SECURITY]',
                    metadata: { size: '16384 KB', modified: '2024-02-28 03:45:00' }
                  },
                ]
              },
            ]
          },
          {
            name: 'Temp',
            type: 'directory',
            children: [
              {
                name: 'ransomware.exe',
                type: 'file',
                content: '[PE Executable - LockBit 3.0 Ransomware]\n\nFile Info:\n- MD5: a1b2c3d4e5f6789012345678abcdef00\n- Size: 156 KB\n- Compiled: 2024-02-27 14:33:00 UTC\n- Packer: UPX 3.91',
                metadata: { size: '156 KB', modified: '2024-02-28 03:45:00' }
              }
            ]
          },
          {
            name: 'Logs',
            type: 'directory',
            children: [
              {
                name: 'System.evtx',
                type: 'file',
                content: `Event ID: 7045
TimeCreated: 2024-02-28 03:44:12
Service Name: RansomwareService
Path: C:\\Windows\\Temp\\ransomware.exe
Start Type: Automatic

Event ID: 7036
TimeCreated: 2024-02-28 03:44:15
Service: Windows Defender entered the stopped state

Event ID: 7036
TimeCreated: 2024-02-28 03:44:18
Service: Windows Update entered the stopped state

Event ID: 1
TimeCreated: 2024-02-28 03:45:00
Source: Disk
Event: Encryption started on C:\\

Event ID: 1
TimeCreated: 2024-02-28 03:45:30
Source: Disk
Event: Encryption started on D:\\

Event ID: 1
TimeCreated: 2024-02-28 03:46:00
Source: Disk
Event: Encryption completed - 15,234 files`,
                metadata: { size: '245 KB', modified: '2024-02-28 04:00:00' }
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
            name: 'admin',
            type: 'directory',
            children: [
              {
                name: 'Desktop',
                type: 'directory',
                children: [
                  { 
                    name: 'ransom_note.txt', 
                    type: 'file', 
                    content: `╔══════════════════════════════════════════════════════════════════╗
║                     LOCKBIT 3.0 RANSOMWARE                      ║
║                    Your files have been encrypted              ║
╚══════════════════════════════════════════════════════════════════╝

YOUR DATA HAS BEEN ENCRYPTED
-----------------------------
All your files have been encrypted with military-grade encryption.
Without the private key, it is impossible to decrypt your files.

WHAT HAPPENED
-------------
Your network was compromised. We have exfiltrated 45GB of sensitive data.
This includes:
- Patient records (HIPAA protected)
- Financial records
- Employee personal information

DEMAND
-------
0.85 BTC (approximately $45,000 USD)
Payment must be made within 72 hours.
After 72 hours, the price doubles.

CONTACT
-------
Tor Browser: http://lockbit3xxxxx.onion
Email: lockbit@protonmail.com

DO NOT
-------
- Do not try to decrypt files yourself
- Do not contact law enforcement (we monitor this)
- Do not reboot or try to restore from backup (data is synced)

YOUR ID: METRO-HOSP-2847-F`,
                    metadata: { size: '2 KB', modified: '2024-02-28 03:50:00' }
                  },
                  {
                    name: 'downloads.zip',
                    type: 'file',
                    content: '[ZIP Archive - Exfiltrated data, 45GB]',
                    metadata: { size: '45 GB', modified: '2024-02-28 03:49:00' }
                  }
                ]
              },
              {
                name: 'Downloads',
                type: 'directory',
                children: [
                  {
                    name: 'invoice_template.docx',
                    type: 'file',
                    content: '[ benign document ]',
                    metadata: { size: '24 KB', modified: '2024-02-20 10:00:00' }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: 'ProgramData',
        type: 'directory',
        children: [
          {
            name: 'Microsoft',
            type: 'directory',
            children: [
              {
                name: 'Windows',
                type: 'directory',
                children: [
                  {
                    name: 'Cron',
                    type: 'directory',
                    children: [
                      {
                        name: 'schedule.xml',
                        type: 'file',
                        content: `<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <Triggers>
    <LogonTrigger>
      <Enabled>true</Enabled>
    </LogonTrigger>
  </Triggers>
  <Principals>
    <Principal id="Author">
      <LogonType>InteractiveToken</LogonType>
      <RunLevel>LeastPrivilege</RunLevel>
    </Principal>
  </Principals>
  <Settings>
    <MultipleInstancesPolicy>IgnoreNew</MultipleInstancesPolicy>
    <DisallowStartIfOnBatteries>false</DisallowStartIfOnBatteries>
    <StopIfGoingOnBatteries>false</StopIfGoingOnBatteries>
    <AllowHardTerminate>true</AllowHardTerminate>
  </Settings>
  <Actions Context="Author">
    <Exec>
      <Command>C:\\Windows\\Temp\\ransomware.exe</Command>
      <Arguments>-silent -persist</Arguments>
    </Exec>
  </Actions>
</Task>`,
                        metadata: { size: '1 KB', modified: '2024-02-28 03:44:30' }
                      }
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
  solution: [
    'Initial vector: Phishing email with malicious attachment',
    'Ransomware executable found in Windows/Temp',
    'Persistence via Run key and scheduled task',
    'Windows Defender disabled before encryption',
    'Data exfiltration confirmed: 45GB downloaded',
    'Attack timeline: 03:44 - First execution, 03:45 - Encryption started',
  ],
};
