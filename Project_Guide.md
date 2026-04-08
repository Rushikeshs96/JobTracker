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

## 🛠️ Part 2: Domain Layer (The Entities)

In `JobTracker.Domain`, create an `Entities` folder and an `Enums` folder.

### 1. Enums
**JobStatus.cs**
```csharp
public enum JobStatus { Applied, PhoneScreen, Technical, FinalInterview, Offer, Rejected, Ghosted }
```
**InterviewType.cs**
```csharp
public enum InterviewType { HR, Technical, CodingChallenge, Behavioral, SystemDesign }
```

### 2. Entities
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
*   `Interviews`: List\<Interview\> (Navigation Property)

**Interview.cs**
*   `Id`: int
*   `JobApplicationId`: int (Foreign Key)
*   `InterviewDate`: DateTime
*   `Type`: InterviewType (Enum)
*   `InterviewerName`: string
*   `Notes`: string
*   `MeetingLink`: string

**Contact.cs**
*   `Id`: int
*   `FullName`: string
*   `Role`: string
*   `Email`: string
*   `LinkedInUrl`: string
*   `JobApplicationId`: int? (Optional Foreign Key)

---

## 🗄️ Part 3: Infrastructure & API Layer

### 1. Database Context (`JobTracker.Infrastructure`)
Create `AppDbContext.cs`:
*   Add `DbSet<JobApplication>`, `DbSet<Interview>`, `DbSet<Contact>`.
*   Configure the relationship: One `JobApplication` has many `Interviews`.

### 2. Configuration (`JobTracker.Api`)
In `appsettings.json`:
```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Database=JobTrackerDB;Username=postgres;Password=your_password"
}
```

In `Program.cs`:
*   Register Npgsql: `builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(...));`
*   **Enable CORS**:
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

## 🎨 Part 4: Frontend Setup (VS Code)

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

# Components
ng generate component components/dashboard
ng generate component components/job-list
ng generate component components/job-form
ng generate component components/navbar
```

---

## 🚀 Part 5: Implementation Roadmap

### Level 1: Basic Job Tracker (MVP)
1.  **Backend**: Create a simple `JobsController` with GET/POST/DELETE.
2.  **Frontend Service**: Create `job.service.ts` to call the .NET API.
3.  **Frontend UI**: 
    *   **Navbar**: Use Bootstrap’s dark navbar.
    *   **Dashboard**: Use Bootstrap Cards to show the count of "Applied" vs "Interviews".
    *   **Job List**: Use `mat-table` (Material) to list jobs.
    *   **Job Form**: Use `mat-form-field` inside a Bootstrap `.container` for a clean layout.

### Level 2: Advanced Features
1.  **Interview Tracking**: Add a section inside the "Job Details" view to list interview rounds.
2.  **Status Colors**: Use Bootstrap badges (e.g., `.bg-success` for Offer, `.bg-danger` for Rejected).
3.  **Networking**: Create a simple "Contacts" page to store recruiter details.

---

## 🏁 How to Run
1.  **Backend**: In **Visual Studio**, set `JobTracker.Api` as Startup Project and press **F5**.
2.  **Frontend**: In **VS Code**, open terminal and type `ng serve`.
3.  **Database**: Open **pgAdmin** to verify your `JobTrackerDB` tables were created.
4.  **Browser**: Navigate to `http://localhost:4200`.