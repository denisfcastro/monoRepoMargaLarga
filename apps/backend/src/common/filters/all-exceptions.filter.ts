import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface ValidationError {
  field: string;
  messages: string[];
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = 'Ocorreu um erro interno no servidor. Tente novamente mais tarde.';
    let errors: ValidationError[] | undefined;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const body = exceptionResponse as Record<string, unknown>;

        // Erros de ValidationPipe (class-validator) retornam array de mensagens
        if (Array.isArray(body['message'])) {
          message = 'Verifique os campos informados e corrija os erros apontados.';
          errors = this.parseValidationErrors(body['message'] as string[]);
        } else {
          message = (body['message'] as string) || message;
        }
      } else if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      }
    } else if (exception instanceof Error) {
      // Erros inesperados: loga internamente mas não vaza detalhes
      console.error('[AllExceptionsFilter] Erro inesperado:', exception);
    }

    const payload: Record<string, unknown> = {
      statusCode,
      message,
      timestamp: new Date().toISOString(),
    };

    if (errors) {
      payload['errors'] = errors;
    }

    response.status(statusCode).json(payload);
  }

  private parseValidationErrors(messages: string[]): ValidationError[] {
    // Agrupa mensagens do class-validator por campo (formato: "campo: mensagem")
    const map = new Map<string, string[]>();

    for (const msg of messages) {
      // class-validator normalmente retorna mensagem direta; tentamos extrair campo
      const parts = msg.split(':');
      if (parts.length >= 2) {
        const field = parts[0].trim();
        const fieldMsg = parts.slice(1).join(':').trim();
        if (!map.has(field)) map.set(field, []);
        map.get(field)!.push(fieldMsg);
      } else {
        const field = 'geral';
        if (!map.has(field)) map.set(field, []);
        map.get(field)!.push(msg);
      }
    }

    return Array.from(map.entries()).map(([field, fieldMessages]) => ({
      field,
      messages: fieldMessages,
    }));
  }
}
