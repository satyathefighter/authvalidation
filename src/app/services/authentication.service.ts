import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError} from 'rxjs';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }
    register(user: User) {
        let errortext = '';
        const users: any[] = JSON.parse(localStorage.getItem('users')) || [];
        const duplicateUser = users.filter((userdetials: User) => {
            return  userdetials.username === user.username || userdetials.email === user.email || userdetials.mobile === user.mobile;
        });
        if (duplicateUser.length) {
                if (duplicateUser[0].username === user.username && duplicateUser[0].mobile === user.mobile
                     && duplicateUser[0].email === user.email) {
                    errortext += 'Username,Mobile and Email ID';
                } else if (duplicateUser[0].username === user.username && duplicateUser[0].mobile === user.mobile){
                    errortext += 'Username and Mobile';
                } else if (duplicateUser[0].username === user.username && duplicateUser[0].email === user.email){
                    errortext += 'Username and Email ID';
                } else if (duplicateUser[0].email === user.email && duplicateUser[0].mobile === user.mobile){
                    errortext += 'Email ID and Mobile';
                } else if (duplicateUser[0].username === user.username) {
                    errortext += 'Username';
                } else if (duplicateUser[0].mobile === user.mobile){
                    errortext += 'Mobile';
                } else if (duplicateUser[0].email === user.email){
                    errortext += 'Email ID';
                }
            return throwError({ error: { message: errortext + ' is already taken' } });
        }
        // save new user
        user.id = users.length + 1;
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        // respond 200 OK
        return of(new HttpResponse({ status: 200 }));
    }
    login(username: any, password: string) {
        const userdata: any[] = JSON.parse(localStorage.getItem('users')) || [];
         const filteredUsers = userdata.filter(user => {
            return (user.username === username || user.mobile === username || user.email === username) && user.password === password;
        });
        if (filteredUsers.length) {
            // if login details are valid return 200 OK with user details and fake jwt token
            const user = filteredUsers[0];
            const body = {
                id: user.id,
                username: user.username,
                email: user.email,
                name: user.name,
                mobile: user.mobile,
                address: user.address
            };
            localStorage.setItem('currentUser', JSON.stringify(body));
            this.currentUserSubject.next(user);
            return of(new HttpResponse({ status: 200, body: body }));
        } else {
            return throwError({ error: { message: 'Username or password is incorrect' } });
        }
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

}
