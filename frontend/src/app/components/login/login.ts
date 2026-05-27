import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  userId = '';
  password = '';
  role: 'General User' | 'Admin' = 'General User';
  
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // If already logged in, send directly to dashboard
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (!this.userId.trim() || !this.password.trim()) {
      this.errorMessage = 'Please fill out both the User ID and Password fields.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Introduce a short artificial delay on login for styling effect
    setTimeout(() => {
      this.authService.login(this.userId, this.password, this.role).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.message || 'Login failed. Please check credentials and connection.';
        }
      });
    }, 800); // 800ms of sweet fluid transition time
  }
}
