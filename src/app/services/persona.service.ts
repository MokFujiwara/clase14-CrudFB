import { Injectable } from '@angular/core';
/** importar librerías **/
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { PersonaI } from '../model/person.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private personaCollection: AngularFirestoreCollection<PersonaI>;
  private personas: Observable<PersonaI[]>;

  constructor(db: AngularFirestore) {
    this.personaCollection = db.collection<PersonaI>('persona');
    this.personas = this.personaCollection.snapshotChanges().pipe(
      map(
        actions => {
          return actions.map(a => {
            const id = a.payload.doc.id;
            const dato = a.payload.doc.data();
            return { id, ...dato }
          });
        }));
  }
  //métodos crud
  //método que listaría todas las personas
  getPersonas() {
    return this.personas;
  }
  //método para buscar personas por ID
  getPersona(id: string) {
    return this.personaCollection.doc<PersonaI>(id).valueChanges();
  }
  //método que almacena una persona
  addPersona(persona: PersonaI) {
    return this.personaCollection.add(persona);
  }

}

