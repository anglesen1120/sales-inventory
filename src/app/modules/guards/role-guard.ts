import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot} from '@angular/router';
import { LocalStorageConfig } from '../../library/clientconfig/localstorageconfig';

@Injectable()
export class RoleGuardService implements CanActivate {

    constructor( public router: Router) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        let curentUser: any = LocalStorageConfig.GetUser();
        curentUser = JSON.parse(curentUser).Data;
        // this will be passed from the route config
        // on the data property

      // nếu có quền truy cập
        if (curentUser.DepartmentID !== 4) {
            this.router.navigate(['not-found']);
            return false;
        }
        return true;
    }

}


