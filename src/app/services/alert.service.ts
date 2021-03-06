import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  public appDrawer: any;

  constructor(
    private snackBar: MatSnackBar
    ) { }


  openSnackBar(message: string, action: string, style) {
    this.snackBar.open(message, null, {
      duration: 6000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass : [style]
    });
  }

  public closeNav() {
    this.appDrawer.close();
  }

  public openNav() {
    this.appDrawer.open();
  }

}
