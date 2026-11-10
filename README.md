# EPIA Patient Follow-up Management System

A complete, professional healthcare patient follow-up management system with AI-powered automation. Built as an internship assessment project for EPIA Backend & AI Automation.

## 📸 Screenshots

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)
*Real-time statistics and follow-up status visualization*

### Patient Management
![Patient List](docs/screenshots/patient-list.png)
*Complete CRUD operations for patient records*

### AI Follow-up Automation
![AI Automation](docs/screenshots/ai-automation.png)
*AI-powered message generation with staff approval workflow*

### Add/Edit Patient
![Patient Form](docs/screenshots/patient-form.png)
*Patient data entry with validation*

*Note: Screenshots should be added to the `docs/screenshots/` directory for documentation purposes.*

## 🌟 Features

- **Dashboard**: Real-time statistics and follow-up status visualization
- **Patient Management**: Complete CRUD operations for patient records
- **AI-Powered Follow-ups**: Generate personalized WhatsApp messages using Gemini AI
- **Draft Management**: Staff review and approval workflow for AI-generated messages
- **Search & Filter**: Quickly find patients by name, phone, or status
- **Responsive Design**: Professional healthcare SaaS interface optimized for all devices
- **Data Persistence**: SQLite database for reliable data storage

## 🛠 Technology Stack

### Frontend
- **React.js** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons
- **Recharts** for data visualization

### Backend
- **Node.js** runtime
- **Express.js** web framework
- **SQLite** database
- **REST API** architecture
- **dotenv** for environment variables
- **Gemini API** for AI message generation (with mock fallback)

## 📁 Project Structure

```
epia-patient-followup/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components (Sidebar, Toast)
│   │   ├── contexts/        # React contexts (ToastContext)
│   │   ├── hooks/           # Custom hooks (useToast)
│   │   ├── layouts/         # Page layouts (MainLayout)
│   │   ├── pages/           # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── PatientList.jsx
│   │   │   ├── AddPatient.jsx
│   │   │   ├── EditPatient.jsx
│   │   │   ├── ViewPatient.jsx
│   │   │   └── AIAutomation.jsx
│   │   ├── services/        # API service layer
│   │   ├── App.jsx          # Root component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── backend/
│   ├── config/
│   │   └── database.js      # SQLite database configuration
│   ├── controllers/
│   │   ├── patientController.js
│   │   └── messageDraftController.js
│   ├── routes/
│   │   ├── patientRoutes.js
│   │   └── messageDraftRoutes.js
│   ├── services/
│   │   └── aiService.js     # Gemini AI integration
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── database/
│   │   ├── epia.db          # SQLite database file
│   │   └── seed.js          # Sample data seeder
│   ├── server.js            # Express server
│   ├── package.json
│   └── .env                 # Environment variables
└── README.md
```

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key (optional):
```
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

4. Initialize the database with sample data:
```bash
node database/seed.js
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

The default `.env` should contain:
```
VITE_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🔌 API Endpoints

### Patient Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patients/stats` | Get dashboard statistics |
| GET | `/api/patients/due-today` | Get patients due for follow-up today |
| GET | `/api/patients` | Get all patients (supports search and status filter) |
| GET | `/api/patients/:id` | Get patient by ID |
| POST | `/api/patients` | Create new patient |
| PUT | `/api/patients/:id` | Update patient details |
| DELETE | `/api/patients/:id` | Delete patient |
| PATCH | `/api/patients/:id/complete` | Mark follow-up as completed |

### Message Draft Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/message-drafts/:id/generate` | Generate AI message for patient |
| GET | `/api/message-drafts/:id` | Get message draft by patient ID |
| PUT | `/api/message-drafts/:id` | Update message draft |
| POST | `/api/message-drafts/:id/approve` | Approve message draft |
| POST | `/api/message-drafts/:id/reject` | Reject message draft |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check API health status |

## 💾 Database Schema

### Patients Table
```sql
CREATE TABLE patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  consultation_date TEXT NOT NULL,
  follow_up_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Message Drafts Table
```sql
CREATE TABLE message_drafts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'Not Generated',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);
```

## 🤖 AI Integration

### Gemini API Integration

The system uses Google's Gemini API to generate personalized follow-up messages. The AI considers:
- Patient name
- Consultation date
- Follow-up date
- Professional and friendly tone
- WhatsApp-appropriate formatting

### Mock AI Fallback

If the Gemini API key is not configured or the API is unavailable, the system automatically falls back to a mock AI response. This ensures the complete workflow remains functional for testing and demonstration purposes.

Mock messages are randomly selected from a set of pre-written professional templates.

### Staff Approval Workflow

**Important**: The system does NOT automatically send WhatsApp messages. All AI-generated messages must be:
1. Reviewed by staff
2. Edited if necessary
3. Approved or rejected manually

This ensures quality control and prevents unintended communications.

## 🧪 Testing

### Manual Testing Steps

1. **Backend Health Check**
```bash
curl http://localhost:5000/api/health
```

2. **Test Patient Endpoints**
```bash
# Get all patients
curl http://localhost:5000/api/patients

# Get dashboard stats
curl http://localhost:5000/api/patients/stats

# Get patients due today
curl http://localhost:5000/api/patients/due-today
```

3. **Test AI Message Generation**
```bash
# Generate AI message for patient ID 1
curl -X POST http://localhost:5000/api/message-drafts/1/generate
```

4. **Frontend Testing**
   - Open `http://localhost:3000` in your browser
   - Navigate through all pages
   - Test adding, editing, and deleting patients
   - Test AI message generation and approval workflow
   - Verify search and filter functionality

### Sample Data

The database seeder includes 8 fictional patients with various follow-up dates and statuses for testing purposes.

## 🚀 Production Build

### Frontend Production Build

```bash
cd frontend
npm run build
```

The built files will be in the `frontend/dist` directory.

### Backend Production

For production deployment:
1. Set `NODE_ENV=production`
2. Use a process manager like PM2
3. Configure proper CORS settings
4. Use environment-specific database
5. Implement proper logging

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5000/api
```

## 📝 Important Notes

- **Security**: API keys are stored in backend environment variables only, never in frontend code
- **Data Persistence**: All patient data is stored in SQLite database (`backend/database/epia.db`)
- **No Real WhatsApp Integration**: The system generates message drafts only. Real WhatsApp API integration is not implemented.
- **Mock AI**: The system works completely with mock AI responses if Gemini API is unavailable
- **Staff Review**: Every AI-generated message requires manual staff approval before any action
- **Environment Files**: `.env` files are excluded from Git via `.gitignore`. Use `.env.example` as template

## ✅ Assessment Compliance

This project fully complies with the EPIA Backend & AI Automation Internship Technical Assessment requirements:

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| GET /api/patients/stats | ✅ | Returns total patients, due today, completed, pending, upcoming |
| POST /api/patients | ✅ | Creates patient with validation for name, phone, dates |
| GET /api/patients | ✅ | Returns all patients with search and status filter |
| GET /api/patients/due-today | ✅ | Returns patients with today's follow-up and Pending status |
| PATCH /api/patients/:id/complete | ✅ | Updates follow-up status to Completed |
| AI Draft Generation | ✅ | Uses Gemini API with mock fallback |
| Draft Editing | ✅ | PUT endpoint to update message content |
| Draft Approval | ✅ | POST endpoint to approve draft (no auto-send) |
| Draft Rejection | ✅ | POST endpoint to reject draft |
| No Auto WhatsApp | ✅ | No WhatsApp API integration; staff approval required |
| SQLite Database | ✅ | Patients and message_drafts tables with foreign keys |
| Input Validation | ✅ | Middleware validation on all endpoints |
| Error Handling | ✅ | Centralized error handler with proper HTTP codes |
| REST API | ✅ | All endpoints follow REST conventions |
| Frontend Integration | ✅ | React frontend with Axios API calls |
| Professional UI | ✅ | Healthcare SaaS design with Tailwind CSS |
| Responsive Design | ✅ | Works on desktop, tablet, and mobile |

## 🔍 Setup Verification

After installation, verify the setup:

1. **Backend Health Check**
```bash
curl http://localhost:5000/api/health
```
Expected: `{"success":true,"message":"EPIA Patient Follow-up API is running"}`

2. **Database Initialization**
```bash
# Check if database exists
ls backend/database/epia.db
```

3. **Frontend Build**
```bash
cd frontend
npm run build
```
Expected: Build succeeds with output in `dist/` directory

4. **Test AI Generation**
```bash
# Generate a test message (requires a patient in database)
curl -X POST http://localhost:5000/api/message-drafts/1/generate
```
Expected: AI-generated message with status "Generated"

## 🐛 Known Limitations

1. No real WhatsApp message sending capability
2. SQLite is not suitable for high-concurrency production environments
3. No user authentication system
4. No audit trail for message approvals
5. Limited to single-user scenarios

## 📄 License

This project was created as an internship assessment for EPIA Backend & AI Automation.

## 👨‍💻 Development

### Adding New Features

1. **Backend**: Add controllers, routes, and update database schema if needed
2. **Frontend**: Create page components in `src/pages/` and add routes in `App.jsx`
3. **API**: Add new endpoints to the API service in `src/services/api.js`

### Code Style

- Follow existing code structure and patterns
- Use descriptive variable and function names
- Add comments for complex logic
- Maintain consistent formatting

## 📞 Support

For questions or issues related to this project, please refer to the EPIA internship assessment guidelines.

---

**Built with ❤️ for EPIA Patient Follow-up Management**
#   e p i a - p a t i e n t - f o l l o w u p  
 