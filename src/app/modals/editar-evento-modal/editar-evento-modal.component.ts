import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventosService } from 'src/app/services/eventos.service';

@Component({
  selector: 'app-editar-evento-modal',
  templateUrl: './editar-evento-modal.component.html',
  styleUrls: ['./editar-evento-modal.component.scss']
})
export class EditarEventoModalComponent {

  constructor(
      private eventosService: EventosService,
      private dialogRef: MatDialogRef<EditarEventoModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit(): void {
    }

    public cerrar_modal() {
      this.dialogRef.close({ isDelete: false });
    }
    public confirmar() {
    this.dialogRef.close({ isConfirmed: true });
  }

}
