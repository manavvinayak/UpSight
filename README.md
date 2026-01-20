# UpSight - Document Scanner Web App

A CamScanner-style web application built with React that automatically detects and perspective-corrects documents from uploaded images or PDFs.

## Features

### ✓ Authentication
- Email/password sign-up and sign-in
- Per-user data isolation
- Secure session management using localStorage

### ✓ Document Processing
- Upload PNG, JPEG, or PDF files
- Automatic document edge detection using OpenCV.js
- Perspective correction and transformation
- PDF first-page extraction using PDF.js

### ✓ Before/After View
- Side-by-side comparison of original and corrected images
- Zoom controls (50% - 300%)
- Pan functionality with scrollable containers

### ✓ Persistence
- Files stored using LocalForage (IndexedDB)
- Metadata tracking (userId, filename, timestamps, status)
- Per-user file URLs and access control

### ✓ Gallery/History
- List all prior uploads for signed-in user
- Click to view before/after comparisons
- Delete uploads functionality
- Sorted by most recent first

### ✓ UI/UX
- Monochrome design using Tailwind CSS
- Clean, professional interface
- Loading states and progress indicators
- Comprehensive error handling with retry options
- Responsive design for desktop and mobile

## Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS (monochrome palette)
- **Computer Vision**: OpenCV.js (document detection & perspective correction)
- **PDF Processing**: PDF.js
- **Storage**: LocalForage (IndexedDB wrapper)
- **State Management**: React Context API

## Installation

```bash
# Clone the repository
cd upsight

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173/`

