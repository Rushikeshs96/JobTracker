import { Component, OnInit } from '@angular/core';
import { Contact } from '../../../models/models';
import { ContactService } from '../../../services/contact/contact.service';

@Component({
  selector: 'app-contacts',
  standalone: false,
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css',
})
export class ContactsComponent implements OnInit {
  contacts: Contact[] = [];
  showForm: boolean = false;
  isEditMode: boolean = false;

  currentContact: Contact = {
    id: 0,
    fullName: '',
    role: '',
    email: '',
    linkedInUrl: '',
    jobApplicationId: null,
  };

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    // this.loadDummyData();
    this.getAllContacts();
  }

  openCreateForm() {
    this.isEditMode = false;
    // Reset the form to blank
    this.currentContact = {
      id: 0,
      fullName: '',
      role: '',
      email: '',
      linkedInUrl: '',
      jobApplicationId: null,
    };
    this.showForm = true;
  }

  openUpdateForm(contact: Contact) {
    this.isEditMode = true;
    // Make a copy of the selected contact so changes don't affect the table until saved
    this.currentContact = { ...contact };
    this.showForm = true;
  }

  cancelForm() {
    this.showForm = false;
  }

  getAllContacts() {
    this.contactService.getAllContacts().subscribe({
      next: (data) => (this.contacts = data),
      error: (error) => console.error('Error fetching contacts : ', error),
    });
  }

  saveContact() {
    const { jobApplicationId, ...contactWithoutJobId } = this.currentContact;

    if (this.isEditMode) {
      this.contactService
        .updateContact(this.currentContact.id, this.currentContact)
        .subscribe({
          next: (next) => {
            this.getAllContacts();
            this.showForm = false;
          },
          error: (error) => console.error('Error Upadting contacts : ', error),
        });
    } else {
      this.contactService.createContact(this.currentContact).subscribe({
        next: (next) => {
          this.getAllContacts();
          this.showForm = false;
        },
        error: (error) => console.error('Error Creating contacts : ', error),
      });
    }
  }

  deleteContact(id: number) {
    const conformDelete = window.confirm(
      'Are you sure you want to delete this contact?',
    );

    if (conformDelete) {
      this.contactService.deleteContact(id).subscribe({
        next: (next) => {
          this.getAllContacts();
        },
        error: (error) => console.error('Error deleting contacts : ', error),
      });
    }
  }

  loadDummyData(): void {
    this.contacts = [
      {
        id: 1,
        jobApplicationId: 101,
        fullName: 'Ramesh Pawar',
        role: 'dev',
        email: 'sap@gmail.com',
        linkedInUrl: 'string',
      },
      {
        id: 2,
        jobApplicationId: 102,
        fullName: 'Ramesh don',
        role: 'tester',
        email: 'sap@gmail.com',
        linkedInUrl: 'string',
      },
    ];
  }
}
