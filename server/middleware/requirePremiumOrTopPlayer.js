import pool from "../db/index.js";

export default async function requirePremiumOrTopPlayer(req, res, next) {
	const userId = req.user?.id;
	if (!userId) return res.status(401).json({ error: "Unauthorized" });

	try {
		const premiumRes = await pool.query(
			"SELECT premium FROM player_profiles WHERE user_id = $1",
			[userId]
		);
		const isPremium = premiumRes.rows[0]?.premium;

		if (isPremium) return next();

		const topRes = await pool.query(
			`SELECT user_id FROM player_stats
       ORDER BY points_scored DESC
       LIMIT 1`
		);
		const topUserId = topRes.rows[0]?.user_id;

		if (userId === topUserId) return next();

		return res
			.status(403)
			.json({ error: "Premium or top athletes access required" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
}
