import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './features/auth/layouts/auth-layout/auth-layout.component';
import { LoginPageComponent } from './features/auth/pages/login/login-page.component';
import { RegisterPageComponent } from './features/auth/pages/register/register-page.component';
import { AdminLayoutComponent } from './features/admin/layouts/admin-layout/admin-layout.component';
import { DashboardPageComponent } from './features/admin/pages/dashboard/dashboard-page.component';
import { SimulationsPageComponent } from './features/admin/pages/simulations/simulations-page.component';
import { FloodEventsPageComponent } from './features/admin/pages/flood-events/flood-events-page.component';
import { AlertsPageComponent } from './features/admin/pages/alerts/alerts-page.component';
import { UsersPageComponent } from './features/admin/pages/users/users-page.component';
import { SettingsPageComponent } from './features/admin/pages/settings/settings-page.component';
import { authGuard } from './core/guards/auth.guard';
import { UserLayoutComponent } from './features/user/layouts/user-layout/user-layout.component';
import { UserDashboardPageComponent } from './features/user/pages/dashboard/user-dashboard-page.component';
import { FloodHistoryComponent } from './shared/components/flood-history/flood-history.component';
import { ProfilePageComponent } from './features/user/pages/profile-page/profile-page.component';
import { HomePageComponent } from './features/home/pages/home/home-page.component';
import { adminGuard } from './core/guards/admin.guard';
import { userGuard } from './core/guards/user.guard';
import { SimulationLab } from './features/user/pages/simulation-lab/simulation-lab';
import { SimulationsHistoryComponent } from './features/user/pages/simulations-history/simulations-history.component';

export const routes: Routes = [
	{
		path: 'auth',
		component: AuthLayoutComponent,
		children: [
			{ path: 'login', component: LoginPageComponent, canActivate: [authGuard] },
			{ path: 'register', component: RegisterPageComponent, canActivate: [authGuard] }
		]
	},
	{
		path: 'admin',
		component: AdminLayoutComponent,
		canActivate: [adminGuard],
		children: [
			{ path: '', pathMatch: 'full', redirectTo: 'dashboard' },
			{ path: 'dashboard', component: DashboardPageComponent },
			{ path: 'simulations', component: SimulationsPageComponent },
			{ path: 'floodevents', component: FloodEventsPageComponent},
			{ path: 'alerts', component: AlertsPageComponent },
			{ path: 'users', component: UsersPageComponent },
			{ path: 'settings', component: SettingsPageComponent }
		]
	},
	{
		path: 'user',
		component: UserLayoutComponent,
		canActivate: [userGuard],
		children: [
			{ path: '', pathMatch: 'full', redirectTo: 'dashboard' },
			{ path: 'dashboard', component: UserDashboardPageComponent },
			{ path: 'history', component: FloodHistoryComponent },
			{ path: 'profile', component: ProfilePageComponent },
			{ path: 'simulationlab', component: SimulationLab },
			{ path: 'simulationshistory', component: SimulationsHistoryComponent }
		]
	},
	{ path: '', component: HomePageComponent },
	{ path: '**', redirectTo: '' }
];
