import {HttpInterceptorFn, HttpResponse} from '@angular/common/http';
import {map} from 'rxjs';
import {HydraResponse} from '../models/hydra-response';

export const hydraInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map(event => {
      if (event instanceof HttpResponse && event.body) {
        const body: any = event.body;

        if (body['hydra:member']) {
          const transformed: HydraResponse<any> = {
            items: body['hydra:member'] as any[],
            totalItems: (body['hydra:totalItems'] as number) || 0,
            context: (body['@context'] as string) || '',
            id: (body['@id'] as string) || '',
            type: (body['@type'] as string) || ''
          };
          return event.clone({ body: transformed });
        }
      }
      return event;
    })
  );
};
