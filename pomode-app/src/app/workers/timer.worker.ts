// Timer Worker - Roda em thread separada para evitar throttling do navegador
let targetEndTime = 0;
let intervalId: any = null;

self.onmessage = (e: MessageEvent) => {
  const { action, endTime } = e.data;

  switch (action) {
    case 'start':
      targetEndTime = endTime;
      startTimer();
      break;

    case 'stop':
      stopTimer();
      break;

    case 'check':
      checkStatus();
      break;
  }
};

function startTimer() {
  stopTimer(); // Limpa qualquer timer anterior

  // Verifica a cada 100ms
  intervalId = setInterval(() => {
    const now = Date.now();
    const remaining = Math.max(0, Math.ceil((targetEndTime - now) / 1000));

    // Envia atualização para o thread principal
    self.postMessage({
      type: 'tick',
      remaining,
      now
    });

    // Se completou
    if (remaining <= 0) {
      self.postMessage({
        type: 'complete'
      });
      stopTimer();
    }
  }, 100);
}

function stopTimer() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function checkStatus() {
  if (targetEndTime === 0) return;

  const now = Date.now();
  const remaining = Math.max(0, Math.ceil((targetEndTime - now) / 1000));

  self.postMessage({
    type: 'status',
    remaining,
    completed: remaining <= 0
  });
}
