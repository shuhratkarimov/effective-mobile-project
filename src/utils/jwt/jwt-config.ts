const parseEnv = <T extends string | number>(value: string | undefined, fallback?: T): T => {
  if (value === undefined || value === "") {
    if (fallback !== undefined) return fallback;
    throw new Error("Missing env variable");
  }

  if (typeof fallback === "number") {
    const parsed = Number(value);
    if (isNaN(parsed)) throw new Error(`Invalid number env value: ${value}`);
    return parsed as T;
  }

  return value as T;
};

const config = {
  jwt: {
    secret: parseEnv(process.env.JWT_ACCESS_SECRET),
    expiresIn: parseEnv(process.env.JWT_ACCESS_EXPIRES_IN, "15m"),
  },

  refresh: {
    secret: parseEnv(process.env.JWT_REFRESH_SECRET),
    expiresIn: parseEnv(process.env.JWT_REFRESH_EXPIRES_IN, "7d"),
  },
};

export default config;
