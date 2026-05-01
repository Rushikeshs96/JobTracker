import { Component, OnInit } from '@angular/core';
import { Interview } from '../../../models/models';
import { InterviewService } from '../../../services/interview/interview.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-interviews',
  standalone: false,
  templateUrl: './interviews.component.html',
  styleUrl: './interviews.component.css',
})
export class InterviewsComponent implements OnInit {
  interviews: Interview[] = [];
  showform: boolean = false;
  editForm: boolean = false;
  currentInterviewId: number = 0;

  interviewTypeOptions = [
    { value: 0, label: 'HR' },
    { value: 1, label: 'Technical' },
    { value: 2, label: 'Coding Challenge' },
    { value: 3, label: 'Behavioral' },
    { value: 4, label: 'System Design' },
  ];

  interviewForm: FormGroup;

  constructor(
    private interviewService: InterviewService,
    private fb: FormBuilder,
  ) {
    this.interviewForm = this.fb.group({
      jobApplicationId: [''],
      interviewDate: ['', Validators.required],
      type: [null, Validators.required],
      interviewerName: [''],
      meetingLink: [''],
      notes: [''],
    });
  }

  ngOnInit(): void {
    // this.loadDummyData();
    this.getAllInterviews();
  }

  loadDummyData(): void {
    this.interviews = [
      {
        id: 1,
        jobApplicationId: 101,
        interviewDate: new Date('2026-05-05'),
        type: 1,
        interviewerName: 'John Doe',
        meetingLink: 'https://meet.google.com/abc-xyz',
        notes: 'First round technical interview',
      },
      {
        id: 2,
        jobApplicationId: 102,
        interviewDate: new Date('2026-05-05'),
        type: 2,
        interviewerName: 'John Doe',
        meetingLink: 'https://meet.google.com/abc-xyz',
        notes: 'First round technical interview',
      },
      {
        id: 3,
        jobApplicationId: 103,
        interviewDate: new Date('2026-05-05'),
        type: 3,
        interviewerName: 'John Doe',
        meetingLink: 'https://meet.google.com/abc-xyz',
        notes: 'First round technical interview',
      },
    ];
  }

  getAllInterviews() {
    this.interviewService.getAllInterviews().subscribe({
      next: (data) => (this.interviews = data),
      error: (error) => console.log(error),
    });
  }

  getInterviewTypeName(typeValue: any): string {
    const option = this.interviewTypeOptions.find(
      (o) => o.value == typeValue || o.label.replace(' ', '') == typeValue,
    );
    return option ? option.label : 'Unknown';
  }

  openCreateForm() {
    this.editForm = false;
    this.interviewForm.reset();
    this.showform = true;
  }

  onUpdateForm(interview: Interview) {
    this.editForm = true;
    this.currentInterviewId = interview.id;

    let formatedDate = '';
    if (interview.interviewDate) {
      const dateObj = new Date(interview.interviewDate);
      formatedDate = dateObj.toISOString().substring(0, 16);
    }

    this.interviewForm.patchValue({
      jobApplicationId: interview.jobApplicationId,
      interviewDate: formatedDate,
      type: interview.type,
      interviewerName: interview.interviewerName,
      meetingLink: interview.meetingLink,
      notes: interview.notes,
    });
    this.showform = true;
  }

  cancelForm() {
    this.showform = false;
  }

  saveInterview() {
    const formValues = this.interviewForm.value;
    formValues.type = Number(formValues.type);

    if (this.editForm) {
      const updatedInterview: Interview = {
        id: this.currentInterviewId,
        ...formValues,
      };

      this.interviewService
        .updateInterview(this.currentInterviewId, updatedInterview)
        .subscribe({
          next: () => {
            this.getAllInterviews();
            this.showform = false;
          },
          error: (error) => console.log(error),
        });
    } else {
      this.interviewService.createInterview(formValues).subscribe({
        next: () => {
          this.getAllInterviews();
          this.showform = false;
        },
        error: (error) => console.log(error),
      });
    }
  }

  deleteInterview(id: number) {
    if (window.confirm('Are you sure you want to delete this interview?')) {
      this.interviewService.deleteInterview(id).subscribe({
        next: () => this.getAllInterviews(),
        error: (err) => console.error('Error deleting interview:', err),
      });
    }
  }
}
