import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToastService, Toast, ToastType } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService]
    });

    service = TestBed.inject(ToastService);
  });

  describe('Inicialização', () => {
    it('deve ser criado', () => {
      expect(service).toBeTruthy();
    });

    it('deve inicializar sem toasts', () => {
      expect(service.toasts().length).toBe(0);
    });
  });

  describe('show', () => {
    it('deve adicionar toast ao array', () => {
      service.show('Mensagem de teste', 'info');

      expect(service.toasts().length).toBe(1);
      expect(service.toasts()[0].message).toBe('Mensagem de teste');
      expect(service.toasts()[0].type).toBe('info');
    });

    it('deve gerar ID único para cada toast', () => {
      service.show('Toast 1', 'info');
      service.show('Toast 2', 'success');

      const ids = service.toasts().map(t => t.id);
      expect(ids[0]).not.toBe(ids[1]);
    });

    it('deve usar duração padrão de 5000ms', () => {
      service.show('Mensagem', 'info');

      expect(service.toasts()[0].duration).toBe(5000);
    });

    it('deve permitir duração customizada', () => {
      service.show('Mensagem', 'info', 3000);

      expect(service.toasts()[0].duration).toBe(3000);
    });
  });

  describe('Métodos de conveniência', () => {
    it('success deve criar toast do tipo success', () => {
      service.success('Sucesso!');

      expect(service.toasts()[0].type).toBe('success');
    });

    it('error deve criar toast do tipo error', () => {
      service.error('Erro!');

      expect(service.toasts()[0].type).toBe('error');
    });

    it('warning deve criar toast do tipo warning', () => {
      service.warning('Atenção!');

      expect(service.toasts()[0].type).toBe('warning');
    });

    it('info deve criar toast do tipo info', () => {
      service.info('Informação');

      expect(service.toasts()[0].type).toBe('info');
    });
  });

  describe('dismiss', () => {
    it('deve remover toast por ID', () => {
      service.show('Mensagem 1', 'info');
      service.show('Mensagem 2', 'success');

      const toastId = service.toasts()[0].id;
      service.dismiss(toastId);

      expect(service.toasts().length).toBe(1);
      expect(service.toasts()[0].message).toBe('Mensagem 2');
    });

    it('não deve lançar erro se ID não existir', () => {
      expect(() => service.dismiss('id-inexistente')).not.toThrow();
    });
  });

  describe('dismissAll', () => {
    it('deve remover todos os toasts', () => {
      service.show('Toast 1', 'info');
      service.show('Toast 2', 'success');
      service.show('Toast 3', 'error');

      service.dismissAll();

      expect(service.toasts().length).toBe(0);
    });
  });

  describe('Auto-dismiss', () => {
    it('deve remover toast automaticamente após duração', fakeAsync(() => {
      service.show('Mensagem', 'info', 1000);

      expect(service.toasts().length).toBe(1);

      tick(1100);

      expect(service.toasts().length).toBe(0);
    }));

    it('deve manter toast até a duração especificada', fakeAsync(() => {
      service.show('Mensagem', 'info', 3000);

      tick(2000);
      expect(service.toasts().length).toBe(1);

      tick(1100);
      expect(service.toasts().length).toBe(0);
    }));
  });

  describe('Múltiplos Toasts', () => {
    it('deve permitir múltiplos toasts simultâneos', () => {
      service.success('Sucesso');
      service.error('Erro');
      service.warning('Atenção');
      service.info('Info');

      expect(service.toasts().length).toBe(4);
    });

    it('deve remover toasts na ordem correta', fakeAsync(() => {
      service.show('Toast 1', 'info', 1000);
      tick(500);
      service.show('Toast 2', 'success', 1000);

      tick(600); // 1100ms total para Toast 1
      expect(service.toasts().length).toBe(1);
      expect(service.toasts()[0].message).toBe('Toast 2');

      tick(500); // 1100ms total para Toast 2
      expect(service.toasts().length).toBe(0);
    }));
  });
});
