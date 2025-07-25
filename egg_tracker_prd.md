# The Daily Yolk - Product Requirements Document

## Overview
Build a mobile-first web application called "The Daily Yolk" for quickly logging egg consumption with minimal friction. The app should be optimized for daily use on mobile devices and integrate with an existing Google Sheets database containing 500+ rows of historical data.

## Core Requirements

### User Interface
- **Single-page application** with no navigation needed
- **Mobile-first design** optimized for phone usage
- Clean, minimal interface with large touch targets
- Orange/yellow color scheme to match egg theme
- Responsive design that works on both mobile and desktop

### Functional Requirements

#### Date Selection
- Display current date prominently at top in format: "Day, Month DDth, YYYY" (e.g., "Fri, August 25th, 2025")
- Date should be clickable to open a calendar modal
- Calendar modal should:
  - Default to today's date
  - Allow selection of past dates for retroactive logging
  - Close when date is selected or cancelled
  - Update the displayed date immediately

#### Preparation Style Selection
- Four large buttons for egg preparation methods:
  - Scrambled
  - Fried  
  - Boiled
  - Other
- Only one selection allowed at a time
- Selected button should have visual feedback (different styling)
- Default selection: Scrambled

#### Quantity Selection
- Plus (+) and minus (-) buttons flanking a number display
- Default quantity: 3
- Minimum quantity: 1
- Maximum quantity: 12 (reasonable upper bound)
- Large, easy-to-tap buttons

#### Submission
- Large green "Submit" button at bottom
- On successful submission:
  - Show green success message: "Successfully submitted!"
  - Reset form to defaults (today's date, Scrambled, quantity 3)
  - Keep form active for additional entries
- Handle errors gracefully with user-friendly messages

### Data Integration

#### Google Sheets Integration
- Connect to existing Google Sheets document
- Append new rows with columns matching existing format:
  - Column A: Timestamp (MM/DD/YYYY HH:MM:SS format - when submitted)
  - Column B: Date Eaten (MM/DD/YYYY format - the date selected in app)
  - Column C: Preparation Style (text)
  - Column D: Quantity Eaten (number)
  - Column E: Location Eaten (leave blank - legacy column, no longer used)

#### API Requirements
- Use Google Sheets API v4
- Implement proper authentication (Service Account recommended)
- Handle rate limits and network errors
- Provide clear error messages for connection issues

### Technical Specifications

#### Frontend
- **Single HTML file** with embedded CSS and JavaScript (for easy deployment)
- **Vanilla JavaScript** (no frameworks needed for this simple app)
- **CSS Grid/Flexbox** for responsive layout
- **Local storage** for storing API credentials if needed

#### Deployment
- Deploy to **Vercel** (user has existing setup there)
- No server-side requirements
- Include instructions for Google Sheets API setup
- Optimize for home screen bookmark/PWA functionality

#### Browser Support
- **Primary target**: Firefox on Android (user's main device)
- Modern mobile browsers (Chrome, Safari, Firefox)
- Optimize for home screen bookmark functionality
- Compatible with Hermit Lite app wrapper if needed

## Design Specifications

### Layout
```
┌─────────────────────────┐
│    🥚 The Daily Yolk   │
├─────────────────────────┤
│  Fri, August 25th, 2025│  ← Clickable date
├─────────────────────────┤
│                         │
│ [Scrambled*] [Fried]    │  ← Selection buttons
│ [Boiled]     [Other]    │  ← * indicates selected
│                         │
├─────────────────────────┤
│    [-]    3    [+]      │  ← Quantity selector
├─────────────────────────┤
│      [Submit]           │  ← Submit button
└─────────────────────────┘
```

### Color Scheme
- Primary: Yolk Yellow (#FFD700)
- Secondary: Light yellow (#FFF8DC)
- Success: Green (#28A745)
- Background: Light cream (#FFFEF7)
- Text: Dark gray (#333333)

### Button States
- **Unselected**: Light background, yolk yellow border
- **Selected**: Yolk yellow background, dark text
- **Hover/Active**: Slightly darker yellow
- **Disabled**: Gray background, gray text

## Success Metrics
- **Speed**: Form completion in under 10 seconds
- **Reliability**: 99%+ successful submissions
- **Usability**: No more than 3 taps required for standard entry

## Future Considerations (Not Required for MVP)
- PWA manifest for better home screen app experience
- Offline capability with sync when online
- Basic analytics dashboard
- Export functionality
- Preparation style customization
- Bulk entry for multiple meals

## Setup Instructions for Developer

### Google Sheets API Setup
1. Go to Google Cloud Console
2. Create new project or select existing
3. Enable Google Sheets API
4. Create Service Account credentials
5. Download JSON key file
6. Share target Google Sheet with service account email
7. Note the Sheet ID from the URL

### Required Environment Variables/Configuration
- `GOOGLE_SHEETS_ID`: The Google Sheets document ID
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`: Service account email
- `GOOGLE_PRIVATE_KEY`: Private key from service account JSON

### Existing Data Format
The current Google Sheet has columns:
- Column A: Timestamp (MM/DD/YYYY HH:MM:SS format - when form was submitted)
- Column B: Date Eaten (MM/DD/YYYY format - the actual date eggs were consumed)
- Column C: Preparation Style (text: "Scrambled (Hard, Soft, Omelette, Frittata)", "Boiled (Hard, Soft, Deviled)", etc.)
- Column D: Quantity Eaten (number)
- Column E: Location Eaten (legacy column - leave blank for new entries)

New entries should append to this existing format. The app should populate:
- Column A with current timestamp when form is submitted
- Column B with the date selected in the app (defaults to today)
- Column C with the selected preparation style (simplified: "Scrambled", "Fried", "Boiled", "Other")
- Column D with the selected quantity
- Column E should be left empty (or can be omitted entirely)

## Acceptance Criteria
- [ ] App loads quickly on mobile devices
- [ ] Date displays correctly and calendar modal works
- [ ] All preparation style buttons work with proper visual feedback
- [ ] Quantity selector works with constraints (1-12)
- [ ] Successful submission appends data to Google Sheets
- [ ] Success message displays and form resets properly
- [ ] Error handling works for network/API issues
- [ ] App works well as home screen bookmark on Android Firefox
- [ ] Compatible with Hermit Lite if user chooses that approach
- [ ] Optimized specifically for Android Firefox browser
- [ ] Meets accessibility standards (semantic HTML, proper contrast)

## Technical Notes
- Keep the entire app in a single HTML file for maximum portability
- Use modern JavaScript features (ES6+) but ensure mobile browser compatibility
- Implement proper error boundaries and user feedback
- Consider using a simple build step to minify if desired
- Include comprehensive comments in code for future maintenance