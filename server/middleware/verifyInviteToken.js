// /server/middleware/verifyInviteToken.js
import jwt from "jsonwebtoken";

export default function verifyInviteToken(req, res, next) {
	const token = req.query.token || req.body.token;

	if (!token) {
		return res.status(400).json({ error: "Missing invite token" });
	}

	try {
		const decoded = jwt.verify(token, process.env.INVITE_SECRET);
		req.inviteData = decoded; // attach to req for downstream use
		next();
	} catch (err) {
		console.error("Invalid invite token:", err);
		return res.status(401).json({ error: "Invalid or expired invite token" });
	}
}
