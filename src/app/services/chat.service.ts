import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Message } from '../interfaces/message.iterface';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public chats: Message[];
  private itemsCollection: AngularFirestoreCollection<Message>;
  public user: any = {};

  constructor(
    private firestore: AngularFirestore,
    public authentication: AngularFireAuth
  ) {
    this.authentication.authState.subscribe(user => {
      if (!user) {
        return;
      }

      this.user.name = user.displayName;
      this.user.uid = user.uid;
    });
    this.chats = [];
   }

   loadMessages(): Observable<Message[]> {
     this.itemsCollection = this.firestore.collection<Message>('chats', query =>
      query.orderBy('createdAt', 'desc').limit(250)
     );
     return this.itemsCollection.valueChanges().pipe(
      map((messages: Message[]) => {
        this.chats = [];
        messages.forEach(message => {
          this.chats.unshift(message);
        });
        return messages;
      })
     );
   }

   addMessage(data: string): Promise<DocumentReference> {
    const message: Message = {
      name: this.user.name,
      text: data,
      createdAt: new Date(),
      uid: this.user.uid
    };
    return this.itemsCollection.add(message);
   }

   login(typeLogin: string): void {
    if (typeLogin === 'google') {
      this.authentication.signInWithPopup(new auth.GoogleAuthProvider());
    } else {
      this.authentication.signInWithPopup(new auth.TwitterAuthProvider());
    }
  }

  logout(): void {
    this.authentication.signOut();
    this.user = {};
  }

}
