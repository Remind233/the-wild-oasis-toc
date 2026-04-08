import NextAuth, {
  NextAuthConfig,
  User,
  Account,
  Profile,
  Session,
} from "next-auth";
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from "./guest-service";

// 扩展 Session 类型以包含 guestId
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      guestId?: number; // 根据您的 guest.id 类型调整（可能是 string）
    };
  }
}

const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // authorized 用于中间件路由保护
    authorized({ auth, request }) {
      return !!auth?.user;
    },
    // signIn 在用户登录时调用，用于创建访客记录
    async signIn({ user, account, profile }) {
      try {
        if (!user.email) return false; // 必须存在邮箱
        const existingGuest = await getGuest(user.email);
        if (!existingGuest) {
          await createGuest({
            email: user.email,
            fullName: user.name ?? "", // 保证 fullName 为字符串
          });
        }
        return true;
      } catch {
        return false;
      }
    },
    // session 回调：将 guestId 添加到 session.user
    async session({ session, user }) {
      if (session.user?.email) {
        const guest = await getGuest(session.user.email);
        if (guest) {
          session.user.guestId = guest.id;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
