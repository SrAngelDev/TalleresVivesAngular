export interface LineaFactura {
  id: number;
  articulo: string;
  cantidad: number;
  precio: number;
  tipoIva: number; // 21, 10, 4
  base: number;
  iva: number;
  total: number;
}

export interface Factura {
  numeroFactura: string;
  fecha: string;
  nombreCliente: string;
  direccion: string;
  provincia: string;
  ciudad: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono: string;
  email: string;
  lineas: LineaFactura[];
  baseImponible21: number;
  iva21: number;
  baseImponible10: number;
  iva10: number;
  baseImponible4: number;
  iva4: number;
  totalFactura: number;
}
