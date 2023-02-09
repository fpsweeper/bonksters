import { Component, OnInit, inject, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';
@Component({
  selector: 'app-custom-snack',
  templateUrl: './custom-snack.component.html',
  styleUrls: ['./custom-snack.component.scss']
})
export class CustomSnackComponent implements OnInit {

  snackBarRef = inject(MatSnackBarRef);
  
  constructor(@Inject(MAT_SNACK_BAR_DATA) public msg: any) { }

  ngOnInit(): void {
  }

}
