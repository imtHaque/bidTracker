import { Injectable, NgZone } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { User } from './shared/user.model';
import { Observable, of } from 'rxjs';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  usrRole = new Subject();
  loginPage = new Subject();
  fireToast = new Subject();

  opp = [];
  taskArr = [];


  constructor(private http: HttpClient, private ngZone: NgZone) { }

  login = [
    {username: 'slead', password: '123', position: 'saleslead'},
    {username: 'approver', password: '123', position: 'approver'}
        ];

        url = '';


getAllTask() {
  return this.http.get<any>(this.url + '/api/getAllTask');
}

  toastFire(fire, message) {
    this.fireToast.next({fireMsg: fire, toastMsg: message});
  }


  postBid(formToSubmit) {
    return this.http.post<any>(this.url + '/api/newEntry', formToSubmit);
  }

  getUser(userInput: string) {
    return this.http.get<User[]>(this.url + '/api/user/' + userInput);
  }

  getOpp() {
    return this.http.get<any>(this.url + '/api/getOpp');
  }

  getSLOpp() {
    return this.http.get<any>(this.url + '/api/getslOpp');
  }

  getAwaitingApprvlOpp() {
    return this.http.get<any>(this.url + '/api/getawaitingApprovalOpp');
  }

  getSingleOpp(id: string) {
    return this.http.get<any>(this.url + '/api/getOpp/' + id);
  }

  updateOpp(updateForm, id: string) {
    return this.http.put<any>(this.url + '/api/getOpp/' + id, updateForm );
  }

  deleteBidTeam(id: string) {
    return this.http.delete<any>(this.url + '/api/delOpp/' + id);
  }

  addBidTeam(updateForm, id: string) {
    return this.http.post<any>(this.url + '/api/addTeam/' + id, updateForm);
  }

  requestApproval(updateForm, id: string) {
    return this.http.put<any>(this.url + '/api/reqApprovalOpp/' + id, updateForm );
  }

  acceptOpp(updateForm, id: string) {
    return this.http.put<any>(this.url + '/api/acceptOpp/' + id, updateForm);
  }

  rejectOpp(updateForm, id: string) {
    return this.http.put<any>(this.url + '/api/rejectOpp/' + id, updateForm);
  }

  set UsrRole(value) {

    this.usrRole.next(value);
    localStorage.setItem('token', value);
  }

  get UsrRole() {
    return localStorage.getItem('token');
  }

  loggedIn() {
    return localStorage.getItem('token');
  }

  insertTask(task) {
    return this.http.post<any>(this.url + '/api/newTask', task);
  }

  getTask(id: string) {
    return this.http.get<any>(this.url + '/api/getTask/' + id);
  }

  updateTaskStatus(id: string, task) {
    return this.http.put<any>(this.url + '/api/taskStatusUpdate/' + id, task);
  }

  getLoseProbability(id: string) {
    return this.http.get<any>(this.url + '/api/getSuccessProbability/' + id);
  }

  getNotification() {
    return this.http.get<any>(this.url + '/api/not2');
  }

//    getEventSource(url: string): EventSource {
//      return new EventSource(url);
//    }

//    getServerSentEvent(url: string) {
//       return new Observable (
//        observer => {
//          const eventSource = this.getEventSource(url);

//          eventSource.onmessage = event => {
//            this.ngZone.run(() => {
//              observer.next(event);
//            });
//          };

//          eventSource.onerror = error => {
//            this.ngZone.run(() => {
//              observer.next(error);
//            });
//          };
//    });
//  }

   isOnLoginPage(bool) {
   this.loginPage.next(bool);
 }
}
