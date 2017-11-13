import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FtCdkTableComponent } from './ft-cdk-table.component';

describe('FtCdkTableComponent', () => {
  let component: FtCdkTableComponent;
  let fixture: ComponentFixture<FtCdkTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FtCdkTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FtCdkTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
