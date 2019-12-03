import { Component, OnInit, OnDestroy} from '@angular/core';
import { NodeService } from '../node.service';

@Component({
  selector: 'app-getopp',
  templateUrl: './getopp.component.html',
  styleUrls: ['./getopp.component.css']
})
export class GetoppComponent implements OnInit, OnDestroy {
 opps;
showSpinner = true;
sortingVar = ['Deadline', 'Prospecting', 'Awaiting Approval', 'Closed Won', 'Closed Lost'];
showSortingVar: boolean;
clickedSortingVar;
userSearchInput = '';
userSearchResult = [];
showSearchResult: boolean;

holdBreadCrumbVar = 1;

userRole;
  constructor(
    private nodeService: NodeService
  ) {
  }


  ngOnInit() {

    if (this.nodeService.taskArr.length === 0) {
    this.nodeService.getAllTask().subscribe(
      data => {
        this.nodeService.taskArr = data.records;
      });
    }

    if (this.nodeService.opp.length === 0) {
    this.nodeService.getOpp().subscribe(
      opp => {
        this.nodeService.opp = opp;
        this.opps = this.nodeService.opp;
        this.showSpinner = false;

      });
    } else if (this.nodeService.opp.length > 0) {
      this.opps = this.nodeService.opp;
      this.showSpinner = false;
    }



    this.nodeService.usrRole.subscribe(
      userPosition => {
        this.userRole = userPosition;
      });

    this.userRole = localStorage.getItem('token');
    if (this.userRole === null) {
    this.userRole = undefined;
  }
    if (this.userRole === 'saleslead') {
    this.clickedSortingVar = 'Prospecting';
    } else {
      this.clickedSortingVar = 'Awaiting Approval' ;
      this.holdBreadCrumbVar = 2;
    }
  }



showSort() {
  this.showSearchResult = false;
  this.showSortingVar = !this.showSortingVar;
}

sortOpps(clik, varNum?) {

  this.clickedSortingVar = clik;
  this.showSortingVar = false;
  this.holdBreadCrumbVar = varNum;

}
searchInputLogic(input) {
  this.showSearchResult = true;
  this.showSortingVar = false;
  this.userSearchInput = input;

  if (this.userSearchInput !== '' && this.userSearchInput !== undefined) {
    this.userSearchResult = [];
    let i = 0;

    for (i = 0; i < this.opps.length; i++) {
      this.opps[i].name.includes(this.userSearchInput);

      if (this.opps[i].name.toLowerCase().includes(this.userSearchInput.toLowerCase())) {

        this.userSearchResult.push(this.opps[i]);

      }
    }
  } else {
    this.showSearchResult = false;
  }
}

ngOnDestroy() {
}

}
