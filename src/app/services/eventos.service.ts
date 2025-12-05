import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FacadeService } from './facade.service';
import { ErrorsService } from './tools/errors.service';
import { ValidatorService } from './tools/validator.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) { }

  // Esquema del objeto evento
  public esquemaEvento() {
    return {
      'nombre_evento': '',
      'tipo_evento': '',
      'fecha_realizacion': '',
      'hora_inicio': '',
      'hora_fin': '',
      'lugar': '',
      'publico_objetivo': '',
      'programa_educativo': '',
      'responsable_id': '',
      'responsable_nombre"': '',
      'descripcion': '',
      'cupo_maximo': ''
    }
  }

  // Validación para el formulario de eventos
  public validarEvento(data: any, editar: boolean) {
    console.log("Validando evento... ", data);
    let error: any = [];

    // Validar nombre del evento
    if (!this.validatorService.required(data["nombre_evento"])) {
      error["nombre_evento"] = this.errorService.required;
    } else if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/.test(data["nombre"])) {
      error["nombre_evento"] = "Solo se permiten letras, números y espacios";
    }

    // Validar tipo de evento
    if (!this.validatorService.required(data["tipo_evento"])) {
      error["tipo_evento"] = this.errorService.required;
    }

    // Validar fecha de realización
    if (!this.validatorService.required(data["fecha_realizacion"])) {
      error["fecha_realizacion"] = this.errorService.required;
    } else {
      const fechaSeleccionada = new Date(data["fecha_realizacion"]);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (fechaSeleccionada < hoy) {
        error["fecha_realizacion"] = "No se pueden seleccionar fechas anteriores al día actual";
      }
    }

    // Validar hora de inicio
    if (!this.validatorService.required(data["hora_inicio"])) {
      error["hora_inicio"] = this.errorService.required;
    }

    // Validar hora de finalización
    if (!this.validatorService.required(data["hora_fin"])) {
      error["hora_fin"] = this.errorService.required;
    }

    // Validar que hora de inicio sea menor que hora de fin
    if (data["hora_inicio"] && data["hora_fin"]) {
      if (data["hora_inicio"] >= data["hora_fin"]) {
        error["hora_fin"] = "La hora de finalización debe ser mayor que la hora de inicio";
      }
    }

    // Validar lugar
    if (!this.validatorService.required(data["lugar"])) {
      error["lugar"] = this.errorService.required;
    } else if (!/^[a-zA-Z0-9\s]+$/.test(data["lugar"])) {
      error["lugar"] = "Solo se permiten caracteres alfanuméricos y espacios";
    }

    // Validar público objetivo
    if (!this.validatorService.required(data["publico_objetivo"])) {
      error["publico_objetivo"] = "Debes seleccionar al menos un público objetivo";
    }

    // Validar programa educativo si el público objetivo incluye estudiantes
    if (data["publico_objetivo"] && data["publico_objetivo"].includes("Estudiantes")) {
      if (!this.validatorService.required(data["programa_educativo"])) {
        error["programa_educativo"] = "Debes seleccionar un programa educativo cuando el público objetivo incluye estudiantes";
      }
    }

    // Validar responsable del evento
    if (!this.validatorService.required(data["responsable_id"])) {
      error["responsable_id"] = this.errorService.required;
    }

    // Validar descripción breve
    if (!this.validatorService.required(data["descripcion"])) {
      error["descripcion"] = this.errorService.required;
    } else if (!this.validatorService.max(data["descripcion"], 300)) {
      error["descripcion"] = this.errorService.max(300);
      alert("La descripción no puede exceder los 300 caracteres");
    }

    // Validar cupo máximo
    if (!this.validatorService.required(data["cupo_maximo"])) {
      error["cupo_maximo"] = this.errorService.required;
    } else if (!this.validatorService.numeric(data["cupo_maximo"])) {
      error["cupo_maximo"] = "Solo se permiten números enteros positivos";
      alert("El formato del cupo es solo números");
    } else if (parseInt(data["cupo_maximo"]) <= 0) {
      error["cupo_maximo"] = "El cupo debe ser mayor a 0";
    } else if (data["cupo_maximo"].toString().length > 3) {
      error["cupo_maximo"] = "El cupo está limitado a 3 dígitos";
      alert("El cupo máximo no puede exceder 3 dígitos (999)");
    }

    // Return arreglo de errores
    return error;
  }

  // ========== SERVICIOS HTTP ==========

  // Servicio para registrar un nuevo evento
  public registrarEvento(data: any): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.post<any>(`${environment.url_api}/eventos/`, data, { headers });
  }

  // Servicio para obtener la lista de todos los eventos
  public obtenerListaEventos(): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.get<any>(`${environment.url_api}/lista-eventos/`, { headers });
  }

  // Servicio para obtener un evento por ID
  public obtenerEventoPorID(idEvento: number): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.get<any>(`${environment.url_api}/eventos/?id=${idEvento}`, { headers });
  }

  // Servicio para actualizar un evento
  public actualizarEvento(data: any): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.put<any>(`${environment.url_api}/eventos/`, data, { headers });
  }

  // Servicio para eliminar un evento
  public eliminarEvento(idEvento: number): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.delete<any>(`${environment.url_api}/eventos/?id=${idEvento}`, { headers });
  }

  // Servicio para obtener lista de maestros (para el select de responsables)
  public obtenerListaMaestros(): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.get<any>(`${environment.url_api}/lista-maestros/`, { headers });
  }

  // Servicio para obtener lista de administradores (para el select de responsables)
  public obtenerListaAdministradores(): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.get<any>(`${environment.url_api}/lista-admins/`, { headers });
  }
}
