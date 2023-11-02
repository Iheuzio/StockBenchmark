const MockDB = require('../db/MockDB'); // Import your MockDB class

describe('MockDB Unit Tests', () => {
  let mockDB;

  beforeEach(() => {
    mockDB = new MockDB();
  });

  describe('connect', () => {
    it('should establish a connection to the database', async () => {
      await mockDB.connect('dataset', 'dataset');
      expect(mockDB.databaseName).toBe('dataset');
      expect(mockDB.collectionName).toBe('dataset');
    });
  });

  describe('close', () => {
    it('should close the database connection', async () => {
      await mockDB.connect('dataset', 'dataset');
      await mockDB.close();
      // basically acts like a closed connection
      expect(mockDB.data.collection).toBeNull();
    });
  });

  describe('readAll', () => {
    it('should return an empty array when no data is present', async () => {
      const result = await mockDB.readAll();
      expect(result).toEqual([]);
    });

    it('should return data when data is present', async () => {
      mockDB.data.collection = [{ name: 'Item 1' }, { name: 'Item 2' }];
      const result = await mockDB.readAll();
      expect(result).toEqual(mockDB.data.collection);
    });
  });

  describe('create', () => {
    it('should insert data into the collection', async () => {
      const dataToInsert = { name: 'New Item' };
      await mockDB.create(dataToInsert);
      expect(mockDB.data.collection).toContainEqual(dataToInsert);
    });
  });

  describe('deleteMany', () => {
    it('should delete data from the collection based on the filter', async () => {
      const dataToKeep = { name: 'Item 1' };
      const dataToDelete = { name: 'Item 2' };
      mockDB.data.collection = [dataToKeep, dataToDelete];
      const filter = (item) => item.name === 'Item 2';

      const result = await mockDB.deleteMany(filter);
      expect(result.deletedCount).toBe(1);
      expect(mockDB.data.collection).toEqual([dataToKeep]);
    });

    it('should return 0 when no data matches the filter', async () => {
      const dataToKeep = { name: 'Item 1' };
      mockDB.data.collection = [dataToKeep];
      const filter = (item) => item.name === 'Item 2';

      const result = await mockDB.deleteMany(filter);
      expect(result.deletedCount).toBe(0);
      expect(mockDB.data.collection).toEqual([dataToKeep]);
    });
  });

  describe('createTickerData', () => {
    it('should insert ticker data into the collection', async () => {
      const tickerData = {
        ticker: 'AAPL',
        data: [{ timestamp: '2022-01-01', open: 150, close: 160 }],
      };
      await mockDB.createTickerData(tickerData.ticker, tickerData.data);
      const result = await mockDB.readTickerData(tickerData.ticker);
      expect(result).toEqual(tickerData);
    });
  });

  describe('readTickerData', () => {
    it('should return the ticker data for a specific ticker', async () => {
      const tickerData = {
        ticker: 'AAPL',
        data: [{ timestamp: '2022-01-01', open: 150, close: 160 }],
      };
      mockDB.data.collection.push(tickerData);
      const result = await mockDB.readTickerData(tickerData.ticker);
      expect(result).toEqual(tickerData);
    });

    it('should return null for an unknown ticker', async () => {
      const result = await mockDB.readTickerData('GOOGL');
      expect(result).toBe(undefined);
    });
  });

  describe('readAllTickers', () => {
    it('should return an array of tickers', async () => {
      const tickers = [
        { ticker: 'AAPL' },
        { ticker: 'GOOGL' },
        { ticker: 'MSFT' },
      ];
      mockDB.data.collection = tickers.map((ticker) => ({ ticker }));
      const result = await mockDB.readAllTickers();
      expect(result).toEqual(tickers.map((ticker) => ({ ticker })));
    });
  });

  describe('readBestPerformance', () => {
    it('should return the best performance for a specific stock', async () => {
      const stock = 'AAPL';
      const bestDay = {
        day: '2022-01-01',
        stock: stock,
        open: 150,
        close: 160,
        percentage: 6.666666666666667,
      };
      mockDB.data.collection.push({
        ticker: stock,
        data: [{ timestamp: bestDay.day, open: bestDay.open, close: bestDay.close }],
      });
      const result = await mockDB.readBestPerformance(stock);
      expect(result).toEqual(bestDay);
    });

    it('should return null when no data is available for the stock', async () => {
      const result = await mockDB.readBestPerformance('GOOGL');
      expect(result).toBeNull();
    });
  });

  describe('findBestPerformingDays', () => {
    it('should return the best performing days for all stocks', async () => {
      const stocks = ['AAPL', 'GOOGL', 'MSFT'];
      const bestDays = [
        { day: '2022-01-01', stock: 'AAPL', open: 150, close: 160, percentage: 6.666666666666667 },
        { day: '2022-01-02', stock: 'GOOGL', open: 1000, close: 1010, percentage: 1.0 },
        { day: '2022-01-03', stock: 'MSFT', open: 250, close: 260, percentage: 4.0 },
      ];

      stocks.forEach((stock, index) => {
        mockDB.data.collection.push({
          ticker: stock,
          data: [{ timestamp: bestDays[index].day, open: bestDays[index].open, close: bestDays[index].close }],
        });
      });

      const result = await mockDB.findBestPerformingDays();
      expect(result).toEqual(bestDays);
    });

    it('should return an empty array when no data is available for any stock', async () => {
      const result = await mockDB.findBestPerformingDays();
      expect(result).toEqual([]);
    });
  });

  describe('readWorstPerformance', () => {
    it('should return the worst performance for a specific stock', async () => {
      const stock = 'AAPL';
      const worstDay = {
        day: '2022-01-01',
        stock: stock,
        open: 160,
        close: 150,
        percentage: -6.25,
      };
      mockDB.data.collection.push({
        ticker: stock,
        data: [{ timestamp: worstDay.day, open: worstDay.open, close: worstDay.close }],
      });
      const result = await mockDB.readWorstPerformance(stock);
      expect(result).toEqual(worstDay);
    });

    it('should return null when no data is available for the stock', async () => {
      const result = await mockDB.readWorstPerformance('GOOGL');
      expect(result).toBeNull();
    });
  });

  describe('findWorstPerformingDays', () => {
    it('should return the worst performing days for all stocks', async () => {
      const stocks = ['AAPL', 'GOOGL', 'MSFT'];
      const worstDays = [
        { day: '2022-01-01', stock: 'AAPL', open: 160, close: 150, percentage: -6.25 },
        { day: '2022-01-02', stock: 'GOOGL', open: 1010, close: 1000, percentage: -1.0 },
        { day: '2022-01-03', stock: 'MSFT', open: 260, close: 250, percentage: -4.0 },
      ];
  
      stocks.forEach((stock, index) => {
        mockDB.data.collection.push({
          ticker: stock,
          data: [{ timestamp: worstDays[index].day, open: worstDays[index].open, close: worstDays[index].close }],
        });
      });
  
      const result = await mockDB.findWorstPerformingDays(); // Call the method on the mockDB instance
      expect(result).toEqual(worstDays);
    });
  
    it('should return an empty array when no data is available for any stock', async () => {
      const result = await mockDB.findWorstPerformingDays(); // Call the method on the mockDB instance
      expect(result).toEqual([]);
    });
  });
});
