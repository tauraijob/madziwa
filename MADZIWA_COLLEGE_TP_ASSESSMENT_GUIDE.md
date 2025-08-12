# Madziwa College TP Assessment Platform - Development Guide

## Project Overview
A comprehensive web-based application for Teaching Practice (TP) assessment management at Madziwa College. Built with React frontend, Django backend, and PrimeVue UI components.

## Technology Stack

### Frontend
- **Nuxt 4 (Vue 3)** - Application framework with Vite dev server
- **PrimeVue 4** - UI component library
- **Vue Router 4** - Client-side routing
- **Axios** - HTTP client for API communication
- **Tailwind CSS 3** - Utility-first styling
- **PrimeIcons 7** - Icon library

### Backend
- **Nuxt Server API (Nitro 2)** - Server routes and runtime
- **Prisma 6** - Type-safe ORM
- **MySQL** - Primary database (XAMPP in local dev)
- **Puppeteer 24** - PDF generation
- **JSZip 3** - ZIP creation for batch downloads

### Styling
- **Tailwind CSS** - Utility classes and theming
- **PrimeVue CSS** - Component styling
- **Responsive Design** - Mobile-first approach

## Project Structure

```
madziwa-tp-platform/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   ├── styles/         # Custom CSS
│   │   └── App.jsx         # Main app component
│   ├── public/
│   └── package.json
├── backend/                 # Django application
│   ├── madziwa_tp/         # Django project
│   │   ├── assessments/    # Assessment app
│   │   ├── users/          # User management
│   │   ├── api/            # API endpoints
│   │   └── settings.py     # Django settings
│   ├── requirements.txt
│   └── manage.py
└── README.md


## Core Features

### 1. Assessment Score Sheet Form
**Supervisor Details:**
- Full Name (InputText)
- Email Address (InputText with email validation)
- Phone Number (InputText with phone validation)
- National ID Number (InputText)

**Student Details:**
- Full Name (InputText)
- Sex (Dropdown: Male/Female)
- Candidate Number (InputText with format validation)
- Email Address (InputText with email validation)
- School Name (InputText)
- Class (InputText)
- Assessment Date (Calendar)
- Assessment Time (Calendar with time picker)
- Subject (InputText)
- Topic (InputText)

### 2. Assessment Scoring System (100 points total)

| Category | Max Mark | Components |
|----------|----------|------------|
| Preparation & Scheming | 20 | InputNumber, Textarea |
| Lesson Planning | 20 | InputNumber, Textarea |
| Learning Environment & Management | 10 | InputNumber, Textarea |
| Other Work-Related Learning Documents | 10 | InputNumber, Textarea |
| Lesson Presentation: Introduction | 3 | InputNumber, Textarea |
| Lesson Presentation: Development | 30 | InputNumber, Textarea |
| Lesson Presentation: Conclusion | 3 | InputNumber, Textarea |
| Personal Dimensions | 4 | InputNumber, Textarea |
| Overall Comment (Summary) | — | Long Textarea |

### 3. Additional Features
- **Secure Login System** - Supervisor authentication
- **Assessment Management** - View, edit, delete assessments
- **Export Functionality** - PDF and Excel export
- **Admin Dashboard** - Manage students, supervisors, schools
- **Responsive Design** - Mobile and desktop optimized

## Database Models

### Django Models
```python
# assessments/models.py
class Supervisor(models.Model):
    full_name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20)
    national_id = models.CharField(max_length=20, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Student(models.Model):
    full_name = models.CharField(max_length=200)
    sex = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female')])
    candidate_number = models.CharField(max_length=20, unique=True)
    email = models.EmailField()
    school_name = models.CharField(max_length=200)
    class_name = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

class Assessment(models.Model):
    supervisor = models.ForeignKey(Supervisor, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    assessment_date = models.DateField()
    assessment_time = models.TimeField()
    subject = models.CharField(max_length=100)
    topic = models.CharField(max_length=200)
    
    # Scoring fields
    preparation_mark = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(20)])
    preparation_comment = models.TextField()
    lesson_planning_mark = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(20)])
    lesson_planning_comment = models.TextField()
    environment_mark = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(10)])
    environment_comment = models.TextField()
    documents_mark = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(10)])
    documents_comment = models.TextField()
    introduction_mark = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(3)])
    introduction_comment = models.TextField()
    development_mark = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(30)])
    development_comment = models.TextField()
    conclusion_mark = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(3)])
    conclusion_comment = models.TextField()
    personal_mark = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(4)])
    personal_comment = models.TextField()
    overall_comment = models.TextField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    @property
    def total_mark(self):
        return (self.preparation_mark + self.lesson_planning_mark + 
                self.environment_mark + self.documents_mark + 
                self.introduction_mark + self.development_mark + 
                self.conclusion_mark + self.personal_mark)
```

## API Endpoints

### Django REST Framework URLs
```python
# assessments/urls.py
urlpatterns = [
    path('api/assessments/', AssessmentViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('api/assessments/<int:pk>/', AssessmentViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),
    path('api/supervisors/', SupervisorViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('api/students/', StudentViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('api/export/<int:pk>/', ExportAssessmentView.as_view()),
]
```

## React Components Structure

### Main Components
```jsx
// src/components/AssessmentForm.jsx
// src/components/AssessmentList.jsx
// src/components/AssessmentDetail.jsx
// src/components/LoginForm.jsx
// src/components/Navigation.jsx
// src/components/ExportModal.jsx
```

### Pages
```jsx
// src/pages/Home.jsx
// src/pages/AssessmentForm.jsx
// src/pages/AssessmentList.jsx
// src/pages/AssessmentDetail.jsx
// src/pages/Login.jsx
// src/pages/Dashboard.jsx
```

## PrimeVue Components Usage

### Form Components
- **InputText** - Text inputs
- **InputNumber** - Numeric inputs with validation
- **Dropdown** - Select dropdowns
- **Calendar** - Date and time pickers
- **Textarea** - Multi-line text inputs
- **Button** - Action buttons
- **Card** - Content containers
- **DataTable** - Tabular data display
- **Dialog** - Modal dialogs
- **Toast** - Notification messages

### Layout Components
- **Panel** - Content panels
- **TabView** - Tabbed interfaces
- **Accordion** - Collapsible sections
- **Divider** - Visual separators
- **Grid** - Responsive grid system

## Development Setup

### Backend Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Security Considerations

1. **Authentication** - JWT tokens for API access
2. **Authorization** - Role-based access control
3. **Input Validation** - Server-side validation for all inputs
4. **CSRF Protection** - Django's built-in CSRF protection
5. **Data Encryption** - Sensitive data encryption at rest
6. **HTTPS** - Secure communication in production

## Deployment

### Backend Deployment
- **Platform**: Heroku, DigitalOcean, AWS
- **Database**: PostgreSQL
- **Static Files**: AWS S3 or similar
- **Environment Variables**: Secure configuration management

### Frontend Deployment
- **Platform**: Vercel, Netlify, AWS S3
- **Build Process**: Vite build optimization
- **CDN**: Global content delivery

## Testing Strategy

### Backend Testing
- **Unit Tests** - Django test framework
- **Integration Tests** - API endpoint testing
- **Model Tests** - Data validation testing

### Frontend Testing
- **Component Tests** - React Testing Library
- **Integration Tests** - User interaction testing
- **E2E Tests** - Cypress or Playwright

## Performance Optimization

1. **Database Optimization** - Proper indexing and queries
2. **Frontend Optimization** - Code splitting and lazy loading
3. **Caching** - Redis for session and data caching
4. **CDN** - Static asset delivery optimization
5. **Image Optimization** - Compressed and responsive images

## Maintenance and Support

1. **Regular Updates** - Security patches and dependency updates
2. **Backup Strategy** - Automated database backups
3. **Monitoring** - Application performance monitoring
4. **Documentation** - Comprehensive API and user documentation
5. **User Training** - Supervisor training and support

---

This guide provides a comprehensive foundation for building the Madziwa College TP Assessment Platform with modern web technologies and best practices. 