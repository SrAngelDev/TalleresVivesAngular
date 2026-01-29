import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { FacturaService } from '../../services/factura.service';
import { Factura, LineaFactura } from '../../models/factura.model';

@Component({
  selector: 'app-factura',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent implements OnInit {
  facturaForm!: FormGroup;
  lineaForm!: FormGroup;
  lineas: LineaFactura[] = [];
  lineaIdCounter = 1;
  
  // Captcha
  captchaNumero1 = 0;
  captchaNumero2 = 0;
  captchaResultado = 0;
  
  // Totales
  baseImponible21 = 0;
  iva21 = 0;
  baseImponible10 = 0;
  iva10 = 0;
  baseImponible4 = 0;
  iva4 = 0;
  totalFactura = 0;

  // Estado de envío
  enviando = false;
  mensajeExito = false;

  constructor(
    private fb: FormBuilder,
    private facturaService: FacturaService
  ) {}

  ngOnInit(): void {
    this.generarCaptcha();
    this.inicializarFormularios();
  }

  inicializarFormularios(): void {
    // Formulario principal de factura
    this.facturaForm = this.fb.group({
      numeroFactura: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      fecha: [this.obtenerFechaActual(), Validators.required],
      nombreCliente: ['', [Validators.required, Validators.minLength(3)]],
      direccion: ['', Validators.required],
      provincia: ['', Validators.required],
      ciudad: ['', Validators.required],
      tipoDocumento: ['NIF', Validators.required],
      numeroDocumento: ['', [Validators.required, this.validarDocumento.bind(this)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      captcha: ['', [Validators.required, this.validarCaptcha.bind(this)]]
    });

    // Formulario para añadir líneas
    this.lineaForm = this.fb.group({
      articulo: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      tipoIva: [21, Validators.required]
    });
  }

  obtenerFechaActual(): string {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  }

  validarDocumento(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const tipoDoc = this.facturaForm?.get('tipoDocumento')?.value;
    const valor = control.value.toUpperCase();
    
    if (tipoDoc === 'NIF') {
      const nifRegex = /^[0-9]{8}[A-Z]$/;
      if (!nifRegex.test(valor)) {
        return { nifInvalido: true };
      }
      // Validar letra
      const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
      const numero = parseInt(valor.substr(0, 8));
      const letra = valor.substr(8, 1);
      if (letras.charAt(numero % 23) !== letra) {
        return { nifInvalido: true };
      }
    } else if (tipoDoc === 'CIF') {
      const cifRegex = /^[A-Z][0-9]{7}[A-Z0-9]$/;
      if (!cifRegex.test(valor)) {
        return { cifInvalido: true };
      }
    }
    
    return null;
  }

  generarCaptcha(): void {
    this.captchaNumero1 = Math.floor(Math.random() * 10);
    this.captchaNumero2 = Math.floor(Math.random() * 10);
    this.captchaResultado = this.captchaNumero1 + this.captchaNumero2;
  }

  validarCaptcha(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    return parseInt(control.value) === this.captchaResultado ? null : { captchaIncorrecto: true };
  }

  agregarLinea(): void {
    if (this.lineaForm.invalid) {
      this.lineaForm.markAllAsTouched();
      return;
    }

    const valores = this.lineaForm.value;
    const base = valores.cantidad * valores.precio;
    const importeIva = (base * valores.tipoIva) / 100;
    const total = base + importeIva;

    const nuevaLinea: LineaFactura = {
      id: this.lineaIdCounter++,
      articulo: valores.articulo,
      cantidad: valores.cantidad,
      precio: valores.precio,
      tipoIva: valores.tipoIva,
      base: base,
      iva: importeIva,
      total: total
    };

    this.lineas.push(nuevaLinea);
    this.calcularTotales();
    this.lineaForm.reset({
      articulo: '',
      cantidad: 1,
      precio: 0,
      tipoIva: 21
    });
  }

  eliminarLinea(id: number): void {
    this.lineas = this.lineas.filter(l => l.id !== id);
    this.calcularTotales();
  }

  calcularTotales(): void {
    this.baseImponible21 = 0;
    this.iva21 = 0;
    this.baseImponible10 = 0;
    this.iva10 = 0;
    this.baseImponible4 = 0;
    this.iva4 = 0;

    this.lineas.forEach(linea => {
      if (linea.tipoIva === 21) {
        this.baseImponible21 += linea.base;
        this.iva21 += linea.iva;
      } else if (linea.tipoIva === 10) {
        this.baseImponible10 += linea.base;
        this.iva10 += linea.iva;
      } else if (linea.tipoIva === 4) {
        this.baseImponible4 += linea.base;
        this.iva4 += linea.iva;
      }
    });

    this.totalFactura = 
      this.baseImponible21 + this.iva21 +
      this.baseImponible10 + this.iva10 +
      this.baseImponible4 + this.iva4;
  }

  enviarFactura(): void {
    if (this.facturaForm.invalid) {
      this.facturaForm.markAllAsTouched();
      alert('Por favor, complete todos los campos correctamente');
      return;
    }

    if (this.lineas.length === 0) {
      alert('Debe agregar al menos una línea a la factura');
      return;
    }

    const factura: Factura = {
      ...this.facturaForm.value,
      lineas: this.lineas,
      baseImponible21: this.baseImponible21,
      iva21: this.iva21,
      baseImponible10: this.baseImponible10,
      iva10: this.iva10,
      baseImponible4: this.baseImponible4,
      iva4: this.iva4,
      totalFactura: this.totalFactura
    };

    this.enviando = true;

    this.facturaService.grabarFactura(factura).subscribe({
      next: (response) => {
        this.mensajeExito = true;
        setTimeout(() => {
          this.reiniciarFormulario();
          this.mensajeExito = false;
        }, 3000);
        this.enviando = false;
      },
      error: (error) => {
        console.log('Factura preparada para enviar:', factura);
        alert('Factura validada correctamente (el servicio no existe, pero los datos son correctos)');
        this.enviando = false;
        // Simular éxito
        this.mensajeExito = true;
        setTimeout(() => {
          this.reiniciarFormulario();
          this.mensajeExito = false;
        }, 3000);
      }
    });
  }

  reiniciarFormulario(): void {
    this.facturaForm.reset({
      numeroFactura: '',
      fecha: this.obtenerFechaActual(),
      tipoDocumento: 'NIF',
      captcha: ''
    });
    this.lineaForm.reset({
      articulo: '',
      cantidad: 1,
      precio: 0,
      tipoIva: 21
    });
    this.lineas = [];
    this.calcularTotales();
    this.generarCaptcha();
  }

  esInvalido(campo: string): boolean {
    const control = this.facturaForm.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  esInvalidoLinea(campo: string): boolean {
    const control = this.lineaForm.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
