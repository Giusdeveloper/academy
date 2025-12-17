import axios, { AxiosResponse } from 'axios';
import { REVOLUT_CONFIG, RevolutPaymentRequest, RevolutPaymentResponse } from '@/config/revolut';

class RevolutService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = REVOLUT_CONFIG.BASE_URL;
    this.apiKey = REVOLUT_CONFIG.API_KEY || '';
    
    if (!this.apiKey) {
      throw new Error('REVOLUT_API_KEY non configurata nelle variabili d\'ambiente');
    }
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  /**
   * Crea un nuovo pagamento
   */
  async createPayment(paymentData: RevolutPaymentRequest): Promise<RevolutPaymentResponse> {
    try {
      const response: AxiosResponse<RevolutPaymentResponse> = await axios.post(
        `${this.baseURL}/payments`,
        {
          ...paymentData,
          return_url: REVOLUT_CONFIG.SUCCESS_URL,
          webhook_url: REVOLUT_CONFIG.WEBHOOK_URL,
        },
        {
          headers: this.getHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      console.error('Errore nella creazione del pagamento Revolut:', error);
      throw new Error('Impossibile creare il pagamento');
    }
  }

  /**
   * Recupera i dettagli di un pagamento
   */
  async getPayment(paymentId: string): Promise<RevolutPaymentResponse> {
    try {
      const response: AxiosResponse<RevolutPaymentResponse> = await axios.get(
        `${this.baseURL}/payments/${paymentId}`,
        {
          headers: this.getHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      console.error('Errore nel recupero del pagamento Revolut:', error);
      throw new Error('Impossibile recuperare il pagamento');
    }
  }

  /**
   * Cancella un pagamento
   */
  async cancelPayment(paymentId: string): Promise<RevolutPaymentResponse> {
    try {
      const response: AxiosResponse<RevolutPaymentResponse> = await axios.post(
        `${this.baseURL}/payments/${paymentId}/cancel`,
        {},
        {
          headers: this.getHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      console.error('Errore nella cancellazione del pagamento Revolut:', error);
      throw new Error('Impossibile cancellare il pagamento');
    }
  }

  /**
   * Verifica la firma del webhook
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    // Implementazione della verifica della firma del webhook
    // Revolut fornisce una firma HMAC per verificare l'autenticità
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', REVOLUT_CONFIG.WEBHOOK_SECRET || '')
      .update(payload)
      .digest('hex');
    
    return signature === expectedSignature;
  }

  /**
   * Crea un pagamento per un corso
   */
  async createCoursePayment(courseId: string, courseTitle: string, price: number, userEmail: string, userName?: string) {
    const orderId = `course_${courseId}_${Date.now()}`;
    
    const paymentData: RevolutPaymentRequest = {
      amount: Math.round(price * 100), // Revolut richiede l'importo in centesimi
      currency: REVOLUT_CONFIG.CURRENCY,
      description: `Acquisto corso: ${courseTitle}`,
      order_id: orderId,
      customer_email: userEmail,
      customer_name: userName,
      metadata: {
        course_id: courseId,
        course_title: courseTitle,
        type: 'course_purchase',
      },
    };

    return await this.createPayment(paymentData);
  }
}

// Esporta un'istanza singleton
export const revolutService = new RevolutService();
export default revolutService;
