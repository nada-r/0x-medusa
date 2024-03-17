import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    externalResolver: true,
  },
};

export type VerifyReply = {
  code: string;
  detail: string;
};

const verifyEndpoint = `${process.env.NEXT_PUBLIC_WLD_API_BASE_URL}/api/v1/verify/${process.env.NEXT_PUBLIC_WLD_APP_ID}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VerifyReply>
) {
  const allowedOrigins = ['http://localhost:8000'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000'); // Adjust according to your frontend app URL, use '*' for wide open
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS method for preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // The rest of your API logic
  console.log("Received request to verify credential:\n", req.body);
  const reqBody = {
    nullifier_hash: req.body.nullifier_hash,
    merkle_root: req.body.merkle_root,
    proof: req.body.proof,
    verification_level: req.body.verification_level,
    action: req.body.action,
    signal: req.body.signal,
  };

  try {
    const verifyRes = await fetch(verifyEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });

    const wldResponse = await verifyRes.json();

    console.log(`Received ${verifyRes.status} response from World ID /verify endpoint:\n`, wldResponse);

    if (verifyRes.ok) {
      console.log("Credential verified! This user's nullifier hash is: ", wldResponse.nullifier_hash);
      return res.status(200).send({
        code: "success",
        detail: "This action verified correctly!",
      });
    } else {
      return res.status(verifyRes.status).send({ code: wldResponse.code, detail: wldResponse.detail });
    }
  } catch (error) {
    console.error("Verification failed:", error);
    return res.status(500).send({ code: "error", detail: "Internal Server Error" });
  }
}
