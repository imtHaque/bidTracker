import { Component, OnInit} from '@angular/core';
import { FormGroup, Validators, FormBuilder} from '@angular/forms';
import {NodeService} from '../node.service';
import { User } from '../shared/user.model';
import { Router } from '@angular/router';

@Component({

  selector: 'app-new-entry',
  templateUrl: './new-entry.component.html',
  styleUrls: ['./new-entry.component.css']
})
export class NewEntryComponent implements OnInit {

  currentJustify = 'justified';
// form value array

  probabilityArray = [0.10, 0.30, 0.50, 0.70, 0.90];
  estimatedValueArray = [100000, 500000, 1000000 ];

// user Search init
  users: User[] = [];
  hideInput: boolean;
  displaySelectedUser;
  showUserList = false;
  showBidTeamUserSearchList = false;
  bidTeamArray = [];




  // form
   mainForm: FormGroup;

  constructor(private fb: FormBuilder,
              private nodeService: NodeService,
              private router: Router) {
              }


  ngOnInit() {
    this.mainForm = this.fb.group ({

      oppDetail: this.fb.group({

        name: ['', Validators.required],
        description: ['', Validators.required],
        salesLead: ['', Validators.required],
        sharePointLink: ['', Validators.required],
        website: ['', Validators.required],
        probability: [0.1, Validators.required],
        estimatedValue: ['', Validators.required]
      }),

        preBid: this.fb.group({

          wbsCode: ['', Validators.required],
          bidDeadline: ['', Validators.required],
          costs: ['', Validators.required],
          effortDays: ['', Validators.required],
          bidTeam: [ [], Validators.required]

        })
      });
  }

  SLSearch(userInput?: string) {

    if (userInput !== '') {

      this.showUserList = true;

      this.nodeService.getUser(userInput)
    .subscribe(

      (sfUsers: any) => {

        this.users = sfUsers;

      });
    } else {
      this.showUserList = false;
      return null;

    }
  }

  selectedUser( id: string, name: string) {

    this.mainForm.get('oppDetail').get('salesLead').setValue(id);
    this.displaySelectedUser = name;
    this.showUserList = false;
    this.hideInput = true;
  }

  onUserDelete() {
    this.mainForm.get('oppDetail').get('salesLead').setValue('');
    this.hideInput = false;
  }

  findBidTeamUser(userInput: string) {
    if (userInput !== '') {

      this.showBidTeamUserSearchList = true;

      this.nodeService.getUser(userInput)
      .subscribe(
        users => {
          this.users = users;
        }
      );
    } else {
      this.showBidTeamUserSearchList = false;
      return null;
    }
  }

  bidTeamUserSelection(name: string, id: string) {
    this.bidTeamArray.push({name, id});
    this.showBidTeamUserSearchList = false;
    this.mainForm.get('preBid').get('bidTeam').setValue(this.bidTeamArray);
  }

  bidTeamDelete(index: number) {
    this.bidTeamArray.splice(index, 1);
    this.mainForm.get('preBid').get('bidTeam').setValue(this.bidTeamArray);
  }

  save() {
    this.nodeService.postBid(this.mainForm.value)

    .subscribe(

     data => console.log('success ', data),
      error => console.log('error ', error)

    );

    this.nodeService.getOpp().subscribe(data => {
      this.nodeService.opp = data;
    });

    this.router.navigate(['/ng/homePage']);
    this.nodeService.toastFire(true, 'Saved !');
  }

}
