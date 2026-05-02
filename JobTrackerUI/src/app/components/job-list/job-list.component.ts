import { Component } from '@angular/core';
import { JobApplication, JobStatus } from '../../models/models';
import { JobService } from '../../services/job.service';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-job-list',
  standalone: false,
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.css',
})
export class JobListComponent {
  jobs: JobApplication[] = [];

  showform: boolean = false;
  isEditMode: boolean = false;
  applicationForm: FormGroup;
  currentApplicationId: number = 0;

  jobStatusOptions = [
    { value: 0, label: 'Applied' },
    { value: 1, label: 'PhoneScreen' },
    { value: 2, label: 'Technical' },
    { value: 3, label: 'FinalInterview' },
    { value: 4, label: 'Offer' },
    { value: 5, label: 'Rejected' },
    { value: 6, label: 'Ghosted' },
  ];

  interviewTypeOptions = [
    { value: 0, label: 'HR' },
    { value: 1, label: 'Technical' },
    { value: 2, label: 'Coding Challenge' },
    { value: 3, label: 'Behavioral' },
    { value: 4, label: 'System Design' },
  ];

  constructor(
    private jobService: JobService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.applicationForm = this.fb.group({
      companyName: ['', Validators.required],
      jobTitle: ['', Validators.required],
      jobDescription: [''],
      jobPostingUrl: [''],
      salaryRange: [''],
      status: [null, Validators.required],
      dateApplied: ['', Validators.required],
      notes: [''],
      contacts: this.fb.array([]),
      interviews: this.fb.array([]),
    });
  }

  get contactsFormArray(): FormArray {
    return this.applicationForm.get('contacts') as FormArray;
  }

  addContact() {
    const contactForm = this.fb.group({
      id: [0],
      fullName: ['', Validators.required],
      role: [''],
      email: [''],
      linkedInUrl: [''],
    });
    this.contactsFormArray.push(contactForm);
  }

  removeContact(index: number) {
    this.contactsFormArray.removeAt(index);
  }

  get interviewFormArray(): FormArray {
    return this.applicationForm.get('interviews') as FormArray;
  }

  addInterview() {
    const interviewForm = this.fb.group({
      id: [0],
      interviewDate: ['', Validators.required],
      type: [null, Validators.required],
      interviewerName: [''],
      notes: [''],
      meetingLink: [''],
    });
    this.interviewFormArray.push(interviewForm);
  }

  removeInterview(index: number): void {
    this.interviewFormArray.removeAt(index);
  }

  getInterviewTypeName(typeValue: any): string {
    const option = this.interviewTypeOptions.find(
      (o) => o.value == typeValue || o.label.replace(' ', '') == typeValue,
    );
    return option ? option.label : 'Unknown';
  }

  ngOnInit() {
    // this.loadDummyJobs();
    this.getAllJobApplications();
  }

  openForm() {
    this.isEditMode = false;
    this.applicationForm.reset();
    this.contactsFormArray.clear();
    this.showform = true;
  }

  onUpdateForm(application: JobApplication) {
    this.isEditMode = true;
    this.currentApplicationId = application.id;

    let formatedDate = '';
    if (application.dateApplied) {
      const dateObj = new Date(application.dateApplied);
      formatedDate = dateObj.toISOString().substring(0, 16);
    }

    this.contactsFormArray.clear();
    this.interviewFormArray.clear();

    if (application.contacts && application.contacts.length > 0) {
      application.contacts.forEach((contact) => {
        this.contactsFormArray.push(
          this.fb.group({
            id: [contact.id],
            fullName: [contact.fullName, Validators.required],
            role: [contact.role],
            email: [contact.email],
            linkedInUrl: [contact.linkedInUrl],
          }),
        );
      });
    }

    if (application.interviews && application.interviews.length > 0) {
      application.interviews.forEach((interview) => {
        this.interviewFormArray.push(
          this.fb.group({
            id: [interview.id],
            interviewDate: [interview.interviewDate, Validators.required],
            type: [interview.type, Validators.required],
            interviewerName: [interview.interviewerName],
            notes: [interview.notes],
            meetingLink: [interview.meetingLink],
          }),
        );
      });
    }

    this.applicationForm.patchValue({
      companyName: application.companyName,
      jobTitle: application.jobTitle,
      jobDescription: application.jobDescription,
      jobPostingUrl: application.jobPostingUrl,
      salaryRange: application.salaryRange,
      status: application.status,
      dateApplied: formatedDate,
      notes: application.notes,
    });
    this.showform = true;
  }

  cancelForm() {
    this.isEditMode = false;
    this.showform = false;
  }

  getStatusLabel(statusValue: number | undefined | null): string {
    if (statusValue === null || statusValue === undefined) return 'Unknown';

    const option = this.jobStatusOptions.find(
      (opt) => opt.value === statusValue,
    );
    return option ? option.label : 'Unknown';
  }

  loadDummyJobs(): void {
    this.jobs = [
      {
        id: 1,
        companyName: 'Google',
        jobTitle: 'Software Engineer',
        status: JobStatus.Applied,
        dateApplied: new Date(),
        salaryRange: '120k-150k',
      },
      {
        id: 2,
        companyName: 'Microsoft',
        jobTitle: 'Backend Developer',
        status: JobStatus.Technical,
        dateApplied: new Date(new Date().setDate(new Date().getDate() - 5)),
        salaryRange: '130k-160k',
      },
      {
        id: 3,
        companyName: 'Amazon',
        jobTitle: 'Full Stack Dev',
        status: JobStatus.Offer,
        dateApplied: new Date(new Date().setDate(new Date().getDate() - 10)),
        salaryRange: '140k-180k',
      },
    ];
  }

  getAllJobApplications() {
    this.jobService.getAllJobApplications().subscribe({
      next: (data) => (this.jobs = data),
      error: (error) => console.error('error fetching applications', error),
    });
  }

  saveJobApplication() {
    const formValues = this.applicationForm.value;
    formValues.type = Number(formValues.type);

    if (this.isEditMode) {
      const updatedAplication: JobApplication = {
        id: this.currentApplicationId,
        ...formValues,
      };

      this.jobService
        .updateJobApplication(this.currentApplicationId, updatedAplication)
        .subscribe({
          next: () => {
            (this.getAllJobApplications(), (this.showform = false));
          },
          error: (error) => console.log(error),
        });
    } else {
      this.jobService.createJobApplication(formValues).subscribe({
        next: () => {
          (this.getAllJobApplications(), (this.showform = false));
        },
        error: (error) => console.log(error),
      });
    }
  }

  deleteJob(id: number): void {
    if (confirm('Are you sure you want to delete this application?')) {
      this.jobService.deleteJobApplication(id).subscribe(() => {
        this.getAllJobApplications();
      });
    }
  }
}
