const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const authMiddleware = async (req, res, next) => {
  try {
    const access_token = req.query.access_token || req.body.access_token;
    if (!access_token)
      return res.status(401).json({ error: "No token provided" });

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(access_token);

    if (error || !user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Get subscription information
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    req.user = user;

    req.subscription = subscription;
    // console.log('User:', req.user);
    // console.log('Subscription:', req.subscription);
    next();
  } catch (err) {
    console.error("Error verifying token:", err);
    return res.status(401).json({ error: "Invalid token format" });
  }
};

module.exports = authMiddleware;
