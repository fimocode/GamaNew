import { User } from './../entity/user';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  urlUser = "/api/users";
  
  constructor(private http: HttpClient) { }

  getUserById(id: Number): Observable<User> {
    return this.http.get<User>(`${this.urlUser}/${id}`);
  }

  login(user: User): Observable<User> {
    return this.http.post<User>(`${this.urlUser}/login`, user);
  }

  creatUser(user: User): Observable<User> {
    return this.http.post<User>(this.urlUser, user);
  }

}
