import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { Certificado } from './certificados.service';

@Injectable()
export class PdfService {
  private readonly uploadsDir = path.join(process.cwd(), 'uploads', 'certificados');

  constructor() {
    // Não criar diretório no construtor para evitar problemas de permissão
  }

  private ensureUploadsDir(): void {
    if (!fs.existsSync(this.uploadsDir)) {
      try {
        fs.mkdirSync(this.uploadsDir, { recursive: true });
      } catch (error) {
        console.error('Erro ao criar diretório uploads:', error);
      }
    }
  }

  async generateCertificadoPDF(certificado: Certificado): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    const html = this.generateCertificadoHTML(certificado);
    
    await page.setContent(html);
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });

    await browser.close();
    return pdf;
  }

  async saveCertificadoPDF(certificado: Certificado): Promise<string> {
    this.ensureUploadsDir(); // Criar diretório apenas quando necessário
    
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
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Certificado - ${certificado.titulo}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .certificate {
            background: white;
            padding: 60px;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 800px;
            width: 100%;
          }
          .header {
            border-bottom: 3px solid #667eea;
            padding-bottom: 30px;
            margin-bottom: 40px;
          }
          .title {
            font-size: 36px;
            color: #333;
            margin: 0;
            font-weight: bold;
          }
          .subtitle {
            font-size: 18px;
            color: #666;
            margin: 10px 0 0 0;
          }
          .content {
            margin: 40px 0;
          }
          .participant-name {
            font-size: 28px;
            color: #667eea;
            font-weight: bold;
            margin: 20px 0;
          }
          .training-info {
            font-size: 16px;
            color: #555;
            line-height: 1.6;
            margin: 20px 0;
          }
          .dates {
            display: flex;
            justify-content: space-between;
            margin: 40px 0;
            font-size: 14px;
            color: #666;
          }
          .qr-code {
            margin: 30px 0;
            text-align: center;
          }
          .qr-code img {
            width: 100px;
            height: 100px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #999;
          }
          .certificate-number {
            font-size: 14px;
            color: #667eea;
            font-weight: bold;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="header">
            <h1 class="title">CERTIFICADO</h1>
            <p class="subtitle">Sistema SST Platform</p>
          </div>
          
          <div class="content">
            <p class="training-info">
              Certificamos que <span class="participant-name">${certificado.participante.nome}</span>
              participou com aproveitamento do treinamento:
            </p>
            
            <h2 style="color: #333; margin: 30px 0;">${certificado.treinamento.titulo}</h2>
            
            <div class="training-info">
              <p><strong>Instrutor:</strong> ${certificado.treinamento.instrutor}</p>
              <p><strong>Carga Horária:</strong> ${certificado.treinamento.cargaHoraria} horas</p>
              <p><strong>Descrição:</strong> ${certificado.descricao}</p>
            </div>
            
            <div class="certificate-number">
              Certificado Nº: ${certificado.numero}
            </div>
          </div>
          
          <div class="dates">
            <div>
              <strong>Data de Emissão:</strong><br>
              ${dataEmissao}
            </div>
            <div>
              <strong>Validade:</strong><br>
              ${dataValidade}
            </div>
          </div>
          
          <div class="qr-code">
            <p><strong>Código QR para Validação</strong></p>
            <img src="data:image/png;base64,${certificado.qrCode}" alt="QR Code">
          </div>
          
          <div class="footer">
            <p>Este certificado pode ser validado através do QR Code ou no sistema SST Platform</p>
            <p>Link de validação: ${certificado.linkValidacao}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
