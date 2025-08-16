import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceManager } from './device-manager';

describe('DeviceManager', () => {
  let component: DeviceManager;
  let fixture: ComponentFixture<DeviceManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceManager]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceManager);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
