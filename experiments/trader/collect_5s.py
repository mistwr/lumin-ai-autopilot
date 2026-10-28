"""Read-only Binance spot stream collector for LUMIN 5S.

Run: python -m pip install websockets
     python experiments/trader/collect_5s.py --seconds 60 --out sample.jsonl
Does not authenticate, place orders, or manage funds.
"""
import argparse
import asyncio
import json
import time
from pathlib import Path
from urllib.parse import quote

from microstructure_5s import FiveSecondWindow

async def collect(seconds: int, out: str, symbol: str) -> None:
    import websockets
    streams = f"{symbol}@aggTrade/{symbol}@bookTicker"
    url = "wss://data-stream.binance.vision/stream?streams=" + quote(streams, safe="@/")
    window = FiveSecondWindow()
    end = time.monotonic() + seconds
    next_snapshot = time.monotonic() + 5
    last_quote = None
    Path(out).parent.mkdir(parents=True, exist_ok=True)
    with open(out, "w", encoding="utf-8") as f:
        async with websockets.connect(url, ping_interval=20, ping_timeout=20) as ws:
            while time.monotonic() < end:
                try:
                    message = json.loads(await asyncio.wait_for(ws.recv(), timeout=1))
                except asyncio.TimeoutError:
                    message = {}
                event = message.get("data", {})
                received_ms = int(time.time() * 1000)
                if event.get("e") == "aggTrade":
                    window.add_trade(int(event["T"]), float(event["p"]), float(event["q"]), bool(event["m"]))
                elif message.get("stream", "").endswith("@bookTicker"):
                    # bookTicker has no exchange timestamp; record local receive time.
                    window.add_quote(received_ms, float(event["b"]), float(event["B"]), float(event["a"]), float(event["A"]))
                    last_quote = (float(event["b"]), float(event["a"]))
                if time.monotonic() >= next_snapshot:
                    row = {"captured_at_ms": received_ms, "symbol": symbol, **window.snapshot(received_ms)}
                    if last_quote:
                        row["best_bid"], row["best_ask"] = last_quote
                    f.write(json.dumps(row) + "\n")
                    f.flush()
                    print(json.dumps(row))
                    next_snapshot += 5

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--seconds", type=int, default=60)
    parser.add_argument("--out", default="experiments/trader/market_5s.jsonl")
    parser.add_argument("--symbol", choices=["btcusdt", "ethusdt"], default="btcusdt")
    args = parser.parse_args()
    if not 5 <= args.seconds <= 86400:
        parser.error("--seconds must be between 5 and 86400")
    asyncio.run(collect(args.seconds, args.out, args.symbol))
