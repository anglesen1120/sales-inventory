import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AuthenticationService {

    // loggedIn dùng để cập nhật trạng thái đã đăng nhập hay chưa của user giữa các component
    loggedIn = new BehaviorSubject<boolean>(false);

    userLogged = new BehaviorSubject<any>(null);

    constructor() { }

    isLoggedIn(): Observable<boolean> {
        return this.loggedIn.asObservable();
    }
    updateLogged(isLogged: boolean) {
        this.loggedIn.next(isLogged);
    }
    curentUserLogged(): Observable<any> {
        return this.userLogged.asObservable();
    }
    updateUserLogged(object: object) {
        this.userLogged.next(object);
    }
}
