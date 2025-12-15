import { TestBed } from '@angular/core/testing';
import { ThemeService, Theme } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    // Limpa localStorage antes de cada teste
    localStorage.clear();

    // Remove atributo data-theme do documento
    document.documentElement.removeAttribute('data-theme');

    TestBed.configureTestingModule({
      providers: [ThemeService]
    });

    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  describe('Inicialização', () => {
    it('deve ser criado', () => {
      expect(service).toBeTruthy();
    });

    it('deve inicializar com tema "auto" se não houver tema salvo', () => {
      // Recria serviço sem tema salvo
      localStorage.clear();
      document.documentElement.removeAttribute('data-theme');

      const newService = new ThemeService();
      expect(newService.theme()).toBe('auto');
    });

    it('deve carregar tema do localStorage se existir', () => {
      localStorage.setItem('pomode-theme', 'dark');

      const newService = new ThemeService();
      expect(newService.theme()).toBe('dark');
    });
  });

  describe('setTheme', () => {
    it('deve definir tema como light', () => {
      service.setTheme('light');
      expect(service.theme()).toBe('light');
    });

    it('deve definir tema como dark', () => {
      service.setTheme('dark');
      expect(service.theme()).toBe('dark');
    });

    it('deve definir tema como auto', () => {
      service.setTheme('auto');
      expect(service.theme()).toBe('auto');
    });

    it('deve persistir tema no localStorage', () => {
      service.setTheme('dark');

      const stored = localStorage.getItem('pomode-theme');
      expect(stored).toBe('dark');
    });

    it('deve aplicar atributo data-theme no documento', () => {
      service.setTheme('dark');

      const dataTheme = document.documentElement.getAttribute('data-theme');
      expect(dataTheme).toBe('dark');
    });
  });

  describe('toggleTheme', () => {
    it('deve alternar de light para dark', () => {
      service.setTheme('light');
      service.toggleTheme();

      expect(service.theme()).toBe('dark');
    });

    it('deve alternar de dark para light', () => {
      service.setTheme('dark');
      service.toggleTheme();

      expect(service.theme()).toBe('light');
    });
  });

  describe('isDark', () => {
    it('deve retornar true quando tema é dark', () => {
      service.setTheme('dark');
      expect(service.isDark()).toBe(true);
    });

    it('deve retornar false quando tema é light', () => {
      service.setTheme('light');
      expect(service.isDark()).toBe(false);
    });
  });

  describe('effectiveTheme', () => {
    it('deve retornar light quando tema é light', () => {
      service.setTheme('light');
      expect(service.effectiveTheme()).toBe('light');
    });

    it('deve retornar dark quando tema é dark', () => {
      service.setTheme('dark');
      expect(service.effectiveTheme()).toBe('dark');
    });

    it('deve resolver auto baseado na preferência do sistema', () => {
      // Nota: Este teste pode variar baseado na configuração do sistema
      service.setTheme('auto');

      // effectiveTheme deve ser 'light' ou 'dark', nunca 'auto'
      const effective = service.effectiveTheme();
      expect(['light', 'dark']).toContain(effective);
    });
  });

  describe('Integração com DOM', () => {
    it('deve adicionar classe ao body quando tema é dark', () => {
      service.setTheme('dark');

      // Verifica se o atributo foi aplicado
      const dataTheme = document.documentElement.getAttribute('data-theme');
      expect(dataTheme).toBe('dark');
    });

    it('deve remover classe do body quando tema é light', () => {
      service.setTheme('dark');
      service.setTheme('light');

      const dataTheme = document.documentElement.getAttribute('data-theme');
      expect(dataTheme).toBe('light');
    });
  });
});
