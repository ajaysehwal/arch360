export interface Price {
    id: string;
    name: string;
    price: number;
    interval: string;
    currency: string;
    features: string[];
}

export const PRICING_PLANS: readonly Price[] = [
    {
      id: 'price_basic',

      name: 'Basic',
      price: 5.99,
      interval: 'month',
      currency: 'usd',
      features: ['Create 10 virtual Tours','2GB private storage', 'priority support']
    },
    {
      id: 'price_pro',
      name: 'Pro',
      price: 15.99,
      interval: 'month',
      currency: 'usd',
      features: ["unlimited virtual tours", "5 users invite", "unlimited projects", "priority support"]
    },
    {
      id: 'price_enterprise',

      name: 'Enterprise',
      price: 49.99,
      interval: 'month',
      currency: 'usd',
      features: ['unlimited virtual tours', 'unlimited users', 'unlimited projects', 'dedicated instance', 'priority support']
    }
  ] 
  

  