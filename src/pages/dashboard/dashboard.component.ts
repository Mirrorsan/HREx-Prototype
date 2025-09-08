import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { WelcomeBannerComponent } from '../../components/welcome-banner/welcome-banner.component';
import { ProfileCardComponent } from '../../components/profile-card/profile-card.component';
import { ProgressCardComponent } from '../../components/progress-card/progress-card.component';
import { TimeTrackerCardComponent } from '../../components/time-tracker-card/time-tracker-card.component';
import { OnboardingCardComponent } from '../../components/onboarding-card/onboarding-card.component';
import { CalendarCardComponent } from '../../components/calendar-card/calendar-card.component';
import { TeamOverviewCardComponent } from '../../components/team-overview-card/team-overview-card.component';
import { ApprovalsCardComponent } from '../../components/approvals-card/approvals-card.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WelcomeBannerComponent,
    ProfileCardComponent,
    ProgressCardComponent,
    TimeTrackerCardComponent,
    OnboardingCardComponent,
    CalendarCardComponent,
    TeamOverviewCardComponent,
    ApprovalsCardComponent
  ]
})
export class DashboardComponent {
  private authService = inject(AuthService);
  
  currentUser = this.authService.currentUser;
  userRole = computed(() => this.currentUser()?.role);
}