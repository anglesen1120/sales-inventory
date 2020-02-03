import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Product } from '../models/product.model';
import { map } from 'rxjs/operators';
import { pipe, Observable, observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})


export class ProductService {

    constructor(private fireStore: AngularFirestore) {


    }

    createProduct(product: Product): Observable<any> {
        // return this.fireStore.collection('/Products').doc('/UTTBcmzDh4nkhIq7MGSJ').set(product);
        return new Observable((observable)=>{
            this.fireStore.collection('Products').add(product).then((doc)=>{
                observable.next({
                    data: doc.id
                });
            });
        });
        //return this.fireStore.collection('Products').add(product).then(res => res);
            
        
    }

    getImformationProduct() {
        return this.fireStore.collection('Products').snapshotChanges();
    }
}




