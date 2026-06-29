import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getServerSession } from "next-auth/next";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";

function normalizeUsername(username) {
  return username?.trim().toLowerCase();
}

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
    name: "Username and Password",
    credentials: {
      username: { label: "Username", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const username = normalizeUsername(credentials?.username);
      const password = credentials?.password || "";

      if (!username || !password) {
        throw new Error("Username and password are required");
      }

      const user = await prisma.user.findUnique({ where: { username } });

      if (!user?.passwordHash) {
        throw new Error("Invalid username or password");
      }

      const matches = await bcrypt.compare(password, user.passwordHash);
      if (!matches) {
        throw new Error("Invalid username or password");
      }

      return {
        id: String(user.id),
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        name:
          user.name ||
          [user.firstName, user.lastName].filter(Boolean).join(" ") ||
          user.username ||
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

      if (user?.username) {
        token.username = user.username;
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

      if (
        !token.username ||
        (!token.firstName && !token.lastName) ||
        !token.name
      ) {
        const username = normalizeUsername(token.username);
        const email = normalizeEmail(token.email);
        const dbUser = username
          ? await prisma.user.findUnique({ where: { username } })
          : email
            ? await prisma.user.findUnique({ where: { email } })
            : null;

        if (dbUser) {
          token.userId = dbUser.id;
          token.username = dbUser.username;
          token.firstName = dbUser.firstName;
          token.lastName = dbUser.lastName;
          token.name =
            dbUser.name ||
            [dbUser.firstName, dbUser.lastName].filter(Boolean).join(" ") ||
            dbUser.username ||
            dbUser.email;
          token.picture = dbUser.image;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.userId || "");
        session.user.username = token.username || null;
        session.user.email = token.email || session.user.email || null;
        session.user.name =
          token.name ||
          session.user.name ||
          token.username ||
          session.user.email;
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
