import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { EventosService } from 'src/app/services/eventos.service';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { EditarEventoModalComponent } from 'src/app/modals/editar-evento-modal/editar-evento-modal.component';
@Component({
  selector: 'app-registro-eventos-admin',
  templateUrl: './registro-eventos-admin.component.html',
  styleUrls: ['./registro-eventos-admin.component.scss']
})

export class RegistroEventosAdminComponent implements OnInit {

  @Input() rol: string = "";
  @Input() datos_event: any = {};

  // Objeto para almacenar los datos del evento
  public evento: any = {};
  public token: string = "";
  public errors: any = {};
  public editar: boolean = false;
  public idEvento: number = 0;
  public fechaMinima: Date = new Date(); // Fecha mínima es hoy

  // Objeto para manejar el público objetivo con checkboxes
  public publico: any = {
    estudiantes: false,
    profesores: false,
    publico_general: false
  };

  // Listas para los selects
  public listaAdministradores: any[] = [];
  public listaMaestros: any[] = [];


  constructor(
    private router: Router,
    private location: Location,
    public activatedRoute: ActivatedRoute,
    private eventosService: EventosService,
    private facadeService: FacadeService,
      public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params['id'] != undefined) {
      this.editar = true;
      // Asignamos a nuestra variable global el valor del ID que viene por la URL
      this.idEvento = this.activatedRoute.snapshot.params['id'];
      console.log("ID Evento: ", this.idEvento);

    } else {
      // Va a registrar un nuevo evento
      this.evento = this.eventosService.esquemaEvento();
      this.token = this.facadeService.getSessionToken();
    }

    // Cargar listas de responsables
    this.cargarResponsables();

    // Imprimir datos en consola
    console.log("Evento: ", this.evento);
  }

   ngOnChanges(changes: SimpleChanges): void {
    if (changes['datos_event']) {



      if (this.datos_event && Object.keys(this.datos_event).length > 0) {
        this.evento = { ...this.datos_event };

        // Cargar público objetivo
        if (this.evento.publico_objetivo) {
          this.cargarPublicoObjetivo(this.evento.publico_objetivo);
        }
        this.evento.hora_inicio =this.evento.hora_inicio_formatted;
        this.evento.hora_fin =this.evento.hora_fin_formatted;
        this.evento.responsable_id = this.evento.responsable;

      }
    }
  }

  // Cargar lista de administradores y maestros
  public cargarResponsables(): void {
    // Llamar al servicio para obtener administradores
    this.eventosService.obtenerListaAdministradores().subscribe(
      (response) => {
        this.listaAdministradores = response;
        console.log("Lista de administradores: ", this.listaAdministradores);
      },
      (error) => {
        console.error("Error al obtener administradores: ", error);
      }
    );

    // Llamar al servicio para obtener maestros
    this.eventosService.obtenerListaMaestros().subscribe(
      (response) => {
        this.listaMaestros = response;
        console.log("Lista de maestros: ", this.listaMaestros);
      },
      (error) => {
        console.error("Error al obtener maestros: ", error);
      }
    );
  }

  // Cargar checkboxes de público objetivo si estamos editando
  public cargarPublicoObjetivo(publicoString: string): void {
    if (publicoString) {
      this.publico.estudiantes = publicoString.includes('Estudiantes');
      this.publico.profesores = publicoString.includes('Profesores');
      this.publico.publico_general = publicoString.includes('Público general');
    }
  }

  // Método que se ejecuta cuando cambia el público objetivo
  public onPublicoChange(): void {
    // Si se desmarca "Estudiantes", limpiar programa educativo
    if (!this.publico.estudiantes) {
      this.evento.programa_educativo = '';
    }
  }

  // Preparar el objeto de público objetivo para enviar
  public prepararPublicoObjetivo(): string {
    const publicos: string[] = [];
    if (this.publico.estudiantes) publicos.push('Estudiantes');
    if (this.publico.profesores) publicos.push('Profesores');
    if (this.publico.publico_general) publicos.push('Público general');
    return publicos.join(', ');
  }

  // Regresar a la página anterior
  public regresar(): void {
    this.location.back();
  }

  // Registrar nuevo evento
  public registrar(): void {
    // Preparar datos del evento
    this.evento.publico_objetivo = this.prepararPublicoObjetivo();

    // Validamos si el formulario está lleno y correcto
    this.errors = {};
    this.errors = this.eventosService.validarEvento(this.evento, this.editar);

    if (Object.keys(this.errors).length > 0) {

      return;
    }
     if (this.evento.fecha_realizacion) {
    this.evento.fecha_realizacion= new Date(this.evento.fecha_realizacion)
      .toISOString()
      .split('T')[0];
  }

    // Lógica para registrar un nuevo evento
    this.eventosService.registrarEvento(this.evento).subscribe(
      (response) => {
        // Redirigir o mostrar mensaje de éxito
        alert("Evento registrado exitosamente");
        console.log("Evento registrado: ", response);

        if (this.token && this.token !== "") {
          this.router.navigate(["dashboard/eventos-academicos"]);
        } else {
          this.router.navigate(["/"]);
        }
      },
      (error) => {
        // Manejar errores de la API
        alert("Error al registrar evento");
        console.error("Error al registrar evento: ", error);
      }
    );
  }

  // Actualizar evento existente
  public actualizar(): void {
    // Preparar datos del evento
     this.evento.publico_objetivo = this.prepararPublicoObjetivo();

    // Lógica para actualizar los datos de un evento existente
    // Validamos si el formulario está lleno y correcto
    this.errors = {};
    this.errors = this.eventosService.validarEvento(this.evento, this.editar);

    if (Object.keys(this.errors).length > 0) {
      return;
    }
     if (this.evento.fecha_realizacion) {
    this.evento.fecha_realizacion= new Date(this.evento.fecha_realizacion)
      .toISOString()
      .split('T')[0];
  }

    this.eventosService.actualizarEvento(this.evento).subscribe(
      (response) => {
        // Redirigir o mostrar mensaje de éxito
        alert("Evento actualizado exitosamente");
        console.log("Evento actualizado: ", response,this.evento);
        this.router.navigate(["dashboard/eventos-academicos"]);
      },
      (error) => {
        // Manejar errores de la API
        alert("Error al actualizar evento");
        console.error("Error al actualizar evento: ", error);
      }
    );
  }


  public abrirModalConfirmacion(): void {
   const dialogRef = this.dialog.open(EditarEventoModalComponent, {
    data: {
      nombre_evento: this.evento.nombre_evento
    },
    height: '288px',
    width: '328px',
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result && result.isConfirmed) {
      // Si confirma, entonces actualizar
      this.actualizar();
    } else {
      console.log("Actualización cancelada");
    }
  });
}
  // ========== MÉTODOS DE VALIDACIÓN DE ENTRADA ==========

  // Solo letras y espacios
  public soloLetras(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    // Permitir solo letras (mayúsculas y minúsculas) y espacio
    if (
      !(charCode >= 65 && charCode <= 90) &&  // Letras mayúsculas
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas
      charCode !== 32                         // Espacio
    ) {
      event.preventDefault();
    }
  }

  // Solo letras, números y espacios
  public soloLetrasNumerosEspacios(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (
      !(charCode >= 48 && charCode <= 57) &&  // Números
      !(charCode >= 65 && charCode <= 90) &&  // Letras mayúsculas
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas
      charCode !== 32                         // Espacio
    ) {
      event.preventDefault();
    }
  }

  // Solo alfanuméricos y espacios
  public soloAlfanumericosEspacios(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (
      !(charCode >= 48 && charCode <= 57) &&  // Números
      !(charCode >= 65 && charCode <= 90) &&  // Letras mayúsculas
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas
      charCode !== 32                         // Espacio
    ) {
      event.preventDefault();
    }
  }

  // Solo letras, números y puntuación básica
  public soloLetrasNumerosPuntuacion(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    // Permitir letras, números, espacios y puntuación básica: . , ; : ¿ ? ¡ ! - ( )
    const permitidos = [32, 46, 44, 59, 58, 63, 33, 45, 40, 41, 191, 161];
    if (
      !(charCode >= 48 && charCode <= 57) &&  // Números
      !(charCode >= 65 && charCode <= 90) &&  // Letras mayúsculas
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas
      !permitidos.includes(charCode)          // Puntuación permitida
    ) {
      event.preventDefault();
    }
  }

  // Solo números
  public soloNumeros(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (!(charCode >= 48 && charCode <= 57)) { // Números 0-9
      event.preventDefault();
    }
  }
}
