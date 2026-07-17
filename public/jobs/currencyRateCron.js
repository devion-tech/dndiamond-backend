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
                        USD: quotes.HKDUSD,
                        GBP: quotes.HKDGBP,
                        EUR: quotes.HKDEUR,
                        AUD: quotes.HKDAUD,
                        SGD: quotes.HKDSGD,
                    },
                },
            }
        );

        console.log("Currency rates updated successfully");
    } catch (error) {
        console.error(
            "Currency update failed:",
            error.message
        );
    }
};

export const startCurrencyRateCron = () => {
    cron.schedule("0 0 * * *", async () => {
        await updateCurrencyRates();
    });
};