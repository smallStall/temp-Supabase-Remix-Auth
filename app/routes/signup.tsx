import { Form, useActionData, redirect } from "remix";
import { supabaseClient } from "~/supabase";

type ActionRequest = {
  request: Request
}

export const action = async ({ request }: ActionRequest) => {
  const form = await request.formData();
  const email = form.get("email")?.toString();
  const password = form.get("password")?.toString();
  const userName = form.get("userName");
  await supabaseClient.auth.signOut();

  const {
    session: supabaseSession,
    user,
    error: signUpError,
  } = await supabaseClient.auth.signUp({
    email,
    password,
  });
  console.log(userName) //miniflareにて確認
  
  if (!signUpError && user) {
    const { error: profileError } = await supabaseClient
      .from("profiles")
      .insert({ user_name: userName, user_id: user.id }, {returning : 'minimal'});

    if (profileError) return { error: profileError };
    return redirect("/mail")
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