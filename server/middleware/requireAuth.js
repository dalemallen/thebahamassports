import jwt from "jsonwebtoken";

export default function requireAuth(req, res, next) {
	const authHeader = req.headers.authorization;
	if (!authHeader) return res.status(401).json({ error: "Missing token" });

	const token = authHeader.split(" ")[1];

	try {
		const decoded = jwt.decode(token); // For dev use only; use jwt.verify in production
		if (!decoded) throw new Error("Invalid token");

		req.user = {
			id: decoded.sub,
			...decoded,
		};

		next();
	} catch (err) {
		console.error("Auth error:", err);
		res.status(401).json({ error: "Unauthorized" });
	}
}
