# ACORS Frontend - Setup Guide

## Quick Start for MVP Hackathon Demo

This guide will help you get the frontend connected to the backend with full photo upload, AI analysis, and GPS mocking functionality.

---

## Step 1: Install Dependencies

```bash
cd frontend
npm install
```

---

## Step 2: Get Your Credentials

### Supabase Setup:
1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project or use existing one
3. Go to **Project Settings** → **API** 
4. Copy your:
   - **Project URL** (VITE_SUPABASE_URL)
   - **Anon Key** (VITE_SUPABASE_ANON_KEY)

### Cloudinary Setup:
1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up (free tier is fine)
3. Go to **Dashboard**
4. Copy your:
   - **Cloud Name** (VITE_CLOUDINARY_CLOUD_NAME)
5. Go to **Settings** → **Upload**
6. Create an **Unsigned Preset** (give it any name, e.g., "valor-uploads")
7. Copy the preset name (VITE_CLOUDINARY_UPLOAD_PRESET)

---

## Step 3: Configure Environment Variables

Edit `frontend/.env` and fill in your credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=valor-uploads
```

---

## Step 4: Start the Development Server

```bash
npm run dev
```

The app will run on `http://localhost:5173`

---

## Step 5: Test the MVP Flow

### Go to: **Report Issue**

#### Option A: Use the Mock Sample Image
- Click "Use Sample" button
- This loads `garbage-sample.jpg` from assets
- The image is uploaded to Cloudinary
- AI analyzes it using the backend `draft-report` function

#### Option B: Upload Your Own Photo
- Click "Choose Photo"
- Select any image from your device
- Same flow applies

### What Happens Next:
1. **Loading Screen** appears with "Hold on..." message
2. Image uploads to Cloudinary in background
3. GPS location is mocked randomly within Valencia City, Bukidnon
4. AI function is called with the Cloudinary URL
5. AI results are displayed (title, category, priority, department)
6. User can submit the report
7. Report is created in Supabase database
8. Success screen shows with Report ID

---

## Features Implemented for MVP

✅ **Photo Capture & Upload**
- File input to select or take photos
- Mock sample garbage-sample.jpg image
- Automatic upload to Cloudinary
- Base64 preview before upload

✅ **AI Photo Analysis**
- Calls Supabase Edge Function `draft-report`
- Returns: title, description, category, priority, department, confidence
- Shows "Hold on..." loading message during processing

✅ **GPS Mocking**
- Auto-generates random coordinates within Valencia City bounds
- Returns realistic latitude/longitude values
- Displays on map mock

✅ **Report Creation**
- Saves report to Supabase database
- Links photo URL from Cloudinary
- Stores GPS location
- Shows confirmation with Report ID

✅ **Happy Path Flow**
- Step 1: Upload Photo
- Step 2: Review AI Analysis
- Step 3: Submit Report
- Step 4: Success Confirmation

---

## API Endpoints Used

### Supabase Edge Functions (Backend):
- `POST /functions/v1/draft-report` - AI photo analysis

### Supabase REST API:
- `POST /rest/v1/reports` - Create new report

---

## Environment Notes

### Mock Data:
- GPS: Random coordinates in Valencia City, Bukidnon (8.21-8.27 lat, 125.08-125.14 lon)
- Sample Image: `garbage-sample.jpg` in `/src/assets`

### Real Integrations:
- Cloudinary: Real image uploads
- Supabase: Real database writes
- Gemini AI (backend): Real AI analysis

---

## Troubleshooting

### "Cloudinary not configured"
- Check your `.env` file has all Cloudinary variables
- Restart dev server after editing `.env`

### "Missing Supabase configuration"
- Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set
- Make sure Supabase project is running

### Photo upload fails
- Check Cloudinary credentials
- Ensure unsigned preset exists and name matches
- Check network connection

### AI analysis shows error
- Verify backend `draft-report` function is deployed
- Check GEMINI_API_KEY is set in Supabase function secrets
- Test function directly from Supabase dashboard

---

## Next Steps After Hackathon

- Replace mock GPS with real geolocation
- Add real camera capture (not just file input)
- Add user authentication
- Store report history per user
- Add real-time notification system
- Deploy to production

---

## Support Files

- [API Documentation](../backend/docs/API_DOCUMENTATION.md)
- [Deployment Guide](../backend/docs/DEPLOYMENT_GUIDE.md)
- [Testing Guide](../backend/TESTING_GUIDE.md)
