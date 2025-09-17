# LegalSathi - Legal Consultation Platform

[![Vercel](https://img.shields.io/badge/Visit%20Live%20Demo-000000?style=for-the-badge&logo=vercel&labelColor=000000)](https://legal-sathi-bcnp.vercel.app/)

> 🌐 **Live Demo:** [https://legal-sathi-bcnp.vercel.app/](https://legal-sathi-bcnp.vercel.app/)


LegalSathi is a comprehensive legal consultation platform that connects clients with legal professionals. The platform features a three-tier authentication system to serve different user roles:

## Key Features

### For Clients
- User registration and authentication
- Browse and search for qualified lawyers
- Book legal consultations (chat, video, phone)
- Manage consultation history and documents
- Access legal resources and IPC sections

### For Lawyers
- Professional profile management
- Consultation scheduling and management
- Video/audio call consultations
- Client management system
- Earnings tracking
- Availability calendar

### For Admin
- User and lawyer management
- Consultation monitoring
- Platform analytics
- Content management
- Dispute resolution

## Technology Stack
- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: JWT
- **Real-time Communication**: WebRTC for video calls
- **Payments**: Integrated payment gateway

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```
3. Set up environment variables
4. Start the development servers:
   ```bash
   # Backend
   cd backend && npm start
   
   # Frontend
   cd frontend && npm run dev
   ```

## License
This project is licensed under the MIT License.
