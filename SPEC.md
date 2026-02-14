# Strix - Autonomous Recon Agent Platform

## Project Overview

**Project Name:** Strix  
**Tagline:** "Security Recon in 60 seconds"  
**Type:** CLI Security Reconnaissance Tool  
**Core Functionality:** Automated attack surface mapping, vulnerability identification, exploit simulation, and executive reporting in under 60 seconds  
**Target Users:** Security professionals, penetration testers, DevSecOps engineers, and security-conscious organizations

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        STRIX CLI                                │
│                   (One CLI Command)                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SOAR ORCHESTRATION                         │
│         (Security Orchestration, Automation & Response)         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Target    │  │   Recon     │  │    Vulnerability        │ │
│  │  Discovery  │──│   Engine    │──│    Assessment           │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
│         │                │                     │              │
│         ▼                ▼                     ▼              │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Exploit Simulation (Safe/Educational)       │  │
│  └─────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              PDF Report Generator                        │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technical Stack

- **Runtime:** Node.js (CLI)
- **Framework:** Commander.js (CLI parsing)
- **Network Tools:** nmap (via child_process), custom HTTP scanners
- **DNS Resolution:** sslip.io integration
- **PDF Generation:** PDFKit
- **Output:** Colored terminal output (chalk)
- **Configuration:** YAML-based

---

## Core Features

### 1. Target Discovery
- Accept single target (domain, IP, or CIDR)
- Use sslip.io for DNS resolution when needed
- Map attack surface using network scanning techniques
- Identify live hosts and open ports

### 2. Reconnaissance Engine
- Service version detection
- SSL/TLS analysis
- HTTP endpoint enumeration
- Technology stack fingerprinting
- Directory/file discovery

### 3. Vulnerability Assessment
- Common vulnerability scanning
- Weak endpoint identification
- Misconfiguration detection
- Default credential checks
- Outdated software detection

### 4. Exploit Simulation
- **SAFE/Educational ONLY** - No real exploits
- Simulates common attack vectors
- Demonstrates potential impact
- Risk scoring based on CVSS-like metrics

### 5. SOAR Orchestration
- Automated workflow execution
- Parallel task execution
- Rate limiting and throttling
- Error handling and retry logic

### 6. Executive Report Generation
- Professional PDF output
- Executive summary
- Technical findings
- Risk ratings
- Remediation recommendations
- Visual charts/graphs

---

## CLI Interface

### Main Command
```bash
strix recon <target> [options]
```

### Options
- `-o, --output <file>` - Output PDF report path
- `-t, --timeout <seconds>` - Max scan time (default: 60)
- `-q, --quick` - Quick scan mode (reduced checks)
- `-v, --verbose` - Verbose output
- `--no-color` - Disable colored output
- `-h, --help` - Show help

### Examples
```bash
# Basic scan
strix recon example.com

# Full scan with PDF output
strix recon example.com -o report.pdf

# Quick scan
strix recon 192.168.1.0/24 --quick
```

---

## Project Structure

```
strix/
├── bin/
│   └── strix.js          # CLI entry point
├── src/
│   ├── index.js          # Main export
│   ├── cli.js            # CLI configuration
│   ├── commands/
│   │   └── recon.js      # Recon command
│   ├── modules/
│   │   ├── discovery.js     # Target discovery
│   │   ├── recon.js         # Reconnaissance engine
│   │   ├── vuln.js          # Vulnerability assessment
│   │   ├── exploit.js       # Exploit simulation
│   │   └── pdf.js           # Report generation
│   ├── soar/
│   │   └── orchestrator.js  # SOAR orchestration
│   ├── dns/
│   │   └── sslip.js         # sslip.io integration
│   └── utils/
│       ├── logger.js        # Logging utility
│       └── validators.js    # Input validation
├── package.json
└── README.md
```

---

## Acceptance Criteria

1. ✅ Single CLI command executes full reconnaissance workflow
2. ✅ Completes scan within 60 seconds (or configured timeout)
3. ✅ Generates professional PDF report
4. ✅ Identifies common vulnerabilities safely
5. ✅ Provides executive summary with risk ratings
6. ✅ Works with domains, IPs, and CIDR ranges
7. ✅ Integrates sslip.io for DNS resolution
8. ✅ Implements SOAR-style orchestration
9. ✅ Educational exploit simulation (no harmful operations)
10. ✅ Professional colored terminal output

---

## Security & Ethical Considerations

- **Educational Purpose Only:** This tool is designed for authorized security testing and educational purposes
- **Safe Simulations:** Exploit simulations are educational demonstrations, never actual exploits
- **No Persistence:** No malware or persistence mechanisms
- **Consent Required:** Users must have authorization to scan target systems
- **Rate Limiting:** Built-in rate limiting to prevent impact on targets

---

## Output Report Structure

### Executive Summary
- Scan overview
- Risk score (0-100)
- Critical findings count
- Recommendations summary

### Technical Findings
- Each vulnerability with:
  - Severity (Critical/High/Medium/Low/Info)
  - Description
  - Evidence
  - Impact
  - Remediation steps

### Appendices
- Scan timeline
- Tools used
- Methodology
