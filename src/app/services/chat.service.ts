import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Message } from '../interfaces/message.iterface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  chats: Message[];
  private itemsCollection: AngularFirestoreCollection<Message>;

  constructor(private firestore: AngularFirestore) {
    this.chats = [];
   }

   loadMessages(): Observable<Message[]> {
     this.itemsCollection = this.firestore.collection<Message>('chats');
     return this.itemsCollection.valueChanges().pipe(
      map((messages: Message[]) => {
        this.chats = messages;
        return messages;
      })
     );
   }

   addMessage(data: string): Promise<DocumentReference> {
    const message: Message = {
      name: 'Juan Ruíz',
      text: data,
      createdAt: new Date()
    };
    return this.itemsCollection.add(message);
   }
}
