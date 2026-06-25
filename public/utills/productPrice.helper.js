// helpers/productPrice.helper.js
export const calculateJewelryPrice = (
    product,
    pricingSettings
) => {

    const goldOption = product.options.find(
        (item) => item.name.toLowerCase() === "gold_type"
    );

    if (!goldOption) {
        return 0;
    }

    const prices = goldOption.values.map((gold) => {

        const goldRate = pricingSettings[gold.value] || 0;
        const goldPrice = product.weight * goldRate;

        const makingCharge =
            product.weight *
            pricingSettings.making_charge;

        return (
            goldPrice +
            makingCharge +
            (product.pricing?.diamond_cost || 0) +
            (product.pricing?.gemstone_cost || 0) +
            (product.pricing?.additional_cost || 0)
        );
    });

    return Math.min(...prices);
};

/* Calculate Single Jewelry price */
export const calculateJewelryVariantPrices = (
    product,
    pricingSettings,
) => {
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

        const finalPrice =
            goldPrice +
            makingCharge +
            (product.pricing?.diamond_cost || 0) +
            (product.pricing?.gemstone_cost || 0) +
            (product.pricing?.additional_cost || 0);

        return {
            gold_type: gold.value,
            price: finalPrice,
        };
    });
};