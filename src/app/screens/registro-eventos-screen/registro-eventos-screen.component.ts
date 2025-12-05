
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { EventosService } from 'src/app/services/eventos.service';
import { FacadeService } from 'src/app/services/facade.service';



@Component({
  selector: 'app-registro-eventos-screen',
  templateUrl: './registro-eventos-screen.component.html',
  styleUrls: ['./registro-eventos-screen.component.scss']
})
export class RegistroEventosScreenComponent {
  public evento: any = {};
  public editar: boolean = false;
  public idEvento: number = 0;
  rol: any;
  constructor(   private location: Location,
    public activatedRoute: ActivatedRoute,
      public facadeService: FacadeService,
    private router: Router,
    private eventosService: EventosService) {

    // Aquí puedes establecer el rol según la lógica de tu aplicación
  }

  ngOnInit(): void {
    //PROTEGER RUTA SOLO PARA ADMINISTRADORES
  const rol = this.facadeService.getUserGroup();
  const rolLimpio = (rol || '').toString().trim().toLowerCase();

  if (rolLimpio != 'administrador') {
    alert('No tienes permisos para acceder a esta página. Solo administradores.');
    this.router.navigate(['/']);
    return;
  }
    // El if valida si existe un parámetro ID en la URL
    if (this.activatedRoute.snapshot.params['id'] != undefined) {
      this.editar = true;
      // Asignamos a nuestra variable global el valor del ID que viene por la URL
      this.idEvento = this.activatedRoute.snapshot.params['id'];
      console.log("ID Evento: ", this.idEvento);
      // Al iniciar la vista obtiene el evento por su ID
      this.obtenerEventoByID();
    }
  }

   // Obtener evento por ID
  public obtenerEventoByID() {
    console.log("Obteniendo evento con ID: ", this.idEvento);

    this.eventosService.obtenerEventoPorID(this.idEvento).subscribe(
      (response) => {
        this.evento = response;
        console.log("Evento obtenido: ", this.evento);

        // Formatear fecha si viene en formato ISO
        if (this.evento.fecha_realizacion) {
          const fecha = new Date(this.evento.fecha_realizacion);
          this.evento.fecha_realizacion_formatted = fecha.toLocaleDateString('es-MX');
        }

        // Formatear horas si es necesario
        if (this.evento.hora_inicio) {
          this.evento.hora_inicio_formatted = this.evento.hora_inicio.substring(0, 5);
        }

        if (this.evento.hora_fin) {
          this.evento.hora_fin_formatted = this.evento.hora_fin.substring(0, 5);
        }

        // Convertir publico_objetivo a array
        if (this.evento.publico_objetivo && typeof this.evento.publico_objetivo === 'string') {
          this.evento.publico_objetivo_array = this.evento.publico_objetivo
            .split(',')
            .map(item => item.trim());
        } else if (Array.isArray(this.evento.publico_objetivo)) {
          this.evento.publico_objetivo_array = this.evento.publico_objetivo;
        } else {
          this.evento.publico_objetivo_array = [];
        }

        console.log("Evento procesado: ", this.evento);
      },
      (error) => {
        console.log("Error: ", error);
        alert("No se pudo obtener el evento seleccionado");
      }
    );
  }


  public goBack() {
    this.location.back();
  }
}
