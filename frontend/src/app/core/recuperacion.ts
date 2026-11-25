export interface MetaDiaria {
  dia: number;
  meta: number;
}

export interface PlanRecuperacion {
  porcentajeActual: number;
  porcentajePendiente: number;
  diasDisponibles: number;
  avanceDiario: number;
  nivel: 'completado' | 'normal' | 'urgente' | 'cerrado';
  mensaje: string;
  metas: MetaDiaria[];
}

export function calcularRecuperacion(
  porcentaje: number,
  diasRestantes: number,
): PlanRecuperacion {
  const actual = Math.max(0, Math.min(100, porcentaje));
  const pendiente = 100 - actual;

  // Incluye el día actual como oportunidad de avance.
  const dias = Math.max(0, Math.floor(diasRestantes) + 1);

  const plan: PlanRecuperacion = {
    porcentajeActual: actual,
    porcentajePendiente: pendiente,
    diasDisponibles: dias,
    avanceDiario: 0,
    nivel: 'normal',
    mensaje: '',
    metas: [],
  };

  if (actual === 100) {
    plan.nivel = 'completado';
    plan.mensaje = '¡Felicitaciones! Has cumplido tu objetivo semanal.';
    return plan;
  }

  if (dias === 0) {
    plan.nivel = 'cerrado';
    plan.mensaje = 'La semana ha finalizado.';
    return plan;
  }

  plan.avanceDiario = Math.ceil(pendiente / dias);

  plan.nivel = plan.avanceDiario >= 30
    ? 'urgente'
    : 'normal';

  plan.mensaje = plan.nivel === 'urgente'
    ? 'Necesitas aumentar tu ritmo de avance para cumplir el objetivo.'
    : 'Sigue este plan diario para alcanzar tu objetivo semanal.';

  for (let dia = 1; dia <= dias; dia++) {
    plan.metas.push({
      dia,
      meta: Math.min(
        100,
        Math.ceil(actual + (pendiente * dia) / dias),
      ),
    });
  }

  return plan;
}
