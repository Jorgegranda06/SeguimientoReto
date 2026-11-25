import { calcularRecuperacion } from './recuperacion';

describe('Asistente de recuperación', () => {

  it('debe calcular el avance diario desde cero', () => {
    const plan = calcularRecuperacion(0, 5);

    expect(plan.diasDisponibles).toBe(6);
    expect(plan.porcentajePendiente).toBe(100);
    expect(plan.avanceDiario).toBe(17);
  });

  it('debe recalcular el plan con un progreso del 40%', () => {
    const plan = calcularRecuperacion(40, 5);

    expect(plan.porcentajePendiente).toBe(60);
    expect(plan.avanceDiario).toBe(10);
    expect(plan.nivel).toBe('normal');
  });

  it('debe generar metas hasta alcanzar el 100%', () => {
    const plan = calcularRecuperacion(40, 5);

    expect(plan.metas.map(m => m.meta))
      .toEqual([50, 60, 70, 80, 90, 100]);
  });

  it('debe reconocer un objetivo completado', () => {
    const plan = calcularRecuperacion(100, 5);

    expect(plan.nivel).toBe('completado');
    expect(plan.avanceDiario).toBe(0);
    expect(plan.metas.length).toBe(0);
  });

  it('debe detectar una situación urgente', () => {
    const plan = calcularRecuperacion(10, 0);

    expect(plan.nivel).toBe('urgente');
    expect(plan.diasDisponibles).toBe(1);
    expect(plan.avanceDiario).toBe(90);
  });

  it('no debe generar metas para una semana cerrada', () => {
    const plan = calcularRecuperacion(40, -1);

    expect(plan.nivel).toBe('cerrado');
    expect(plan.diasDisponibles).toBe(0);
    expect(plan.metas.length).toBe(0);
  });

});
