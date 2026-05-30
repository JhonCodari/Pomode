import { TestBed } from '@angular/core/testing';
import { IntentionService } from './intention.service';

const STORAGE_KEY = 'pomode_daily_focus';

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

describe('IntentionService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [IntentionService]
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('estado inicial', () => {
    let service: IntentionService;

    beforeEach(() => {
      service = TestBed.inject(IntentionService);
    });

    it('deve ser criado', () => {
      expect(service).toBeTruthy();
    });

    it('intenção inicial é string vazia', () => {
      expect(service.intention()).toBe('');
    });

    it('lista de accomplished inicial é vazia', () => {
      expect(service.accomplished()).toEqual([]);
    });
  });

  describe('set()', () => {
    let service: IntentionService;

    beforeEach(() => {
      service = TestBed.inject(IntentionService);
    });

    it('deve atualizar o sinal de intenção', () => {
      service.set('focar no relatório');
      expect(service.intention()).toBe('focar no relatório');
    });

    it('deve remover espaços extras da intenção', () => {
      service.set('  foco  ');
      expect(service.intention()).toBe('foco');
    });

    it('deve substituir uma intenção anterior', () => {
      service.set('primeira intenção');
      service.set('segunda intenção');
      expect(service.intention()).toBe('segunda intenção');
    });
  });

  describe('clear()', () => {
    let service: IntentionService;

    beforeEach(() => {
      service = TestBed.inject(IntentionService);
    });

    it('deve redefinir a intenção para string vazia', () => {
      service.set('minha meta');
      service.clear();
      expect(service.intention()).toBe('');
    });

    it('não deve afetar a lista de accomplished', () => {
      service.set('meta');
      service.addAccomplished('tarefa feita');
      service.clear();
      expect(service.accomplished()).toEqual(['tarefa feita']);
    });
  });

  describe('addAccomplished()', () => {
    let service: IntentionService;

    beforeEach(() => {
      service = TestBed.inject(IntentionService);
    });

    it('deve adicionar uma intenção à lista de accomplished', () => {
      service.addAccomplished('tarefa A');
      expect(service.accomplished()).toContain('tarefa A');
    });

    it('deve acumular múltiplas intenções accomplished', () => {
      service.addAccomplished('tarefa A');
      service.addAccomplished('tarefa B');
      expect(service.accomplished()).toEqual(['tarefa A', 'tarefa B']);
    });

    it('deve persistir o accomplished no localStorage com a data de hoje', () => {
      service.addAccomplished('tarefa persistida');

      const raw = localStorage.getItem(STORAGE_KEY);
      expect(raw).toBeTruthy();
      const log = JSON.parse(raw!);
      expect(log.date).toBe(todayISO());
      expect(log.accomplished).toContain('tarefa persistida');
    });

    it('deve sobrescrever a entrada anterior no localStorage ao adicionar nova', () => {
      service.addAccomplished('primeiro');
      service.addAccomplished('segundo');

      const raw = localStorage.getItem(STORAGE_KEY);
      const log = JSON.parse(raw!);
      expect(log.accomplished).toEqual(['primeiro', 'segundo']);
    });
  });

  describe('carregamento do localStorage (construtor)', () => {
    it('deve carregar accomplished de hoje ao inicializar', () => {
      const log = { date: todayISO(), accomplished: ['tarefa de hoje A', 'tarefa de hoje B'] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(log));

      const service = TestBed.inject(IntentionService);

      expect(service.accomplished()).toEqual(['tarefa de hoje A', 'tarefa de hoje B']);
    });

    it('não deve carregar accomplished de um dia anterior', () => {
      const log = { date: '2020-01-01', accomplished: ['tarefa de ontem'] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(log));

      const service = TestBed.inject(IntentionService);

      expect(service.accomplished()).toEqual([]);
    });

    it('não deve lançar erro com dado corrompido no localStorage', () => {
      localStorage.setItem(STORAGE_KEY, 'isto não é json válido');

      expect(() => TestBed.inject(IntentionService)).not.toThrow();
    });

    it('deve inicializar com accomplished vazio quando localStorage está vazio', () => {
      const service = TestBed.inject(IntentionService);

      expect(service.accomplished()).toEqual([]);
    });

    it('não deve alterar o sinal de intenção ao carregar dados do localStorage', () => {
      const log = { date: todayISO(), accomplished: ['tarefa A'] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(log));

      const service = TestBed.inject(IntentionService);

      // intention é controlada somente por set(); carregamento não a afeta
      expect(service.intention()).toBe('');
    });
  });

  describe('sinais são readonly', () => {
    it('intention deve expor um ReadonlySignal', () => {
      const service = TestBed.inject(IntentionService);
      // Verifica que o sinal só pode ser lido, não escrito diretamente
      expect(typeof service.intention).toBe('function');
      expect((service.intention as any).set).toBeUndefined();
    });

    it('accomplished deve expor um ReadonlySignal', () => {
      const service = TestBed.inject(IntentionService);
      expect(typeof service.accomplished).toBe('function');
      expect((service.accomplished as any).set).toBeUndefined();
    });
  });
});
