/**
 * Mẫu Node (debug): REST leverageBracket + WS v2/account.position + account.status.
 * Env: BINANCE_API_KEY, BINANCE_API_SECRET
 * Usage: node scripts/binance-margin-sample.mjs [SYMBOL]
 *
 * Testnet USDⓈ-M Futures REST: https://testnet.binancefuture.com
 * WebSocket: wss://testnet.binancefuture.com/ws-fapi/v1
 */

import crypto from "crypto";
import process from "process";
import axios from "axios";
import WebSocket from "ws";

const REST_URL = "https://testnet.binancefuture.com";
const WS_URL = "wss://testnet.binancefuture.com/ws-fapi/v1";

const API_KEY = process.env.BINANCE_API_KEY;
const API_SECRET = process.env.BINANCE_API_SECRET;

function signParams(params, secret) {
  const keys = Object.keys(params)
    .filter((k) => k !== "signature")
    .sort();
  const query = keys.map((k) => `${k}=${params[k]}`).join("&");
  return crypto.createHmac("sha256", secret).update(query).digest("hex");
}

function wsRequest(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = crypto.randomUUID();
    const payload = { id, method, params };

    const onMessage = (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        if (msg.id !== id) return;

        ws.off("message", onMessage);

        if (msg.status && msg.status !== 200) {
          reject(new Error(JSON.stringify(msg, null, 2)));
          return;
        }

        resolve(msg.result);
      } catch (err) {
        reject(err);
      }
    };

    ws.on("message", onMessage);
    ws.send(JSON.stringify(payload));
  });
}

function toNum(v) {
  if (v === undefined || v === null || v === "") return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function safeDivide(a, b) {
  if (!Number.isFinite(a) || !Number.isFinite(b) || b === 0) return null;
  return a / b;
}

function pickBracket(brackets, absNotional) {
  return (
    brackets.find((b) => absNotional >= toNum(b.notionalFloor) && absNotional < toNum(b.notionalCap)) ||
    brackets[brackets.length - 1]
  );
}

function calcMaintMarginFromBracket(absNotional, bracket) {
  const ratio = toNum(bracket.maintMarginRatio);
  const cum = toNum(bracket.cum);
  return absNotional * ratio - cum;
}

async function main() {
  if (!API_KEY || !API_SECRET) {
    throw new Error("Missing BINANCE_API_KEY or BINANCE_API_SECRET in env");
  }

  const symbol = process.argv[2] || "BTCUSDT";

  const ts1 = Date.now();
  const bracketParams = { symbol, timestamp: ts1 };
  const bracketSig = signParams(bracketParams, API_SECRET);

  const bracketResp = await axios.get(`${REST_URL}/fapi/v1/leverageBracket`, {
    params: { ...bracketParams, signature: bracketSig },
    headers: { "X-MBX-APIKEY": API_KEY },
  });

  const bracketData = bracketResp.data;
  const brackets = Array.isArray(bracketData) ? bracketData[0]?.brackets : bracketData?.brackets;
  if (!brackets?.length) {
    throw new Error("leverageBracket: no brackets in response");
  }

  const ws = new WebSocket(WS_URL);

  await new Promise((resolve, reject) => {
    ws.on("open", resolve);
    ws.on("error", reject);
  });

  try {
    const ts2 = Date.now();
    const posParams = { apiKey: API_KEY, symbol, timestamp: ts2 };
    posParams.signature = signParams(posParams, API_SECRET);

    const positions = await wsRequest(ws, "v2/account.position", posParams);

    const ts3 = Date.now();
    const accParams = { apiKey: API_KEY, timestamp: ts3 };
    accParams.signature = signParams(accParams, API_SECRET);

    const account = await wsRequest(ws, "v2/account.status", accParams);

    const position = Array.isArray(positions) ? positions.find((p) => p.symbol === symbol) : positions;

    if (!position) {
      throw new Error(`No position found for ${symbol}`);
    }

    const accountPosition = (account.positions || []).find(
      (p) => p.symbol === symbol && (p.positionSide === "BOTH" || !p.positionSide),
    );

    const absNotional = Math.abs(toNum(position.notional));
    const leverage = toNum(position.leverage);
    const marginType = (position.marginType || "").toLowerCase();
    const isolatedWallet = toNum(position.isolatedWallet);
    const unRealizedProfit = toNum(position.unRealizedProfit ?? position.unrealizedProfit);

    const currentBracket = pickBracket(brackets, absNotional);
    const estimatedMaintMargin = calcMaintMarginFromBracket(absNotional, currentBracket);

    const actualMaintMargin = accountPosition ? toNum(accountPosition.maintMargin) : null;
    const maintMarginToUse =
      actualMaintMargin !== null && Number.isFinite(actualMaintMargin) ? actualMaintMargin : estimatedMaintMargin;

    const totalMaintMargin = toNum(account.totalMaintMargin);
    const totalMarginBalance = toNum(account.totalMarginBalance);
    const accountMarginRatio = safeDivide(totalMaintMargin, totalMarginBalance);

    let positionMarginRatio = null;
    let note = "";

    if (marginType === "isolated") {
      const isolatedMarginBalance = isolatedWallet + unRealizedProfit;
      positionMarginRatio = safeDivide(maintMarginToUse, isolatedMarginBalance);
      note = "Isolated: marginRatio = maintMargin / (isolatedWallet + unrealizedProfit)";
    } else if (marginType === "cross") {
      positionMarginRatio = accountMarginRatio;
      note =
        "Cross: dùng accountMarginRatio vì cross positions dùng chung margin pool; không có position margin balance riêng trong Position Info V2.";
    } else {
      note = "Unknown marginType";
    }

    const result = {
      symbol,
      marginType,
      leverage,
      notional: absNotional,
      unRealizedProfit,
      isolatedWallet,
      liquidationPrice: toNum(position.liquidationPrice),
      bracket: {
        bracket: currentBracket.bracket,
        notionalFloor: toNum(currentBracket.notionalFloor),
        notionalCap: toNum(currentBracket.notionalCap),
        maintMarginRatio: toNum(currentBracket.maintMarginRatio),
        cum: toNum(currentBracket.cum),
      },
      maintMargin: {
        fromAccountStatus: actualMaintMargin,
        estimatedFromBracket: estimatedMaintMargin,
        used: maintMarginToUse,
      },
      account: {
        totalMaintMargin,
        totalMarginBalance,
        accountMarginRatio,
        accountMarginRatioPct: accountMarginRatio === null ? null : +(accountMarginRatio * 100).toFixed(4),
      },
      position: {
        positionMarginRatio,
        positionMarginRatioPct:
          positionMarginRatio === null ? null : +(positionMarginRatio * 100).toFixed(4),
      },
      note,
    };

    console.log(JSON.stringify(result, null, 2));
  } finally {
    ws.close();
  }
}

main().catch((err) => {
  console.error(err.response?.data || err.message || err);
  process.exit(1);
});
