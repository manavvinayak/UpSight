<div align="center">
  <h1>📄 UpSight</h1>
  <p><strong>Professional Document Scanner Web Application</strong></p>
  <p>Transform your documents with intelligent scanning, enhancement, and cloud storage — all within your browser</p>
  
  ![React](https://img.shields.io/badge/React-19-blue?logo=react)
  ![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?logo=vite)
  ![Canvas API](https://img.shields.io/badge/Canvas_API-Native-orange)
  ![License](https://img.shields.io/badge/License-MIT-green)
</div>

---

## 🌟 Overview

**UpSight** is a modern, browser-based document scanning solution inspired by industry leaders like CamScanner. Built entirely with native web technologies, it leverages the **Canvas API** for sophisticated image processing, delivering professional-grade document enhancement without external dependencies or heavy libraries.

### Why UpSight?

-  **Lightning Fast** - Native Canvas API processing with zero overhead
-  **Intelligent Enhancement** - Custom algorithms for text clarity and background cleanup
-  **Fully Responsive** - Seamless experience across desktop, tablet, and mobile devices
-  **Secure & Private** - Cloud storage with user authentication and data isolation
-  **Offline Capable** - IndexedDB storage for local file persistence
-  **Cloud-Powered** - Cloudinary CDN for instant global access

---

##  Key Features

###  **Authentication & Security**
- Secure user registration and login system
- JWT-based authentication with token verification
- Per-user data isolation and access control
- Persistent sessions across browser refreshes

###  **Advanced Document Processing**
- **Multi-format Support**: PNG, JPEG, and PDF files
- **Intelligent Edge Detection**: Custom Sobel operator implementation for accurate document boundary detection
- **Perspective Correction**: Automatic quadrilateral detection and perspective transformation
- **Smart Enhancement**:
  - Unsharp masking for crisp text
  - Adaptive contrast and brightness optimization
  - Background whitening for clean, professional results
  - Text darkening for improved readability

###  **PDF Integration**
- First-page extraction from PDF documents using PDF.js
- Automatic conversion to image format for processing
- High-quality rendering with configurable DPI

###   **Visual Comparison**
- Side-by-side before/after preview
- Interactive zoom controls (50% - 300%)
- Smooth transitions and responsive layout
- High-resolution image preservation

###  **Cloud & Local Storage**
- Dual storage strategy: Cloud (MongoDB) + Local (IndexedDB)
- Cloudinary integration for scalable image hosting
- LocalForage for offline file access
- Automatic upload on file selection
- Comprehensive metadata tracking

###   **Document History**
- Chronological view of all processed documents
- User-specific document gallery
- One-click document retrieval and review
- Delete functionality with cascade cleanup
- Timestamp tracking for upload and modification

###  **User Experience**
- Clean, modern monochrome design
- Intuitive drag-and-drop file upload
- Real-time processing feedback
- Graceful error handling with retry options
- Loading indicators and status messages
- Mobile-first responsive design

---

##   Technology Stack

### **Core Technologies**
| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | Frontend framework | 19.x |
| **Vite** | Build tool & dev server | Latest |
| **Node.js + Express** | Backend API | 20.x |
| **MongoDB** | Cloud database | Latest |

### **Image Processing**
| Technology | Purpose |
|------------|---------|
| **Canvas API** | Native browser image manipulation |
| **Custom Algorithms** | Edge detection (Sobel operator) |
| **Bilinear Interpolation** | Perspective transformation |
| **Unsharp Masking** | Text sharpening |

### **PDF & File Handling**
| Technology | Purpose |
|------------|---------|
| **PDF.js** | PDF parsing and rendering |
| **Cloudinary** | Cloud image storage & delivery |
| **Multer** | File upload handling |

### **Frontend Libraries**
| Technology | Purpose |
|------------|---------|
| **React Router DOM** | Client-side routing |
| **Tailwind CSS** | Utility-first styling |
| **LocalForage** | IndexedDB wrapper for storage |

### **Authentication & Security**
| Technology | Purpose |
|------------|---------|
| **JWT** | Token-based authentication |
| **bcrypt** | Password hashing |
| **CORS** | Cross-origin resource sharing |

---

## 🚀 Getting Started

 

## 📂 Project Structure

```
UpSight/
├── upsight/                    # Frontend React Application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Footer.jsx
│   │   │   ├── Logo.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/            # React Context providers
│   │   │   └── AuthContext.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── home.jsx        # Main document processing page
│   │   │   ├── history.jsx     # Document gallery
│   │   │   ├── signin.jsx
│   │   │   ├── signup.jsx
│   │   │   ├── privacy.jsx
│   │   │   └── terms.jsx
│   │   ├── services/           # API integration
│   │   │   └── api.js
│   │   ├── utils/              # Core processing utilities
│   │   │   ├── api.js          # Authentication API
│   │   │   ├── documentProcessor.js  # Canvas API processing
│   │   │   ├── pdfProcessor.js       # PDF.js integration
│   │   │   └── storage.js            # LocalForage wrapper
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── server/                     # Backend Express API
    ├── src/
    │   ├── config/
    │   │   ├── cloudinary.js   # Cloudinary configuration
    │   │   └── multer.js       # File upload middleware
    │   ├── middleware/
    │   │   └── auth.js         # JWT authentication
    │   ├── models/
    │   │   ├── User.js         # User schema
    │   │   └── Document.js     # Document schema
    │   ├── routes/
    │   │   ├── auth.js         # Authentication routes
    │   │   └── document.js     # Document routes
    │   └── index.js            # Server entry point
    └── package.json
```

 

## 🎯 Usage Guide

### 1. **Sign Up / Sign In**
Create an account or log in to access document processing features.

### 2. **Upload Document**
- Click the upload area or drag-and-drop files
- Supported formats: PNG, JPEG, PDF
- Document automatically uploads to cloud storage

### 3. **Process Document**
- Click "Process Document" button
- Watch real-time processing with status indicators
- System automatically detects edges and corrects perspective

### 4. **Review Results**
- Compare original and processed images side-by-side
- Use zoom slider for detailed inspection
- Results saved automatically

### 5. **Access History**
- Navigate to History page
- View all previously processed documents
- Click any document to review or delete

---

## 🚀 Deployment

### Frontend (Vercel )

```bash
cd upsight
npm run build
# Deploy dist/ folder
```

### Backend (Render )

```bash
cd server
# Set environment variables
# Deploy with auto-build
```
 

## 📝 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## 🙏 Acknowledgments

- **PDF.js** by Mozilla for PDF rendering capabilities
- **Cloudinary** for reliable image hosting
- **React Team** for the amazing frontend framework
- **Tailwind CSS** for elegant styling utilities

---

## 📧 Contact

For questions, suggestions, or support:
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/upsight/issues)

---

<div align="center">
  <p> Made with research</p>
  <p>⭐ Star this repo if you find it useful!</p>
</div>

