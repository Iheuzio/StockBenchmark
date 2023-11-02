class MockDB {
  constructor() {
    this.data = {
      collection: [],
    };
  }

  async connect(dbname, collName) {
    if(dbname !== 'dataset' || collName !== 'dataset') {
      throw new Error('Invalid database name or collection name');
    }
    return true;
  }

  async close() {
    return true;
  }

  async readAll() {
    return this.data.collection;
  }

  async create(quote) {
    // Simulate inserting data
    this.data.collection.push(quote);
  }

  async deleteMany(filter) {
    // Simulate deleting data
    const deletedItems = this.data.collection.filter(filter);
    this.data.collection = this.data.collection.filter((item) => !filter(item));
    return { deletedCount: deletedItems.length };
  }

  async createManyTickerData(dataToInsert) {
    const dataForInsertMany = dataToInsert.map(({ ticker, data }) => ({
      ticker,
      data,
    }));

    this.data.collection.push(...dataForInsertMany);
  }

  async createTickerData(ticker, data) {
    const tickerData = {
      ticker: ticker,
      data: data
    };
    this.data.collection.push(tickerData);
  }

  async readTickerData(ticker) {
    return this.data.collection.find((item) => item.ticker === ticker);
  }

  async readAllTickers() {
    // Return all tickers from the mock data
    return this.data.collection.
      filter((item) => item.ticker).
      map((item) => ({ ticker: item.ticker }));
  }

  async readBestPerformance(stock) {
    
    const documents = this.data.collection.
      filter((item) => item.ticker === stock).
      map((item) => ({
        ticker: item.ticker,
        data: item.data,
      }));

    let bestDay = null;
    let maxPercentage = 0;

    documents.forEach((doc) => {
      const data = doc.data;
      data.forEach((item) => {
        const open = item.open;
        const close = item.close;

        if (open > 0) {
          const percentage = ((close - open) / open) * 100;

          if (percentage > maxPercentage) {
            maxPercentage = percentage;
            bestDay = {
              day: item.timestamp,
              stock: doc.ticker,
              open: open,
              close: close,
              percentage: percentage
            };
          }
        }
      });
    });

    return bestDay;
  }

  async findBestPerformingDays() {
    const allStocks = this.readAllTickers();
    const bestDaysPromises = [];

    for (const stock of allStocks) {
      bestDaysPromises.push(this.readBestPerformance(stock.ticker));
    }

    const bestDays = await Promise.all(bestDaysPromises);

    const filteredBestDays = bestDays.filter(day => day !== null);

    filteredBestDays.sort((a, b) => b.percentage - a.percentage);

    return filteredBestDays;
  }

  async readWorstPerformance(stock) {

    const documents = this.data.collection.
      filter((item) => item.ticker === stock).
      map((item) => ({
        ticker: item.ticker,
        data: item.data,
      }));

    let worstDay = null;
    let minPercentage = 0;

    documents.forEach((doc) => {
      const data = doc.data;
      data.forEach((item) => {
        const open = item.open;
        const close = item.close;

        if (open > 0) {
          const percentage = ((close - open) / open) * 100;

          if (percentage < minPercentage) {
            minPercentage = percentage;
            worstDay = {
              day: item.timestamp,
              stock: doc.ticker,
              open: open,
              close: close,
              percentage: percentage
            };
          }
        }
      });
    });

    return worstDay;
  }

  async findWorstPerformingDays() {
    const allStocks = this.readAllTickers();
    const worstDaysPromises = [];

    for (const stock of allStocks) {
      worstDaysPromises.push(this.readWorstPerformance(stock.ticker));
    }

    const worstDays = await Promise.all(worstDaysPromises);

    const filteredWorstDays = worstDays.filter(day => day !== null);

    filteredWorstDays.sort((a, b) => a.percentage - b.percentage);

    return filteredWorstDays;
  }
}

module.exports = MockDB;
