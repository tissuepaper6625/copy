import express from 'express';
import { ethers } from 'ethers';
import { PrivyClient } from '@privy-io/server-auth';

const router = express.Router();

/* ------------------------------------------------------------------------- */
/*  Privy client – create ONE instance only                                   */
/* ------------------------------------------------------------------------- */
const privy = new PrivyClient(
  process.env.PRIVY_APP_ID,
  process.env.PRIVY_APP_SECRET
);

/* ------------------------------------------------------------------------- */
/*  POST /wallet/verify-wallet                                                 */
/* ------------------------------------------------------------------------- */
/**
 * Body:
 *   {
 *     address:   "0xAbc…",                     // wallet address
 *     signature: "0x7b8e…",                    // 65‑byte hex sig (or { signature: "…" })
 *     message:   "Attention – … at 1719451234567"
 *   }
 *
 * ▶︎ The message MUST end with a Unix epoch time – **seconds (10‑digit) OR milliseconds (13‑digit)**.
 * ▶︎ Timestamp must be ≤ 5 min old (replay‑attack protection).
 */
router.post('/verify-wallet', async (req, res) => {
  const { address, signature, message } = req.body;

  /* 1. Basic presence check ------------------------------------------------ */
  if (!address || !signature || !message) {
    return res
      .status(400)
      .json({ success: false, error: 'Missing address, signature, or message' });
  }

  /* 2. Normalise & validate the signature ---------------------------------- */
  const rawSignature =
    typeof signature === 'object' && signature.signature
      ? signature.signature
      : signature;

  if (
    typeof rawSignature !== 'string' ||
    !rawSignature.startsWith('0x') ||
    rawSignature.length !== 132
  ) {
    return res
      .status(400)
      .json({ success: false, error: 'Invalid signature format' });
  }

  /* 3. Validate wallet address --------------------------------------------- */
  if (!ethers.isAddress(address)) {
    return res
      .status(400)
      .json({ success: false, error: 'Invalid wallet address' });
  }

  /* 4. Replay‑attack protection -------------------------------------------- */
  const tsMatch = message.match(/at\s+(\d{10,13})$/);
  if (!tsMatch) {
    return res
      .status(400)
      .json({ success: false, error: 'Message timestamp missing' });
  }

  // seconds → ms when needed
  const stampMs = tsMatch[1].length === 10 ? Number(tsMatch[1]) * 1000 : Number(tsMatch[1]);
  const FIVE_MINUTES_MS = 5 * 60 * 1000;

  if (Date.now() - stampMs > FIVE_MINUTES_MS) {
    return res
      .status(400)
      .json({ success: false, error: 'Message timestamp invalid or too old' });
  }

  /* 5. Cryptographically verify the signer --------------------------------- */
  try {
    const recovered = ethers.verifyMessage(message, rawSignature);

    if (recovered.toLowerCase() !== address.toLowerCase()) {
      return res
        .status(400)
        .json({ success: false, error: 'Signature does not match address' });
    }

    /* 6. Query Privy – no auto‑creation (SDK v1.27 removed createUser) ------ */
    const user = await privy.getUserByWalletAddress(address).catch(() => null);
    // comment this if (!user) block of code to test becuase this will check if user exists in privy and quit if they do not exist
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found in Privy' });
    }

    /* 7. Respond ------------------------------------------------------------ */
    return res.json({
      success: true,
      verified: true,
      userExistsInPrivy: Boolean(user),
      mfaEnabled: Boolean(user?.mfa?.enabled),
      timestamp: Date.now(),
    });
  } catch (err) {
    console.error('verify-wallet error →', err);
    return res
      .status(500)
      .json({ success: false, error: `Server error: ${err.message}` });
  }
});

export default router;
