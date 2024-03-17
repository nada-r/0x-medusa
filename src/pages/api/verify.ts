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

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<VerifyReply>
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust this to match your front-end URL for better security
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS method (preflight request)
  if (req.method === 'OPTIONS') {
    // Stop here if it's a preflight request
    return res.status(200).end();
  }

  console.log("Received request to verify credential:\n", req.body);
  const reqBody = {
    nullifier_hash: req.body.nullifier_hash,
    merkle_root: req.body.merkle_root,
    proof: req.body.proof,
    verification_level: req.body.verification_level,
    action: req.body.action,
    signal: req.body.signal,
  };
  console.log("Sending request to World ID /verify endpoint:\n", reqBody);

  fetch(verifyEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  }).then((verifyRes) => {
    verifyRes.json().then((wldResponse) => {
      console.log(
        `Received ${verifyRes.status} response from World ID /verify endpoint:\n`,
        wldResponse
      );
      if (verifyRes.status === 200) {
        console.log("Credential verified! This user's nullifier hash is: ", wldResponse.nullifier_hash);
        res.status(verifyRes.status).send({
          code: "success",
          detail: "This action verified correctly!",
        });
      } else {
        res.status(verifyRes.status).send({ code: wldResponse.code, detail: wldResponse.detail });
      }
    });
  });
}
