import { siteConfig } from "@/site.config";

export const storageKey = (suffix: string) => `${siteConfig.brand.storagePrefix}_${suffix}`;

export const TOKEN_KEY = storageKey("token");
export const CART_KEY = storageKey("cart");
export const COOKIE_KEY = storageKey("cookie_consent");
