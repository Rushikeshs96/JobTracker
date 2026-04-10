Here is the updated, comprehensive `Project_Guide.md`. 

I have kept all your original setup instructions, database configurations, and project structures, and seamlessly integrated your detailed **Database Models**, **API Endpoints**, and the **Angular Conceptual Roadmap** into the flow.

--- START OF FILE Project_Guide.md ---

# Job Application Tracker - Full Stack Project Plan (Clean Architecture)

This document provides a complete roadmap for building a Job Application Tracker. 
- **Backend:** .NET 8/9 with Clean Architecture (**Visual Studio**)
- **Database:** PostgreSQL
- **Frontend:** Angular with Bootstrap & Material (**VS Code**)

---

## 🏗️ Part 1: Backend Setup (Visual Studio)

### 1. Create the Solution & Project Structure
1.  Open **Visual Studio** -> **Create a new project** -> **Blank Solution**. Name it `JobTracker`.
2.  Add the following projects (Right-click Solution -> Add -> New Project):
    *   **Class Library**: `JobTracker.Domain` (Core Entities)
    *   **Class Library**: `JobTracker.Application` (Interfaces & Business Logic)
    *   **Class Library**: `JobTracker.Infrastructure` (Postgres & EF Core)
    *   **ASP.NET Core Web API**: `JobTracker.Api` (Controllers)

### 2. Set Project References
*   `JobTracker.Application` → References `JobTracker.Domain`
*   `JobTracker.Infrastructure` → References `JobTracker.Application`
*   `JobTracker.Api` → References `JobTracker.Infrastructure` & `JobTracker.Application`

### 3. Install NuGet Packages
Open **Tools > NuGet Package Manager > Package Manager Console**:

```powershell
# Set Default Project to JobTracker.Infrastructure:
Install-Package Npgsql.EntityFrameworkCore.PostgreSQL
Install-Package Microsoft.EntityFrameworkCore.Design

# Set Default Project to JobTracker.Api:
Install-Package Microsoft.EntityFrameworkCore.Design
```

---

## 🗄️ Part 2: Domain Layer (Entities & Enums)

In `JobTracker.Domain`, create an `Entities` folder and an `Enums` folder to hold your database models.

### 1. Enums
**JobStatus.cs**
```csharp
public enum JobStatus { Applied, PhoneScreen, Technical, FinalInterview, Offer, Rejected, Ghosted }
```
**InterviewType.cs**
```csharp
public enum InterviewType { HR, Technical, CodingChallenge, Behavioral, SystemDesign }
```

### 2. Entities (Database Models)
**JobApplication.cs**
*   `Id`: int (Primary Key)
*   `CompanyName`: string
*   `JobTitle`: string
*   `JobDescription`: string
*   `JobPostingUrl`: string
*   `SalaryRange`: string
*   `Status`: JobStatus (Enum)
*   `DateApplied`: DateTime
*   `Notes`: string
*   **Relationships:** Has many `Interviews` and `Contacts`.

**Interview.cs**
*   `Id`: int (Primary Key)
*   `JobApplicationId`: int (Foreign Key)
*   `InterviewDate`: DateTime
*   `Type`: InterviewType (Enum)
*   `InterviewerName`: string
*   `Notes`: string
*   `MeetingLink`: string
*   **Relationships:** Belongs to a `JobApplication`.

**Contact.cs**
*   `Id`: int (Primary Key)
*   `FullName`: string
*   `Role`: string
*   `Email`: string
*   `LinkedInUrl`: string
*   `JobApplicationId`: int (Foreign Key)
*   **Relationships:** Belongs to a `JobApplication`.

---

## 🌐 Part 3: API Endpoints (Controllers)

Your backend will expose the following endpoints to be consumed by the Angular frontend.

**1. Jobs API (`/api/Job`)**
*   `GET /api/Job` - Fetches a list of all job applications.
*   `GET /api/Job/{id}` - Fetches a specific job application by ID (includes associated interviews & contacts).
*   `POST /api/Job` - Creates a new job application.
*   `PUT /api/Job/{id}` - Updates an existing job application.
*   `DELETE /api/Job/{id}` - Deletes a specific job application.

**2. Interviews API (`/api/Interviews`)**
*   `GET /api/Interviews` - Fetches a list of all interviews.
*   `GET /api/Interviews/{id}` - Fetches a specific interview by ID.
*   `GET /api/Interviews/job/{jobId}` - Fetches all interview rounds for a specific job application.
*   `POST /api/Interviews` - Creates a new interview.
*   `PUT /api/Interviews/{id}` - Updates an existing interview.
*   `DELETE /api/Interviews/{id}` - Deletes a specific interview.

**3. Contacts API (`/api/Contacts`)**
*   `GET /api/Contacts` - Fetches a list of all contacts.
*   `GET /api/Contacts/{id}` - Fetches a specific contact by ID.
*   `GET /api/Contacts/jobApplicationId/{id}` - Fetches all contacts associated with a specific job application.
*   `POST /api/Contacts` - Creates a new contact.
*   `POST /api/Contacts/{id}` - Updates an existing contact (Note: Mapped as POST in your backend, though conceptually PUT).
*   `DELETE /api/Contacts/{id}` - Deletes a specific contact.

**4. Dashboard API (`/api/DashBoard`)**
*   `GET /api/DashBoard/stats` - Returns aggregation statistics (Total jobs, and counts for Applied, PhoneScreen, Technical, FinalInterview, Offer, Rejected, Ghosted).
*   `GET /api/DashBoard/upcoming` - Returns a list of interviews scheduled between today and the next 7 days.

---

## ⚙️ Part 4: Infrastructure Setup

### 1. Database Context (`JobTracker.Infrastructure`)
Create `AppDbContext.cs`:
*   Add `DbSet<JobApplication>`, `DbSet<Interview>`, `DbSet<Contact>`.
*   Configure the relationships (One-to-Many) in `OnModelCreating` if needed.

### 2. Configuration (`JobTracker.Api`)
In `appsettings.json`:
```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Database=JobTrackerDB;Username=postgres;Password=your_password"
}
```

In `Program.cs`:
*   Register Npgsql: `builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(...));`
*   **Enable CORS** (Crucial for Angular to talk to the .NET API):
    ```csharp
    builder.Services.AddCors(opt => {
        opt.AddPolicy("CorsPolicy", policy => {
            policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:4200");
        });
    });
    app.UseCors("CorsPolicy");
    ```

### 3. Database Migrations (Visual Studio)
In Package Manager Console:
```powershell
Add-Migration InitialCreate -Project JobTracker.Infrastructure -StartupProject JobTracker.Api
Update-Database -Project JobTracker.Infrastructure -StartupProject JobTracker.Api
```

---

## 🎨 Part 5: Frontend Setup (VS Code)

### 1. Initialize Project
Open a terminal in a new folder:
```bash
ng new JobTrackerUI --no-standalone
cd JobTrackerUI
npm install bootstrap bootstrap-icons
ng add @angular/material
```

### 2. Configure Bootstrap
Open `angular.json` and add the CSS path to the "styles" array:
`"node_modules/bootstrap/dist/css/bootstrap.min.css"`

### 3. Generate Structure
```bash
# Services
ng generate service services/job
ng generate service services/dashboard

# Components
ng generate component components/dashboard
ng generate component components/job-list
ng generate component components/job-form
ng generate component components/navbar
```

---

## 🗺️ Part 6: Frontend Implementation Roadmap

### Conceptual Flow (Building the UI Layer)

**Phase 1: Foundation & Types**
1. Configure `app.module.ts`: Import `HttpClientModule` (for API calls), `ReactiveFormsModule` (for robust forms), and Angular Material/Bootstrap modules.
2. Create `models.ts`: Define TypeScript interfaces (`JobApplication`, `Interview`, `Contact`, `DashboardStats`) and Enums (`JobStatus`, `InterviewType`). *Ensure names/values match your C# backend exactly.*

**Phase 2: Service Layer (API Connectors)**
1. **Environment:** Store your .NET API URL (`https://localhost:7xxx/api`) in `environment.ts`.
2. **Job Service:** Create methods mapping to `/api/Job` (GetAll, GetById, Create, Update, Delete).
3. **Dashboard Service:** Create methods for `/api/DashBoard/stats` and `/api/DashBoard/upcoming`.
4. **Interviews/Contacts Services:** Map their respective endpoints.

**Phase 3: Routing Setup**
Map Angular routes (`app-routing.module.ts`) to components:
* `/dashboard` → `DashboardComponent`
* `/jobs` → `JobListComponent`
* `/jobs/new` → `JobFormComponent`
* `/jobs/edit/:id` → `JobFormComponent`

**Phase 4: Building the Components**
1. **Navbar:** Place at the top of `app.component.html` using a Bootstrap dark navbar to link to Dashboard and Jobs.
2. **Dashboard Component:** Use Bootstrap Cards to show `DashboardStats`. Use a Material List to display upcoming interviews.
3. **Job List Component:** Call JobService to get all jobs. Display using Angular Material `mat-table`. Use Bootstrap colored badges for `JobStatus` (e.g., Green=Offer, Red=Rejected). Add Edit/Delete buttons.
4. **Job Form Component:** Use `ReactiveForms`. If the URL has an ID, populate the form (Edit mode). If not, leave blank (Create mode). Submit to the API and redirect back to the list.

**Phase 5: Advanced Features & Refinements**
1. **Job Details & Nested Views:** Create a view to show a Job. Inside that view, call `/api/Interviews/job/{jobId}` to list interview rounds.
2. **Modals/Dialogs:** Use Angular Material Dialogs (`MatDialog`) to add Interviews/Contacts dynamically without leaving the job details page.
3. **Error Handling:** Add an Angular Interceptor to catch HTTP errors globally and display a toast notification (`MatSnackBar`) if the API fails.

---

## 🏁 How to Run
1.  **Backend**: In **Visual Studio**, set `JobTracker.Api` as Startup Project and press **F5**.
2.  **Frontend**: In **VS Code**, open terminal and type `ng serve`.
3.  **Database**: Open **pgAdmin** to verify your `JobTrackerDB` tables were created.
4.  **Browser**: Navigate to `http://localhost:4200`.

--- END OF FILE Project_Guide.md ---