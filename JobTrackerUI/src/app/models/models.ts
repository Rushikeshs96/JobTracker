export enum JobStatus {
  Applied = 0,
  PhoneScreen = 1,
  Technical = 2,
  FinalInterview = 3,
  Offer = 4,
  Rejected = 5,
  Ghosted = 6,
}

export enum InterviewType {
  HR = 0,
  Technical = 1,
  CodingChallenge = 2,
  Behavioral = 3,
  SystemDesign = 4,
}

export interface JobApplication {
  id: number;
  companyName: string;
  jobTitle: string;
  jobDescription?: string;
  jobPostingUrl?: string;
  salaryRange?: string;
  status: JobStatus;
  dateApplied: Date;
  notes?: string;
  contacts?: Contact[];
  interviews?: Interview[];
}

export interface Interview {
  id: number;
  interviewDate: Date;
  type: InterviewType;
  interviewerName?: string;
  notes?: string;
  meetingLink?: string;
  jobApplicationId?: number | null;
}

export interface Contact {
  id: number;
  fullName: string;
  role?: string;
  email?: string;
  linkedInUrl?: string;
  jobApplicationId?: number | null;
}

export interface DashboardStats {
  totalJobs: number;
  applied: number;
  phoneScreen: number;
  technical: number;
  finalInterview: number;
  offer: number;
  rejected: number;
  ghosted: number;
}
