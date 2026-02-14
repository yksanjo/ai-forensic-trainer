import type { Case } from '../../types';

export const phishingAttackScenario: Case = {
  id: 'phishing-attack-001',
  title: 'Suspicious Email Campaign - ABC Corp',
  description: 'Investigate a phishing attack that targeted multiple employees',
  requestor: 'IT Security Team',
  date: '2024-03-15',
  difficulty: 'Beginner',
  category: 'Incident Response',
  timeLimit: 30,
  xpReward: 500,
  briefing: `CASE BRIEFING
==============

Date: March 15, 2024
Requestor: IT Security Team, ABC Corp

INCIDENT SUMMARY:
Multiple employees reported receiving phishing emails pretending to be from HR.
One employee (jsmith) clicked the link and entered their credentials on a fake login page.
The IT team has seized the workstation for forensic analysis.

YOUR MISSION:
1. Identify the phishing email and analyze its contents
2. Determine which employees received the email
3. Find evidence of credential compromise
4. Identify any lateral movement or data access
5. Document the attack timeline

SYSTEM DETAILS:
- Workstation: DESKTOP-JSMITH
- User: jsmith
- OS: Windows 10 Pro
- Domain: abc.corp.local

WARNING: Evidence may be volatile. Document your findings as you go.`,
  objectives: [
    {
      id: 'obj-1',
      description: 'Find the suspicious email on the desktop',
      isCompleted: false,
      xpReward: 100,
    },
    {
      id: 'obj-2',
      description: 'Identify the phishing email sender and contents',
      isCompleted: false,
      xpReward: 100,
    },
    {
      id: 'obj-3',
      description: 'Find evidence of credential use in event logs',
      isCompleted: false,
      xpReward: 150,
    },
    {
      id: 'obj-4',
      description: 'Identify what data was accessed',
      isCompleted: false,
      xpReward: 150,
    },
  ],
  evidence: [
    {
      id: 'ev-1',
      path: '/Users/jsmith/Desktop/suspicious_email.eml',
      name: 'suspicious_email.eml',
      type: 'email',
      description: 'The original phishing email',
      isFound: false,
    },
    {
      id: 'ev-2',
      path: '/Windows/System32/config/SECURITY.evtx',
      name: 'SECURITY.evtx',
      type: 'log',
      description: 'Windows Security Event Log - may contain login events',
      isFound: false,
    },
    {
      id: 'ev-3',
      path: '/Windows/Logs/IIS/access.log',
      name: 'access.log',
      type: 'log',
      description: 'IIS web server access log',
      isFound: false,
    },
    {
      id: 'ev-4',
      path: '/Users/jsmith/AppData/Local/Google/Chrome/History',
      name: 'Chrome History',
      type: 'log',
      description: 'Browser history database',
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
                    content: 'Registry Hive - SYSTEM',
                    metadata: { size: '24576 KB', modified: '2024-03-15 08:30:00' }
                  },
                  { 
                    name: 'SECURITY', 
                    type: 'file', 
                    content: `Event Type: Audit Success
Event Source: Microsoft-Windows-Security-Auditing
Event ID: 4624
Date/Time: 2024-03-15 09:45:22
User: ABC\\jsmith
Logon Type: 10
Source Network Address: 192.168.1.105
Authentication Package: NTLM

Event ID: 4625
Date/Time: 2024-03-15 09:47:15
Failure Reason: Unknown user name or bad password
Target User: jsmith
Source: 203.0.113.50

Event ID: 4648
Date/Time: 2024-03-15 09:48:33
User: ABC\\jsmith
Target Server: DC01.abc.corp.local
Process: C:\\\\Program Files\\\\Internet Explorer\\\\iexplore.exe`,
                    metadata: { size: '16384 KB', modified: '2024-03-15 09:50:00' }
                  },
                  { 
                    name: 'SAM', 
                    type: 'file', 
                    content: 'Registry Hive - SAM',
                    metadata: { size: '4096 KB', modified: '2024-03-01 00:00:00' }
                  },
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
                  { 
                    name: 'access.log', 
                    type: 'file', 
                    content: `203.0.113.50 - - [15/Mar/2024:09:44:18 -0500] "GET /hr/portal/login.php HTTP/1.1" 200 4523 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
203.0.113.50 - - [15/Mar/2024:09:44:25 -0500] "POST /hr/portal/auth.php HTTP/1.1" 200 124 "https://hr.abc-corp-portal.com/hr/portal/login.php" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
203.0.113.50 - - [15/Mar/2024:09:45:10 -0500] "GET /hr/portal/dashboard.php HTTP/200 8945 "https://hr.abc-corp-portal.com/hr/portal/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
203.0.113.50 - - [15/Mar/2024:09:46:02 -0500] "GET /hr/portal/documents.php?folder=projects HTTP/200 15234 "https://hr.abc-corp-portal.com/hr/portal/dashboard.php" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
203.0.113.50 - - [15/Mar/2024:09:47:33 -0500] "GET /hr/portal/documents.php?file=budget_q1.xlsx HTTP/200 28672 "https://hr.abc-corp-portal.com/hr/portal/documents.php" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
192.168.1.105 - - [15/Mar/2024:10:15:22 -0500] "GET /api/employees HTTP/200 45123 "-" "python-requests/2.28.0"`,
                    metadata: { size: '124 KB', modified: '2024-03-15 10:30:00' }
                  },
                  { 
                    name: 'error.log', 
                    type: 'file', 
                    content: '',
                    metadata: { size: '12 KB', modified: '2024-03-15 08:00:00' }
                  }
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
                  { 
                    name: 'suspicious_email.eml', 
                    type: 'file', 
                    content: `From: HR Department <hr@abc-corp-portal.com>
To: jsmith@abc.corp.local
Date: Fri, 15 Mar 2024 09:30:15 -0500
Subject: URGENT: Action Required - Update Your Employee Information
MIME-Version: 1.0
Content-Type: text/html

<html>
<body>
<p>Dear Employee,</p>
<p>We require all employees to update their personal information in our new HR portal.</p>
<p>Please click the link below to verify your details:</p>
<p><a href="http://hr.abc-corp-portal.com/hr/portal/login.php">Update Your Information Now</a></p>
<p><strong>Deadline: March 15, 2024</strong></p>
<p>This is mandatory for compliance purposes.</p>
<p>Regards,<br>HR Department<br>ABC Corporation</p>
</body>
</html>`,
                    metadata: { size: '4 KB', modified: '2024-03-15 09:30:15' }
                  },
                  { 
                    name: 'screenshot.png', 
                    type: 'file', 
                    content: '[Image Data - Screenshot of fake login page]',
                    metadata: { size: '156 KB', modified: '2024-03-15 09:35:00' }
                  }
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
                      { 
                        name: 'project_alpha.docx', 
                        type: 'file', 
                        content: '[Document Data - Project Alpha specifications]',
                        metadata: { size: '45 KB', modified: '2024-03-10 14:20:00' }
                      },
                      { 
                        name: 'budget_q1.xlsx', 
                        type: 'file', 
                        content: '[Spreadsheet Data - Q1 Budget]',
                        metadata: { size: '28 KB', modified: '2024-03-12 11:45:00' }
                      },
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
                              { 
                                name: 'History', 
                                type: 'file', 
                                content: '[SQLite Database - Chrome browsing history]\n\nURLs visited:\n- hr.abc-corp-portal.com/hr/portal/login.php\n- hr.abc-corp-portal.com/hr/portal/dashboard.php\n- hr.abc-corp-portal.com/hr/portal/documents.php\n- hr.abc-corp-portal.com/hr/portal/documents.php?file=budget_q1.xlsx',
                                metadata: { size: '512 KB', modified: '2024-03-15 09:50:00' }
                              },
                              { 
                                name: 'Login Data', 
                                type: 'file', 
                                content: '[Encrypted Data - Saved credentials]',
                                metadata: { size: '64 KB', modified: '2024-03-15 09:45:00' }
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
  },
  solution: [
    'Found suspicious_email.eml on Desktop',
    'Identified phishing email from hr@abc-corp-portal.com',
    'Found credential compromise in SECURITY.evtx (Event 4625)',
    'Found lateral movement in IIS access.log',
    'Identified data access: budget_q1.xlsx was downloaded',
  ],
};
