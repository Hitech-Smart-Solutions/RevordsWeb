import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingBusinessComponent } from './UpcomingBusiness.components';

describe('UpcomingBusinessComponent', () => {
  let component: UpcomingBusinessComponent;
  let fixture: ComponentFixture<UpcomingBusinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpcomingBusinessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpcomingBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
