const express = require("express");
const passport = require("passport");

const router = express.Router();

// GitHub OAuth Login
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

// GitHub OAuth Callback
router.get("/github/callback",
    passport.authenticate("github", { failureRedirect: "/" }),
    (req, res) => {
        const redirectUrl = process.env.NODE_ENV === "production"
            ? "https://task-manager-5431.onrender.com/api/api-docs"
            : "http://localhost:8080/api/api-docs";
        res.redirect(redirectUrl);
    }
);

// Logout Route
router.get("/logout", (req, res) => {
    req.logout(() => {
        res.redirect("/");
    });
});

// Check if user is authenticated
router.get("/user", (req, res) => {
    res.json({ user: req.isAuthenticated() ? req.user : null });
});

module.exports = router;
