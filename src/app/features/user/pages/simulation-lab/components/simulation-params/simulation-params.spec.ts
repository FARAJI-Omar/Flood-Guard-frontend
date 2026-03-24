import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationParams } from './simulation-params';

describe('SimulationParams', () => {
  let component: SimulationParams;
  let fixture: ComponentFixture<SimulationParams>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulationParams]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimulationParams);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
