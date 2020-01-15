import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { EContentType } from '../../library/enum/econtenttype';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import 'rxjs/add/operator/share';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { LocalStorageConfig } from '../../library/clientconfig/localstorageconfig';
import { AlertService } from '../../library/alert/alert.service';


@Injectable()

export class TransferHttp {
  private Host: string;
  // tslint:disable-next-line: no-inferrable-types
  private Api: string = 'api/';
  private baseUrl = 'https://localhost:44390/';

  constructor(private http: HttpClient,
              private authentication: AuthenticationService,
              private router: Router,
              private alertService: AlertService) {
    this.Host = this.baseUrl + this.Api;
  }

  get<T>(url: string, contentType?: EContentType) {
    return this.mapshare(this.http.get<T>(this.Host + url, this.jwt(contentType)));
  }

  getFile(url: string, contentType?: EContentType) {
    // tslint:disable-next-line: prefer-const
    let sContent: string = this.contentType(contentType === undefined ? EContentType.json : contentType);
    let httpHeaders = new HttpHeaders({
      'Content-Type': sContent
    });

    if (LocalStorageConfig.GetUser() != null) {
      // tslint:disable-next-line: prefer-const
      let currentUser = LocalStorageConfig.GetUser();
      if (currentUser && currentUser.Data.Token) {
        httpHeaders = new HttpHeaders(
          {
            // tslint:disable-next-line: object-literal-key-quotes
            'Authorization': 'Bearer ' + currentUser.Data.Token,
            'Content-Type': sContent
          },
        );
      }
    }
    // return this.mapshare(this.http.get(this.Host + url, { observe:'response', responseType: 'blob' }));
    return this.http.get(this.Host + url, { headers: httpHeaders, observe: 'response', responseType: 'blob' })
      .pipe(map((res: any) => res))
      .share();
  }

  post(url: string, body: any, contentType?: EContentType) {
    return this.mapshare(this.http.post(this.Host + url, body, this.jwt(contentType)));
  }

  postUpload(url: string, body: any) {
    return (this.mapshare(this.http.post(this.Host + url, body)));
  }

  put(url: string, body: any, contentType?: EContentType) {
    return this.mapshare(this.http.put(this.Host + url, body, this.jwt(contentType)));
  }

  delete(url: string, contentType?: EContentType) {
    return this.mapshare(this.http.delete(this.Host + url, this.jwt(contentType)));
  }

  // tslint:disable-next-line: ban-types
  private mapshare(data: Observable<any>) {
    return data.pipe(
      map(res => res),
      catchError(error => this.handleAuthError(error))
    );
  }

  private handleAuthError(error: HttpErrorResponse) {
    if (!navigator.onLine) {
      // Handle offline error
      this.alertService.error('Không có đường truyền mạng.');
    }
    // handle your auth error or rethrow
    if (error.status === 401) {
      // navigate /delete cookies or whatever
      this.alertService.error('handled error ' + error.status);
      this.router.navigate(['/login']);
      // tslint:disable-next-line: max-line-length
      /// if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
      // return of(err.message);
      /// return Observable.of(err.message);
    }
    if (error.status === 500) {

    } else if (error.status === 588) {

    }
    return throwError(error.statusText);
  }

  private jwt(contentType?: EContentType) {
    // create authorization header with jwt token
    // tslint:disable-next-line: prefer-const
    let sContent: string = this.contentType(contentType === undefined ? EContentType.json : contentType);
    let httpHeaders = new HttpHeaders({
      'Content-Type': sContent
    });

    if (LocalStorageConfig.GetUser() != null) {
      // tslint:disable-next-line: prefer-const
      let currentUser = LocalStorageConfig.GetUser();
      if (currentUser && currentUser.Data.Token) {
        httpHeaders = new HttpHeaders(
          {
            // tslint:disable-next-line: object-literal-key-quotes
            'Authorization': 'Bearer ' + currentUser.Data.Token,
            'Content-Type': sContent
          },
        );
      }
    }
    return { headers: httpHeaders };
  }

  private contentType(typeValue: EContentType) {
    // tslint:disable-next-line: prefer-const
    let result = 'application/json; charset=utf-8';
    switch (typeValue) {
      case EContentType.json:
        return result;
      case EContentType.urlencoded:
        return 'application/x-www-form-urlencoded; charset=utf-8';
      default:
        return result;
    }
  }
}
