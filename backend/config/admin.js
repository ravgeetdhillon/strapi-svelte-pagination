module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '0c0c021331c50ab2575a0dea524cd2ec'),
  },
});
