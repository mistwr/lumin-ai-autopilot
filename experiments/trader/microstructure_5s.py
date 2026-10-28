"""Research-only five-second microstructure feature extractor.

Feed ordered trade and top-of-book events with millisecond timestamps.
No predictions, no orders, no exchange credentials.
"""
from collections import deque
from dataclasses import dataclass, field

@dataclass
class FiveSecondWindow:
    trades: deque = field(default_factory=deque)
    quotes: deque = field(default_factory=deque)
    window_ms: int = 5000

    def add_trade(self, timestamp_ms: int, price: float, quantity: float, buyer_is_maker: bool):
        if price <= 0 or quantity <= 0:
            raise ValueError("Positive price and quantity required")
        self.trades.append((timestamp_ms, price, quantity, buyer_is_maker))
        self._prune(timestamp_ms)

    def add_quote(self, timestamp_ms: int, bid: float, bid_qty: float, ask: float, ask_qty: float):
        if not (0 < bid <= ask and bid_qty >= 0 and ask_qty >= 0):
            raise ValueError("Invalid quote")
        self.quotes.append((timestamp_ms, bid, bid_qty, ask, ask_qty))
        self._prune(timestamp_ms)

    def _prune(self, now_ms: int):
        threshold = now_ms - self.window_ms
        for events in (self.trades, self.quotes):
            while events and events[0][0] < threshold:
                events.popleft()

    def snapshot(self, now_ms: int) -> dict:
        self._prune(now_ms)
        buys = sum(p * q for _, p, q, buyer_is_maker in self.trades if not buyer_is_maker)
        sells = sum(p * q for _, p, q, buyer_is_maker in self.trades if buyer_is_maker)
        total = buys + sells
        result = {
            "window_ms": self.window_ms,
            "trade_count": len(self.trades),
            "aggressive_buy_notional": buys,
            "aggressive_sell_notional": sells,
            "trade_imbalance": (buys - sells) / total if total else None,
            "return_pct": (
                100 * (self.trades[-1][1] / self.trades[0][1] - 1)
                if len(self.trades) >= 2 else None
            ),
        }
        if self.quotes:
            _, bid, bid_qty, ask, ask_qty = self.quotes[-1]
            mid = (bid + ask) / 2
            result["spread_bps"] = 10000 * (ask - bid) / mid
            result["top_book_imbalance"] = (
                (bid_qty - ask_qty) / (bid_qty + ask_qty)
                if bid_qty + ask_qty else None
            )
        else:
            result["spread_bps"] = None
            result["top_book_imbalance"] = None
        return result
