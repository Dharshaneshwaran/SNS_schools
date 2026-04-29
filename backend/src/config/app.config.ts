export const appConfig = {
  port: Number(process.env.PORT ?? 5000),
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:3001',
  jwtSecret:
    process.env.JWT_SECRET ?? 'sns-erp-local-access-secret-change-me',
  refreshSecret:
    process.env.JWT_REFRESH_SECRET ?? 'sns-erp-local-refresh-secret-change-me',
  accessTokenTtlSeconds: Number(process.env.JWT_EXPIRES_IN ?? 3600),
  refreshTokenTtlSeconds: Number(
    process.env.JWT_REFRESH_EXPIRES_IN ?? 60 * 60 * 24 * 14,
  ),
};
