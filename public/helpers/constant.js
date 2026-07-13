export const ROLE = {
  ADMIN: "ADMIN",
  USER: "USER",
};

export const productTypes = ["jewellery", "diamond", "watch"];
export const diamondTypes = ["labgrown", "natural"];
export const paymentMethods = ["stripe", "paypal", "alipay", "wechat_pay"];
export const JEWELLERY = "jewellery";
export const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
