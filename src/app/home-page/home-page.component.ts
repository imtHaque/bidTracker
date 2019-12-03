/*
TO DO :

Change add bid to record a new opp;

SEE more bottom right to show bids full detail;

search bar top right;

add task left side smaller;

*/



import { Component, OnInit } from '@angular/core';
import { NodeService } from '../node.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  constructor(private nodeService: NodeService) { }
  userRole;
  ngOnInit() {


    this.nodeService.getOpp().subscribe(
      opp => {
        this.nodeService.opp = opp;
      });

    this.nodeService.getAllTask().subscribe(
        task => {
        this.nodeService.taskArr = task.records;
      });

    this.nodeService.usrRole.subscribe(
      userPosition => {
        this.userRole = userPosition;
      });

    this.userRole = localStorage.getItem('token');
    if (this.userRole === null) {
    this.userRole = undefined;
  }

  }

}
