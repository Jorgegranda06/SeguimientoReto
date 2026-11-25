
from django.contrib import admin

from .models import Avance, Reto, TareaSemanal


class AvanceInline(admin.TabularInline):
    model = Avance
    extra = 0


@admin.register(Reto)
class RetoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'estado', 'fecha_inicio', 'fecha_fin')
    list_filter = ('estado',)
    search_fields = ('titulo', 'descripcion')
    inlines = [AvanceInline]


@admin.register(Avance)
class AvanceAdmin(admin.ModelAdmin):
    list_display = ('reto', 'fecha', 'porcentaje')
    list_filter = ('reto',)


@admin.register(TareaSemanal)
class TareaSemanalAdmin(admin.ModelAdmin):
    list_display = (
        'reto',
        'semana',
        'fecha_inicio',
        'fecha_fin',
        'porcentaje',
    )
    list_filter = ('semana', 'reto')
    search_fields = ('reto__titulo', 'descripcion')
    ordering = ('reto', 'semana')
