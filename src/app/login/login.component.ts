import { Component, OnInit, OnDestroy, ElementRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NodeService } from '../node.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
loginForm: FormGroup;
role;




  constructor(private fb: FormBuilder,
              private nodeService: NodeService,
              private router: Router,
              private elementRef: ElementRef) { }

  ngOnInit() {


    if (this.nodeService.UsrRole) {
      this.router.navigate(['/ng/homePage']);
    }

    this.nodeService.isOnLoginPage(true);

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }


login(username: string, password: string) {

let i = 0;

for (i = 0; i < this.nodeService.login.length; i++) {

  if ((this.nodeService.login[i].username === username) && (this.nodeService.login[i].password === password)) {
   this.nodeService.UsrRole = this.nodeService.login[i].position;

   }
  }
this.router.navigate(['/ng/homePage']);
}


ngOnDestroy() {
  this.nodeService.isOnLoginPage(false);
  this.elementRef.nativeElement.ownerDocument.body.style.background = 'white';
}
}
