import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(opts: CreateExpressContextOptions): Promise<TrpcContext> {
  let user: User | null = null;

  // Development mode: Use mock user for local testing
  if (process.env.NODE_ENV === 'development' && process.env.USE_MOCK_AUTH === 'true') {
    console.log('[Auth] Using mock user for development');
    user = {
      id: 1,
      openId: 'mock-dev-openid-123',
      email: 'dev@example.com',
      name: 'Development User',
      role: 'admin',
      loginMethod: 'mock',
      subscriptionTier: 'premium',
      subscriptionExpiry: null,
      revenueCatUserId: null,
      aiAnalysisCount: 0,
      aiAnalysisResetDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    } as User;
  } else {
    // Production mode: Use real authentication
    try {
      user = await sdk.authenticateRequest(opts.req);
    } catch (error) {
      // Authentication is optional for public procedures.
      user = null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
