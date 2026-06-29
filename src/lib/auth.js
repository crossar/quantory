import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getServerSession } from "next-auth/next";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";

function normalizeEmail(email) {
  return email?.trim().toLowerCase();
}

function splitName(name) {
  const fullName = name?.trim();
  if (!fullName) {
    return { firstName: null, lastName: null };
  }

  const [firstName, ...rest] = fullName.split(/\s+/);
  return {
    firstName: firstName || null,
    lastName: rest.length > 0 ? rest.join(" ") : null,
  };
}

const providers = [
  CredentialsProvider({
    name: "Email and Password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = normalizeEmail(credentials?.email);
      const password = credentials?.password || "";

      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user?.passwordHash) {
        throw new Error("Invalid email or password");
      }

      const matches = await bcrypt.compare(password, user.passwordHash);
      if (!matches) {
        throw new Error("Invalid email or password");
      }

      return {
        id: String(user.id),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        name:
          user.name ||
          [user.firstName, user.lastName].filter(Boolean).join(" ") ||
          user.email,
        image: user.image,
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google") {
        return true;
      }

      const email = normalizeEmail(user.email);
      if (!email) {
        return false;
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      const fullName = user.name?.trim() || profile?.name?.trim() || null;
      const { firstName, lastName } = splitName(fullName);

      if (existingUser) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            email,
            name: existingUser.name || fullName,
            firstName: existingUser.firstName || firstName,
            lastName: existingUser.lastName || lastName,
            image: user.image || profile?.picture || existingUser.image,
          },
        });
      }

      return true;
    },
    async jwt({ token, user }) {
      const userId =
        typeof user?.id === "number"
          ? user.id
          : user?.id
            ? Number(user.id)
            : token.userId;

      if (userId) {
        token.userId = userId;
      }

      if (user?.email) {
        token.email = user.email;
      }

      if (user?.name) {
        token.name = user.name;
      }

      if (typeof user?.firstName !== "undefined") {
        token.firstName = user.firstName;
      }

      if (typeof user?.lastName !== "undefined") {
        token.lastName = user.lastName;
      }

      if (typeof user?.image !== "undefined") {
        token.picture = user.image;
      }

      if ((!token.firstName && !token.lastName) || !token.name) {
        const email = normalizeEmail(token.email);
        if (email) {
          const dbUser = await prisma.user.findUnique({ where: { email } });
          if (dbUser) {
            token.userId = dbUser.id;
            token.firstName = dbUser.firstName;
            token.lastName = dbUser.lastName;
            token.name =
              dbUser.name ||
              [dbUser.firstName, dbUser.lastName].filter(Boolean).join(" ") ||
              dbUser.email;
            token.picture = dbUser.image;
          }
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.userId || "");
        session.user.email = token.email || session.user.email || null;
        session.user.name =
          token.name || session.user.name || session.user.email;
        session.user.firstName = token.firstName || null;
        session.user.lastName = token.lastName || null;
        session.user.image = token.picture || session.user.image || null;
      }

      return session;
    },
  },
};

export function getAuthSession(req, res) {
  return getServerSession(req, res, authOptions);
}

export async function getSessionUserId(req, res) {
  const session = await getAuthSession(req, res);
  const userId = Number(session?.user?.id);

  return Number.isInteger(userId) ? userId : null;
}

export default NextAuth(authOptions);
