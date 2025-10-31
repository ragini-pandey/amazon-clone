module.exports = {
    reactStrictMode: true,
    images: {
        domains: ["fakestoreapi.com", "drive.google.com"],
    },
    env: {
        STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    },
};
