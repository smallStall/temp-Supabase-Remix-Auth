import { Form, useActionData, redirect, Link } from "remix";
import { supabaseClient } from "~/supabase";
import { commitSession, getSession } from "~/session.server";

export const action = async ({ request }: { request: Request }) => {
  const form = await request.formData();
  const email = form.get("email")?.toString();
  const password = form.get("password")?.toString();

  //ログイン
  const {
    user,
    error,
    session: supabaseSession,
  } = await supabaseClient.auth.signIn({
    email,
    password,
  });
  //supabaseClient.authにて認証されたら
  if (user) {
    const session = await getSession(request.headers.get("Cookie"));
    session.set("access_token", supabaseSession?.access_token);
    return redirect("/secret", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  return { user, error };
};

export default function Login() {
  const actionData = useActionData();

  return (
    <div className="remix__page">
      <main>
        <h1>ログイン</h1>
        <Form method="post">
          <div className="form_item">
            <label htmlFor="email">メールアドレス:</label>
            <input id="email" name="email" type="text" />
          </div>
          <div className="form_item">
            <label htmlFor="password">パスワード:</label>
            <input id="password" name="password" type="password" />
          </div>
          <div>
            <button type="submit">ログイン</button>
            <div>
            <Link to="/signup">
              ユーザー登録はこちら
            </Link>
            </div>
          </div>
        </Form>
        <p>{actionData?.error ? actionData?.error?.message : null}</p>
      </main>
    </div>
  );
}
