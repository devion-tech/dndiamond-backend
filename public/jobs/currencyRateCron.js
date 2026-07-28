import cron from "node-cron";
import axios from "axios";
import Globals from "../models/globals.js";

export const updateCurrencyRates = async () => {
  try {
    const response = await axios.get(process.env.EXCHANGE_RATE_API);
    const quotes = response.data.quotes;

    await Globals.updateOne(
      {},
      {
        $set: {
          currency_rates: {
            HKD: 1,
            AUD: quotes.HKDAUD,
            NZD: quotes.HKDNZD,
            // USD: quotes.HKDUSD,
            // GBP: quotes.HKDGBP,
            // EUR: quotes.HKDEUR,
            // SGD: quotes.HKDSGD,
          },
        },
      },
    );

  } catch (error) {
    return error;
  }
};

export const startCurrencyRateCron = () => {
  cron.schedule("0 0 * * *", async () => {
    await updateCurrencyRates();
  });
};
