# Legal Sathi Deployment Guide

## Vercel Deployment

This project is configured for full-stack deployment on Vercel with both frontend and backend API routes.

### Prerequisites

1. **MongoDB Database**: Set up a MongoDB Atlas cluster or use your preferred MongoDB hosting
2. **Cloudinary Account**: For image uploads and storage
3. **Twilio Account**: For video calling functionality (optional for demo)
4. **Vercel Account**: For deployment

### Environment Variables

Before deploying, set up the following environment variables in your Vercel dashboard:

```bash
# MongoDB
MONGODB_URI=your_production_mongodb_connection_string

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# JWT
JWT_SECRET=your_production_jwt_secret_key

# Admin
ADMIN_EMAIL=admin@legalsathi.com
ADMIN_PASSWORD=your_secure_admin_password

# Twilio Video API (Optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_API_KEY=your_twilio_api_key
TWILIO_API_SECRET=your_twilio_api_secret

# Node Environment
NODE_ENV=production
```

### Deployment Steps

1. **Connect to Vercel**:
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables**:
   - Go to your Vercel dashboard
   - Navigate to your project settings
   - Add all the environment variables listed above

### Project Structure

```
Legal Sathi/
├── frontend/          # React frontend (Vite)
├── backend/           # Express.js backend
├── api/              # Vercel serverless functions
├── admin/            # Admin panel
└── vercel.json       # Vercel configuration
```

### API Endpoints

After deployment, your API will be available at:
- `https://your-domain.vercel.app/api/user/*` - User routes
- `https://your-domain.vercel.app/api/lawyer/*` - Lawyer routes
- `https://your-domain.vercel.app/api/admin/*` - Admin routes
- `https://your-domain.vercel.app/api/twilio/*` - Video calling routes

### Local Development

1. **Backend**:
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Troubleshooting

1. **Database Connection Issues**: Ensure your MongoDB URI is correct and the database is accessible
2. **CORS Issues**: The API is configured to accept requests from Vercel domains
3. **Environment Variables**: Double-check all environment variables are set in Vercel dashboard
4. **Build Errors**: Check the Vercel build logs for specific error messages

### Features

- **User Authentication**: JWT-based authentication for users, lawyers, and admin
- **Video Calling**: Twilio-powered video consultations
- **File Uploads**: Cloudinary integration for profile pictures and documents
- **Payment Integration**: Razorpay for consultation payments
- **Admin Panel**: Complete admin dashboard for managing users and lawyers

### Demo Mode

The application includes demo mode for video calling when Twilio credentials are not configured, allowing you to test the interface without setting up Twilio.
