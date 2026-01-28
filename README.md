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



