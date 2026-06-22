import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { AuthService } from './src/modules/auth/application/services/auth.service';

async function test() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);

  try {
    const result = await authService.login({
      email: 'admin@mangalarga.com',
      senha: 'Admin@1234',
    });
    console.log('Login successful!', result);
  } catch (error: any) {
    console.error('Login failed with error:', error);
    if (error.response) {
      console.error('Error details:', error.response);
    }
  } finally {
    await app.close();
  }
}

test().catch(console.error);
