import { Component, Inject, Optional, OnInit } from '@angular/core';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from '../../../../services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { StatusCodes } from '../../../../enums/common/common';
import { AddOrEditService } from '../add-or-edit.service';

interface Function {
  value: string;
  viewValue: string;
}
interface Type {
  value: string;
  viewValue: string;
}
interface CostType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-cost-center',
  templateUrl: './cost-center.component.html',
  styleUrls: ['./cost-center.component.scss']
})

export class CostCenterComponent implements OnInit {
  modelFormData: FormGroup;
  formData: any;
  employeesList: any;

  Function: Function[] =
    [
      { value: 'Manufacturing Operations', viewValue: 'Manufacturing Operations' },
      { value: 'Administration', viewValue: 'Administration' },
      { value: 'Personal', viewValue: 'Personal' },
      { value: 'Sales', viewValue: 'Sales' },
      { value: 'Distribution', viewValue: 'Distribution' },
      { value: 'Material Management', viewValue: 'Material Management' },
      { value: 'Research and Development', viewValue: 'Research and Development' }
    ];
  Type: Type[] =
    [
      { value: 'Process', viewValue: 'Process' },
      { value: 'Operation ', viewValue: 'Operation ' },
      { value: 'Service', viewValue: 'Service' },
      { value: 'Sales', viewValue: 'Sales' }
    ];
  costType: CostType[] =
    [
      { value: 'Manufacturing Cost', viewValue: 'Manufacturing Cost' },
      { value: 'Non-Manufacturing ', viewValue: 'Non-Manufacturing ' },
      { value: 'Non Cost', viewValue: 'Non Cost' },
      { value: 'Capital Expenditure', viewValue: 'Capital Expenditure' }
    ];
    cotList: any;
    UomList: any;
    deptList: any;
    objectum: any;

  constructor(private commonService: CommonService,
    private apiService: ApiService,
    private addOrEditService: AddOrEditService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CostCenterComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      objectType: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(4)]],
      number: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      shortName: [null],
      longName: [null],
      functions: [null],
      type: [null],
      quantity: [null],
      department: [null],
      uom: [null],
      fromDate: [null],
      responsiblePerson: [null],
      costType: [null],

    });

    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['number'].disable();
    }

  }

  ngOnInit() {
    
    this.getcostofobjecttypeData();
  }
  getobjectNumberData() {
    const getobjectlist = String.Join('/', this.apiConfigService.getttingobjectNumbers,
      this.modelFormData.get('objectType').value);
    this.apiService.apiGetRequest(getobjectlist)
      .subscribe(
        response => {
          const res = response.body;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {

              this.objectum = res.response['objectno'];
              this.modelFormData.patchValue({
                number: this.objectum
              });
            }
          }
          this.spinner.hide();
        });
  }
  getcostofobjecttypeData() {
    const getcostofobjecttypeUrl = String.Join('/', this.apiConfigService.getcostofobjectList);
    this.apiService.apiGetRequest(getcostofobjecttypeUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.cotList = res.response['cotList'];
              //this.cotList = res.response['cotList'].filter(resp => resp.usage == 'Cost unit');
            }
          }
          this.getEmployeesList();
        });
  }
  getEmployeesList() {
    const getEmployeeList = String.Join('/', this.apiConfigService.getEmployeeList);
    this.apiService.apiGetRequest(getEmployeeList)
      .subscribe(
        response => {
          const res = response.body;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.employeesList = res.response['emplist'];
            }
          }
          this.getuomTypeData();
        });
  }
  getuomTypeData() {
    const getuomTypeUrl = String.Join('/', this.apiConfigService.getuomList);
    this.apiService.apiGetRequest(getuomTypeUrl)
      .subscribe(
        response => {
          const res = response.body;
          console.log(res);
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.UomList = res.response['UomList'];
            }
          }
          this.getDepartmentData();
        });
  }
  getDepartmentData() {
    const getdepteUrl = String.Join('/', this.apiConfigService.getdepartmentList);
    this.apiService.apiGetRequest(getdepteUrl)
      .subscribe(
        response => {
          const res = response.body;
          console.log(res);
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.deptList = res.response['deptList'];
            }
          }
          this.spinner.hide();
        });
  }

  approveOrReject(event) {
    //debugger;
    if (event) {
      this.modelFormData.patchValue({
        costType: "Accept",
        reject: null
      });
    } else {
      this.modelFormData.patchValue({
        costType: null,
        reject: "Reject"
      });
    }
  }
  get formControls() { return this.modelFormData.controls; }

  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    this.modelFormData.controls['number'].enable();
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
    if (this.formData.action == 'Edit') {
      this.modelFormData.controls['number'].disable();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
