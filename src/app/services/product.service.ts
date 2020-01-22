import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Product } from '../models/product.model';


@Injectable({
    providedIn: 'root'
})


export class ProductService {

    constructor(private fireStore: AngularFirestore) {


    }

    createProduct(product: Product) {
        // return this.fireStore.collection('/Products').doc('/UTTBcmzDh4nkhIq7MGSJ').set(product);
        return this.fireStore.doc('/Products/UTTBcmzDh4nkhIq7MGSJ').set(product,
            {merge: true}
        );
    }

    getImformationProduct() {
        return this.fireStore.collection('Products').snapshotChanges();
    }
}




