import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { Certificado } from './certificados.service';

@Injectable()
export class PdfService {
  private readonly uploadsDir = path.join(process.cwd(), 'uploads', 'certificados');

  constructor() {
    // Criar diretório de uploads se não existir
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  async generateCertificadoPDF(certificado: Certificado): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      
      // Definir viewport para A4
      await page.setViewport({ width: 794, height: 1123 }); // A4 em pixels
      
      // Gerar HTML do certificado
      const html = this.generateCertificadoHTML(certificado);
      
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      // Gerar PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        }
      });

      return pdfBuffer;
    } finally {
      await browser.close();
    }
  }

  async saveCertificadoPDF(certificado: Certificado): Promise<string> {
    const pdfBuffer = await this.generateCertificadoPDF(certificado);
    const fileName = `${certificado.numero}-${Date.now()}.pdf`;
    const filePath = path.join(this.uploadsDir, fileName);
    
    fs.writeFileSync(filePath, pdfBuffer);
    
    return `/uploads/certificados/${fileName}`;
  }

  private generateCertificadoHTML(certificado: Certificado): string {
    const dataEmissao = new Date(certificado.dataEmissao).toLocaleDateString('pt-BR');
    const dataValidade = new Date(certificado.dataValidade).toLocaleDateString('pt-BR');
    
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Certificado ${certificado.numero}</title>
        <style>
          @page {
            size: A4;
            margin: 20mm;
          }
          
          body {
            font-family: 'Times New Roman', serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
          }
          
          .certificate-container {
            background: white;
            border: 3px solid #2c3e50;
            border-radius: 15px;
            padding: 40px;
            margin: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            position: relative;
            overflow: hidden;
          }
          
          .certificate-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%23f0f0f0"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.1;
            pointer-events: none;
          }
          
          .header {
            text-align: center;
            margin-bottom: 40px;
            position: relative;
            z-index: 1;
          }
          
          .logo {
            width: 120px;
            height: 120px;
            background: #3498db;
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 48px;
            font-weight: bold;
          }
          
          .title {
            font-size: 28px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          
          .subtitle {
            font-size: 16px;
            color: #7f8c8d;
            margin-bottom: 30px;
          }
          
          .certificate-number {
            font-size: 14px;
            color: #95a5a6;
            margin-bottom: 40px;
            text-align: center;
          }
          
          .content {
            text-align: center;
            margin-bottom: 40px;
            position: relative;
            z-index: 1;
          }
          
          .certificate-text {
            font-size: 18px;
            line-height: 1.6;
            color: #34495e;
            margin-bottom: 30px;
          }
          
          .participant-name {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
            margin: 20px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .training-info {
            font-size: 16px;
            color: #34495e;
            margin: 15px 0;
          }
          
          .details {
            display: flex;
            justify-content: space-between;
            margin: 40px 0;
            flex-wrap: wrap;
          }
          
          .detail-item {
            flex: 1;
            min-width: 200px;
            margin: 10px;
            text-align: center;
          }
          
          .detail-label {
            font-size: 12px;
            color: #7f8c8d;
            text-transform: uppercase;
            margin-bottom: 5px;
          }
          
          .detail-value {
            font-size: 14px;
            color: #2c3e50;
            font-weight: bold;
          }
          
          .footer {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            position: relative;
            z-index: 1;
          }
          
          .signature-section {
            text-align: center;
            flex: 1;
          }
          
          .signature-line {
            width: 200px;
            height: 2px;
            background: #2c3e50;
            margin: 10px auto;
          }
          
          .signature-name {
            font-size: 14px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 5px;
          }
          
          .signature-title {
            font-size: 12px;
            color: #7f8c8d;
          }
          
          .qr-section {
            text-align: center;
            flex: 1;
          }
          
          .qr-code {
            width: 80px;
            height: 80px;
            background: #ecf0f1;
            border: 1px solid #bdc3c7;
            margin: 0 auto 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8px;
            color: #7f8c8d;
          }
          
          .validation-info {
            font-size: 10px;
            color: #95a5a6;
            text-align: center;
          }
          
          .hash-info {
            font-size: 8px;
            color: #bdc3c7;
            text-align: center;
            margin-top: 10px;
            word-break: break-all;
          }
          
          .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 120px;
            color: rgba(52, 152, 219, 0.1);
            font-weight: bold;
            pointer-events: none;
            z-index: 0;
          }
          
          .status-badge {
            position: absolute;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
          }
        </style>
      </head>
      <body>
        <div class="certificate-container">
          <div class="watermark">CERTIFICADO</div>
          <div class="status-badge">Emitido</div>
          
          <div class="header">
            <div class="logo">SST</div>
            <div class="title">Certificado de Conclusão</div>
            <div class="subtitle">Sistema de Segurança do Trabalho</div>
            <div class="certificate-number">Número: ${certificado.numero}</div>
          </div>
          
          <div class="content">
            <div class="certificate-text">
              Certificamos que
            </div>
            
            <div class="participant-name">
              ${certificado.participante.nome}
            </div>
            
            <div class="certificate-text">
              concluiu com êxito o treinamento
            </div>
            
            <div class="training-info">
              <strong>${certificado.treinamento.titulo}</strong>
            </div>
            
            <div class="certificate-text">
              com carga horária de <strong>${certificado.treinamento.cargaHoraria} horas</strong>,
              ministrado pelo instrutor <strong>${certificado.treinamento.instrutor}</strong>.
            </div>
            
            ${certificado.nota ? `
            <div class="certificate-text" style="margin-top: 20px;">
              Nota obtida: <strong>${certificado.nota}/100</strong>
            </div>
            ` : ''}
          </div>
          
          <div class="details">
            <div class="detail-item">
              <div class="detail-label">Data de Emissão</div>
              <div class="detail-value">${dataEmissao}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Data de Validade</div>
              <div class="detail-value">${dataValidade}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Tipo de Certificado</div>
              <div class="detail-value">${certificado.tipo.toUpperCase()}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">CPF</div>
              <div class="detail-value">${certificado.participante.cpf}</div>
            </div>
          </div>
          
          <div class="footer">
            <div class="signature-section">
              <div class="signature-line"></div>
              <div class="signature-name">${certificado.treinamento.instrutor}</div>
              <div class="signature-title">Instrutor Responsável</div>
            </div>
            
            <div class="qr-section">
              <div class="qr-code">
                QR Code<br>${certificado.numero}
              </div>
              <div class="validation-info">
                Valide este certificado em:<br>
                ${certificado.linkValidacao}
              </div>
              <div class="hash-info">
                Hash: ${certificado.hash}
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
