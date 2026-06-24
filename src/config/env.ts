/**
 * Environment Configuration
 * Validates and centralizes all environment variables
 */

const requiredEnvVars = [
  "DATABASE_URL",
  "JWT_SECRET",
];

const optionalEnvVars = {
  PORT: "5000",
  NODE_ENV: "development",
  CLIENT_URL: "http://localhost:3000",
  JWT_EXPIRE_IN: "7d",
  OTP_EXPIRY_MINUTES: "10",
  LOG_LEVEL: "debug",
};

/**
 * Validate environment variables on startup
 */
export const validateEnv = (): void => {
  const missing = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
};

/**
 * Get environment configuration object
 */
export const envConfig = {
  // Required
  database: {
    url: process.env.DATABASE_URL!,
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRE_IN || optionalEnvVars.JWT_EXPIRE_IN,
  },

  // Optional with defaults
  server: {
    port: Number(process.env.PORT) || Number(optionalEnvVars.PORT),
    nodeEnv: process.env.NODE_ENV || optionalEnvVars.NODE_ENV,
    clientUrl: process.env.CLIENT_URL || optionalEnvVars.CLIENT_URL,
  },
  otp: {
    expiryMinutes:
      Number(process.env.OTP_EXPIRY_MINUTES) ||
      Number(optionalEnvVars.OTP_EXPIRY_MINUTES),
  },
  logger: {
    level: process.env.LOG_LEVEL || optionalEnvVars.LOG_LEVEL,
  },
  email: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || "noreply@avora.com",
  },

  // Helpers
  isDevelopment: (process.env.NODE_ENV || optionalEnvVars.NODE_ENV) === "development",
  isProduction: (process.env.NODE_ENV || optionalEnvVars.NODE_ENV) === "production",
};

export default envConfig;
