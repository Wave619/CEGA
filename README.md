
# Cyber Essentials Self-Assessment Tool

A web-based tool to help organizations assess their compliance with Cyber Essentials requirements across five key control areas.

## Features

- Interactive questionnaire covering 5 control areas:
  - Firewalls
  - Secure Configuration
  - Security Update Management
  - User Access Control
  - Malware Protection
- Weighted scoring system for critical security controls
- Risk matrix visualization
- Detailed compliance status for each section
- Specific recommendations for improvement
- Printable assessment report

## How It Works

The assessment uses a weighted scoring system where critical security controls have higher importance:

### Question Weights
- **Weight 3 (Highest Priority)**:
  - Default password changes
  - User authentication

- **Weight 2 (High Priority)**:
  - Boundary firewalls
  - Administrative access restrictions
  - Critical updates
  - Multi-factor authentication
  - Malware protection
  - Malware execution prevention

- **Weight 1 (Standard Priority)**:
  - All other questions

### Scoring

- "Yes" answers receive full weight points
- "Partial" answers receive half weight points
- "No" answers receive zero points
- "N/A" answers are excluded from calculations

### Compliance Status

- **Compliant**: Score ≥ 90%
- **Partially Compliant**: Score 70-89%
- **Non-Compliant**: Score < 70%

## Usage

1. Answer all questions in each section
2. Click "Next" to proceed through sections
3. Review the final results including:
   - Risk matrix position
   - Section-by-section compliance status
   - Overall compliance score
   - Detailed recommendations for improvement
4. Print or save the report as needed

## Files

- `index.html`: Main assessment interface
- `style.css`: Styling and layout
- `script.js`: Assessment logic and scoring calculations

## Development

This tool runs on a basic HTTP server on port 5000. To start the server, click the "Run" button in the Replit interface.
