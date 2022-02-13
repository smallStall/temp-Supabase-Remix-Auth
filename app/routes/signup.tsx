import { Form, useActionData, redirect } from "remix";
import { supabaseClient } from "~/supabase";
import { commitSession, getSession } from "~/session.server";

type ActionRequest = {
  request: Request;
};

export const action = async ({ request }: ActionRequest) => {
  const form = await request.formData();
  const email = form.get("email")?.toString();
  const password = form.get("password")?.toString();
  const userName = form.get("userName");
  await supabaseClient.auth.signOut();

  const {
    session: gotrueSession,
    user,
    error: signUpError,
  } = await supabaseClient.auth.signUp({
    email,
    password,
  });
  if (!signUpError && user) {
    const { error: profileError } = await supabaseClient
      .from("profiles")
      .insert({ user_name: userName, id: user.id }, {returning : 'minimal'});

    if (profileError) return { error: profileError };    

    const session = await getSession(request.headers.get("Cookie"));
    console.log(gotrueSession?.access_token) //miniflareにてJWTを確認
    session.set("access_token", gotrueSession?.access_token);
    return redirect("/mail", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
  return { user, signUpError };
};

export default function Signup() {
  const actionData = useActionData();

  return (
    <div>
      <h1>ユーザー登録</h1>
      <Form method="post">
        <div>
          <label>ユーザー名:</label>
          <input id="userName" name="userName"  type="text" />
        </div>
        <div>
          <label>メールアドレス:</label>
          <input id="email" name="email" autoComplete="username" />
        </div>
        <div>
          <label>パスワード:</label>
          <input
            id="password"
            type="password"
            name="password"
            autoComplete="current-password"
          />
        </div>
        <input type="submit" />
        <p>{actionData?.error ? actionData?.error?.message : null}</p>
      </Form>
    </div>
  );
}
