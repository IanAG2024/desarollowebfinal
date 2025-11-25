
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { FacadeService } from 'src/app/services/facade.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import {Sort, MatSort} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { AlumnosService } from '../../services/alumnos.service';


@Component({
  selector: 'app-alumnos-screen',
  templateUrl: './alumnos-screen.component.html',
  styleUrls: ['./alumnos-screen.component.scss']
})
export class AlumnosScreenComponent {

  public name_user: string = "";
    public rol: string = "";
    public token: string = "";
    public lista_alumnos: any[] = [];
    public viewLoaded = false;




    sortedData: DatosUsuario[];

    //Para la tabla
    displayedColumns: string[] = ['matricula', 'nombre', 'email', 'fecha_nacimiento', 'telefono', 'rfc', 'ocupacion', 'edad', 'editar', 'eliminar'];
    dataSource = new MatTableDataSource<DatosUsuario>();
;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;




    ngAfterViewInit() {

      this.obtenerAlumnos();


        //Obtener alumnos

    }

    constructor(
      public facadeService: FacadeService,
      public alumnosService: AlumnosService,
      private router: Router,
      public dialog: MatDialog,

    ) {  this.sortedData = this.lista_alumnos.slice();

    }

    ngOnInit(): void {
      this.name_user = this.facadeService.getUserCompleteName();
      this.rol = this.facadeService.getUserGroup();
      //Validar que haya inicio de sesión
      //Obtengo el token del login
      this.token = this.facadeService.getSessionToken();
      console.log("Token: ", this.token);
      if(this.token == ""){
        this.router.navigate(["/"]);
      }


    }

    // Consumimos el servicio para obtener los maestros
    //Obtener maestros
    public obtenerAlumnos() {
      this.alumnosService.obtenerListaAlumnos().subscribe(
        (response) => {
          this.lista_alumnos = response;
          console.log("Lista users: ", this.lista_alumnos);
          if (this.lista_alumnos.length > 0) {
            //Agregar datos del nombre e email
            this.lista_alumnos.forEach(usuario => {
              usuario.first_name = usuario.user.first_name;
              usuario.last_name = usuario.user.last_name;
              usuario.email = usuario.user.email;
            });
            console.log("Alumnos: ", this.lista_alumnos);

          this.dataSource.data = this.lista_alumnos
            
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;



            this.dataSource.filterPredicate = (data, filter) => {
            const fullName = (data.first_name + ' ' + data.last_name).toLowerCase();
            filter = filter.trim().toLowerCase();


            return (
              data.first_name.toLowerCase().includes(filter) ||
              data.last_name.toLowerCase().includes(filter) ||
              fullName.includes(filter)
            );
    };
          }
        }, (error) => {
          console.error("Error al obtener la lista de Alumnos: ", error);
          alert("No se pudo obtener la lista de Alumnos");
        }
      );
    }


    public goEditar(idUser: number) {
      this.router.navigate(["registro-usuarios/maestros/" + idUser]);
    }

    public delete(idUser: number) {
      // Administrador puede eliminar cualquier maestro
      // Maestro solo puede eliminar su propio registro
      const userId = Number(this.facadeService.getUserId());
      if (this.rol === 'administrador' || (this.rol === 'maestro' && userId === idUser)) {
        //Si es administrador o es maestro, es decir, cumple la condición, se puede eliminar
        const dialogRef = this.dialog.open(EliminarUserModalComponent,{
          data: {id: userId, rol: 'maestro'}, //Se pasan valores a través del componente
          height: '288px',
          width: '328px',
        });

      dialogRef.afterClosed().subscribe(result => {
        if(result.isDelete){
          console.log("Maestro eliminado");
          alert("Maestro eliminado correctamente.");
          //Recargar página
          window.location.reload();
        }else{
          alert("Maestro no se ha podido eliminar.");
          console.log("No se eliminó el maestro");
        }
      });
      }else{
        alert("No tienes permisos para eliminar este maestro.");
      }
    }

    sortData(sort: Sort) {
      const data = this.lista_alumnos.slice();
      if (!sort.active || sort.direction === '') {
        this.dataSource.data = data;
        return;
      }

      this.dataSource.data = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'matricula':
            return compare(a.matricula, b.matricula, isAsc);
          case 'nombre':
            return compare(a.first_name + a.last_name, b.first_name + b.last_name, isAsc);
          default:
            return 0;
        }
      });
    }

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);

}



//Esto va fuera de la llave que cierra la clase
export interface DatosUsuario {

      matricula: '',
      first_name: '',
      last_name: '',
      email: '',

      curp: '',
      rfc: '',
      edad: '',
      telefono: '',
      ocupacion: '',

}

