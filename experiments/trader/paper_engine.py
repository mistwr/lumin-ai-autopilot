"""LUMIN Trader paper-trading simulator. No exchange orders or credentials."""
from dataclasses import dataclass, field
from typing import List

@dataclass
class Trade:
    entry: float
    quantity: float
    stop: float
    fee_paid: float

@dataclass
class PaperTrader:
    cash: float = 100.0
    fee_rate: float = 0.001
    risk_per_trade: float = 0.01
    daily_loss_limit: float = 0.03
    initial_equity: float = 100.0
    daily_start_equity: float = 100.0
    position: Trade | None = None
    ledger: List[dict] = field(default_factory=list)

    def equity(self, price: float) -> float:
        return self.cash + (self.position.quantity * price if self.position else 0.0)

    def buy(self, price: float, stop: float) -> dict:
        if price <= 0 or stop <= 0 or stop >= price:
            raise ValueError("Invalid price or stop")
        if self.position:
            raise ValueError("Position already open")
        if self.daily_start_equity - self.equity(price) >= self.daily_start_equity * self.daily_loss_limit:
            raise ValueError("Daily loss limit reached")
        max_risk = self.equity(price) * self.risk_per_trade
        # Includes entry and estimated exit fees in worst-case risk.
        unit_risk = price - stop + self.fee_rate * (price + stop)
        qty = min(max_risk / unit_risk, self.cash / (price * (1 + self.fee_rate)))
        if qty <= 0:
            raise ValueError("Insufficient balance")
        fee = qty * price * self.fee_rate
        self.cash -= qty * price + fee
        self.position = Trade(price, qty, stop, fee)
        event = {"action": "BUY", "price": price, "qty": qty, "fee": fee}
        self.ledger.append(event)
        return event

    def sell(self, price: float) -> dict:
        if not self.position or price <= 0:
            raise ValueError("No position or invalid price")
        p = self.position
        fee = p.quantity * price * self.fee_rate
        self.cash += p.quantity * price - fee
        pnl = p.quantity * (price - p.entry) - fee - p.fee_paid
        self.position = None
        event = {"action": "SELL", "price": price, "qty": p.quantity, "fee": fee, "pnl": pnl}
        self.ledger.append(event)
        return event

    def on_price(self, price: float) -> dict | None:
        if self.position and price <= self.position.stop:
            return self.sell(price)  # Gaps/slippage can exceed planned risk.
        return None

    def reset_day(self, price: float) -> None:
        self.daily_start_equity = self.equity(price)
