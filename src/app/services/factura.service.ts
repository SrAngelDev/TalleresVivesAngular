import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Factura } from '../models/factura.model';

@Injectable({ 
  providedIn: 'root' 
})
export class FacturaService {
  private urlServicio = 'URL_DEL_SERVICIO_JAVA/grabarfactura';

  constructor(private http: HttpClient) { }

  grabarFactura(facturaData: Factura): Observable<any> {
    return this.http.post<any>(this.urlServicio, facturaData);
  }
}
