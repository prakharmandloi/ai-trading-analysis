let priceChart = null;

function generateHistoricalData(symbol) {
  const days = 90;
  const basePrice = Math.random() * 200 + 50;
  const prices = [];
  const dates = [];
  const volume = [];
  
  let currentPrice = basePrice;
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toLocaleDateString());
    
    const change = (Math.random() - 0.48) * 5;
    currentPrice = Math.max(currentPrice + change, basePrice * 0.7);
    prices.push(parseFloat(currentPrice.toFixed(2)));
    
    volume.push(Math.floor(Math.random() * 10000000 + 1000000));
  }
  
  return { symbol, currentPrice: prices[prices.length - 1], historicalPrices: prices, dates, volume };
}

function performAIAnalysis(data) {
  const prices = data.historicalPrices;
  const recentPrices = prices.slice(-30);
  
  const firstPrice = recentPrices[0];
  const lastPrice = recentPrices[recentPrices.length - 1];
  const trendPercent = ((lastPrice - firstPrice) / firstPrice) * 100;
  
  let trend = 'Neutral';
  if (trendPercent > 5) trend = 'Strong Uptrend';
  else if (trendPercent > 2) trend = 'Uptrend';
  else if (trendPercent < -5) trend = 'Strong Downtrend';
  else if (trendPercent < -2) trend = 'Downtrend';
  
  const momentum = calculateMomentum(recentPrices);
  const volatility = calculateVolatility(recentPrices);
  const support = Math.min(...recentPrices);
  const resistance = Math.max(...recentPrices);
  const insights = generateInsights(data, trend, momentum, volatility);
  
  return { trend, momentum, volatility, support, resistance, insights };
}

function calculateMomentum(prices) {
  const recent = prices.slice(-5);
  const older = prices.slice(-10, -5);
  const recentAvg = recent.reduce((a, b) => a + b) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b) / older.length;
  const change = ((recentAvg - olderAvg) / olderAvg) * 100;
  
  if (change > 3) return 'Strong Positive';
  if (change > 1) return 'Positive';
  if (change < -3) return 'Strong Negative';
  if (change < -1) return 'Negative';
  return 'Neutral';
}

function calculateVolatility(prices) {
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i-1]) / prices[i-1]);
  }
  const mean = returns.reduce((a, b) => a + b) / returns.length;
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance) * 100;
  
  if (stdDev > 3) return 'High';
  if (stdDev > 1.5) return 'Medium';
  return 'Low';
}

function generateInsights(data, trend, momentum, volatility) {
  const insights = [];
  
  if (trend.includes('Uptrend')) {
    insights.push(`The stock is showing a ${trend.toLowerCase()} with consistent price appreciation over the past 30 days.`);
  } else if (trend.includes('Downtrend')) {
    insights.push(`The stock is experiencing a ${trend.toLowerCase()}, indicating selling pressure in recent trading sessions.`);
  }
  
  if (momentum.includes('Positive')) {
    insights.push(`Momentum indicators suggest ${momentum.toLowerCase()} buying pressure, which could continue in the short term.`);
  } else if (momentum.includes('Negative')) {
    insights.push(`Momentum has turned ${momentum.toLowerCase()}, suggesting potential further downside risk.`);
  }
  
  insights.push(`Volatility is ${volatility.toLowerCase()}, ${volatility === 'High' ? 'indicating significant price swings and higher risk' : volatility === 'Medium' ? 'showing moderate price fluctuations' : 'suggesting stable price movement'}.`);
  
  const avgVolume = data.volume.reduce((a, b) => a + b) / data.volume.length;
  insights.push(`Average daily volume is ${(avgVolume / 1000000).toFixed(2)}M shares, indicating ${avgVolume > 5000000 ? 'strong' : 'moderate'} liquidity.`);
  
  return insights;
}

function generatePredictions(data, analysis) {
  const currentPrice = data.currentPrice;
  const predictions = [];
  
  let weekChange = Math.random() * 6 - 2;
  if (analysis.trend.includes('Uptrend')) weekChange += 2;
  if (analysis.trend.includes('Downtrend')) weekChange -= 2;
  predictions.push({ period: '1 Week', price: (currentPrice * (1 + weekChange / 100)).toFixed(2), change: weekChange.toFixed(2) });
  
  let monthChange = Math.random() * 12 - 4;
  if (analysis.trend.includes('Uptrend')) monthChange += 4;
  if (analysis.trend.includes('Downtrend')) monthChange -= 4;
  predictions.push({ period: '1 Month', price: (currentPrice * (1 + monthChange / 100)).toFixed(2), change: monthChange.toFixed(2) });
  
  let quarterChange = Math.random() * 20 - 6;
  if (analysis.trend.includes('Uptrend')) quarterChange += 6;
  if (analysis.trend.includes('Downtrend')) quarterChange -= 6;
  predictions.push({ period: '3 Months', price: (currentPrice * (1 + quarterChange / 100)).toFixed(2), change: quarterChange.toFixed(2) });
  
  return predictions;
}

function generateSuggestions(data, analysis) {
  const suggestions = [];
  
  if (analysis.trend.includes('Uptrend') && analysis.momentum.includes('Positive')) {
    suggestions.push({ type: 'success', icon: '📈', title: 'Buy Signal', description: `Strong upward momentum detected. Consider entering a long position. Target price: $${(data.currentPrice * 1.08).toFixed(2)}, Stop loss: $${(data.currentPrice * 0.95).toFixed(2)}` });
  } else if (analysis.trend.includes('Downtrend') && analysis.momentum.includes('Negative')) {
    suggestions.push({ type: 'danger', icon: '📉', title: 'Sell Signal', description: `Downward pressure increasing. Consider reducing position or setting tight stop losses. Support level at $${analysis.support.toFixed(2)}` });
  } else {
    suggestions.push({ type: 'warning', icon: '⏸️', title: 'Hold Position', description: `Mixed signals detected. Wait for clearer trend confirmation before making significant moves. Monitor support at $${analysis.support.toFixed(2)} and resistance at $${analysis.resistance.toFixed(2)}` });
  }
  
  if (analysis.volatility === 'High') {
    suggestions.push({ type: 'warning', icon: '⚡', title: 'High Volatility Alert', description: 'Consider using options strategies or reducing position size due to elevated volatility. Implement strict risk management.' });
  }
  
  suggestions.push({ type: 'success', icon: '🎯', title: 'Key Levels', description: `Watch for breakout above $${analysis.resistance.toFixed(2)} for bullish continuation or breakdown below $${analysis.support.toFixed(2)} for bearish signal.` });
  suggestions.push({ type: 'warning', icon: '💼', title: 'Portfolio Management', description: 'Maintain proper position sizing (2-5% of portfolio) and diversification across sectors to manage risk effectively.' });
  
  return suggestions;
}

function calculateRiskScore(analysis) {
  let score = 50;
  if (analysis.volatility === 'High') score += 25;
  else if (analysis.volatility === 'Low') score -= 15;
  if (analysis.trend.includes('Strong')) score += 10;
  if (analysis.momentum.includes('Strong')) score += 10;
  score = Math.max(0, Math.min(100, score));
  
  let level = 'Medium';
  if (score < 40) level = 'Low';
  else if (score > 65) level = 'High';
  
  const factors = [
    { name: 'Volatility Risk', value: analysis.volatility },
    { name: 'Trend Strength', value: analysis.trend },
    { name: 'Momentum', value: analysis.momentum },
    { name: 'Market Conditions', value: 'Moderate' }
  ];
  
  return { score, level, factors };
}

function renderChart(data) {
  const ctx = document.getElementById('priceChart');
  if (priceChart) priceChart.destroy();
  
  priceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.dates,
      datasets: [{ label: `${data.symbol} Price`, data: data.historicalPrices, borderColor: '#667eea', backgroundColor: 'rgba(102, 126, 234, 0.1)', borderWidth: 3, fill: true, tension: 0.4 }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'top' } }, scales: { y: { beginAtZero: false } } }
  });
}

function renderHistoricalStats(data) {
  const prices = data.historicalPrices;
  const firstPrice = prices[0];
  const lastPrice = prices[prices.length - 1];
  const change = ((lastPrice - firstPrice) / firstPrice) * 100;
  const high = Math.max(...prices);
  const low = Math.min(...prices);
  const avgVolume = data.volume.reduce((a, b) => a + b) / data.volume.length;
  
  document.getElementById('historicalStats').innerHTML = `
    <div class="stat-card"><div class="stat-label">Current Price</div><div class="stat-value">$${lastPrice.toFixed(2)}</div></div>
    <div class="stat-card"><div class="stat-label">90-Day Change</div><div class="stat-value ${change >= 0 ? 'positive' : 'negative'}">${change >= 0 ? '+' : ''}${change.toFixed(2)}%</div></div>
    <div class="stat-card"><div class="stat-label">90-Day High</div><div class="stat-value">$${high.toFixed(2)}</div></div>
    <div class="stat-card"><div class="stat-label">90-Day Low</div><div class="stat-value">$${low.toFixed(2)}</div></div>
    <div class="stat-card"><div class="stat-label">Avg Volume</div><div class="stat-value">${(avgVolume / 1000000).toFixed(2)}M</div></div>
  `;
}

function renderAIAnalysis(analysis) {
  const insightsHTML = analysis.insights.map(insight => `<div class="insight-item">${insight}</div>`).join('');
  document.getElementById('aiAnalysis').innerHTML = `
    <div style="margin-bottom: 20px;"><strong>Trend:</strong> ${analysis.trend} | <strong>Momentum:</strong> ${analysis.momentum} | <strong>Volatility:</strong> ${analysis.volatility}</div>
    <div style="margin-bottom: 20px;"><strong>Support Level:</strong> $${analysis.support.toFixed(2)} | <strong>Resistance Level:</strong> $${analysis.resistance.toFixed(2)}</div>
    <h3 style="margin: 20px 0 15px 0; color: #667eea;">Key Insights:</h3>${insightsHTML}
  `;
}

function renderPredictions(predictions) {
  document.getElementById('predictions').innerHTML = predictions.map(pred => `
    <div class="prediction-card"><div class="prediction-period">${pred.period}</div><div class="prediction-value">$${pred.price}</div><div class="prediction-change">${parseFloat(pred.change) >= 0 ? '↗' : '↘'} ${pred.change}%</div></div>
  `).join('');
}

function renderSuggestions(suggestions) {
  document.getElementById('suggestions').innerHTML = suggestions.map(sug => `
    <div class="suggestion-item ${sug.type}"><div class="suggestion-icon">${sug.icon}</div><div class="suggestion-content"><h3>${sug.title}</h3><p>${sug.description}</p></div></div>
  `).join('');
}

function renderRiskAssessment(risk) {
  const factorsHTML = risk.factors.map(factor => `<div class="risk-factor"><h4>${factor.name}</h4><p>${factor.value}</p></div>`).join('');
  document.getElementById('riskAssessment').innerHTML = `
    <div class="risk-meter"><div class="risk-label">${risk.level} Risk</div><div class="risk-bar"><div class="risk-fill ${risk.level.toLowerCase()}" style="width: ${risk.score}%"></div></div><div class="risk-label">${risk.score}/100</div></div>
    <div class="risk-factors">${factorsHTML}</div>
  `;
}

function analyzeStock() {
  const symbol = document.getElementById('stockSymbol').value.toUpperCase();
  if (!symbol) { alert('Please enter a stock symbol'); return; }
  
  document.getElementById('aiAnalysis').innerHTML = '<div class="loading">Analyzing data</div>';
  document.getElementById('predictions').innerHTML = '<div class="loading">Generating predictions</div>';
  document.getElementById('suggestions').innerHTML = '<div class="loading">Creating suggestions</div>';
  document.getElementById('riskAssessment').innerHTML = '<div class="loading">Assessing risk</div>';
  
  setTimeout(() => {
    const stockData = generateHistoricalData(symbol);
    const analysis = performAIAnalysis(stockData);
    const predictions = generatePredictions(stockData, analysis);
    const suggestions = generateSuggestions(stockData, analysis);
    const risk = calculateRiskScore(analysis);
    
    renderChart(stockData);
    renderHistoricalStats(stockData);
    renderAIAnalysis(analysis);
    renderPredictions(predictions);
    renderSuggestions(suggestions);
    renderRiskAssessment(risk);
  }, 1500);
}

document.getElementById('analyzeBtn').addEventListener('click', analyzeStock);
document.getElementById('stockSymbol').addEventListener('keypress', (e) => { if (e.key === 'Enter') analyzeStock(); });
console.log('AI Trading Analysis Platform Ready!');