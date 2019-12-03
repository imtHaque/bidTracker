import { Component, OnInit, ViewChild} from '@angular/core';
import { NodeService } from './node.service';
import { Router } from '@angular/router';
import { IgxToastPosition } from 'igniteui-angular';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {



  // toasts
  @ViewChild('toast', {static: false}) toast;

  toastMessage: string;
  fireTheToast: boolean;
  toastPosition = IgxToastPosition.Middle;

  // toasts

  onLoginPage;

constructor(private nodeService: NodeService,
            private router: Router ) {


  this.nodeService.loginPage.subscribe(
    value => {
      this.onLoginPage = value;
    }
  );

  this.nodeService.fireToast.subscribe(
    (toastObject: any) => {

      this.toastMessage = toastObject.toastMsg;
      this.fireTheToast = toastObject.fireMsg;

      if (this.fireTheToast) {

        this.toast.show();

      }
      }

  );
 }



 ngOnInit() {

 }

}


