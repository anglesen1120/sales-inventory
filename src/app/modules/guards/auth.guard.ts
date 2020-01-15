import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { AuthenticationService } from '../../services/authentication.service';
import { LocalStorageConfig } from '../../library/clientconfig/localstorageconfig';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

    constructor(private router: Router,
                private accountService: AccountService,
                private authenticationService: AuthenticationService) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // let curentUser = LocalStorageConfig.GetUser();
    // if (LocalStorageConfig.GetUser()) {
    //  return  this.accountService.checklogin(curentUser.Description)
    //    .map((result: any) => {
    //      console.log(result)
    //      if (result.Status==200) {
    //          this.authenticationService.updateLogged(true);
    //          return true;
    //        }
    //        else {
    //          LocalStorageConfig.RemoveUser();
    //          this.authenticationService.updateLogged(false);
    //          this.router.navigate(['login']);
    //        }
    //    })
    // }
    // else {
    //    // not logged in so redirect to login page with the return url and return false
    //    this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
    //    return of(false);
    //  }
    return of(true);
  }
  canLoad(route: Route): Observable<boolean> {
    if (LocalStorageConfig.GetUser()) {
      const curentUser = LocalStorageConfig.GetUser();
      return this.accountService.checklogin(curentUser.Data.Token)
        .pipe(map((result: any) => {
          if (result.Status === 200) {
            this.authenticationService.updateUserLogged(curentUser.Data);
            this.authenticationService.updateLogged(true);
            return true;
          } else {
            // alert(result.Description);
            LocalStorageConfig.RemoveUser();
            this.authenticationService.updateLogged(false);
            this.router.navigateByUrl('/login');
         }
        }));
    } else {
      // not logged in so redirect to login page with the return url and return false
      this.router.navigateByUrl('/login');
      return of(false);
    }
  }
}
