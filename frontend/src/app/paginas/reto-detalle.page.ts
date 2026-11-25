import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonProgressBar,
  IonRange,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { BehaviorSubject, catchError, of, switchMap } from 'rxjs';

import { ETIQUETA_ESTADO } from '../core/modelos';
import { RetosApi, mensajeError } from '../core/retos-api.service';
import {
  COLOR_SEMAFORO,
  ETIQUETA_SEMAFORO,
  SemanaEvaluada,
  fechaCorta,
  hoyIso,
} from '../core/semaforo';
import { SeguimientoService } from '../core/seguimiento.service';
import { calcularRecuperacion } from '../core/recuperacion';

@Component({
  selector: 'app-reto-detalle',
  imports: [
    AsyncPipe, ReactiveFormsModule, IonBackButton, IonBadge,
    IonButton, IonButtons, IonCard, IonCardContent,
    IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent,
    IonHeader, IonInput, IonItem, IonLabel, IonList, IonNote,
    IonProgressBar, IonRange, IonSegment, IonSegmentButton,
    IonText, IonTitle, IonToolbar,
  ],
  styles: `
    .semana-actual {
      --background: rgba(var(--ion-color-primary-rgb), 0.08);
    }

    ion-progress-bar {
      margin-top: 6px;
    }

    .asistente {
      border-left: 4px solid var(--ion-color-primary);
      margin: 16px 0;
    }

    .asistente-datos {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin: 16px 0;
    }

    .indicador {
      background: rgba(var(--ion-color-primary-rgb), 0.08);
      border-radius: 12px;
      padding: 12px;
      text-align: center;
    }

    .indicador strong {
      display: block;
      font-size: 24px;
      margin-top: 6px;
      color: var(--ion-color-primary);
    }

    .estado-plan {
      margin-top: 16px;
    }

    .meta-diaria {
      margin: 12px 0;
    }

    .meta-encabezado {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .recomendacion {
      font-size: 14px;
      line-height: 1.5;
      margin: 16px 0;
    }
  `,
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/retos"></ion-back-button>
        </ion-buttons>
        <ion-title>Seguimiento</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      @if (reto$ | async; as reto) {
        <ion-card>
          <ion-card-header>
            <ion-card-title>{{ reto.titulo }}</ion-card-title>
            <ion-card-subtitle>
              {{ etiquetaEstado[reto.estado] }} ·
              {{ fechaCorta(reto.fecha_inicio) }} al
              {{ fechaCorta(reto.fecha_fin) }}
            </ion-card-subtitle>
          </ion-card-header>

          @if (reto.descripcion) {
            <ion-card-content>
              {{ reto.descripcion }}
            </ion-card-content>
          }
        </ion-card>
      } @else {
        <ion-text color="medium">
          <p>Cargando reto…</p>
        </ion-text>
      }

      <ion-segment
        [value]="vista()"
        (ionChange)="vista.set($any($event).detail.value)">

        <ion-segment-button value="semanas">
          <ion-label>Semanas</ion-label>
        </ion-segment-button>

        <ion-segment-button value="avances">
          <ion-label>Avances</ion-label>
        </ion-segment-button>

      </ion-segment>

      @if (vista() === 'semanas') {
        @if (semanas$ | async; as semanas) {

          @if (semanas.length === 0) {
            <p>Este reto todavía no tiene semanas de seguimiento.</p>

            <ion-button expand="block" (click)="generarSemanas()">
              Generar semanas hasta la 15
            </ion-button>
          }

          <!-- FUNCIONALIDAD PROPIA: ASISTENTE DE RECUPERACIÓN -->

          @for (s of semanas; track s.id) {
            @if (s.editable) {

              @let plan = calcularRecuperacion(
                s.porcentaje, s.diasRestantes
              );

              <ion-card class="asistente">
                <ion-card-header>

                  <ion-card-subtitle>
                    PLAN PERSONALIZADO · SEMANA {{ s.semana }}
                  </ion-card-subtitle>

                  <ion-card-title>
                    Asistente de recuperación
                  </ion-card-title>

                </ion-card-header>

                <ion-card-content>

                  <div class="asistente-datos">

                    <div class="indicador">
                      Progreso actual
                      <strong>{{ plan.porcentajeActual }}%</strong>
                    </div>

                    <div class="indicador">
                      Días disponibles
                      <strong>{{ plan.diasDisponibles }}</strong>
                    </div>

                    <div class="indicador">
                      Progreso pendiente
                      <strong>{{ plan.porcentajePendiente }}%</strong>
                    </div>

                    <div class="indicador">
                      Avance diario
                      <strong>{{ plan.avanceDiario }} pp</strong>
                    </div>

                  </div>

                  <ion-progress-bar
                    [value]="plan.porcentajeActual / 100"
                    [color]="plan.nivel === 'completado' ? 'success' : 'primary'">
                  </ion-progress-bar>

                  <div class="estado-plan">

                    @if (plan.nivel === 'completado') {
                      <ion-badge color="success">
                        Objetivo cumplido
                      </ion-badge>

                    } @else if (plan.nivel === 'urgente') {
                      <ion-badge color="danger">
                        Atención prioritaria
                      </ion-badge>

                    } @else {
                      <ion-badge color="success">
                        Plan disponible
                      </ion-badge>
                    }

                  </div>

                  <p class="recomendacion">
                    {{ plan.mensaje }}
                  </p>

                  @if (plan.metas.length > 0) {

                    <h2><strong>Tu plan diario</strong></h2>

                    @for (meta of plan.metas; track meta.dia) {

                      <div class="meta-diaria">

                        <div class="meta-encabezado">
                          <span>
                            {{ meta.dia === 1 ? 'Hoy' : 'Día ' + meta.dia }}
                          </span>

                          <strong>{{ meta.meta }}%</strong>
                        </div>

                        <ion-progress-bar
                          [value]="meta.meta / 100"
                          [color]="meta.meta === 100 ? 'success' : 'primary'">
                        </ion-progress-bar>

                      </div>

                    }

                    <ion-note>
                      pp = puntos porcentuales.
                      Las metas se recalculan según tu progreso.
                    </ion-note>

                  }

                </ion-card-content>
              </ion-card>

            }
          }

          <!-- LISTA ORIGINAL DE SEMANAS -->

          <ion-list>

            @for (s of semanas; track s.id) {

              <ion-item
                [class.semana-actual]="s.editable"
                lines="full">

                <ion-label>

                  <h2>
                    Semana {{ s.semana }}
                    <ion-badge [color]="color[s.semaforo]">
                      {{ etiqueta[s.semaforo] }}
                    </ion-badge>
                  </h2>

                  <p>
                    {{ fechaCorta(s.fecha_inicio) }} al
                    {{ fechaCorta(s.fecha_fin) }} ·
                    {{ s.porcentaje }} %
                  </p>

                  <ion-progress-bar
                    [value]="s.porcentaje / 100"
                    [color]="color[s.semaforo]">
                  </ion-progress-bar>

                  @if (s.editable) {

                    <ion-range
                      aria-label="Porcentaje de la semana"
                      [value]="s.porcentaje"
                      [min]="0"
                      [max]="100"
                      [step]="10"
                      [snaps]="true"
                      [pin]="true"
                      (ionChange)="cambiarPorcentaje(s, $any($event).detail.value)">
                    </ion-range>

                    <ion-note>

                      @if (s.diasRestantes === 0) {
                        Se cierra hoy a medianoche.
                      } @else {
                        Se cierra en {{ s.diasRestantes }} día(s).
                      }

                    </ion-note>

                  }

                  @if (s.enRiesgo) {
                    <ion-text color="danger">
                      <p>
                        Riesgo: si no avanzas,
                        esta semana se cerrará en rojo.
                      </p>
                    </ion-text>
                  }

                </ion-label>

              </ion-item>

            }

          </ion-list>

        }

      } @else {

        <!-- REGISTRO ORIGINAL DE AVANCES -->

        <form
          [formGroup]="formAvance"
          (ngSubmit)="guardarAvance()">

          <ion-list>

            <ion-item>
              <ion-input
                label="Fecha"
                labelPlacement="stacked"
                type="date"
                formControlName="fecha">
              </ion-input>
            </ion-item>

            <ion-item>
              <ion-input
                label="¿Qué avanzaste?"
                labelPlacement="stacked"
                formControlName="descripcion"
                [maxlength]="255">
              </ion-input>
            </ion-item>

            <ion-item>
              <ion-input
                label="Porcentaje (0 a 100)"
                labelPlacement="stacked"
                type="number"
                formControlName="porcentaje"
                [min]="0"
                [max]="100">
              </ion-input>
            </ion-item>

          </ion-list>

          <ion-button
            expand="block"
            type="submit"
            [disabled]="formAvance.invalid">
            Registrar avance
          </ion-button>

        </form>

        @if (avances$ | async; as avances) {

          <ion-list>

            @for (a of avances; track a.id) {

              <ion-item>
                <ion-label>
                  <h3>{{ a.descripcion }}</h3>
                  <p>
                    {{ fechaCorta(a.fecha) }} ·
                    {{ a.porcentaje }} %
                  </p>
                </ion-label>
              </ion-item>

            } @empty {

              <ion-item>
                <ion-label>Sin avances registrados.</ion-label>
              </ion-item>

            }

          </ion-list>

        }

      }

    </ion-content>
  `,
})
export class RetoDetallePage {

  private readonly api = inject(RetosApi);
  private readonly seguimiento = inject(SeguimientoService);
  private readonly toast = inject(ToastController);

  private readonly id = Number(
    inject(ActivatedRoute).snapshot.paramMap.get('id')
  );

  protected readonly etiquetaEstado = ETIQUETA_ESTADO;
  protected readonly etiqueta = ETIQUETA_SEMAFORO;
  protected readonly color = COLOR_SEMAFORO;
  protected readonly fechaCorta = fechaCorta;

  // Funcionalidad propia.
  protected readonly calcularRecuperacion = calcularRecuperacion;

  protected readonly vista = signal<'semanas' | 'avances'>('semanas');

  protected readonly reto$ = this.api.obtenerReto(this.id)
    .pipe(catchError(() => of(null)));

  protected readonly semanas$ =
    this.seguimiento.semanasDeReto$(this.id);

  private readonly recargarAvances$ =
    new BehaviorSubject<void>(undefined);

  protected readonly avances$ = this.recargarAvances$.pipe(
    switchMap(() => this.api.listarAvances(this.id)),
  );

  protected readonly formAvance = new FormGroup({

    fecha: new FormControl(hoyIso(), {
      nonNullable: true,
      validators: [Validators.required],
    }),

    descripcion: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    porcentaje: new FormControl<number | string>(0, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
      ],
    }),

  });

  constructor() {

    this.seguimiento.guardado$
      .pipe(takeUntilDestroyed())
      .subscribe((r) =>
        void this.mostrar(
          r.mensaje,
          r.ok ? 'success' : 'danger'
        )
      );

  }

  protected cambiarPorcentaje(
    semana: SemanaEvaluada,
    valor: unknown
  ): void {

    this.seguimiento.cambiarPorcentaje(
      semana,
      Number(valor)
    );

  }

  protected generarSemanas(): void {

    this.api.generarSemanas(this.id).subscribe({

      next: (r) => {
        void this.mostrar(
          `${r.creadas} semana(s) creada(s).`,
          'success'
        );

        this.seguimiento.recargar();
      },

      error: (e) =>
        void this.mostrar(mensajeError(e), 'danger'),

    });

  }

  protected guardarAvance(): void {

    const valor = this.formAvance.getRawValue();

    this.api.crearAvance({
      reto: this.id,
      fecha: valor.fecha,
      descripcion: valor.descripcion,
      porcentaje: Number(valor.porcentaje),
    }).subscribe({

      next: () => {

        this.formAvance.reset({
          fecha: hoyIso(),
          descripcion: '',
          porcentaje: 0,
        });

        this.recargarAvances$.next();

        void this.mostrar(
          'Avance registrado.',
          'success'
        );

      },

      error: (e) =>
        void this.mostrar(mensajeError(e), 'danger'),

    });

  }

  private async mostrar(
    mensaje: string,
    color: 'success' | 'danger'
  ): Promise<void> {

    const aviso = await this.toast.create({
      message: mensaje,
      color,
      duration: 2500,
    });

    await aviso.present();

  }

}
