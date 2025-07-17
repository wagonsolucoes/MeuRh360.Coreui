import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardGroupComponent,
  ColComponent,
  ContainerComponent,
  FormControlDirective,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent
} from '@coreui/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    ContainerComponent, RowComponent, ColComponent, CardGroupComponent, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle, ReactiveFormsModule, NgIf
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['wagner.leandro@wagonsolucoes.com.br', Validators.required],
      password: ['R3c31t4@', Validators.required]
    });
  }

  submit() {
    debugger;
    this.error = null;
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.auth.login(this.loginForm.value).subscribe({
      next: () => {
        debugger;
        this.loading = false;
        this.router.navigate(['/users']);
      },
      error: (err) => {
        debugger;
        this.loading = false;
        this.error = 'Usuário ou senha inválidos';
      }
    });
  }
}
