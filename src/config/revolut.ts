// Configurazione Revolut Business API
export const REVOLUT_CONFIG = {
  // URL base per le API Revolut
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://b2b.revolut.com/api/1.0' 
    : 'https://sandbox-b2b.revolut.com/api/1.0',
  
  // API Keys (da configurare nelle variabili d'ambiente)
  API_KEY: process.env.REVOLUT_API_KEY,
  WEBHOOK_SECRET: process.env.REVOLUT_WEBHOOK_SECRET,
  
  // Configurazione pagamenti
  CURRENCY: 'EUR',
  COUNTRY: 'IT',
  
  // URL di callback
  SUCCESS_URL: process.env.NEXT_PUBLIC_APP_URL + '/payment/success',
  CANCEL_URL: process.env.NEXT_PUBLIC_APP_URL + '/payment/cancel',
  WEBHOOK_URL: process.env.NEXT_PUBLIC_APP_URL + '/api/webhooks/revolut',
};

// Tipi per le API Revolut
export interface RevolutPaymentRequest {
  amount: number;
  currency: string;
  description: string;
  order_id: string;
  customer_email: string;
  customer_name?: string;
  return_url: string;
  webhook_url: string;
  metadata?: Record<string, unknown>;
}

export interface RevolutPaymentResponse {
  id: string;
  public_id: string;
  amount: number;
  currency: string;
  state: 'PENDING' | 'PROCESSING' | 'AUTHORISED' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  description: string;
  order_id: string;
  customer_email: string;
  created_at: string;
  updated_at: string;
  payment_method?: {
    type: string;
    card?: {
      last4: string;
      brand: string;
    };
  };
  checkout_url?: string;
}

export interface RevolutWebhookPayload {
  type: 'PaymentCreated' | 'PaymentUpdated' | 'PaymentCompleted' | 'PaymentFailed';
  data: {
    id: string;
    public_id: string;
    state: string;
    amount: number;
    currency: string;
    order_id: string;
    customer_email: string;
  };
}
