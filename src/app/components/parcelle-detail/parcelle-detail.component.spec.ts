import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelleDetailComponent } from './parcelle-detail.component';

describe('ParcelleDetailComponent', () => {
  let component: ParcelleDetailComponent;
  let fixture: ComponentFixture<ParcelleDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParcelleDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParcelleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
