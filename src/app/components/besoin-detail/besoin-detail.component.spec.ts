import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BesoinDetailComponent } from './besoin-detail.component';

describe('BesoinDetailComponent', () => {
  let component: BesoinDetailComponent;
  let fixture: ComponentFixture<BesoinDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BesoinDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BesoinDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
