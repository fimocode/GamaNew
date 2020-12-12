import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGamaFileComponent } from './dialog-gama-file.component';

describe('DialogGamaFileComponent', () => {
  let component: DialogGamaFileComponent;
  let fixture: ComponentFixture<DialogGamaFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogGamaFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogGamaFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
