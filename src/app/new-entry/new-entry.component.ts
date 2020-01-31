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

  industryArray = ['Banking', 'Healthcare', 'Transportation', 'Government']
  probabilityArray = [0.10, 0.30, 0.50, 0.70, 0.90];
  estimatedValueArray = [100000, 500000, 1000000 ];

// user Search init
  users: User[] = [];
  hideInput: boolean;
  displaySelectedUser;
  showUserList = false;
  showBidTeamUserSearchList = false;
  bidTeamArray = [];
  showAccountList = false;
  accounts = [];
  hideAccountInput: boolean;
  displaySelectedAccount;

//modal

addNewAccount = false;

//client lead

hideClientLeadInput: boolean;
showClientList: boolean;
clientArray = [];
clientLeadHold;

  // form
   mainForm: FormGroup;

  constructor(private fb: FormBuilder,
              private nodeService: NodeService,
              private router: Router) {
              }


  ngOnInit() {
    this.mainForm = this.fb.group ({

      oppDetail: this.fb.group({
        account: [''],
        name: ['', Validators.required],
        description: ['', Validators.required],
        salesLead: ['', Validators.required],
        clientLead: ['', Validators.required],
        sharePointLink: ['', Validators.required],
        probability: [0.1, Validators.required],
        estimatedValue: ['', Validators.required],

        newAccount: this.fb.group({

          accountName : [''],
          industry: ['']

        })
      }),

        preBid: this.fb.group({

          wbsCode: ['', Validators.required],
          bidDeadline: ['', Validators.required],
          costs: ['', Validators.required],
          effortDays: ['', Validators.required],
          bidTeam: [ [], Validators.required],
          contractLength: ['', Validators.required]

        })
      });
  }

  addNewAcc() {

    this.addNewAccount = true;

  }

  AccountSearch(userInput?: string) {

    if (userInput !== '') {

      this.showAccountList = true;

      this.nodeService.getAccount(userInput)
      .subscribe (

        (account: any) => {

          this.accounts = account;
        }

        );

    } else {

      this.showAccountList = false;
      return null;

    }
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

  CLSearch(userInput?: string) {

    if (userInput !== '') {

      this.showClientList = true;

      this.nodeService.getUser(userInput)
    .subscribe(

      (sfUsers: any) => {

        this.clientArray = sfUsers;

      });
    } else {
      this.showClientList = false;
      return null;

    }
  }
  onClientDelete() {

      this.mainForm.get('oppDetail').get('clientLead').setValue({Id: ''});
      this.hideClientLeadInput = false;
    
  }

  selectedClient(Id: string, Name: string) {

    this.mainForm.get('oppDetail').get('clientLead').setValue({Id, Name});
    this.clientLeadHold = {Id, Name};
    this.showClientList = false;
    this.hideClientLeadInput = true;

  }

  selectedUser( id: string, name: string) {

    this.mainForm.get('oppDetail').get('salesLead').setValue(id);
    this.displaySelectedUser = name;
    this.showUserList = false;
    this.hideInput = true;
  }

  selectedAccount( id: string, name:string) {

    this.mainForm.get('oppDetail').get('account').setValue(id);
    this.displaySelectedAccount = name;
    this.showAccountList = false;
    this.hideAccountInput = true;
    
  }

  onUserDelete() {
    this.mainForm.get('oppDetail').get('salesLead').setValue('');
    this.hideInput = false;
  }

  onAccountDelete() {

    this.mainForm.get('oppDetail').get('account').setValue('');
    this.hideAccountInput = false;

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

  saveAccount() {
    console.log(this.mainForm.get('oppDetail').get('newAccount').value);
    this.nodeService.addNewAccount(this.mainForm.get('oppDetail').get('newAccount').value)
    .subscribe(

      data => {
        this.mainForm.get('oppDetail').get('account').setValue(data.Id);
        this.displaySelectedAccount = this.mainForm.get('oppDetail').get('newAccount').get('accountName').value;
        this.showAccountList = false;
        this.hideAccountInput = true;
        console.log(this.mainForm.get('oppDetail').get('account').value);
      },
       error => console.log('error ', error)
 
     );;
  }

}
