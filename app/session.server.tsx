import { createCookieSessionStorage } from "remix";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "__session",
      expires: new Date(Date.now() + 180), //3分間もつ
      httpOnly: true,
      maxAge: 120, //3分間待ってやる
      path: "/",
      sameSite: "lax",
      secrets: [SESSION_KEY],
      secure: true,
    },
  });

export { getSession, commitSession, destroySession };
