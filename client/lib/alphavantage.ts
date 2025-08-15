import { supabase } from '@/integrations/supabase/client';

export interface ForexQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: string;
}

export interface TechnicalIndicator {
  symbol: string;
  indicator: string;
  value: number;
  timestamp: string;
}

export interface ForexSignal {
  currency_pair: string;
  signal_type: 'BUY' | 'SELL';
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  current_price: number;
  confidence_level: number;
  analysis: string;
  status: 'active' | 'closed' | 'cancelled';
}

const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
const ALPHA_VANTAGE_API_URL = import.meta.env.VITE_ALPHA_VANTAGE_API_URL;

class AlphaVantageService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = ALPHA_VANTAGE_API_KEY;
    this.baseUrl = ALPHA_VANTAGE_API_URL;
  }

  private async makeRequest<T>(params: Record<string, string>): Promise<T> {
    const queryParams = new URLSearchParams({
      ...params,
      apikey: this.apiKey,
    });

    const response = await fetch(`${this.baseUrl}?${queryParams}`);

    if (!response.ok) {
      throw new Error(`Alpha Vantage API Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    // Check for API errors
    if (data['Error Message']) {
      throw new Error(`Alpha Vantage Error: ${data['Error Message']}`);
    }

    if (data['Note']) {
      throw new Error(`Alpha Vantage Rate Limit: ${data['Note']}`);
    }

    return data;
  }

  async getForexRealTimeQuote(fromSymbol: string, toSymbol: string): Promise<ForexQuote> {
    const data = await this.makeRequest({
      function: 'CURRENCY_EXCHANGE_RATE',
      from_currency: fromSymbol,
      to_currency: toSymbol,
    });

    const realtimeData = data['Realtime Currency Exchange Rate'];
    
    return {
      symbol: `${fromSymbol}/${toSymbol}`,
      price: parseFloat(realtimeData['5. Exchange Rate']),
      change: 0, // Real-time doesn't provide change
      changePercent: 0,
      timestamp: realtimeData['6. Last Refreshed'],
    };
  }

  async getForexDailyData(fromSymbol: string, toSymbol: string, outputsize: 'compact' | 'full' = 'compact') {
    const data = await this.makeRequest({
      function: 'FX_DAILY',
      from_symbol: fromSymbol,
      to_symbol: toSymbol,
      outputsize,
    });

    return data['Time Series (Daily)'];
  }

  async getForexIntraday(
    fromSymbol: string, 
    toSymbol: string, 
    interval: '1min' | '5min' | '15min' | '30min' | '60min' = '5min'
  ) {
    const data = await this.makeRequest({
      function: 'FX_INTRADAY',
      from_symbol: fromSymbol,
      to_symbol: toSymbol,
      interval,
    });

    return data[`Time Series (${interval})`];
  }

  async getTechnicalIndicator(
    fromSymbol: string,
    toSymbol: string,
    indicator: string,
    interval: string = 'daily',
    timePeriod: number = 14
  ): Promise<any> {
    const data = await this.makeRequest({
      function: indicator,
      symbol: `${fromSymbol}${toSymbol}`,
      interval,
      time_period: timePeriod.toString(),
    });

    return data;
  }

  // Get RSI (Relative Strength Index)
  async getRSI(fromSymbol: string, toSymbol: string, interval: string = 'daily', timePeriod: number = 14) {
    return this.getTechnicalIndicator(fromSymbol, toSymbol, 'RSI', interval, timePeriod);
  }

  // Get MACD (Moving Average Convergence Divergence)
  async getMACD(fromSymbol: string, toSymbol: string, interval: string = 'daily') {
    const data = await this.makeRequest({
      function: 'MACD',
      symbol: `${fromSymbol}${toSymbol}`,
      interval,
      series_type: 'close',
    });

    return data;
  }

  // Get Bollinger Bands
  async getBollingerBands(fromSymbol: string, toSymbol: string, interval: string = 'daily', timePeriod: number = 20) {
    const data = await this.makeRequest({
      function: 'BBANDS',
      symbol: `${fromSymbol}${toSymbol}`,
      interval,
      time_period: timePeriod.toString(),
      series_type: 'close',
    });

    return data;
  }

  // Generate forex signals based on technical analysis
  async generateForexSignals(): Promise<ForexSignal[]> {
    const majorPairs = [
      { from: 'EUR', to: 'USD' },
      { from: 'GBP', to: 'USD' },
      { from: 'USD', to: 'JPY' },
      { from: 'USD', to: 'CHF' },
      { from: 'AUD', to: 'USD' },
      { from: 'USD', to: 'CAD' },
      { from: 'NZD', to: 'USD' },
    ];

    const signals: ForexSignal[] = [];

    for (const pair of majorPairs) {
      try {
        // Get current price
        const quote = await this.getForexRealTimeQuote(pair.from, pair.to);
        
        // Get RSI for momentum analysis
        const rsiData = await this.getRSI(pair.from, pair.to, 'daily', 14);
        
        // Get MACD for trend analysis
        const macdData = await this.getMACD(pair.from, pair.to, 'daily');

        // Simple signal generation logic
        const signal = this.analyzeAndGenerateSignal(quote, rsiData, macdData);
        
        if (signal) {
          signals.push(signal);
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 12000)); // 12 second delay (5 calls per minute limit)
      } catch (error) {
        console.error(`Error generating signal for ${pair.from}/${pair.to}:`, {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          pair: `${pair.from}/${pair.to}`
        });
      }
    }

    return signals;
  }

  private analyzeAndGenerateSignal(quote: ForexQuote, rsiData: any, macdData: any): ForexSignal | null {
    try {
      // Get the latest RSI value
      const rsiValues = rsiData['Technical Analysis: RSI'];
      const latestRsiDate = Object.keys(rsiValues)[0];
      const latestRsi = parseFloat(rsiValues[latestRsiDate]['RSI']);

      // Get the latest MACD values
      const macdValues = macdData['Technical Analysis: MACD'];
      const latestMacdDate = Object.keys(macdValues)[0];
      const macdLine = parseFloat(macdValues[latestMacdDate]['MACD']);
      const signalLine = parseFloat(macdValues[latestMacdDate]['MACD_Signal']);

      // Simple signal logic
      let signalType: 'BUY' | 'SELL' | null = null;
      let confidence = 50;
      let analysis = '';

      // RSI Analysis
      if (latestRsi < 30) {
        // Oversold condition - potential buy signal
        signalType = 'BUY';
        confidence += 20;
        analysis += 'RSI indicates oversold condition. ';
      } else if (latestRsi > 70) {
        // Overbought condition - potential sell signal
        signalType = 'SELL';
        confidence += 20;
        analysis += 'RSI indicates overbought condition. ';
      }

      // MACD Analysis
      if (macdLine > signalLine) {
        if (signalType === 'BUY' || signalType === null) {
          signalType = 'BUY';
          confidence += 15;
          analysis += 'MACD line above signal line indicates bullish momentum. ';
        }
      } else {
        if (signalType === 'SELL' || signalType === null) {
          signalType = 'SELL';
          confidence += 15;
          analysis += 'MACD line below signal line indicates bearish momentum. ';
        }
      }

      // Only generate signal if confidence is above threshold
      if (!signalType || confidence < 60) {
        return null;
      }

      // Calculate stop loss and take profit levels
      const price = quote.price;
      const volatility = 0.001; // 0.1% - adjust based on historical volatility

      let stopLoss: number;
      let takeProfit: number;

      if (signalType === 'BUY') {
        stopLoss = price * (1 - volatility * 2); // 2:1 risk-reward ratio
        takeProfit = price * (1 + volatility * 4);
      } else {
        stopLoss = price * (1 + volatility * 2);
        takeProfit = price * (1 - volatility * 4);
      }

      return {
        currency_pair: quote.symbol,
        signal_type: signalType,
        entry_price: price,
        stop_loss: stopLoss,
        take_profit: takeProfit,
        current_price: price,
        confidence_level: Math.min(confidence, 95),
        analysis: analysis.trim(),
        status: 'active',
      };
    } catch (error) {
      console.error('Error analyzing signal:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return null;
    }
  }

  // Save generated signals to Supabase
  async saveSignalsToDatabase(signals: ForexSignal[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('forex_signals')
        .insert(signals);

      if (error) {
        throw new Error(`Failed to save signals: ${error.message}`);
      }

      console.log(`Successfully saved ${signals.length} forex signals`);
    } catch (error) {
      console.error('Error saving signals to database:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  // Update signal status (for closing signals)
  async updateSignalStatus(signalId: string, status: 'closed' | 'cancelled'): Promise<void> {
    try {
      const { error } = await supabase
        .from('forex_signals')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', signalId);

      if (error) {
        throw new Error(`Failed to update signal: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating signal status:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  // Get active signals from database
  async getActiveSignals(): Promise<ForexSignal[]> {
    try {
      const { data, error } = await supabase
        .from('forex_signals')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch signals: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching active signals:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  // Get market overview for major currency pairs
  async getMarketOverview(): Promise<ForexQuote[]> {
    const majorPairs = [
      { from: 'EUR', to: 'USD' },
      { from: 'GBP', to: 'USD' },
      { from: 'USD', to: 'JPY' },
      { from: 'USD', to: 'CHF' },
      { from: 'AUD', to: 'USD' },
      { from: 'USD', to: 'CAD' },
    ];

    const quotes: ForexQuote[] = [];

    for (const pair of majorPairs) {
      try {
        const quote = await this.getForexRealTimeQuote(pair.from, pair.to);
        quotes.push(quote);
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 12000));
      } catch (error) {
        console.error(`Error fetching quote for ${pair.from}/${pair.to}:`, {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          pair: `${pair.from}/${pair.to}`
        });
      }
    }

    return quotes;
  }
}

export const alphaVantageService = new AlphaVantageService();
