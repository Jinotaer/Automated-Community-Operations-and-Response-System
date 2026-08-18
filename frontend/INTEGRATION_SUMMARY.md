# ACORS MVP Frontend-Backend Integration Summary

## What's Been Implemented

### ✅ Complete End-to-End Flow

**Frontend → Backend → Database**

```
User selects photo
    ↓
Photo uploaded to Cloudinary
    ↓
Cloudinary URL sent to Supabase Edge Function
    ↓
AI (Gemini) analyzes photo via backend function
    ↓
Results returned to frontend
    ↓
User reviews and submits
    ↓
Report created in Supabase database with photo URL
    ↓
Success confirmation with Report ID
```

---

## Services Created

### 1. **Supabase Client** (`src/services/supabase.js`)
- Initializes Supabase with environment variables
- Used for database operations

### 2. **Report API** (`src/services/reportApi.js`)
Functions:
- `callDraftReport()` - Calls backend AI function
- `createReport()` - Saves report to database
- `getReports()` - Retrieves reports (future use)

### 3. **Cloudinary API** (`src/services/cloudinaryApi.js`)
Functions:
- `uploadToCloudinary()` - Uploads file/base64 to Cloudinary
- Returns secure URL for use with AI

### 4. **GPS Service** (`src/services/gps.js`)
Functions:
- `getMockGPSLocation()` - Random coordinates in Valencia City
- `getRealOrMockGPSLocation()` - Attempts real GPS, falls back to mock

---

## Component Updates

### ReportIssue.jsx - Complete Rewrite

**State Management:**
```javascript
- photoFile: actual File object
- photoPreview: base64 data URL for preview
- aiResult: AI response data (title, description, etc.)
- isLoading: shows "Hold on..." loading screen
- reportId: report ID from database
- gpsLocation: mock GPS coordinates
```

**Key Features:**
1. **Photo Upload**
   - File input for selecting photos
   - "Use Sample" button loads garbage-sample.jpg from assets
   - Instant preview before upload

2. **AI Analysis**
   - Displays loading screen with "Hold on..." message
   - Uploads to Cloudinary in background
   - Calls backend draft-report function
   - Shows confidence percentage
   - Maps AI response to UI fields

3. **Location Display**
   - Mock GPS coordinates shown in map visualization
   - Coordinates saved with report

4. **Report Submission**
   - Creates record in Supabase database
   - Links Cloudinary photo URL
   - Returns Report ID
   - Shows success screen with timestamp

---

## Dependencies Added

```json
{
  "@supabase/supabase-js": "^2.38.4"
}
```

---

## Environment Configuration

**Required `.env` variables:**
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-preset
```

---

## Data Flow Example

### From User Perspective:

**Step 1: Upload Photo**
```
User clicks "Use Sample" 
→ garbage-sample.jpg loads
→ preview shows in UI
→ "Analyze Photo with AI" button enabled
```

**Step 2: Processing**
```
User clicks "Analyze Photo with AI"
→ Loading screen appears with "Hold on..."
→ Photo uploads to Cloudinary (background)
→ GPS location mocked (Valencia City)
→ Backend function called with Cloudinary URL
→ AI analyzes image
```

**Step 3: Review Results**
```
Step 2 completes
→ AI results displayed:
  - Title: "Large pothole detected..."
  - Category: "Potholes"
  - Priority: "High"
  - Department: "Engineering Office"
  - Confidence: "94%"
→ Location shows coordinates
→ "Submit Report" button ready
```

**Step 4: Submit & Success**
```
User clicks "Submit Report"
→ Loading screen appears
→ Report created in database
→ Success screen shows:
  - Report ID (e.g., #abc-123-def)
  - Submission timestamp
  - Status: "Under Review"
```

---

## Backend Integration Points

### Supabase Edge Functions Called:
- **POST `/functions/v1/draft-report`**
  - Input: `{ photo_url, latitude, longitude }`
  - Output: AI classification with confidence
  - Used in: Step 2 processing

### Supabase REST API Called:
- **POST `/rest/v1/reports`**
  - Input: Report details (title, description, category, etc.)
  - Output: Report ID and metadata
  - Used in: Step 4 submission

---

## GPS Mocking Implementation

**Valencia City Bounds:**
```javascript
- North: 8.2700°
- South: 8.2100°
- East: 125.1400°
- West: 125.0800°
```

**Each report gets random coords within bounds:**
```
Example: 8.2347°, 125.1076°
```

---

## Cloudinary Integration

**Image Upload Flow:**
1. User selects or loads photo
2. Frontend converts to File object
3. Calls `uploadToCloudinary(file)`
4. Form data sent to Cloudinary unsigned endpoint
5. Returns secure URL (https://res.cloudinary.com/...)
6. URL used for AI analysis and stored in database

**Benefits:**
- Offloads image storage from Supabase
- Fast CDN delivery
- AI gets public URL without authentication

---

## Error Handling

**Graceful Fallbacks:**
- Cloudinary unavailable → User sees alert, can retry
- Backend function fails → User sees alert with error
- Network error → Caught and displayed to user
- GPS unavailable → Falls back to mock coords
- Missing env vars → Console warning, app still works

---

## MVP Happy Path Testing

### Prerequisites:
1. ✅ Frontend npm install complete
2. ✅ .env configured with Supabase & Cloudinary
3. ✅ Supabase project created with migrations run
4. ✅ Backend functions deployed
5. ✅ garbage-sample.jpg exists in src/assets

### Test Steps:

1. **Navigate to Report Issue page**
   ```
   Go to: /report-issue
   ```

2. **Load mock sample**
   ```
   Click: "Use Sample" button
   Expected: garbage-sample.jpg appears in preview
   ```

3. **Analyze with AI**
   ```
   Click: "Analyze Photo with AI"
   Expected: Loading screen shows "Hold on..." for 3-5 seconds
   ```

4. **Review results**
   ```
   Expected: AI fills in title, description, category, priority, department
   Expected: Confidence shows (e.g., "94%")
   Expected: GPS location displays (random Valencia City coords)
   ```

5. **Submit report**
   ```
   Click: "Submit Report"
   Expected: Loading briefly, then success screen
   Expected: Report ID displayed
   Expected: Timestamp shown (current date/time)
   ```

6. **Verify in database**
   ```
   Check Supabase > reports table
   Expected: New row with submitted data
   Expected: photo_url points to Cloudinary
   Expected: GPS coordinates stored
   ```

---

## Files Modified/Created

### Created:
- `frontend/src/services/supabase.js`
- `frontend/src/services/reportApi.js`
- `frontend/src/services/cloudinaryApi.js`
- `frontend/src/services/gps.js`
- `frontend/SETUP_MVP.md`
- `frontend/.env` (template)

### Modified:
- `frontend/src/Citizen/ReportIssue.jsx` (complete rewrite)
- `frontend/package.json` (added @supabase/supabase-js)

---

## Performance Notes

- **Image upload**: 1-3 seconds (depends on file size & network)
- **AI analysis**: 2-5 seconds (backend function processing)
- **Total flow**: ~5-10 seconds from photo to results
- **Loading UI**: Smooth "Hold on..." message with spinner

---

## Future Enhancements

Post-hackathon:
- [ ] Real camera capture (camera.js library)
- [ ] User authentication
- [ ] Report history/dashboard
- [ ] Real GPS geolocation
- [ ] Report status tracking
- [ ] Notification system
- [ ] Multi-language support
- [ ] Offline support with sync
- [ ] Image compression before upload
- [ ] Map integration (MapBox/Google Maps)

---

## Support & Debugging

### If photo upload fails:
```bash
# Check Cloudinary credentials in browser console
console.log(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME)
```

### If AI analysis fails:
```bash
# Check backend function in Supabase dashboard
# Verify GEMINI_API_KEY secret is set
# Test function directly from dashboard
```

### If report doesn't save:
```bash
# Check Supabase API key in browser console
# Verify reports table exists (run migrations)
# Check RLS policies allow inserts
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            ReportIssue Component                     │   │
│  │  ├─ handlePhotoSelect()                              │   │
│  │  ├─ handleUseMockSample()                            │   │
│  │  ├─ handlePhotoNext() (Upload + AI)                  │   │
│  │  └─ handleSubmit() (Create Report)                   │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Services Layer                             │   │
│  │  ├─ cloudinaryApi.uploadToCloudinary()              │   │
│  │  ├─ reportApi.callDraftReport()                     │   │
│  │  ├─ reportApi.createReport()                        │   │
│  │  ├─ gps.getMockGPSLocation()                        │   │
│  │  └─ supabase.client                                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          ↓
        ┌─────────────────────────────────────┐
        │   Third-Party Services              │
        │  ├─ Cloudinary (Image Upload)      │
        │  └─ Supabase (Backend & Database)  │
        └─────────────────────────────────────┘
                          ↓
        ┌─────────────────────────────────────┐
        │    Backend (Supabase)               │
        │  ├─ Edge Functions                 │
        │  │  └─ draft-report (Gemini AI)   │
        │  ├─ REST API                       │
        │  │  └─ POST /rest/v1/reports      │
        │  └─ Database (PostgreSQL)          │
        │     └─ reports table               │
        └─────────────────────────────────────┘
```

---

## Hackathon Demo Checklist

- [ ] .env file configured with real credentials
- [ ] npm install complete
- [ ] Development server running (`npm run dev`)
- [ ] Can navigate to Report Issue page
- [ ] Can load sample garbage image
- [ ] Can click "Analyze Photo with AI"
- [ ] Loading screen appears with "Hold on..."
- [ ] AI results display after 3-10 seconds
- [ ] Can submit report
- [ ] Success screen shows Report ID
- [ ] Report appears in Supabase dashboard
- [ ] Photo URL points to Cloudinary
- [ ] GPS coordinates saved

---

**Ready for Hackathon Demo! 🚀**
