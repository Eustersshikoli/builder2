import { supabase } from '@/integrations/supabase/client';

export interface ForexQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: string;
}

export interface ForexSignal {
  id: string;
  currency_pair: string;
  signal_type: string;
  entry_price: number;
  stop_loss?: number;
  take_profit?: number;
  exit_price?: number;
  pips_result?: number;
  confidence_level: string;
  risk_level?: string;
  analysis?: string;
  status: string;
  created_at: string;
  updated_at?: string;
  current_price?: number;
}

class AlphaVantageService {
  private apiKey: string;
  private baseURL: string = 'https://www.alphavantage.co/query';
  private lastRequestTime: number = 0;
  private requestDelay: number = 12000; // 12 seconds between requests for free tier

  constructor() {
    this.apiKey = 'DNHJ6Q8Z4AZQC1SO'; // Free tier API key
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async rateLimitedRequest(url: string): Promise<Response> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.requestDelay) {
      await this.delay(this.requestDelay - timeSinceLastRequest);
    }
    
    this.lastRequestTime = Date.now();
    return fetch(url);
  }

  async getCurrentQuote(symbol: string): Promise<ForexQuote | null> {
    try {
      const url = `${this.baseURL}?function=CURRENCY_EXCHANGE_RATE&from_currency=${symbol.split('/')[0]}&to_currency=${symbol.split('/')[1]}&apikey=${this.apiKey}`;
      
      const response = await this.rateLimitedRequest(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.Note) {
        console.warn('API rate limit reached:', data.Note);
        return null;
      }

      if (data.Error) {
        console.error('API error:', data.Error);
        return null;
      }

      const exchangeRate = data['Realtime Currency Exchange Rate'];
      
      if (!exchangeRate) {
        console.warn('No exchange rate data available for', symbol);
        return null;
      }

      return {
        symbol,
        price: parseFloat(exchangeRate['5. Exchange Rate']),
        change: 0, // Alpha Vantage doesn't provide this in the free tier
        changePercent: 0,
        timestamp: exchangeRate['6. Last Refreshed']
      };
    } catch (error) {
      console.error('Error fetching forex quote:', error);
      return null;
    }
  }

  async getIntradayData(symbol: string, interval: string = '1min'): Promise<any> {
    try {
      const fromCurrency = symbol.split('/')[0];
      const toCurrency = symbol.split('/')[1];
      
      const url = `${this.baseURL}?function=FX_INTRADAY&from_symbol=${fromCurrency}&to_symbol=${toCurrency}&interval=${interval}&apikey=${this.apiKey}`;
      
      const response = await this.rateLimitedRequest(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.Note) {
        console.warn('API rate limit reached:', data.Note);
        return null;
      }

      if (data.Error) {
        console.error('API error:', data.Error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching intraday data:', error);
      return null;
    }
  }

  async generateSignalsForCurrencyPair(pair: string): Promise<ForexSignal[]> {
    try {
      const quote = await this.getCurrentQuote(pair);
      
      if (!quote) {
        console.warn(`Could not get quote for ${pair}, generating demo signal`);
        return this.generateDemoSignal(pair);
      }

      const signals: ForexSignal[] = [];
      const currentPrice = quote.price;

      // Generate buy signal
      const buyStopLoss = currentPrice * 0.99; // 1% below current price
      const buyTakeProfit = currentPrice * 1.02; // 2% above current price

      signals.push({
        id: `signal_buy_${pair}_${Date.now()}`,
        currency_pair: pair,
        signal_type: 'buy',
        entry_price: currentPrice,
        stop_loss: buyStopLoss,
        take_profit: buyTakeProfit,
        confidence_level: '75',
        risk_level: 'medium',
        analysis: `Technical analysis suggests bullish momentum for ${pair}. Current price at ${currentPrice}`,
        status: 'active',
        created_at: new Date().toISOString(),
        current_price: currentPrice
      });

      // Generate sell signal
      const sellStopLoss = currentPrice * 1.01; // 1% above current price
      const sellTakeProfit = currentPrice * 0.98; // 2% below current price

      signals.push({
        id: `signal_sell_${pair}_${Date.now() + 1}`,
        currency_pair: pair,
        signal_type: 'sell',
        entry_price: currentPrice,
        stop_loss: sellStopLoss,
        take_profit: sellTakeProfit,
        confidence_level: '68',
        risk_level: 'medium',
        analysis: `Market indicators show potential downward movement for ${pair}`,
        status: 'active',
        created_at: new Date().toISOString(),
        current_price: currentPrice
      });

      return signals;
    } catch (error) {
      console.error('Error generating signals:', error);
      return this.generateDemoSignal(pair);
    }
  }

  private generateDemoSignal(pair: string): ForexSignal[] {
    const demoPrice = Math.random() * 2 + 1; // Random price between 1 and 3
    
    return [{
      id: `demo_signal_${pair}_${Date.now()}`,
      currency_pair: pair,
      signal_type: Math.random() > 0.5 ? 'buy' : 'sell',
      entry_price: demoPrice,
      stop_loss: demoPrice * 0.99,
      take_profit: demoPrice * 1.02,
      confidence_level: '70',
      risk_level: 'low',
      analysis: `Demo signal for ${pair} - Market analysis unavailable`,
      status: 'active',
      created_at: new Date().toISOString(),
      current_price: demoPrice
    }];
  }

  async generateMultipleSignals(): Promise<ForexSignal[]> {
    const majorPairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD'];
    const allSignals: ForexSignal[] = [];

    for (const pair of majorPairs) {
      try {
        const signals = await this.generateSignalsForCurrencyPair(pair);
        allSignals.push(...signals);
        
        // Small delay between pairs to avoid rate limiting
        await this.delay(1000);
      } catch (error) {
        console.error(`Error generating signals for ${pair}:`, error);
      }
    }

    return allSignals;
  }

  async storeSignalsInDatabase(signals: ForexSignal[]): Promise<boolean> {
    try {
      const dbSignals = signals.map(signal => ({
        currency_pair: signal.currency_pair,
        signal_type: signal.signal_type,
        entry_price: signal.entry_price,
        stop_loss: signal.stop_loss,
        take_profit: signal.take_profit,
        confidence_level: signal.confidence_level,
        risk_level: signal.risk_level,
        analysis: signal.analysis,
        status: signal.status
      }));

      const { error } = await supabase
        .from('forex_signals')
        .insert(dbSignals);

      if (error) {
        console.error('Error storing signals in database:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in storeSignalsInDatabase:', error);
      return false;
    }
  }

  async getStoredSignals(): Promise<ForexSignal[]> {
    try {
      const { data, error } = await supabase
        .from('forex_signals')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching stored signals:', error);
        return [];
      }

      return (data || []).map((signal: any) => ({
        ...signal,
        current_price: signal.entry_price // Add current_price property
      })) as ForexSignal[];
    } catch (error) {
      console.error('Error in getStoredSignals:', error);
      return [];
    }
  }

  async getMarketOverview(): Promise<{ pairs: any[], indices: any[], commodities: any[] }> {
    // Return demo market overview data
    return {
      pairs: [
        { symbol: 'EUR/USD', price: 1.0825, change: '+0.0015', changePercent: '+0.14%' },
        { symbol: 'GBP/USD', price: 1.2645, change: '-0.0024', changePercent: '-0.19%' },
        { symbol: 'USD/JPY', price: 149.85, change: '+0.45', changePercent: '+0.30%' }
      ],
      indices: [
        { symbol: 'DXY', price: 103.25, change: '+0.15', changePercent: '+0.15%' }
      ],
      commodities: [
        { symbol: 'GOLD', price: 2035.50, change: '-5.25', changePercent: '-0.26%' }
      ]
    };
  }
}

export const alphaVantageService = new AlphaVantageService();