import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { UsersComponent } from './users.component';
import { UserService } from '../../service/user.service';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { IconDirective } from '@coreui/icons-angular';
import { By } from '@angular/platform-browser';
import { User } from '../../models/User';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  const mockUsers: User[] = [
    { id: '1', userName: 'user1', normalizedUserName: '', email: 'user1@mail.com', normalizedEmail: '', emailConfirmed: true, passwordHash: '', securityStamp: '', concurrencyStamp: '', phoneNumber: '123', phoneNumberConfirmed: true, twoFactorEnabled: false, lockoutEnd: null, lockoutEnabled: false, accessFailedCount: 0, role: 'Administrator' },
    { id: '2', userName: 'user2', normalizedUserName: '', email: 'user2@mail.com', normalizedEmail: '', emailConfirmed: false, passwordHash: '', securityStamp: '', concurrencyStamp: '', phoneNumber: null, phoneNumberConfirmed: false, twoFactorEnabled: false, lockoutEnd: null, lockoutEnabled: true, accessFailedCount: 1, role: 'Vendas' }
  ];
  const mockRoles = ['Administrator', 'Vendas'];

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers', 'getRoles', 'registerUser', 'updateUser', 'deleteUser']);
    await TestBed.configureTestingModule({
      imports: [UsersComponent, ReactiveFormsModule, IconDirective, HttpClientTestingModule],
      providers: [
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
  });

  it('deve listar usuários', () => {
    userServiceSpy.getUsers.and.returnValue(of(mockUsers));
    userServiceSpy.getRoles.and.returnValue(of(mockRoles));
    fixture.detectChanges();
    expect(component.users.length).toBe(2);
    expect(component.roles.length).toBe(2);
  });

  it('deve abrir e fechar modal de cadastro', () => {
    component.openRegisterModal();
    expect(component.showRegisterModal).toBeTrue();
    component.closeRegisterModal();
    expect(component.showRegisterModal).toBeFalse();
  });

  it('deve validar formulário de cadastro', () => {
    component.openRegisterModal();
    component.registerForm.setValue({ email: 'invalid', password: '123', repeatPassword: '1234', role: '', phoneNumber: '' });
    expect(component.registerForm.invalid).toBeTrue();
    component.registerForm.setValue({ email: 'valid@mail.com', password: 'Senha@123', repeatPassword: 'Senha@123', role: 'Administrator', phoneNumber: '' });
    expect(component.registerForm.valid).toBeTrue();
  });

  /*
  it('deve cadastrar usuário', fakeAsync(() => {
    userServiceSpy.registerUser.and.returnValue(of({ text: 'Usuário cadastrado com sucesso.' }));
    userServiceSpy.getUsers.and.returnValue(of(mockUsers));
    userServiceSpy.getRoles.and.returnValue(of(mockRoles));
    component.openRegisterModal();
    component.registerForm.setValue({ email: 'valid@mail.com', password: 'Senha@123', repeatPassword: 'Senha@123', role: 'Administrator', phoneNumber: '' });
    component.registerUser();
    expect(component.registerLoading).toBeTrue();
    tick();
    expect(component.registerLoading).toBeFalse();
    expect(component.registerSuccess).toContain('Usuário cadastrado');
    // Garantir que as próximas chamadas também retornem observable
    userServiceSpy.getUsers.and.returnValue(of(mockUsers));
    userServiceSpy.getRoles.and.returnValue(of(mockRoles));
    tick(4000); // aguarda timeout de fechar modal
    expect(component.showRegisterModal).toBeFalse();
    flush();
  }));

  it('deve editar usuário', fakeAsync(() => {
    userServiceSpy.updateUser.and.returnValue(of({ text: 'Usuário alterado com sucesso.' }));
    userServiceSpy.getUsers.and.returnValue(of(mockUsers));
    userServiceSpy.getRoles.and.returnValue(of(mockRoles));
    component.openEditUser(mockUsers[0]);
    component.registerForm.patchValue({ email: 'edit@mail.com', role: 'Vendas', phoneNumber: '999' });
    component.registerUser();
    expect(component.registerLoading).toBeTrue();
    tick();
    fixture.detectChanges();
    // Garantir que as próximas chamadas também retornem observable
    userServiceSpy.getUsers.and.returnValue(of(mockUsers));
    userServiceSpy.getRoles.and.returnValue(of(mockRoles));
    tick(0); // Garante flush de microtasks e atualização do modal
    expect(component.registerLoading).toBeFalse();
    expect(component.registerSuccess).toContain('Usuário alterado');
    expect(component.showRegisterModal).toBeFalse();
    flush();
  }));
  

  it('deve excluir usuário', fakeAsync(() => {
    userServiceSpy.deleteUser.and.returnValue(of({ text: 'Usuário excluído com sucesso.' }));
    userServiceSpy.getUsers.and.returnValue(of(mockUsers));
    component.openDeleteModal(mockUsers[0]);
    component.confirmDeleteUser();
    expect(component.deleteLoading).toBeTrue();
    tick();
    expect(component.deleteLoading).toBeFalse();
    expect(component.deleteSuccess).toContain('Usuário excluído');
    // Garantir que as próximas chamadas também retornem observable
    userServiceSpy.getUsers.and.returnValue(of(mockUsers));
    userServiceSpy.getRoles.and.returnValue(of(mockRoles));
    tick(2000); // aguarda timeout de fechar modal
    fixture.detectChanges();
    expect(component.showDeleteModal).toBeFalse();
    flush();
  }));
*/
  it('deve tratar erro ao cadastrar usuário', fakeAsync(() => {
    userServiceSpy.registerUser.and.returnValue(throwError(() => ({ error: { text: 'Erro ao cadastrar' } })));
    component.openRegisterModal();
    component.registerForm.setValue({ email: 'valid@mail.com', password: 'Senha@123', repeatPassword: 'Senha@123', role: 'Administrator', phoneNumber: '' });
    component.registerUser();
    tick();
    expect(component.registerError).toContain('Erro ao cadastrar');
    flush();
  }));

  it('deve tratar erro ao editar usuário', fakeAsync(() => {
    userServiceSpy.updateUser.and.returnValue(throwError(() => ({ error: { text: 'Erro ao alterar' } })));
    component.openEditUser(mockUsers[0]);
    component.registerForm.patchValue({ email: 'edit@mail.com', role: 'Vendas', phoneNumber: '999' });
    component.registerUser();
    tick();
    expect(component.registerError).toContain('Erro ao alterar');
    flush();
  }));

  it('deve tratar erro ao excluir usuário', fakeAsync(() => {
    userServiceSpy.deleteUser.and.returnValue(throwError(() => ({ error: { text: 'Erro ao excluir' } })));
    component.openDeleteModal(mockUsers[0]);
    component.confirmDeleteUser();
    tick();
    expect(component.deleteError).toContain('Erro ao excluir');
    flush();
  }));

  it('deve abrir e fechar modal de detalhes', () => {
    component.openUserModal(mockUsers[0]);
    expect(component.showModal).toBeTrue();
    component.closeModal();
    expect(component.showModal).toBeFalse();
  });
}); 