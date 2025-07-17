import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { User } from '../../models/User';
import { NgIf, NgFor, JsonPipe, NgStyle } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserRegister } from '../../models/UserRegister';
import { IconDirective } from '@coreui/icons-angular';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './users.component.html',
  imports: [NgIf, NgFor, ReactiveFormsModule, IconDirective, JsonPipe, NgStyle]
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading = true;
  error: string | null = null;
  registerForm: FormGroup;
  registerLoading = false;
  registerError: string | null = null;
  registerSuccess: string | null = null;
  selectedUser: User | null = null;
  showModal = false;
  roles: string[] = [];
  showRegisterModal = false;
  isEditMode = false;
  showDeleteModal = false;
  userToDelete: User | null = null;
  deleteLoading = false;
  deleteError: string | null = null;
  deleteSuccess: string | null = null;

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^([a-zA-Z0-9_\.-]+)@([a-zA-Z0-9\.-]+)\.([a-zA-Z]{2,6})$/)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])/)]],
      repeatPassword: ['', Validators.required],
      role: ['', Validators.required],
      phoneNumber: ['']
    }, { validators: this.passwordsMatchValidator });
  }

  ngOnInit() {
    this.loadUsers();
    this.userService.getRoles().subscribe({
      next: roles => this.roles = roles,
      error: () => this.roles = []
    });
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: users => {
        this.users = users;
        this.loading = false;
      },
      error: err => {
        this.error = 'Erro ao carregar usuários';
        this.loading = false;
      }
    });
  }

  openRegisterModal(user?: User) {
    this.registerForm.reset();
    this.registerForm.markAsPristine();
    this.registerForm.markAsUntouched();
    this.registerError = null;
    this.registerSuccess = null;
    if (user) {
      this.isEditMode = true;
      this.selectedUser = user;
      this.registerForm.patchValue({
        email: user.email,
        password: '',
        repeatPassword: '',
        role: user.role || '',
        phoneNumber: user.phoneNumber || ''
      });
      this.registerForm.get('password')?.clearValidators();
      this.registerForm.get('repeatPassword')?.clearValidators();
      this.registerForm.get('password')?.updateValueAndValidity();
      this.registerForm.get('repeatPassword')?.updateValueAndValidity();
    } else {
      this.isEditMode = false;
      this.selectedUser = null;
      this.registerForm.get('password')?.setValidators([Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])/)]);
      this.registerForm.get('repeatPassword')?.setValidators([Validators.required]);
      this.registerForm.get('password')?.updateValueAndValidity();
      this.registerForm.get('repeatPassword')?.updateValueAndValidity();
    }
    this.showRegisterModal = true;
  }
  closeRegisterModal() {
    this.showRegisterModal = false;
    if (this.isEditMode) {
      this.loadUsers();
    }
  }

  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const repeatPassword = group.get('repeatPassword')?.value;
    return password === repeatPassword ? null : { passwordsMismatch: true };
  }

  registerUser() {
    this.registerError = null;
    this.registerSuccess = null;
    if (this.registerForm.invalid) return;
    this.registerLoading = true;
    if (this.isEditMode && this.selectedUser) {
      const data = {
        id: this.selectedUser.id,
        email: this.registerForm.value.email,
        phoneNumber: this.registerForm.value.phoneNumber || '',
        role: this.registerForm.value.role
      };
      this.userService.updateUser(this.selectedUser.id, data).subscribe({
        next: (res: any) => {
          this.registerLoading = false;
          this.registerSuccess = res?.text || res?.message || (this.isEditMode ? 'Usuário alterado com sucesso!' : 'Usuário cadastrado com sucesso!');
          this.registerForm.reset();
          this.loadUsers();
          if (this.isEditMode) {
            this.closeRegisterModal();
          } else {
            setTimeout(() => this.closeRegisterModal(), 4000);
          }
        },
        error: err => {
          this.registerLoading = false;
          this.registerError = err?.error?.text || err?.error?.message || (err?.error ? JSON.stringify(err.error) : 'Erro ao alterar usuário');
        }
      });
    } else {
      const data: UserRegister = {
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        role: this.registerForm.value.role
      };
      this.userService.registerUser(data).subscribe({
        next: () => {
          this.registerLoading = false;
          this.registerSuccess = 'Usuário cadastrado com sucesso!';
          this.registerForm.reset();
          this.loadUsers();
          this.closeRegisterModal();
        },
        error: err => {
          this.registerLoading = false;
          this.registerError = 'Erro ao cadastrar usuário';
        }
      });
    }
  }

  openUserModal(user: User) {
    this.selectedUser = user;
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
    this.selectedUser = null;
  }

  openEditUser(user: User) {
    this.openRegisterModal(user);
  }

  openDeleteModal(user: User) {
    this.userToDelete = user;
    this.deleteError = null;
    this.deleteSuccess = null;
    this.showDeleteModal = true;
  }
  closeDeleteModal() {
    this.showDeleteModal = false;
    this.userToDelete = null;
    this.loadUsers();
  }
  confirmDeleteUser() {
    if (!this.userToDelete) return;
    this.deleteLoading = true;
    this.userService.deleteUser(this.userToDelete.id).subscribe({
      next: (res: any) => {
        this.deleteLoading = false;
        this.deleteSuccess = res?.text || res?.message || 'Usuário excluído com sucesso!';
        this.loadUsers();
        setTimeout(() => this.closeDeleteModal(), 2000);
      },
      error: err => {
        this.deleteLoading = false;
        this.deleteError = err?.error?.text || err?.error?.message || (err?.error ? JSON.stringify(err.error) : 'Erro ao excluir usuário');
      }
    });
  }
} 