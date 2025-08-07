import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ForexQuote {
  symbol: string
  price: number
  timestamp: string
}

interface TechnicalIndicator {
  rsi: number
  macd: number
  signal: number
}

interface ForexSignal {
  currency_pair: string
  signal_type: 'BUY' | 'SELL'
  entry_price: number
  stop_loss: number
  take_profit: number
  current_price: number
  confidence_level: number
  analysis: string
  status: 'active'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const alphaVantageApiKey = Deno.env.get('ALPHA_VANTAGE_API_KEY')
    
    if (!alphaVantageApiKey) {
      return new Response('API key not configured', { 
        status: 500, 
        headers: corsHeaders 
      })
    }

    const majorPairs = [
      { from: 'EUR', to: 'USD' },
      { from: 'GBP', to: 'USD' },
      { from: 'USD', to: 'JPY' },
      { from: 'USD', to: 'CHF' },
      { from: 'AUD', to: 'USD' },
      { from: 'USD', to: 'CAD' },
    ]

    const signals: ForexSignal[] = []

    for (const pair of majorPairs) {
      try {
        // Get current forex rate
        const quoteResponse = await fetch(
          `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${pair.from}&to_currency=${pair.to}&apikey=${alphaVantageApiKey}`
        )
        
        if (!quoteResponse.ok) {
          console.error(`Failed to fetch quote for ${pair.from}/${pair.to}`)
          continue
        }

        const quoteData = await quoteResponse.json()
        
        if (quoteData['Error Message'] || quoteData['Note']) {
          console.error(`Alpha Vantage error for ${pair.from}/${pair.to}:`, {
            error: quoteData['Error Message'] || quoteData['Note'],
            pair: `${pair.from}/${pair.to}`
          })
          continue
        }

        const realtimeData = quoteData['Realtime Currency Exchange Rate']
        if (!realtimeData) {
          console.error(`No realtime data for ${pair.from}/${pair.to}`)
          continue
        }

        const currentPrice = parseFloat(realtimeData['5. Exchange Rate'])
        
        // Get RSI data
        await new Promise(resolve => setTimeout(resolve, 12000)) // Rate limiting
        
        const rsiResponse = await fetch(
          `https://www.alphavantage.co/query?function=RSI&symbol=${pair.from}${pair.to}&interval=daily&time_period=14&series_type=close&apikey=${alphaVantageApiKey}`
        )
        
        if (!rsiResponse.ok) {
          console.error(`Failed to fetch RSI for ${pair.from}/${pair.to}`)
          continue
        }

        const rsiData = await rsiResponse.json()
        
        if (rsiData['Error Message'] || rsiData['Note']) {
          console.error(`RSI error for ${pair.from}/${pair.to}:`, {
            error: rsiData['Error Message'] || rsiData['Note'],
            pair: `${pair.from}/${pair.to}`
          })
          continue
        }

        const rsiValues = rsiData['Technical Analysis: RSI']
        if (!rsiValues) {
          console.error(`No RSI data for ${pair.from}/${pair.to}`)
          continue
        }

        const latestRsiDate = Object.keys(rsiValues)[0]
        const latestRsi = parseFloat(rsiValues[latestRsiDate]['RSI'])

        // Get MACD data
        await new Promise(resolve => setTimeout(resolve, 12000)) // Rate limiting
        
        const macdResponse = await fetch(
          `https://www.alphavantage.co/query?function=MACD&symbol=${pair.from}${pair.to}&interval=daily&series_type=close&apikey=${alphaVantageApiKey}`
        )
        
        if (!macdResponse.ok) {
          console.error(`Failed to fetch MACD for ${pair.from}/${pair.to}`)
          continue
        }

        const macdData = await macdResponse.json()
        
        if (macdData['Error Message'] || macdData['Note']) {
          console.error(`MACD error for ${pair.from}/${pair.to}:`, {
            error: macdData['Error Message'] || macdData['Note'],
            pair: `${pair.from}/${pair.to}`
          })
          continue
        }

        const macdValues = macdData['Technical Analysis: MACD']
        if (!macdValues) {
          console.error(`No MACD data for ${pair.from}/${pair.to}`)
          continue
        }

        const latestMacdDate = Object.keys(macdValues)[0]
        const macdLine = parseFloat(macdValues[latestMacdDate]['MACD'])
        const signalLine = parseFloat(macdValues[latestMacdDate]['MACD_Signal'])

        // Generate signal based on technical analysis
        const signal = generateSignal(
          { symbol: `${pair.from}/${pair.to}`, price: currentPrice, timestamp: new Date().toISOString() },
          { rsi: latestRsi, macd: macdLine, signal: signalLine }
        )

        if (signal) {
          signals.push(signal)
        }

      } catch (error) {
        console.error(`Error processing ${pair.from}/${pair.to}:`, {
          message: error instanceof Error ? error.message : 'Unknown error',
          pair: `${pair.from}/${pair.to}`
        })
      }
    }

    // Save signals to database
    if (signals.length > 0) {
      const { error: insertError } = await supabaseClient
        .from('forex_signals')
        .insert(signals)

      if (insertError) {
        console.error('Error saving signals:', {
          message: insertError instanceof Error ? insertError.message : 'Unknown error',
          code: insertError && typeof insertError === 'object' && 'code' in insertError ? insertError.code : 'NO_CODE'
        })
        return new Response('Failed to save signals', { 
          status: 500, 
          headers: corsHeaders 
        })
      }

      // Create notification for admin users
      const { data: adminUsers } = await supabaseClient
        .from('user_profiles')
        .select('id')
        .eq('is_admin', true)

      if (adminUsers && adminUsers.length > 0) {
        const notifications = adminUsers.map(admin => ({
          user_id: admin.id,
          title: 'New Forex Signals Generated',
          message: `${signals.length} new forex signals have been generated and are now available.`,
          type: 'info',
          action_url: '/admin/signals',
        }))

        await supabaseClient
          .from('user_notifications')
          .insert(notifications)
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      signals_generated: signals.length,
      signals: signals 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Signal generation error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

function generateSignal(quote: ForexQuote, indicators: TechnicalIndicator): ForexSignal | null {
  try {
    let signalType: 'BUY' | 'SELL' | null = null
    let confidence = 50
    let analysis = ''

    // RSI Analysis
    if (indicators.rsi < 30) {
      signalType = 'BUY'
      confidence += 20
      analysis += 'RSI indicates oversold condition (strong buy signal). '
    } else if (indicators.rsi > 70) {
      signalType = 'SELL'
      confidence += 20
      analysis += 'RSI indicates overbought condition (strong sell signal). '
    } else if (indicators.rsi < 50) {
      if (signalType === null) signalType = 'BUY'
      confidence += 10
      analysis += 'RSI below 50 suggests bearish momentum weakening. '
    } else if (indicators.rsi > 50) {
      if (signalType === null) signalType = 'SELL'
      confidence += 10
      analysis += 'RSI above 50 suggests bullish momentum strengthening. '
    }

    // MACD Analysis
    if (indicators.macd > indicators.signal) {
      if (signalType === 'BUY' || signalType === null) {
        signalType = 'BUY'
        confidence += 15
        analysis += 'MACD line above signal line indicates bullish momentum. '
      }
    } else {
      if (signalType === 'SELL' || signalType === null) {
        signalType = 'SELL'
        confidence += 15
        analysis += 'MACD line below signal line indicates bearish momentum. '
      }
    }

    // Market volatility adjustment
    const volatilityFactor = Math.random() * 0.002 + 0.001 // 0.1% to 0.3%
    
    // Add some randomness for demonstration (in real scenario, use more sophisticated analysis)
    const marketSentiment = Math.random()
    if (marketSentiment > 0.7) {
      confidence += 10
      analysis += 'Strong market sentiment supports the signal. '
    } else if (marketSentiment < 0.3) {
      confidence -= 5
      analysis += 'Weak market sentiment adds caution to the signal. '
    }

    // Only generate signal if confidence is above threshold
    if (!signalType || confidence < 60) {
      return null
    }

    // Calculate stop loss and take profit levels
    const price = quote.price
    let stopLoss: number
    let takeProfit: number

    if (signalType === 'BUY') {
      stopLoss = price * (1 - volatilityFactor * 2)
      takeProfit = price * (1 + volatilityFactor * 3)
    } else {
      stopLoss = price * (1 + volatilityFactor * 2)
      takeProfit = price * (1 - volatilityFactor * 3)
    }

    return {
      currency_pair: quote.symbol,
      signal_type: signalType,
      entry_price: price,
      stop_loss: Number(stopLoss.toFixed(5)),
      take_profit: Number(takeProfit.toFixed(5)),
      current_price: price,
      confidence_level: Math.min(confidence, 95),
      analysis: analysis.trim(),
      status: 'active',
    }
  } catch (error) {
    console.error('Error generating signal:', {
      message: error instanceof Error ? error.message : 'Unknown error'
    })
    return null
  }
}
