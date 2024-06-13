import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const res = await axios.post("http://103.164.54.252:8000/api/auth/login", {
            username: credentials.username,
            password: credentials.password,
          });
          console.log("res", res.data);
          if (res.data) {
            return { accessToken: res.data.access, refreshToken: res.data.refresh }
          }
        } catch (error) {
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/signin"
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    jwt: true,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
      }
      return token
    },
    async session({ session, token }) {
      session.user = {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken
      }
      return session
    }
  },
});
