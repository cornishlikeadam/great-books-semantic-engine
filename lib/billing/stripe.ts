import Stripe from "stripe";
import { appConfig } from "@/lib/config";

let stripeClient: Stripe | null = null;

export function getStripeClient() {
  if (!appConfig.stripeSecretKey) return null;
  if (!stripeClient) {
    stripeClient = new Stripe(appConfig.stripeSecretKey);
  }
  return stripeClient;
}
