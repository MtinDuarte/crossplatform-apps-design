import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceManagerPage } from './device-manager.page';

describe('DeviceManagerPage', () => {
  let component: DeviceManagerPage;
  let fixture: ComponentFixture<DeviceManagerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceManagerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
