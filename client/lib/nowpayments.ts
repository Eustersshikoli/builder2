import { supabase } from '@/integrations/supabase/client';

export interface PaymentCurrency {
  currency: string;
  name: string;
  logo_url: string;
  min_amount: number;
  max_amount: number;
}

export interface PaymentEstimate {
  currency_from: string;
  amount_from: number;
  currency_to: string;
  estimated_amount: number;
}

export interface PaymentRequest {
  price_amount: number;
  price_currency: string;
  pay_currency: string;
  order_id: string;
  order_description: string;
  ipn_callback_url?: string;
  success_url?: string;
  cancel_url?: string;
}

export interface PaymentResponse {
  payment_id: string;
  payment_status: string;
  pay_address: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  pay_currency: string;
  order_id: string;
  order_description: string;
  purchase_id: string;
  outcome_amount: number;
  outcome_currency: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentStatus {
  payment_id: string;
  payment_status: string;
  pay_address: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  pay_currency: string;
  actually_paid: number;
  pay_in: string;
  order_id: string;
  order_description: string;
  purchase_id: string;
  outcome_amount: number;
  outcome_currency: string;
  created_at: string;
  updated_at: string;
}

const NOWPAYMENTS_API_URL = import.meta.env.VITE_NOWPAYMENTS_API_URL;
const NOWPAYMENTS_API_KEY = import.meta.env.VITE_NOWPAYMENTS_API_KEY;

class NOWPaymentsService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = NOWPAYMENTS_API_KEY;
    this.baseUrl = NOWPAYMENTS_API_URL;
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`NOWPayments API Error: ${response.status} - ${errorData.message || response.statusText}`);
    }

    return response.json();
  }

  async getApiStatus(): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>('/status');
  }

  async getAvailableCurrencies(): Promise<{ currencies: string[] }> {
    return this.makeRequest<{ currencies: string[] }>('/currencies');
  }

  async getCurrenciesForPayout(): Promise<{ currencies: string[] }> {
    return this.makeRequest<{ currencies: string[] }>('/merchant/coins');
  }

  async getEstimatedPrice(params: {
    amount: number;
    currency_from: string;
    currency_to: string;
  }): Promise<PaymentEstimate> {
    const queryParams = new URLSearchParams({
      amount: params.amount.toString(),
      currency_from: params.currency_from,
      currency_to: params.currency_to,
    });

    return this.makeRequest<PaymentEstimate>(`/estimate?${queryParams}`);
  }

  async getMinimumPaymentAmount(params: {
    currency_from: string;
    currency_to: string;
  }): Promise<{ min_amount: number }> {
    const queryParams = new URLSearchParams({
      currency_from: params.currency_from,
      currency_to: params.currency_to,
    });

    return this.makeRequest<{ min_amount: number }>(`/min-amount?${queryParams}`);
  }

  async createPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    return this.makeRequest<PaymentResponse>('/payment', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    return this.makeRequest<PaymentStatus>(`/payment/${paymentId}`);
  }

  async getPaymentsByOrderId(orderId: string): Promise<{ data: PaymentStatus[] }> {
    return this.makeRequest<{ data: PaymentStatus[] }>(`/payment/order/${orderId}`);
  }

  // Helper method to create payment with Supabase integration
  async createInvestmentPayment(
    userId: string,
    investmentId: string,
    amount: number,
    paymentCurrency: string = 'btc',
    orderDescription: string = 'Investment Payment'
  ): Promise<{ payment: PaymentResponse; dbPayment: any }> {
    try {
      // Generate unique order ID
      const orderId = `inv_${investmentId}_${Date.now()}`;

      // Create payment request
      const paymentData: PaymentRequest = {
        price_amount: amount,
        price_currency: 'usd',
        pay_currency: paymentCurrency,
        order_id: orderId,
        order_description: orderDescription,
        ipn_callback_url: `${window.location.origin}/api/payment-webhook`,
        success_url: `${window.location.origin}/dashboard?payment=success`,
        cancel_url: `${window.location.origin}/dashboard?payment=cancelled`,
      };

      // Create payment with NOWPayments
      const payment = await this.createPayment(paymentData);

      // Save payment to Supabase
      const { data: dbPayment, error } = await supabase
        .from('deposits')
        .insert({
          user_id: userId,
          amount: amount,
          currency: 'usd',
          crypto_currency: paymentCurrency,
          payment_address: payment.pay_address,
          nowpayments_id: payment.payment_id,
          status: payment.payment_status,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to save payment to database: ${error.message}`);
      }

      return { payment, dbPayment };
    } catch (error) {
      console.error('Error creating investment payment:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  // Method to update payment status in Supabase
  async updatePaymentStatus(paymentId: string): Promise<PaymentStatus> {
    try {
      // Get payment status from NOWPayments
      const paymentStatus = await this.getPaymentStatus(paymentId);

      // Update payment in Supabase
      const { error } = await supabase
        .from('deposits')
        .update({
          status: paymentStatus.payment_status,
          updated_at: new Date().toISOString(),
        })
        .eq('nowpayments_id', paymentId);

      if (error) {
        console.error('Failed to update payment status in database:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
      }

      // If payment is confirmed, activate the investment
      if (paymentStatus.payment_status === 'finished') {
        await this.activateInvestment(paymentId);
      }

      return paymentStatus;
    } catch (error) {
      console.error('Error updating payment status:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  private async activateInvestment(paymentId: string): Promise<void> {
    try {
      // Get payment details
      const { data: payment } = await supabase
        .from('deposits')
        .select('user_id')
        .eq('nowpayments_id', paymentId)
        .single();

      if (payment?.user_id) {
        // Add to user balance instead of activating investment
        const { error } = await supabase
          .from('user_balances')
          .upsert({
            user_id: payment.user_id,
            balance: 0, // This would need proper calculation
            updated_at: new Date().toISOString(),
          });

        if (error) {
          console.error('Failed to update balance:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
          });
        }
      }
    } catch (error) {
      console.error('Error activating investment:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
    }
  }

  // Get popular cryptocurrencies for payment
  getPopularCryptoCurrencies(): PaymentCurrency[] {
    return [
      {
        currency: 'btc',
        name: 'Bitcoin',
        logo_url: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
        min_amount: 0.00001,
        max_amount: 100,
      },
      {
        currency: 'eth',
        name: 'Ethereum',
        logo_url: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
        min_amount: 0.001,
        max_amount: 1000,
      },
      {
        currency: 'usdt',
        name: 'Tether',
        logo_url: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
        min_amount: 1,
        max_amount: 100000,
      },
      {
        currency: 'usdc',
        name: 'USD Coin',
        logo_url: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
        min_amount: 1,
        max_amount: 100000,
      },
      {
        currency: 'ltc',
        name: 'Litecoin',
        logo_url: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png',
        min_amount: 0.001,
        max_amount: 10000,
      },
      {
        currency: 'ada',
        name: 'Cardano',
        logo_url: 'https://cryptologos.cc/logos/cardano-ada-logo.png',
        min_amount: 1,
        max_amount: 1000000,
      },
      {
        currency: 'bnb',
        name: 'Binance Coin',
        logo_url: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
        min_amount: 0.01,
        max_amount: 10000,
      },
      {
        currency: 'sol',
        name: 'Solana',
        logo_url: 'https://cryptologos.cc/logos/solana-sol-logo.png',
        min_amount: 0.01,
        max_amount: 10000,
      },
      {
        currency: 'xrp',
        name: 'Ripple',
        logo_url: 'https://cryptologos.cc/logos/xrp-xrp-logo.png',
        min_amount: 1,
        max_amount: 1000000,
      },
      {
        currency: 'doge',
        name: 'Dogecoin',
        logo_url: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png',
        min_amount: 1,
        max_amount: 1000000,
      },
    ];
  }
}

export const nowPaymentsService = new NOWPaymentsService();
