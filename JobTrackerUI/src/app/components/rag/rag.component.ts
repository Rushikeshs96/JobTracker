import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RagService } from '../../services/rag/rag.service';

@Component({
  selector: 'app-rag',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './rag.component.html',
  styleUrls: ['./rag.component.css'],
})
export class RagComponent {
  // Save Info properties
  infoContent: string = '';
  infoSource: string = '';
  saveMessage: string = '';
  isSaving: boolean = false;

  // Chat properties
  question: string = '';
  chatHistory: { role: string; text: string }[] = [];
  isAsking: boolean = false;

  constructor(private ragService: RagService) {}

  saveInformation() {
    if (!this.infoContent || !this.infoSource) return;

    this.isSaving = true;
    this.ragService.saveInfo(this.infoContent, this.infoSource).subscribe({
      next: (res) => {
        this.saveMessage = 'Information saved to Vector DB successfully!';
        this.infoContent = '';
        this.infoSource = '';
        this.isSaving = false;
        setTimeout(() => (this.saveMessage = ''), 3000);
      },
      error: (err) => {
        this.saveMessage = 'Error saving information.';
        this.isSaving = false;
      },
    });
  }

  askQuestion() {
    if (!this.question) return;

    const userQ = this.question;
    this.chatHistory.push({ role: 'User', text: userQ });
    this.question = '';
    this.isAsking = true;

    this.ragService.askQuestion(userQ).subscribe({
      next: (res) => {
        this.chatHistory.push({ role: 'JobTracker AI', text: res.answer });
        this.isAsking = false;
      },
      error: (err) => {
        this.chatHistory.push({
          role: 'System',
          text: 'Error fetching response.',
        });
        this.isAsking = false;
      },
    });
  }
}
