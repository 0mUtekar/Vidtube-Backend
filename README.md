# 🎥 YouTube Clone Backend

A robust, scalable Node.js backend API that replicates core YouTube functionality with advanced practices and enterprise-level architecture.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture & Design Patterns](#architecture--design-patterns)
- [Advanced Features](#advanced-features)
- [API Endpoints](#api-endpoints)
- [Security Features](#security-features)
- [Performance Optimizations](#performance-optimizations)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Best Practices Implemented](#best-practices-implemented)
- [Contributing](#contributing)

## 🎯 Overview

This project is a comprehensive backend implementation of a YouTube-like platform, featuring user authentication, channel management, video operations, social interactions (likes, comments), and playlist functionality. Built with enterprise-grade practices and optimizations.

### Key Features
- 🔐 **JWT Authentication** with access/refresh token pattern
- 📱 **RESTful API** with consistent response structure
- 🏗️ **Modular Architecture** with separation of concerns
- 📁 **Cloudinary Integration** for media uploads
- 🔍 **Advanced Validation** and error handling
- 🚀 **Performance Optimized** with efficient queries
- 📊 **Scalable Database** design with proper relationships

## 🛠️ Tech Stack

### Core Technologies
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Media Storage**: Cloudinary
- **File Processing**: Busboy

### Development Tools
- **Environment**: dotenv
- **Security**: bcrypt for password hashing
- **CORS**: Cross-Origin Resource Sharing
- **Middleware**: Cookie Parser

## 🏗️ Architecture & Design Patterns

### 1. **MVC Architecture**
```
Controllers → Business Logic
Models → Data Layer  
Routes → API Endpoints
Middleware → Cross-cutting Concerns
```

### 2. **Modular Structure**
- **Separation of Concerns**: Each module handles specific functionality
- **Single Responsibility**: Controllers focus on request/response handling
- **Dependency Injection**: Services injected where needed

### 3. **Error Handling Pattern**
```javascript
// Custom Error Class
class APIerror extends Error {
    constructor(statusCode, message, errors = [], stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.errors = errors;
        this.success = false;
    }
}
```

### 4. **Async Handler Pattern**
```javascript
// Centralized async error handling
const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message,
            success: false
        });
    }
}
```

## 🚀 Advanced Features

### 1. **Robust Authentication System**
- **Access Token**: Short-lived for API access
- **Refresh Token**: Long-lived for token renewal
- **Password Security**: Bcrypt hashing with salt
- **Token Storage**: HTTP-only cookies for security

### 2. **Advanced File Upload Handling**
- **Multi-format Support**: Images, videos, documents
- **Cloudinary Integration**: Automatic optimization and CDN
- **Organized Storage**: Categorized folders (profiles, banners, videos, thumbnails)
- **Error Handling**: Comprehensive upload failure management

### 3. **Intelligent Query Optimization**
- **Selective Field Retrieval**: `.select()` for performance
- **Population Strategy**: Efficient related data loading
- **Validation Layer**: ObjectId validation before queries
- **Clean Responses**: Exclude internal fields (`-__v`)

### 4. **Ownership Validation Pattern**
```javascript
const validateVideoOwnership = async (videoId, userId) => {
    const video = await Video.findById(videoId).populate("channel_id", "owner");
    if (!video) throw new APIerror(404, "Video not found");
    if (video.channel_id.owner.toString() !== userId.toString()) {
        throw new APIerror(403, "You don't own this video");
    }
    return video;
};
```

## 📡 API Endpoints

### Authentication & User Management
- `POST /api/v1/user/register` - User registration
- `POST /api/v1/user/login` - User login
- `POST /api/v1/user/logout` - User logout
- `PUT /api/v1/user/update-username` - Update username
- `PUT /api/v1/user/update-password` - Update password
- `PUT /api/v1/user/update-profile-picture` - Update profile picture
- `PUT /api/v1/user/update-bio` - Update user bio
- `GET /api/v1/user/me` - Get current user details

### Channel Operations
- `POST /api/v1/channel/create` - Create channel
- `GET /api/v1/channel/:channelName` - Get channel details
- `POST /api/v1/channel/:channelName/subscribe` - Subscribe to channel
- `POST /api/v1/channel/:channelName/unsubscribe` - Unsubscribe from channel
- `PUT /api/v1/channel/:channelName/updatebanner` - Update channel banner
- `PUT /api/v1/channel/:channelName/updatename` - Update channel name
- `GET /api/v1/channel/:channelName/subscribers` - Get subscribers list
- `GET /api/v1/channel/:channelName/subscribers/count` - Get subscribers count

### Video Management
- `POST /api/v1/videos` - Upload video
- `GET /api/v1/videos/:video_id` - Get video details
- `DELETE /api/v1/videos/:video_id` - Delete video
- `PATCH /api/v1/videos/:video_id/thumbnail` - Update thumbnail
- `PATCH /api/v1/videos/:video_id/visibility` - Change visibility
- `PUT /api/v1/videos/:video_id/view` - Increment view count
- `GET /api/v1/videos` - Get all public videos
- `GET /api/v1/videos/channel/:channel_id` - Get channel videos

### Social Features - Likes
- `POST /api/v1/likes/:video_id/likevideo` - Like video
- `POST /api/v1/likes/:video_id/unlike` - Unlike video
- `GET /api/v1/likes/:video_id/likesCount` - Get likes count
- `GET /api/v1/likes/:video_id/likes` - Get likes details

### Social Features - Comments
- `POST /api/v1/comments/:video_id/postComment` - Post comment
- `GET /api/v1/comments/:video_id/getComments` - Get comments
- `DELETE /api/v1/comments/:comment_id/deleteComment` - Delete comment
- `GET /api/v1/comments/:video_id/commentsCount` - Get comments count

### Playlist Features
- `POST /api/v1/playlists` - Create playlist
- `GET /api/v1/playlists/:playlist_id` - Get playlist details
- `POST /api/v1/playlists/:playlist_id/video` - Add video to playlist
- `DELETE /api/v1/playlists/:playlist_id` - Delete playlist
- `DELETE /api/v1/playlists/:playlist_id/video/:video_id` - Remove video from playlist
- `GET /api/v1/playlists/:playlist_id/view` - View playlist

### System Status
- `GET /api/v1/status` - Check system status

## 🔒 Security Features

### 1. **Authentication Security**
- Password hashing with bcrypt (salt rounds: 10)
- JWT tokens with secure secrets
- HTTP-only cookies for token storage
- Automatic token expiration

### 2. **Input Validation**
- ObjectId format validation
- Required field validation
- Data type validation
- String length limits

### 3. **Authorization Controls**
- Resource ownership validation
- Private content access control
- User-specific operations protection

### 4. **CORS Configuration**
```javascript
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
```

## ⚡ Performance Optimizations

### 1. **Database Optimizations**
- **Selective Queries**: Only fetch required fields
- **Population Strategy**: Efficient related data loading
- **Index Usage**: Optimized for common queries
- **Lean Queries**: Minimal object overhead

### 2. **Response Optimizations**
- **Clean Responses**: Remove internal fields (`-__v`)
- **Consistent Structure**: Standardized API responses
- **Minimal Data**: Only return necessary information

### 3. **Media Optimization**
- **Cloudinary CDN**: Fast global content delivery
- **Automatic Optimization**: Image/video compression
- **Format Conversion**: Optimal format selection
- **Folder Organization**: Efficient asset management

### 4. **Error Handling Optimization**
- **Centralized Error Handling**: Single point of error management
- **Graceful Degradation**: Proper fallback mechanisms
- **Detailed Logging**: Comprehensive error tracking

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Cloudinary Account

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/youtube-clone-backend.git
cd youtube-clone-backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Configuration
Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017

# JWT Secrets
ACCESS_JWT_SECRET=your_super_secret_access_key_here
REFRESH_JWT_SECRET=your_super_secret_refresh_key_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Step 4: Start Development Server
```bash
npm start
```

The server will start at `http://localhost:8000`

## 🌍 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 8000 |
| `NODE_ENV` | Environment mode | development |
| `MONGO_URI` | MongoDB connection string | - |
| `ACCESS_JWT_SECRET` | JWT access token secret | - |
| `REFRESH_JWT_SECRET` | JWT refresh token secret | - |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | - |
| `CLOUDINARY_API_KEY` | Cloudinary API key | - |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | - |
| `CORS_ORIGIN` | Allowed CORS origin | - |

## 📁 Project Structure

```
youtube-clone-backend/
├── controllers/           # Request handlers
│   ├── channel.controllers.js
│   ├── comments.controllers.js
│   ├── likes.controllers.js
│   ├── playlists.controllers.js
│   ├── status.controllers.js
│   ├── user.controllers.js
│   └── videos.controllers.js
├── models/               # Database schemas
│   ├── channel.models.js
│   ├── comments.models.js
│   ├── likes.models.js
│   ├── playlists.models.js
│   ├── user.models.js
│   └── video.models.js
├── routes/               # API routes
│   ├── channels.routes.js
│   ├── comments.routes.js
│   ├── likes.routes.js
│   ├── playlists.routes.js
│   ├── status.routes.js
│   ├── user.routes.js
│   └── videos.routes.js
├── middleware/           # Custom middleware
│   ├── cloudinaryMiddleware.js
│   └── verifyJWT.js
├── utils/                # Utility functions
│   ├── APIerror.js
│   ├── APIresponse.js
│   └── asyncHandler.js
├── database/             # Database configuration
│   └── index.js
├── app.js                # Express app configuration
├── index.js              # Server entry point
├── .env                  # Environment variables
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## 🏆 Best Practices Implemented

### 1. **Code Organization**
- **Modular Architecture**: Clear separation of concerns
- **Consistent Naming**: Descriptive and consistent naming conventions
- **File Structure**: Logical organization of files and folders

### 2. **Error Handling**
- **Custom Error Classes**: Standardized error handling
- **Async Wrapper**: Centralized async error catching
- **Graceful Failures**: Proper error responses with status codes

### 3. **Security Practices**
- **Input Validation**: Comprehensive input validation
- **Authentication**: Secure JWT implementation
- **Authorization**: Resource-based access control
- **Password Security**: Bcrypt hashing with salts

### 4. **Database Practices**
- **Schema Validation**: Mongoose schema validation
- **Relationships**: Proper document relationships
- **Indexes**: Optimized for common queries
- **Data Integrity**: Consistent data validation

### 5. **API Design**
- **RESTful Conventions**: Standard REST API patterns
- **Consistent Responses**: Uniform response structure
- **Proper Status Codes**: Appropriate HTTP status codes
- **Documentation**: Clear endpoint documentation

### 6. **Performance Practices**
- **Efficient Queries**: Optimized database operations
- **Caching Strategy**: CDN integration for media
- **Minimal Data Transfer**: Only necessary data in responses
- **Resource Management**: Proper memory and resource handling

### 7. **Development Practices**
- **Environment Configuration**: Secure environment variables
- **Logging**: Comprehensive error and access logging
- **Middleware**: Reusable middleware components
- **Testing Ready**: Structure ready for unit tests

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and patterns
- Add appropriate error handling
- Include proper validation
- Test your changes thoroughly
- Update documentation as needed

---

**Built by Om Utekar**

For questions or support, please open an issue on GitHub.