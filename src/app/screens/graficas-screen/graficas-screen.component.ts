import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { EventosService } from 'src/app/services/eventos.service';

@Component({
  selector: 'app-graficas-screen',
  templateUrl: './graficas-screen.component.html',
  styleUrls: ['./graficas-screen.component.scss']
})
export class GraficasScreenComponent implements OnInit {

  // Contadores de usuarios
  public totalAdministradores: number = 0;
  public totalMaestros: number = 0;
  public totalAlumnos: number = 0;
  public totalUsuarios: number = 0;

  // Contadores de eventos por tipo
  public totalConferencias: number = 0;
  public totalTalleres: number = 0;
  public totalSeminarios: number = 0;
  public totalConcursos: number = 0;

  // ========== COLORES CONSISTENTES ==========
  // Colores para USUARIOS (se mantienen en todas las gráficas de usuarios)
  private coloresUsuarios = {
    administradores: {
      background: 'rgba(64, 103, 121, 0.8)',  // Azul oscuro
      border: 'rgba(64, 103, 121, 1)'
    },
    maestros: {
      background: 'rgba(232, 65, 80, 0.8)',   // Rojo
      border: 'rgba(232, 65, 80, 1)'
    },
    alumnos: {
      background: 'rgba(75, 192, 192, 0.8)',  // Verde azulado
      border: 'rgba(75, 192, 192, 1)'
    }
  };

  // Colores para EVENTOS (se mantienen en todas las gráficas de eventos)
  private coloresEventos = {
    conferencias: {
      background: 'rgba(64, 103, 121, 0.8)',  // Azul oscuro
      border: 'rgba(64, 103, 121, 1)'
    },
    talleres: {
      background: 'rgba(232, 65, 80, 0.8)',   // Rojo
      border: 'rgba(232, 65, 80, 1)'
    },
    seminarios: {
      background: 'rgba(75, 192, 192, 0.8)',  // Verde azulado
      border: 'rgba(75, 192, 192, 1)'
    },
    concursos: {
      background: 'rgba(255, 159, 64, 0.8)',  // Naranja
      border: 'rgba(255, 159, 64, 1)'
    }
  };

  // ========== GRÁFICAS DE EVENTOS ==========

  // Gráfica de línea (histograma) - Eventos por tipo
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Eventos Académicos',
        backgroundColor: 'rgba(64, 103, 121, 0.2)',
        borderColor: 'rgba(64, 103, 121, 1)',
        pointBackgroundColor: [
          this.coloresEventos.conferencias.border,
          this.coloresEventos.talleres.border,
          this.coloresEventos.seminarios.border,
          this.coloresEventos.concursos.border
        ],
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(64, 103, 121, 0.8)',
        fill: 'origin',
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ],
    labels: []
  };

  public lineChartOption: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'Distribución de Eventos por Tipo (Histograma)',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    }
  };

  public lineChartPlugins = [];

  // Gráfica de barras - Eventos por tipo
  public barChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Cantidad de Eventos',
        backgroundColor: [
          this.coloresEventos.conferencias.background,
          this.coloresEventos.talleres.background,
          this.coloresEventos.seminarios.background,
          this.coloresEventos.concursos.background
        ],
        borderColor: [
          this.coloresEventos.conferencias.border,
          this.coloresEventos.talleres.border,
          this.coloresEventos.seminarios.border,
          this.coloresEventos.concursos.border
        ],
        borderWidth: 2
      }
    ],
    labels: []
  };

  public barChartOption: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false, // Ocultar leyenda ya que los colores se explican por sí solos
      },
      title: {
        display: true,
        text: 'Eventos por Tipo',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  public barChartPlugins = [];

  // ========== GRÁFICAS DE USUARIOS ==========

  // Gráfica de pastel - Usuarios por tipo
  public pieChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        backgroundColor: [
          this.coloresUsuarios.administradores.background,
          this.coloresUsuarios.maestros.background,
          this.coloresUsuarios.alumnos.background
        ],
        borderColor: [
          this.coloresUsuarios.administradores.border,
          this.coloresUsuarios.maestros.border,
          this.coloresUsuarios.alumnos.border
        ],
        borderWidth: 2
      }
    ],
    labels: []
  };

  public pieChartOption: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Distribución de Usuarios (Gráfica Circular)',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    }
  };

  public pieChartPlugins = [];

  // Gráfica de dona - Usuarios por tipo
  public doughnutChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        backgroundColor: [
          this.coloresUsuarios.administradores.background,
          this.coloresUsuarios.maestros.background,
          this.coloresUsuarios.alumnos.background
        ],
        borderColor: [
          this.coloresUsuarios.administradores.border,
          this.coloresUsuarios.maestros.border,
          this.coloresUsuarios.alumnos.border
        ],
        borderWidth: 2
      }
    ],
    labels: []
  };

  public doughnutChartOption: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Distribución de Usuarios (Gráfica de Dona)',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    }
  };

  public doughnutChartPlugins = [];

  constructor(
    private administradoresService: AdministradoresService,
    private alumnosService: AlumnosService,
    private maestrosService: MaestrosService,
    private eventosService: EventosService
  ) { }

  ngOnInit(): void {
    this.cargarDatosUsuarios();
    this.cargarDatosEventos();
  }

  // Cargar datos de usuarios
  public cargarDatosUsuarios(): void {
    // Obtener administradores
    this.administradoresService.obtenerListaAdmins().subscribe(
      (response) => {
        this.totalAdministradores = response.length;
        this.verificarCargaUsuarios();
      },
      (error) => {
        console.error("Error al obtener administradores: ", error);
        this.verificarCargaUsuarios();
      }
    );

    // Obtener maestros
    this.maestrosService.obtenerListaMaestros().subscribe(
      (response) => {
        this.totalMaestros = response.length;
        this.verificarCargaUsuarios();
      },
      (error) => {
        console.error("Error al obtener maestros: ", error);
        this.verificarCargaUsuarios();
      }
    );

    // Obtener alumnos
    this.alumnosService.obtenerListaAlumnos().subscribe(
      (response) => {
        this.totalAlumnos = response.length;
        this.verificarCargaUsuarios();
      },
      (error) => {
        console.error("Error al obtener alumnos: ", error);
        this.verificarCargaUsuarios();
      }
    );
  }

  // Verificar que todos los datos de usuarios se hayan cargado
  private contadorCargaUsuarios = 0;
  private verificarCargaUsuarios(): void {
    this.contadorCargaUsuarios++;

    // Cuando se hayan cargado los 3 tipos de usuarios
    if (this.contadorCargaUsuarios === 3) {
      this.totalUsuarios = this.totalAdministradores + this.totalMaestros + this.totalAlumnos;
      console.log("Totales de usuarios:");
      console.log("Administradores: ", this.totalAdministradores);
      console.log("Maestros: ", this.totalMaestros);
      console.log("Alumnos: ", this.totalAlumnos);
      console.log("Total: ", this.totalUsuarios);

      // Actualizar gráficas de usuarios
      this.actualizarGraficasUsuarios();
    }
  }

  // Actualizar las gráficas de usuarios con los datos obtenidos
  private actualizarGraficasUsuarios(): void {
    const labels = ['Administradores', 'Maestros', 'Alumnos'];
    const data = [this.totalAdministradores, this.totalMaestros, this.totalAlumnos];

    // Actualizar gráfica de pastel
    this.pieChartData = {
      ...this.pieChartData,
      labels: labels,
      datasets: [
        {
          ...this.pieChartData.datasets[0],
          data: data
        }
      ]
    };

    // Actualizar gráfica de dona
    this.doughnutChartData = {
      ...this.doughnutChartData,
      labels: labels,
      datasets: [
        {
          ...this.doughnutChartData.datasets[0],
          data: data
        }
      ]
    };
  }

  // Cargar datos de eventos
  public cargarDatosEventos(): void {
    this.eventosService.obtenerListaEventos().subscribe(
      (response) => {
        // Contar eventos por tipo
        this.totalConferencias = response.filter(e => e.tipo_evento === 'Conferencia').length;
        this.totalTalleres = response.filter(e => e.tipo_evento === 'Taller').length;
        this.totalSeminarios = response.filter(e => e.tipo_evento === 'Seminario').length;
        this.totalConcursos = response.filter(e => e.tipo_evento === 'Concurso').length;

        console.log("Totales de eventos:");
        console.log("Conferencias: ", this.totalConferencias);
        console.log("Talleres: ", this.totalTalleres);
        console.log("Seminarios: ", this.totalSeminarios);
        console.log("Concursos: ", this.totalConcursos);

        // Actualizar gráficas de eventos
        this.actualizarGraficasEventos();
      },
      (error) => {
        console.error("Error al obtener eventos: ", error);
      }
    );
  }

  // Actualizar las gráficas de eventos con los datos obtenidos
  private actualizarGraficasEventos(): void {
    const labels = ['Conferencias', 'Talleres', 'Seminarios', 'Concursos'];
    const data = [this.totalConferencias, this.totalTalleres, this.totalSeminarios, this.totalConcursos];

    // Actualizar gráfica de línea (histograma)
    this.lineChartData = {
      ...this.lineChartData,
      labels: labels,
      datasets: [
        {
          ...this.lineChartData.datasets[0],
          data: data
        }
      ]
    };

    // Actualizar gráfica de barras
    this.barChartData = {
      ...this.barChartData,
      labels: labels,
      datasets: [
        {
          ...this.barChartData.datasets[0],
          data: data
        }
      ]
    };
  }
}
