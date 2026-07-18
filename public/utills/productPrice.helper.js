// helpers/productPrice.helper.js
export const calculateJewelleryPrice = (product, pricingSettings, currency) => {
  const goldOption = product.options.find(
    (item) => item.name.toLowerCase() === "gold_type",
  );

  const exchangeRate = pricingSettings.currency_rates.get(currency) || 1;
  //   console.log("exchangeRate :>> ", exchangeRate, pricingSettings);

  if (!goldOption) {
    return 0;
  }

  const prices = goldOption.values.map((gold) => {
    const goldRate = pricingSettings[gold.value] || 0;
    const goldPrice = product.weight * goldRate;

    const makingCharge = product.weight * pricingSettings.making_charge;

    const hkdPrice =
      goldPrice +
      makingCharge +
      (product.pricing?.diamond_cost || 0) +
      (product.pricing?.gemstone_cost || 0) +
      (product.pricing?.additional_cost || 0);

    return Number((hkdPrice * exchangeRate).toFixed(2));
  });

  return Math.min(...prices);
};

/* Calculate Single Jewellery price */
export const calculateJewelleryVariantPrices = (
  product,
  pricingSettings,
  currency,
) => {
  const exchangeRate = pricingSettings.currency_rates.get(currency) || 1;

  const goldOption = product.options.find(
    (item) => item.name.toLowerCase() === "gold_type",
  );

  if (!goldOption) {
    return [];
  }

  return goldOption.values.map((gold) => {
    const goldRate = pricingSettings[gold.value] || 0;
    const goldPrice = product.weight * goldRate;

    const makingCharge = product.weight * pricingSettings.making_charge;
    const hkdPrice =
      goldPrice +
      makingCharge +
      (product.pricing?.diamond_cost || 0) +
      (product.pricing?.gemstone_cost || 0) +
      (product.pricing?.additional_cost || 0);

    return {
      gold_type: gold.value,
      price: Number((hkdPrice * exchangeRate).toFixed(2)),
      currency,
    };
  });
};

/* Calculate selected gold price for add to cart */
export const calculateSelectedGoldPrice = (
  product,
  pricingSettings,
  selectedGoldType,
  currency,
) => {
  const exchangeRate = pricingSettings.currency_rates.get(currency) || 1;

  const goldRate = pricingSettings[selectedGoldType] || 0;
  const goldPrice = product.weight * goldRate;
  const makingCharge = product.weight * pricingSettings.making_charge;

  const hkdPrice =
    goldPrice +
    makingCharge +
    (product.pricing?.diamond_cost || 0) +
    (product.pricing?.gemstone_cost || 0) +
    (product.pricing?.additional_cost || 0);

  return Number((hkdPrice * exchangeRate).toFixed(2));
};
