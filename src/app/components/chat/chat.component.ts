import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: [
  ]
})
export class ChatComponent implements OnInit {

  message: string;
  element: any;

  constructor(public chatService: ChatService) {
    this.message = '';
    this.chatService.loadMessages().subscribe(() => {
      setTimeout(() => {
      this.element.scrollTop = this.element.scrollHeight;
      }, 10);
    });
  }

  ngOnInit(): void {
    this.element = document.getElementById('app-messages');
  }

  sendMessage(message: string): void {
    if (this.message.trim()) {
      this.chatService.addMessage(message)
      .then(() => this.message = '')
      .catch((error) => console.error('Error al enviar mensaje\n', error));
    }
  }

  convertToDate(createdAt): Date {
    const seconds: number[] = Object.values(createdAt);
    return new Date(seconds[0] * 1000);
  }

}
