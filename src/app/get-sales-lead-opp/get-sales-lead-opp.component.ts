import { Component, OnInit } from '@angular/core';
import { NodeService } from '../node.service';

@Component({
  selector: 'app-get-sales-lead-opp',
  templateUrl: './get-sales-lead-opp.component.html',
  styleUrls: ['./get-sales-lead-opp.component.css']
})
export class GetSalesLeadOppComponent implements OnInit {


  constructor(
    private nodeService: NodeService
  ) {}

  opps = [];
showSpinner = true;
sortingVar = ['Deadline', 'Prospecting', 'Awaiting Approval', 'Closed Won', 'Closed Lost'];
showSortingVar: boolean;
clickedSortingVar;
userSearchInput = '';
userSearchResult = [];
showSearchResult: boolean;

holdBreadCrumbVar: number;

  ngOnInit() {
    this.getOpp();
    this.clickedSortingVar = 'Deadline';
  }


getOpp() {
  this.nodeService.getSLOpp()
  .subscribe(
    opportunities => {
      this.opps = opportunities;
      this.showSpinner = false;
    }
  );
}


showSort() {
  this.showSearchResult = false;
  this.showSortingVar = !this.showSortingVar;
}

sortOpps(clik, varNum?) {
  if (clik !== 'Deadline') {
  this.clickedSortingVar = clik;
  this.showSortingVar = false;
  this.holdBreadCrumbVar = varNum;
  } else {
    this.clickedSortingVar = 'Deadline';
    this.showSortingVar = false;
    this.holdBreadCrumbVar = 0; }
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
