import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BesoinListComponent } from './besoin-list.component';

describe('BesoinListComponent', () => {
  let component: BesoinListComponent;
  let fixture: ComponentFixture<BesoinListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BesoinListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BesoinListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
