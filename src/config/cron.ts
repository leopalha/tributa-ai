import cron from 'node-cron';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Executa a verificação de obrigações todos os dias às 9h
export function startObligationsCheck() {
  cron.schedule('0 9 * * *', async () => {
    try {
      console.log('Iniciando verificação de obrigações...');
      await execAsync('yarn check-obligations');
      console.log('Verificação de obrigações concluída');
    } catch (error) {
      console.error('Erro ao executar verificação de obrigações:', error);
    }
  });
}
