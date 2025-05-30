import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditUserComponent } from './edit-user.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('EditUserComponent', () => {
  let component: EditUserComponent;
  let fixture: ComponentFixture<EditUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
        EditUserComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with required fields', () => {
    expect(component.userForm.get('name')).toBeTruthy();
    expect(component.userForm.get('email')).toBeTruthy();
    expect(component.userForm.get('password')).toBeTruthy();
    expect(component.userForm.get('confirmPassword')).toBeTruthy();
    expect(component.userForm.get('phone')).toBeTruthy();
    expect(component.userForm.get('roles')).toBeTruthy();
    expect(component.userForm.get('isActive')).toBeTruthy();
  });

  it('should validate password match', () => {
    const form = component.userForm;
    form.get('password')?.setValue('password123');
    form.get('confirmPassword')?.setValue('password123');
    expect(form.errors?.['passwordMismatch']).toBeFalsy();

    form.get('confirmPassword')?.setValue('password456');
    expect(form.errors?.['passwordMismatch']).toBeTruthy();
  });

  it('should add and remove branches', () => {
    expect(component.branches.length).toBe(0);
    component.addBranch();
    expect(component.branches.length).toBe(1);
    component.removeBranch(0);
    expect(component.branches.length).toBe(0);
  });
});
