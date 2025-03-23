import { NextApiRequest, NextApiResponse } from "next";
import { authAdmin } from "@/lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { uid, role } = req.body;

  if (!uid || !role) {
    return res.status(400).json({ error: "Missing uid or role" });
  }

  try {
    await authAdmin.setCustomUserClaims(uid, { role });
    return res.status(200).json({ message: `Role ${role} assigned to user ${uid}` });
  } catch (error) {
    return res.status(500).json({ error: "Failed to set role" });
  }
}
