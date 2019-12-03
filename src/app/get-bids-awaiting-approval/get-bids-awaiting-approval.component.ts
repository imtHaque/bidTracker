import { Component, OnInit } from '@angular/core';
import { NodeService } from '../node.service';

@Component({
  selector: 'app-get-bids-awaiting-approval',
  templateUrl: './get-bids-awaiting-approval.component.html',
  styleUrls: ['./get-bids-awaiting-approval.component.css']
})
export class GetBidsAwaitingApprovalComponent implements OnInit {

  opps = [];
showSpinner = true;
sortingVar = ['Awaiting Approval'];
showSortingVar: boolean;
clickedSortingVar;
userSearchInput = '';
userSearchResult = [];
showSearchResult: boolean;


  constructor(
    private nodeService: NodeService
  ) {}

  ngOnInit() {
    this.getOpp();
    this.clickedSortingVar = 'Awaiting Approval';
  }


getOpp() {
  this.nodeService.getAwaitingApprvlOpp()
  .subscribe(
    opportunities => {
      this.opps = opportunities;
      this.showSpinner = false;
    }
  );
}


sortOpps(clik) {
  if (clik !== 'Deadline') {
  this.clickedSortingVar = clik;
  this.showSortingVar = false;
  } else {
    this.clickedSortingVar = 'Deadline';
    this.showSortingVar = false; }
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
}
