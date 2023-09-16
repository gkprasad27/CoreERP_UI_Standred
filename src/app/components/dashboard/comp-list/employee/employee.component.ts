import { Component, Inject, Optional, OnInit } from '@angular/core';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../../../services/api.service';

import { AlertService } from '../../../../services/alert.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { SnackBar, StatusCodes } from '../../../../enums/common/common';
import { CommonService } from 'src/app/services/common.service';
import { AddOrEditService } from '../add-or-edit.service';
import { Static } from 'src/app/enums/common/static';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {


  modelFormData: FormGroup;
  isSubmitted = false;
  formData: any;
  companyList: any;
  companiesList: any;
  branchesList: any;
  bankList: any;
  employeesList: any;
  designationsList: any;


  constructor(
    private apiService: ApiService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    private addOrEditService: AddOrEditService) {

    this.modelFormData = this.formBuilder.group({
      branchId: [''],
      employeeId: [0],
      employeeCode: ['', Validators.required],
      companyCode: [''],
      branchCode: [''],
      designationId: [''],
      employeeName: [''],
      dob: [''],
      maritalStatus: [''],
      gender: [''],
      qualification: [''],
      address: [''],
      phoneNumber: [''],
      mobileNumber: [''],
      email: [''],
      joiningDate: [''],
      releavingDate: [''], //
      isActive: [''],
      narration: [''],
      bloodGroup: [''],
      passportNo: [''],
      accessCardNumber: [''], //
      bankName: [''],
      bankAccountNumber: [''],
      employeeType: [''], //
      iFSCCode: [''], //
      panNumber: [''],
      aadharNumber: [''],
      recomendedBy: [''],
      reportedBy: [''],
      approvedBy: [''],

      pfNumber: [''],
      esiNumber: [''],

    });

    this.formData = { ...this.addOrEditService.editData };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['employeeCode'].disable();
      // this.modelFormData.controls['employeeId'].disable();
    }

  }

  ngOnInit() {
    this.getcompanyData();
    this.getbranchList();
    this.getEmployeesList();
    this.getBankData();
    this.getDesignationsList();
  }

  getcompanyData() {
    const getompanyUrl = String.Join('/', this.apiConfigService.getCompanyList);
    this.apiService.apiGetRequest(getompanyUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.companiesList = res.response['companiesList'];
            }
          }
        });
  }

  getbranchList() {
    const getbranchList = String.Join('/', this.apiConfigService.getBranchesList);
    this.apiService.apiGetRequest(getbranchList)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.branchesList = res.response['branchesList'];
            }
          }
        });
  }


  getBankData() {
    const getbankUrl = String.Join('/', this.apiConfigService.getBankMastersList);
    this.apiService.apiGetRequest(getbankUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.bankList = res.response['bankList'];
            }
          }
          this.spinner.hide();
        });
  }

  getEmployeesList() {
    const getEmployeeList = String.Join('/', this.apiConfigService.getEmployeeList);
    this.apiService.apiGetRequest(getEmployeeList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.employeesList = res.response['emplist'];
            }
          }
          this.spinner.hide();
        });
  }

  getDesignationsList() {
    const getDesignationsList = String.Join('/', this.apiConfigService.getDesignationsList);
    this.apiService.apiGetRequest(getDesignationsList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.designationsList = res.response['designationsList'];
            }
          }
          this.spinner.hide();
        });
  }

  showErrorAlert(caption: string, message: string) {
    // this.alertService.openSnackBar(caption, message);
  }

  get formControls() { return this.modelFormData.controls; }


  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    this.formData.item = this.modelFormData.value;
    this.modelFormData.controls['employeeCode'].enable();
    // this.modelFormData.controls['employeeId'].enable();
    if (this.modelFormData.value.employeeId) {
      this.update();
      return
    }
    const addCashBank = String.Join('/', this.apiConfigService.registerEmployee);
    this.apiService.apiPostRequest(addCashBank, this.modelFormData.value).subscribe(
      response => {
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Employee created Successfully..', Static.Close, SnackBar.success);
            this.router.navigate(['/dashboard/master/employee']);
          }
          this.spinner.hide();
        }
      });
  }

  update() {
    const addCashBank = String.Join('/', this.apiConfigService.updateEmployee);
    this.apiService.apiUpdateRequest(addCashBank, this.modelFormData.value).subscribe(
      response => {
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Employee created Successfully..', Static.Close, SnackBar.success);
            this.router.navigate(['/dashboard/master/employee']);
          }
          this.spinner.hide();
        }
      });
  }

  cancel() {
    this.router.navigate(['dashboard/master/employee'])
  }

}

