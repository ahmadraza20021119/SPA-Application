import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { RecordService, RecordData } from '../../services/record.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  // Session variables
  currentUser: User | null = null;
  isAdmin = false;

  // Active view tab (Admins can toggle between record viewing and directory management)
  activeTab: 'records' | 'admin' = 'records';

  // API latency selector options (in milliseconds)
  selectedDelay = 0; // Default to 0ms (Instantaneous) for fast initial loading!
  
  // Data grids and loads
  records: RecordData[] = [];
  users: User[] = [];
  
  // Loading indicators
  recordsLoading = false;
  usersLoading = false;
  
  // Feedback banners
  recordsError = '';
  usersError = '';

  // Admin User CRUD state
  showUserForm = false;
  isEditing = false;
  
  // CRUD Form fields
  formUserId = '';
  formPassword = '';
  formName = '';
  formEmail = '';
  formRole: 'Admin' | 'General User' = 'General User';
  
  formError = '';
  formSuccess = '';

  constructor(
    private authService: AuthService,
    private recordService: RecordService,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Check if session exists
    this.currentUser = this.authService.currentUserValue;
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.isAdmin = this.authService.isAdmin;
    
    // Initial fetch of records and users (if Admin)
    this.loadRecords();
    if (this.isAdmin) {
      this.loadUsers();
    }
  }

  /**
   * Refreshes the user records using the specified delay parameter.
   */
  loadRecords(): void {
    console.log('[DASHBOARD] loadRecords called. selectedDelay =', this.selectedDelay);
    this.recordsLoading = true;
    this.recordsError = '';
    this.records = [];

    this.recordService.getRecords(this.selectedDelay).subscribe({
      next: (data) => {
        console.log('[DASHBOARD] loadRecords SUCCESS:', data);
        this.records = data;
        this.recordsLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[DASHBOARD] loadRecords ERROR:', err);
        this.recordsError = err.message || 'An unexpected error occurred while fetching records.';
        this.recordsLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Refreshes the system user list (Admin only) using the specified delay parameter.
   */
  loadUsers(): void {
    console.log('[DASHBOARD] loadUsers called. selectedDelay =', this.selectedDelay);
    this.usersLoading = true;
    this.usersError = '';
    this.users = [];

    this.userService.getUsers(this.selectedDelay).subscribe({
      next: (data) => {
        console.log('[DASHBOARD] loadUsers SUCCESS:', data);
        this.users = data;
        this.usersLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[DASHBOARD] loadUsers ERROR:', err);
        this.usersError = err.message || 'An unexpected error occurred while fetching users.';
        this.usersLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Triggers logout action in auth service and redirects to login view.
   */
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // --- ADMIN CRUD ACTIONS ---

  /**
   * Opens form initialized for User Creation.
   */
  openAddUserForm(): void {
    this.resetForm();
    this.isEditing = false;
    this.showUserForm = true;
  }

  /**
   * Opens form pre-populated for User Update.
   */
  openEditUserForm(user: User): void {
    this.resetForm();
    this.isEditing = true;
    this.formUserId = user.id;
    this.formPassword = ''; // Leave password blank, fill only if modifying
    this.formName = user.name;
    this.formEmail = user.email;
    this.formRole = user.role;
    
    this.showUserForm = true;
    
    // Smooth scroll down to the form
    setTimeout(() => {
      document.getElementById('crud-form-anchor')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  /**
   * Submits forms for User creation or modification.
   */
  saveUser(): void {
    this.formError = '';
    this.formSuccess = '';

    // Validate inputs
    if (!this.formUserId.trim() || !this.formName.trim() || !this.formEmail.trim() || !this.formRole) {
      this.formError = 'Please complete all required fields.';
      return;
    }

    if (!this.isEditing && !this.formPassword.trim()) {
      this.formError = 'A password is required for new users.';
      return;
    }

    const userData: any = {
      id: this.formUserId.trim(),
      name: this.formName.trim(),
      email: this.formEmail.trim(),
      role: this.formRole
    };

    if (this.formPassword.trim()) {
      userData.password = this.formPassword.trim();
    }

    if (this.isEditing) {
      // Execute UPDATE operation
      this.userService.updateUser(this.formUserId, userData).subscribe({
        next: () => {
          this.formSuccess = `User '${this.formUserId}' updated successfully.`;
          this.loadUsers();
          this.cdr.detectChanges();
          setTimeout(() => { this.closeUserForm(); this.cdr.detectChanges(); }, 1500);
        },
        error: (err) => {
          this.formError = err.message || 'Failed to update user records.';
          this.cdr.detectChanges();
        }
      });
    } else {
      // Execute CREATE operation
      this.userService.createUser(userData).subscribe({
        next: () => {
          this.formSuccess = `User '${this.formUserId}' created successfully.`;
          this.loadUsers();
          this.cdr.detectChanges();
          setTimeout(() => { this.closeUserForm(); this.cdr.detectChanges(); }, 1500);
        },
        error: (err) => {
          this.formError = err.message || 'Failed to create new user.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  /**
   * Invokes delete request for a specified user.
   */
  deleteUser(id: string): void {
    if (confirm(`Are you absolutely sure you want to delete the user account '${id}'?`)) {
      this.userService.deleteUser(id).subscribe({
        next: (res) => {
          alert(res.message || 'User deleted successfully.');
          this.loadUsers();
          this.cdr.detectChanges();
        },
        error: (err) => {
          alert(err.message || 'Deletion failed.');
        }
      });
    }
  }

  /**
   * Resets form values and alerts.
   */
  private resetForm(): void {
    this.formUserId = '';
    this.formPassword = '';
    this.formName = '';
    this.formEmail = '';
    this.formRole = 'General User';
    this.formError = '';
    this.formSuccess = '';
  }

  /**
   * Closes active form panels.
   */
  closeUserForm(): void {
    this.showUserForm = false;
    this.resetForm();
  }
}
