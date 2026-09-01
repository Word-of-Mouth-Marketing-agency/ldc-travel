export type MarketContext = {
  id: string;
  code: string;
};

export function getLaunchMarketCode() {
  return process.env.NEXT_PUBLIC_LAUNCH_MARKET_CODE ?? "EG";
}

export function marketRelationshipWhere(marketId: string) {
  return {
    markets: {
      contains: marketId,
    },
  } as const;
}
