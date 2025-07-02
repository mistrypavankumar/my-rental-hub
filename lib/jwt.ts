import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// Sign a token (equivalent to jwt.sign)
export async function signToken(
  payload: Record<string, unknown>,
  expiresIn = "7d"
) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + parseDuration(expiresIn);

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(secret);
}

// Verify a token (equivalent to jwt.verify)
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    return null;
  }
}

// Parses durations like '7d', '1h', etc.
function parseDuration(duration: string) {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) throw new Error("Invalid duration format");

  const value = parseInt(match[1]);
  const unit = match[2];

  const multipliers = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 60 * 60 * 24,
  };

  return value * multipliers[unit as keyof typeof multipliers];
}
