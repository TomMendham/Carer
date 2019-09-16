import {Injectable, OnDestroy} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../services/auth.service';
import {UserService} from '../services/user.service';
import {UserDetails} from '../classes/user.model';

@Injectable({
  providedIn: 'root'
})
export class StoryboardGuard implements CanActivate, OnDestroy {
  userSubscription;

  constructor(
    public userService: UserService,
    public router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      this.userService.getUserInformation();
      this.userSubscription = this.userService.userChanged.subscribe(isUser => {
        if (!isUser.currentStoryboard) {
          this.router.navigate(['/profile']);
        }
      });
      return true;
    }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
