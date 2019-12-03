import { Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import { NodeService } from 'src/app/node.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/shared/user.model';

@Component({
  selector: 'app-viewopp',
  templateUrl: './viewopp.component.html',
  styleUrls: ['./viewopp.component.css']
})
export class ViewoppComponent implements OnInit, OnDestroy {

  // win probability

 loseprobability: number;

// store stagename

stageName: string;
bidName: string;

// store logged in user role

userRole: string;
sleadLoggedIn: boolean;
approverLoggedIn: boolean;

 // loading screen
  showSpinner = true;
  disableInput = false;

// hide/show approval button && reject/accept based on stage
hideApprvlBtn = false;
hideAccRejectBtn = false;

  currentJustify = 'justified';
  // storing ID for update
  formId;
// probability ini
  showProbList: boolean;
// estvalue logic
showEsTValueList = false;

// BidTeam logic
users: User[] = [];
showBidTeamUserSearchList = false;
bidTeamArray;
hasBidArrayChanged;

// Sales Lead logic
hideInput: boolean;
displaySelectedUser;
showUserList = false;

// Form init
 name: string;
 description: string;
 sharePointLink: string;
 website: string;
 probabilityArray: number[] = [10, 30, 50, 70, 90];
 probability: number;
 estimatedValueArray = [100000, 500000, 1000000];
 estimatedValue = 0;
 wbsCode;
 bidDeadline;
 costs;
 effortDays;
 salesLeadHold;
 sendForApproval = false;
 loadedFromMemory: boolean;
fm;

 // tasks

 tasks: FormGroup;
 assignToUser;
 assignToUserHold;
 subject: string;
 duedate;
 relatedOpp;
 status = 'Not Started';
 statusArray = ['Not Started', 'In Progress', 'Completed', 'Waiting on someone else', 'Deferred'];
 comment;
 relatedTo;
 showStatusList: boolean;
 showTaskForm: boolean;

 // get tasks
 taskArray = [];

 showTaskUserList: boolean;
 hideTaskUserListInput: boolean;
 breadCrumbVar = 1;


mainForm: FormGroup;

  constructor(private fb: FormBuilder,
              private nodeService: NodeService,
              private route: ActivatedRoute,
              private router: Router,
              private cdr: ChangeDetectorRef) {


              }

  ngOnDestroy() {
  }


  ngOnInit() {

    this.mainForm = this.fb.group({

      oppDetail: this.fb.group({
        name: [this.name, Validators.required],
        description: [this.description, Validators.required],
        sharePointLink: [this.sharePointLink, Validators.required],
        website: [this.website, Validators.required],
        probability: [this.probability, Validators.required],
        estimatedValue: [this.estimatedValue, Validators.required],
        wbsCode: [this.wbsCode, Validators.required],
        bidDeadline: [this.bidDeadline, Validators.required],
        costs: [this.costs, Validators.required],
        effortDays: [this.effortDays, Validators.required],
        bidTeam: [this.bidTeamArray, Validators.required],
        salesLead: [this.salesLeadHold, Validators.required],
        sendForApproval: [this.sendForApproval]
      })
    });

    this.tasks = this.fb.group({
      subject: [this.subject],
      duedate: [this.duedate],
      status: [this.status],
      comment: [this.comment],
      assignToUser: [this.assignToUser],
      relatedTo: [this.relatedTo]
    });

    this.route.params.subscribe(routeParams => {

      if (this.nodeService.opp.length > 0) {
        this.loadedFromMemory = true;
        console.log('executed from memory');
        let i: number;
        for (i = 0; i < this.nodeService.opp.length; i++) {
        if (this.nodeService.opp[i].id === routeParams.id ) {

          this.stageName = this.nodeService.opp[i].stagename;
          this.bidName = this.nodeService.opp[i].name;

          this.formId = this.nodeService.opp[i].id;
          this.probability = (this.nodeService.opp[i].probability);
          if (this.nodeService.opp[i].amount != null) {
                  this.estimatedValue = (this.nodeService.opp[i].amount);
                  }
          if (!(this.nodeService.opp[i].oppotunity_teams__r)) {
                  this.bidTeamArray = [];
                  this.hasBidArrayChanged = [];
                } else {
                  this.bidTeamArray = (this.nodeService.opp[i].oppotunity_teams__r.records);
                  this.hasBidArrayChanged = (this.nodeService.opp[i].oppotunity_teams__r.records);
                }

          if (!(this.nodeService.opp[i].sales_lead__r)) {
                  this.hideInput = false;
                  this.salesLeadHold = {Id: ''};
                } else {
                  this.hideInput = true;
                  this.salesLeadHold = this.nodeService.opp[i].sales_lead__r;
                }

          if (
                  (!(this.nodeService.opp[i].stagename === 'Prospecting'))
                  ) {
                    this.hideApprvlBtn = true;
                    this.disableInput = true;
                }
          if (
                  !(this.nodeService.opp[i].stagename === 'Awaiting Approval')) {

                    this.hideAccRejectBtn = true;
                }
          if (this.salesLeadHold.Id !== '') {
                  this.nodeService.getLoseProbability(this.nodeService.opp[i].sales_lead__r.Id).
                  subscribe(
                    data => {
                      this.loseprobability = data.loseprobability;
                    }
                  );
                }
          let x: number;
          if (this.nodeService.taskArr !== null && this.nodeService.taskArr.length > 0) {
          for (x = 0; x < this.nodeService.taskArr.length; x++) {
          if (this.nodeService.taskArr[x].whatid === this.formId) {
          this.taskArray.push(this.nodeService.taskArr[x]);
            }
          }
        }

          this.thisFormSet(this.nodeService.opp[i]);

          this.userRole = localStorage.getItem('token');

          if (this.userRole === 'saleslead') {
                    this.sleadLoggedIn = true;
                    this.approverLoggedIn = false;
                  } else {
                    this.sleadLoggedIn = false;
                    this.approverLoggedIn = true;
                  }
          this.showSpinner = false;

        }

      }
        this.cdr.detectChanges();

    } else {

      this.nodeService.getOpp().subscribe(
        opp => {
          this.nodeService.opp = opp;
        });


      console.log('executed from API');
      console.log(this.nodeService.opp.length);
      this.nodeService.getSingleOpp(routeParams.id)
                .subscribe(

                singleOpp => {
                  this.stageName = singleOpp[0].stagename;
                  this.bidName = singleOpp[0].name;

                  this.formId = singleOpp[0].id;
                  this.probability = (singleOpp[0].probability);
                  if (singleOpp[0].amount != null) {
                  this.estimatedValue = (singleOpp[0].amount);
                  }
                  if (!(singleOpp[0].oppotunity_teams__r)) {
                  this.bidTeamArray = [];
                  this.hasBidArrayChanged = [];
                } else {
                  this.bidTeamArray = (singleOpp[0].oppotunity_teams__r.records);
                  this.hasBidArrayChanged = (singleOpp[0].oppotunity_teams__r.records);
                }

                  if (!(singleOpp[0].sales_lead__r)) {
                  this.hideInput = false;
                  this.salesLeadHold = {Id: ''};
                } else {
                  this.hideInput = true;
                  this.salesLeadHold = singleOpp[0].sales_lead__r;
                }

                  if (
                  (!(singleOpp[0].stagename === 'Prospecting'))
                  ) {
                    this.hideApprvlBtn = true;
                    this.disableInput = true;
                }
                  if (
                  !(singleOpp[0].stagename === 'Awaiting Approval')) {

                    this.hideAccRejectBtn = true;
                }
                  if (this.salesLeadHold.Id !== '') {
                  this.nodeService.getLoseProbability(singleOpp[0].sales_lead__r.Id).
                  subscribe(
                    data => {
                      this.loseprobability = data.loseprobability;
                    }
                  );
                }

                  this.nodeService.getAllTask().subscribe(
                  data => {
                    this.nodeService.taskArr = data.records;

                    if (this.nodeService.taskArr !== null && this.nodeService.taskArr.length > 0) {
                      let y = 0;
                      for (y = 0; y < this.nodeService.taskArr.length; y++) {
                        if (this.nodeService.taskArr[y].whatid === this.formId) {
                          this.taskArray.push(this.nodeService.taskArr[y]);
                        }
                      }
                    }
                  });

                  this.loadedFromMemory = false;
                  this.thisFormSet(singleOpp);


                  this.userRole = localStorage.getItem('token');

                  if (this.userRole === 'saleslead') {
                    this.sleadLoggedIn = true;
                    this.approverLoggedIn = false;
                  } else {
                    this.sleadLoggedIn = false;
                    this.approverLoggedIn = true;
                  }
                  this.showSpinner = false;
                }
                );

              }
    });


  }

  thisFormSet(opport) {

    if (this.loadedFromMemory) {

    this.fm = opport;

    } else {

    this.fm = opport[0];

    }
    this.mainForm.patchValue({
      oppDetail: ({
        name: this.fm.name,
        description: this.fm.description,
        sharePointLink: this.fm.share_point_link__c,
        website: this.fm.website__c,
        probability: (this.fm.probability),
        estimatedValue: this.fm.amount,
        wbsCode: this.fm.wbs_code__c,
        bidDeadline: this.fm.closedate,
        costs: this.fm.cost__c,
        effortDays: this.fm.effort_days__c,
        bidTeam: this.bidTeamArray,
        salesLead: this.salesLeadHold
      })
      });


    if (this.disableInput) {
      this.mainForm.get('oppDetail').get('name').disable();
      this.mainForm.get('oppDetail').get('description').disable();
      this.mainForm.get('oppDetail').get('sharePointLink').disable();
      this.mainForm.get('oppDetail').get('website').disable();
      this.mainForm.get('oppDetail').get('wbsCode').disable();
      this.mainForm.get('oppDetail').get('bidDeadline').disable();
      this.mainForm.get('oppDetail').get('costs').disable();
      this.mainForm.get('oppDetail').get('effortDays').disable();
    }
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

  AssignTo(userInput?: string) {

    if (userInput !== '') {

      this.showTaskUserList = true;

      this.nodeService.getUser(userInput)
    .subscribe(

      (sfUsers: any) => {

        this.users = sfUsers;

      });
    } else {
      this.showTaskUserList = false;
      return null;

    }
  }

  onAssignToDelete() {
    this.tasks.get('assignToUser').setValue({Id: ''});
    this.hideTaskUserListInput = false;

  }

  assignToUserSelection(Id: string, Name: string) {
    this.tasks.get('assignToUser').setValue({Id, Name});
    this.assignToUserHold = {Id, Name};
    this.showTaskUserList = false;
    this.hideTaskUserListInput = true;
  }


  saveTask() {



    if ((this.tasks.get('subject').value != null) && (this.tasks.get('duedate').value != null)) {
    this.tasks.get('relatedTo').setValue(this.formId);
    this.nodeService.insertTask(this.tasks.value).subscribe(
      () => {
        this.tasks.reset();
        this.showTaskForm = false;
        this.nodeService.toastFire(true, 'Task saved');
      });

    }

    this.nodeService.getAllTask().subscribe(data => {
      this.nodeService.taskArr = data.records;
    });
  }

  updateTaskStatus(task) {
    this.nodeService.updateTaskStatus(task.id, task).subscribe();
  }

  selectedUser( Id: string, Name: string) {
    this.mainForm.get('oppDetail').get('salesLead').setValue({Id, Name});
    this.salesLeadHold = {Id, Name};
    this.showUserList = false;
    this.hideInput = true;
  }

  onUserDelete() {
    if (!this.disableInput) {
    this.mainForm.get('oppDetail').get('salesLead').setValue({Id: ''});
    this.hideInput = false;
    }
  }


  bidTeamUserSelection(Name: string, Id: string) {
    this.bidTeamArray.push({User__r: {Id, Name}});
    this.showBidTeamUserSearchList = false;
    this.mainForm.get('oppDetail').get('bidTeam').setValue(this.bidTeamArray);
  }

  bidTeamDelete(index: number) {
    if (!this.disableInput) {
    this.bidTeamArray.splice(index, 1);
    this.mainForm.get('oppDetail').get('bidTeam').setValue(this.bidTeamArray);
    }
  }

  onProbClick() {
    if (!this.disableInput) {
    this.showProbList = !this.showProbList;
    }
  }

  onProbSelect(prob) {
    this.probability = prob;
    this.showProbList = !this.showProbList;
    this.mainForm.get('oppDetail').get('probability').setValue(prob);
  }

  onEstClick() {
    if (!this.disableInput) {
    this.showEsTValueList = !this.showEsTValueList;
    }
  }

  onEstSelect(estV) {
    this.estimatedValue = estV;
    this.showEsTValueList = !this.showEsTValueList;
    this.mainForm.get('oppDetail').get('estimatedValue').setValue(estV);
  }

  deleteTeam() {
     if (!(this.hasBidArrayChanged[0]) && (this.bidTeamArray[0])) {
        this.addBidTeam();
      } else if ((this.hasBidArrayChanged[0]) && this.bidTeamArray[0]) {
      this.nodeService.deleteBidTeam(this.formId)
      .subscribe(
        () => {this.addBidTeam() ; }
      );
    } else if (!this.bidTeamArray[0]) {
      this.nodeService.deleteBidTeam(this.formId).subscribe();
    }
     return null;
  }

  addBidTeam() {
      this.nodeService.addBidTeam(this.mainForm.value, this.formId)
      .subscribe(
       data => data,
       error => error
      );
      return null;
      }


      save() {

        this.nodeService.updateOpp(this.mainForm.value, this.formId)
        .subscribe(
          () => {this.deleteTeam();
                 this.nodeService.toastFire(true, 'Bid Updated');
                 this.router.navigate(['/ng/homePage']);
                });

        this.nodeService.getOpp().subscribe(data => {
          this.nodeService.opp = data;
        });

      }

      requestForApproval() {
        this.mainForm.get('oppDetail').get('sendForApproval').setValue(true);
        this.nodeService.requestApproval(this.mainForm.value, this.formId)
        .subscribe(
          () => {
            this.deleteTeam();
            this.nodeService.toastFire(true, 'Sent for Approval');
            this.router.navigate(['/ng/homePage']);
          }
        );

        this.nodeService.getOpp().subscribe(data => {
          this.nodeService.opp = data;
        });
      }

      acceptOpp() {
        this.nodeService.acceptOpp(this.mainForm.value, this.formId)
        .subscribe(
          () => {this.nodeService.toastFire(true, 'Approved');
                 this.router.navigate(['/ng/homePage']); }
        );

        this.nodeService.getOpp().subscribe(data => {
          this.nodeService.opp = data;
        });
      }

      rejectOpp() {
        this.nodeService.rejectOpp(this.mainForm.value, this.formId)
        .subscribe(
          () => { this.nodeService.toastFire(true, 'Bid Disqualified');
                  this.router.navigate(['/ng/homePage']); }
        );

        this.nodeService.getOpp().subscribe(data => {
          this.nodeService.opp = data;
        });
      }

      showTaskForms() {
        this.showTaskForm = !this.showTaskForm;
      }

      lowRiskPB() {

        if (this.loseprobability < 0.33) {
          return  (this.loseprobability * 100) + '' + '%';
        } else {
          return '33%';
        }

      }
      mediumRiskPB() {

        if ((this.loseprobability > 0.33) && (this.loseprobability < 0.66)) {
          const adjustedProb = this.loseprobability - 0.33;
          return  (adjustedProb * 100) + '' + '%';
        } else if (this.loseprobability < 0.33) {
          return '0%';
        } else {
          return '33%';
        }
      }

      highRiskPB() {
        if ((this.loseprobability > 0.66)) {
          const adjustedProb = this.loseprobability - 0.66;
          return  ((adjustedProb * 100) + 1) + '' + '%';
        } else {
          return '0%';
        }
      }

      oppTab() {
        this.breadCrumbVar = 1;
      }
      preBidTab() {
        if ( 
        this.mainForm.get('oppDetail').get('name').value &&
        this.mainForm.get('oppDetail').get('description').value &&
        this.mainForm.get('oppDetail').get('sharePointLink').value &&
        this.mainForm.get('oppDetail').get('website').value &&
        this.mainForm.get('oppDetail').get('estimatedValue').value
        ) {

        this.breadCrumbVar = 2;

        } else {

          return null;
          
        }
      }
  }




