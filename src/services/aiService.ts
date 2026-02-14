import type { Case, ChatMessage } from '../types';

const FORENSICS_KNOWLEDGE: Record<string, string> = {
  'phishing': `Phishing is a social engineering attack where attackers disguise as trustworthy entities to steal credentials.
Key indicators to look for:
- Suspicious sender addresses (look for typos in domain names)
- Urgent language creating panic
- Generic greetings
- Suspicious links (hover to check actual URL)
- Requests for credentials or sensitive information`,
  
  'event log': `Windows Event Logs are crucial for forensics:
- Event ID 4624: Successful logon
- Event ID 4625: Failed logon
- Event ID 4648: Explicit credential logon
- Event ID 4672: Special privileges assigned
- Event ID 4720: User account created
- Event ID 4726: User account deleted`,
  
  'lateral movement': `Lateral movement techniques include:
- Pass-the-Hash/Pass-the-Ticket
- Remote Desktop Protocol (RDP)
- Windows Management Instrumentation (WMI)
- PsExec
- PowerShell Remoting
- SMB/Windows Admin Shares`,
  
  'persistence': `Common persistence mechanisms:
- Registry Run keys (HKLM or HKCU)
- Scheduled tasks
- Services
- Startup folders
- WMI event subscriptions
- DLL hijacking
- COM hijacking`,
  
  'ransomware': `Ransomware indicators:
- Unusual file extensions (.encrypted, .locked, etc.)
- Ransom notes
- Disabled security software
- Mass file encryption timestamps
- Known variants: LockBit, REvil, Conti, Ryuk`,
  
  'memory forensics': `Memory forensics involves:
- Dumping process memory
- Analyzing running processes
- Finding injected code
- Extracting credentials
- Timeline reconstruction
- Tools: Volatility, Rekall`,
  
  'network forensics': `Network forensics focuses on:
- Capturing network traffic
- Analyzing logs (IIS, Apache, nginx)
- DNS query analysis
- Identifying C2 communications
- Packet analysis with Wireshark`,
};

const getKeywordResponse = (question: string, caseContext: Case): string => {
  const lowerQuestion = question.toLowerCase();
  
  for (const [keyword, knowledge] of Object.entries(FORENSICS_KNOWLEDGE)) {
    if (lowerQuestion.includes(keyword)) {
      return knowledge;
    }
  }
  
  return '';
};

const getHintForObjective = (caseContext: Case, objectiveIndex: number): string => {
  const hints: Record<string, string[]> = {
    'phishing-attack-001': [
      'Start by checking the Desktop folder of user jsmith. Email attachments often end up there.',
      'The suspicious email has a .eml extension. Look for files that contain "From:", "To:", and "Subject:" headers.',
      'The phishing email contains a link to hr.abc-corp-portal.com - this is a fake domain. Check the event logs for failed login attempts from external IPs.',
      'The IIS access log shows the attacker accessed budget_q1.xlsx after obtaining credentials.',
    ],
    'ransomware-incident-001': [
      'Check the Windows/Temp folder for unusual executables.',
      'The ransom note will be on the Desktop with a .txt extension.',
      'Look for scheduled tasks in ProgramData that might be running the ransomware on startup.',
      'The SYSTEM registry hive contains Run keys that persist the ransomware.',
    ],
  };
  
  const caseHints = hints[caseContext.id] || [];
  return caseHints[objectiveIndex] || 'Keep exploring the file system and logs.';
};

export const generateAIResponse = async (
  message: string,
  caseContext: Case,
  chatHistory: ChatMessage[]
): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
  
  const lowerMessage = message.toLowerCase();
  
  // Check if user is asking for a hint
  if (lowerMessage.includes('hint') || lowerMessage.includes('help me') || lowerMessage.includes('stuck')) {
    const foundEvidence = caseContext.evidence.filter(e => e.isFound).length;
    const objectiveIndex = Math.min(foundEvidence, caseContext.objectives.length - 1);
    return `💡 **Hint:**\n\n${getHintForObjective(caseContext, objectiveIndex)}`;
  }
  
  // Check for specific knowledge queries
  const keywordResponse = getKeywordResponse(lowerMessage, caseContext);
  if (keywordResponse) {
    return keywordResponse;
  }
  
  // Context-aware responses based on what's been found
  const foundEvidence = caseContext.evidence.filter(e => e.isFound).map(e => e.name);
  const remainingEvidence = caseContext.evidence.filter(e => !e.isFound).map(e => e.name);
  
  if (lowerMessage.includes('what') && (lowerMessage.includes('found') || lowerMessage.includes('evidence'))) {
    if (foundEvidence.length === 0) {
      return "You haven't found any evidence yet. Try exploring the file system using terminal commands like 'ls' and 'cd'.";
    }
    return `So far you've found:\n${foundEvidence.map(e => `• ${e}`).join('\n')}\n\nStill to find: ${remainingEvidence.map(e => `• ${e}`).join('\n')}`;
  }
  
  // Default helpful responses
  const responses = [
    "I'm here to help with your investigation. You can ask me about forensics concepts, request hints, or ask about evidence you've found.",
    "Use the terminal to navigate the file system. Try commands like 'ls', 'cd', and 'type' to examine files.",
    "Don't forget to check event logs in C:\\Windows\\System32\\config\\ - they often contain crucial evidence.",
    "Remember: document everything you find. Your findings contribute to solving the case!",
    "The terminal supports commands like 'ls', 'cd', 'dir', 'type', 'cat', 'ipconfig', and 'netstat'.",
  ];
  
  // Check if user wants to analyze specific evidence
  if (lowerMessage.includes('analyze') || lowerMessage.includes('what is') || lowerMessage.includes('tell me about')) {
    for (const evidence of caseContext.evidence) {
      if (lowerMessage.includes(evidence.name.toLowerCase())) {
        return `**${evidence.name}**\n\nType: ${evidence.type}\nPath: ${evidence.path}\n\n${evidence.description}\n\nTip: Use the 'type' command in the terminal to view its contents if it's a text file.`;
      }
    }
  }
  
  return responses[Math.floor(Math.random() * responses.length)];
};

export const getInitialGreeting = (caseTitle: string): string => {
  return `🔍 **AI Co-Investigator Online**\n\nI'm here to help you investigate "${caseTitle}".\n\nYou can:\n• Ask me for hints when you're stuck\n• Request analysis of specific evidence\n• Ask about forensics concepts\n• Check what evidence you've found so far\n\nUse the terminal to navigate the file system and gather evidence. Good luck, investigator!`;
};
