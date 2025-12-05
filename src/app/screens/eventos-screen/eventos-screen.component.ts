import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { FacadeService } from 'src/app/services/facade.service';
import { EventosService } from 'src/app/services/eventos.service';
import { Sort, MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EliminarEventoModalComponent } from 'src/app/modals/eliminar-evento-modal/eliminar-evento-modal.component';

@Component({
  selector: 'app-eventos-screen',
  templateUrl: './eventos-screen.component.html',
  styleUrls: ['./eventos-screen.component.scss']
})
export class EventosScreenComponent implements OnInit {

  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  public lista_eventos: any[] = [];
  public lista_eventos_filtrada: any[] = [];
  public viewLoaded = false;

  sortedData: DatosEvento[];

  // Para la tabla
  displayedColumns: string[] = [
    'nombre',
    'tipo_evento',
    'fecha_realizacion',
    'hora_inicio',
    'lugar',
    'publico_objetivo',
    'responsable',
    'cupo_maximo',
    'editar',
    'eliminar'
  ];

  dataSource = new MatTableDataSource<DatosEvento>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public facadeService: FacadeService,
    public eventosService: EventosService,
    private router: Router,
    public dialog: MatDialog,
  ) {
    this.sortedData = this.lista_eventos.slice();
  }

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();

    // Validar que haya inicio de sesión
    // Obtengo el token del login
    this.token = this.facadeService.getSessionToken();
    console.log("Token: ", this.token,this.rol);

    if (this.token == "") {
      this.router.navigate(["/"]);
    }

    if(this.rol !=='administrador'){
      this.displayedColumns = this.displayedColumns.filter(col => col !== 'editar' && col !== 'eliminar');
    }
  }

  ngAfterViewInit() {
    // Obtener eventos
    this.obtenerEventos();
  }

 // Consumimos el servicio para obtener los eventos
public obtenerEventos(): void {
  this.eventosService.obtenerListaEventos().subscribe(
    (response) => {
      this.lista_eventos = response;
      console.log("Lista eventos original: ", this.lista_eventos);

      if (this.lista_eventos.length > 0) {
        // Procesar datos adicionales si es necesario
        this.lista_eventos.forEach(evento => {
          // Formatear fecha si viene en formato ISO
          if (evento.fecha_realizacion) {
            const fecha = new Date(evento.fecha_realizacion);
            evento.fecha_realizacion_formatted = fecha.toLocaleDateString('es-MX');
          }

          // Formatear horas si es necesario
          if (evento.hora_inicio) {
            evento.hora_inicio_formatted = evento.hora_inicio.substring(0, 5);
          }

          if (evento.hora_fin) {
            evento.hora_fin_formatted = evento.hora_fin.substring(0, 5);
          }

          // Convertir publico_objetivo a array
          if (evento.publico_objetivo && typeof evento.publico_objetivo === 'string') {
            evento.publico_objetivo_array = evento.publico_objetivo
              .split(',')
              .map(item => item.trim());
          } else if (Array.isArray(evento.publico_objetivo)) {
            evento.publico_objetivo_array = evento.publico_objetivo;
          } else {
            evento.publico_objetivo_array = [];
          }
        });

        console.log("Eventos procesados: ", this.lista_eventos);

        // Filtrar eventos según el rol
        this.filtrarEventosPorRol();

        console.log("Eventos filtrados: ", this.lista_eventos_filtrada);

        this.dataSource.data = this.lista_eventos_filtrada;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.dataSource.filterPredicate = (data: any, filter: string) => {
          filter = filter.trim().toLowerCase();

          // Usar nombre_evento en lugar de nombre
          const nombreEvento = (data.nombre_evento).toLowerCase();
          const tipoEvento = (data.tipo_evento || '').toLowerCase();
          const lugar = (data.lugar || '').toLowerCase();
          const responsable = (data.responsable_nombre || '').toLowerCase();

          return (
            nombreEvento.includes(filter) ||
            tipoEvento.includes(filter) ||
            lugar.includes(filter) ||
            responsable.includes(filter)
          );
        };
      }
    },
    (error) => {
      console.error("Error al obtener la lista de Eventos: ", error);
      alert("No se pudo obtener la lista de Eventos");
    }
  );
}

  // Navegar a editar evento
  public goEditar(idEvento: number): void {
    console.log("Navegando a editar evento con ID: ", idEvento);
    this.router.navigate(["registro-eventos/" + idEvento]);
  }





  // Eliminar evento
  public delete(idEvento: number): void {
    // Administrador puede eliminar cualquier evento
    // Maestro solo puede eliminar eventos donde es responsable
    const userId = Number(this.facadeService.getUserId());

    if (this.rol === 'administrador') {
      // Administrador puede eliminar cualquier evento
      this.abrirModalEliminar(idEvento);
    } else {
      alert("No tienes permisos para eliminar eventos.");
    }
  }

  // Abrir modal de confirmación de eliminación
  private abrirModalEliminar(idEvento: number): void {
    const dialogRef = this.dialog.open(EliminarEventoModalComponent, {
      data: { id: idEvento, rol: 'evento', }, // Se pasan valores a través del componente
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.isDelete) {
        console.log("Evento eliminado");
        alert("Evento eliminado correctamente.");
        // Recargar página
        window.location.reload();
      } else {
        alert("Evento no se ha podido eliminar.");
        console.log("No se eliminó el evento");
      }
    });

  }

  // Ordenar datos de la tabla
  sortData(sort: Sort): void {
    const data = this.lista_eventos.slice();

    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';

      switch (sort.active) {
        case 'nombre':
          return compare(a.nombre, b.nombre, isAsc);
        case 'tipo_evento':
          return compare(a.tipo_evento, b.tipo_evento, isAsc);
        case 'fecha_realizacion':
          return compare(a.fecha_realizacion, b.fecha_realizacion, isAsc);
        case 'hora_inicio':
          return compare(a.hora_inicio, b.hora_inicio, isAsc);
        case 'lugar':
          return compare(a.lugar, b.lugar, isAsc);
        case 'cupo_maximo':
          return compare(a.cupo_maximo, b.cupo_maximo, isAsc);
        case 'responsable':
          return compare(a.nombre_responsable || '', b.nombre_responsable || '', isAsc);
        default:
          return 0;
      }
    });
  }

  // Aplicar filtro de búsqueda
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

   // Filtrar eventos según el rol del usuario
  private filtrarEventosPorRol(): void {
    if (this.rol === 'administrador') {
      // Los administradores ven todos los eventos
      this.lista_eventos_filtrada = this.lista_eventos;

    } else if (this.rol === 'maestro') {
      // Los maestros solo ven eventos de "Profesores" y "Público general"
      this.lista_eventos_filtrada = this.lista_eventos.filter(evento => {
        const publicoArray = evento.publico_objetivo_array || [];
        return publicoArray.includes('Profesores') || publicoArray.includes('Público general');
      });

    } else if (this.rol === 'alumno') {
      // Los alumnos solo ven eventos de "Estudiantes" y "Público general"
      this.lista_eventos_filtrada = this.lista_eventos.filter(evento => {
        const publicoArray = evento.publico_objetivo_array || [];
        return publicoArray.includes('Estudiantes') || publicoArray.includes('Público general');
      });

    } else {
      // Por defecto, mostrar todos
      this.lista_eventos_filtrada = this.lista_eventos;
    }
  }


public puedeEditarEliminar(): boolean {
    return this.rol === 'administrador';
  }

  // Obtener clase CSS según el tipo de evento
  public getClaseTipoEvento(tipo: string): string {
    const clases: any = {
      'Conferencia': 'tipo-conferencia',
      'Taller': 'tipo-taller',
      'Seminario': 'tipo-seminario',
      'Concurso': 'tipo-concurso'
    };
    return clases[tipo] || '';
  }
}

// Función auxiliar para comparar valores
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

// Esto va fuera de la llave que cierra la clase
export interface DatosEvento {
  id: number;
  nombre: string;
  tipo_evento: string;
  fecha_realizacion: string;
  fecha_realizacion_formatted?: string;
  hora_inicio: string;
  hora_inicio_formatted?: string;
  hora_fin: string;
  hora_fin_formatted?: string;
  lugar: string;
  publico_objetivo: string;
  programa_educativo?: string;
  responsable_tipo: string;
  responsable_id: number;
  nombre_responsable?: string;
  descripcion: string;
  cupo_maximo: number;
  activo: boolean;
  creado_en?: string;
  actualizado_en?: string;
}
