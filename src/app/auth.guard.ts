import { Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {NodeService} from './node.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private nodeService: NodeService,
              private router: Router) {}


    canActivate(): boolean {
      if (this.nodeService.loggedIn()) {
        return true;
      } else {
        this.router.navigate(['/ng/login']);
        return false;
      }
    }
}
