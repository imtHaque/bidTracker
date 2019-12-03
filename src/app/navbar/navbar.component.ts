import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NodeService } from '../node.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  constructor(private router: Router, private nodeService: NodeService) { }

  notificationArray = [];
  salesLeadNotificationArray = [];
  approverNotificationArray = [];
  clickedSleadNotifications = [];
  clickedApprvNotifications = [];
  openNoti = false;
  userRole;
  unSeenNotiLength;
  saveNotificationLength = 0;

  isNavOpen: boolean;
  ngOnInit() {

    this.isNavOpen = false;

// get notification at interval
// checking for data array
// if data array length different to local memory
// saved to local memory and notification pushed to presentation array

setInterval(() => {
  this.nodeService.getNotification().subscribe(

    data => {

      if (data.length > 0) {
    
        if (data.length !== this.saveNotificationLength){

          this.saveNotificationLength = data.length;

          let i = 0;

        for (i = 0; i < data.length; i++) {

          if (data[i].StageName === 'Awaiting Approval') {

            if (this.approverNotificationArray.length === 0) {

              this.approverNotificationArray.push(data[i]);

            } else 
            {
              let x = 0;

              for (x = 0; x < this.approverNotificationArray.length; x++) {

                if (data[i].Name !== this.approverNotificationArray[x].Name) {

                  this.approverNotificationArray.push(data[i]);

                }

              }

            }

          } else {

            if (this.salesLeadNotificationArray.length === 0) {

              this.salesLeadNotificationArray.push(data[i]);

            } else {

              let y = 0;

              for (y = 0; y < this.salesLeadNotificationArray.length; y++) {

                if (this.salesLeadNotificationArray[y].Name !== data[i].Name &&
                this.salesLeadNotificationArray[y].StageName !== data[i].StageName) {

                  this.salesLeadNotificationArray.push(data[i]);

                }

              }

            }

          }

        }
          
      }
        
    }

  });

},
// notification interval time:
5000
);
    



    this.nodeService.usrRole.subscribe(

        userPosition => {

          this.userRole = userPosition;

        });

    this.userRole = localStorage.getItem('token');

    if (this.userRole === null) {

      this.userRole = undefined;

    }
  }


  logout() {

    this.nodeService.usrRole.next(undefined);
    localStorage.clear();
    this.router.navigate(['/login']);

  }

  openNavbar() {
    this.isNavOpen = false;
  }

  openNotis() {
    this.openNoti = !this.openNoti;
  }

  notiClick(index) {

    this.openNoti = false;

    if (this.userRole === 'saleslead') {

      this.clickedSleadNotifications.push(this.salesLeadNotificationArray[index]);
      this.salesLeadNotificationArray.splice(index, 1);
      
    } else {

      this.clickedApprvNotifications.push(this.approverNotificationArray[index]);
      this.approverNotificationArray.splice(index, 1);
      
    }

  }
}
