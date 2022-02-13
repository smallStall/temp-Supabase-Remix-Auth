import { redirect } from "remix";
import { supabaseClient } from "~/supabase";
import { getSession } from "~/session.server";

type loaderRequest = {
  request: Request;
};

export const loader = async ({ request } : loaderRequest) => {
  const session = await getSession(request.headers.get("Cookie"));
  // access_tokenヘッダーがない場合
  if (!session.has("access_token")) {
    throw redirect("/login");
  } else {
    //ページを取得。ただし、まずはcookieからJWTを取得
    //supabaseで取得したJWTを検索
    const { user, error: sessionErr } = await supabaseClient.auth.api.getUser(
      session.get("access_token")
    );
    // 何もエラーがなければaccess_tokenが承認済み(Supabaseに承認されている)
    if (!sessionErr) {
      supabaseClient.auth.setAuth(session.get("access_token"));
      return {};
    } else {
      return { error: sessionErr };
    }
  }
};

export default function AuthPage() {
  return (
    <div>
      <h1>認証されました</h1>
    </div>
  );
}