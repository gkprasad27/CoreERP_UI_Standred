import { Component, Inject, Optional, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isNullOrUndefined } from 'util';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StatusCodes } from '../../../../enums/common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { ApiService } from '../../../../services/api.service';
import { String } from 'typescript-string-operations';
import { AddOrEditService } from '../add-or-edit.service';

@Component({
  selector: 'app-AssignmentChartAccounttoCompany',
  templateUrl: './AssignmentChartAccounttoCompany.component.html',
  styleUrls: ['./AssignmentChartAccounttoCompany.component.scss']
})

export class AssignmentChartAccounttoCompanyComponent implements OnInit {

  modelFormData: FormGroup;
  formData: any;  
  operationCoaList: any;  
  groupCoaList: any;  
  companyList: any;

  constructor(
    private addOrEditService: AddOrEditService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AssignmentChartAccounttoCompanyComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      code: [0],
      operationCoa: [null],
      groupCoa: [null],
      company: [null]      
    });

    this.formData = { ...data };
    if (!isNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['code'].disable();
    }
  }

  ngOnInit() {
    this.getcompanyData();
    this.getchartofAccountData();
  }
  getcompanyData() {
    const getCompanyUrl = String.Join('/', this.apiConfigService.getCompanysList);
    this.apiService.apiGetRequest(getCompanyUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              console.log(res);
              this.companyList = res.response['companiesList'];
            }
          }
          this.spinner.hide();
        });
  }

  getchartofAccountData() {
    const getchartofAccountUrl = String.Join('/', this.apiConfigService.getChartOfAccountList);
    this.apiService.apiGetRequest(getchartofAccountUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              this.operationCoaList = res.response['coaList'].filter(res => res.type == 'Operational');
              this.groupCoaList = res.response['coaList'].filter(res => res.type == 'Consolidated');
            }
          }
          this.spinner.hide();
        });
  }

  get formControls() { return this.modelFormData.controls; }

  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    this.modelFormData.controls['code'].enable();
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
    if (this.formData.action == 'Edit') {
      this.modelFormData.controls['code'].disable();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
