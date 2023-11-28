const express = require('express');
const router = express.Router();
const DB = require('../db/db');

const db = new DB();

/**
 * @swagger
 * /high/{stock}:
 *   get:
 *     summary: Retrieve the high of {stock}
 *     description: Retrive the high of {stock} by name
 *     parameters:
 *       - in: path
 *         name: stock
 *         required: true
 *         description: Name of stock
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: stock high
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 day:
 *                   type: string
 *                   description: date
 *                   example: 07-02-2013
 *                 stock:
 *                   type: string
 *                   description: stock name
 *                   example: USCS
 *                 open:
 *                   type: integer
 *                   description: stock open
 *                   example: 0.0015999999595806003
 *                 close:
 *                   type: integer
 *                   description: stock close
 *                   example: 0.029999999329447746
 *                 percentage:
 *                   type: integer
 *                   description: stock high persentage
 *                   example: 1775.0000054569682
 *       404:
 *         description: stock not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: error message
 *                   example: No data found
 */
router.get('/high/:stock', async (req, res) => {
  try {
    const stock = req.params.stock;
    const bestTicker = await db.readBestPerformance(stock);
    res.json(bestTicker);
  } catch (error) {
    res.status(404).json({ error: 'No data found' });
  }
});

/**
 * @swagger
 * /highs:
 *   get:
 *     summary: Retrieve all stock high
 *     description: Retrieve all stock high
 *     responses:
 *       200:
 *         description: stock high
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   day:
 *                     type: string
 *                     description: date
 *                     example: 07-02-2013
 *                   stock:
 *                     type: string
 *                     description: stock name
 *                     example: USCS
 *                   open:
 *                     type: integer
 *                     description: stock open
 *                     example: 0.0015999999595806003
 *                   close:
 *                     type: integer
 *                     description: stock close
 *                     example: 0.029999999329447746
 *                   percentage:
 *                     type: integer
 *                     description: stock high persentage
 *                     example: 1775.0000054569682
 *       404:
 *         description: stock not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: error message
 *                   example: No data found
 */
router.get('/highs', async (req, res) => {
  try {
    const bestTickers = await db.findBestPerformingDays();
    res.json(bestTickers);
  } catch (error) {
    res.status(404).json({ error: 'No data found' });
  }
});

/**
 * @swagger
 * /low/{stock}:
 *   get:
 *     summary: Retrieve the low of {stock}
 *     description: Retrive the low of {stock} by name
 *     parameters:
 *       - in: path
 *         name: stock
 *         required: true
 *         description: Name of stock
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: stock low
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 day:
 *                   type: string
 *                   description: date
 *                   example: 24-08-2016
 *                 stock:
 *                   type: string
 *                   description: stock name
 *                   example: USCS
 *                 open:
 *                   type: integer
 *                   description: stock open
 *                   example: 0.006000000052154064
 *                 close:
 *                   type: integer
 *                   description: stock close
 *                   example: 0.00139999995008111
 *                 percentage:
 *                   type: integer
 *                   description: stock low persentage
 *                   example: -76.66666770146952
 *       404:
 *         description: stock not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: error message
 *                   example: No data found
 */
router.get('/low/:stock', async (req, res) => {
  try {
    const stock = req.params.stock;
    const worstTicker = await db.readWorstPerformance(stock);
    res.json(worstTicker);
  } catch (error) {
    res.status(404).json({ error: 'No data found' });
  }
});

/**
 * @swagger
 * /lows:
 *   get:
 *     summary: Retrieve all stock low
 *     description: Retrieve all stock low
 *     responses:
 *       200:
 *         description: stock low
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   day:
 *                     type: string
 *                     description: date
 *                     example: 24-08-2016
 *                   stock:
 *                     type: string
 *                     description: stock name
 *                     example: USCS
 *                   open:
 *                     type: integer
 *                     description: stock open
 *                     example: 0.006000000052154064
 *                   close:
 *                     type: integer
 *                     description: stock close
 *                     example: 0.00139999995008111
 *                   percentage:
 *                     type: integer
 *                     description: stock high persentage
 *                     example: -76.66666770146952
 *       404:
 *         description: stock not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: error message
 *                   example: No data found
 */
router.get('/lows', async (req, res) => {
  try {
    const worstTickers = await db.findWorstPerformingDays();
    res.json(worstTickers);
  } catch (error) {
    res.status(404).json({ error: 'No data found' });
  }
});

module.exports = router;