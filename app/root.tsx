import { Outlet, useLoaderData, LiveReload } from "remix";
import { SupabaseClient } from "@supabase/supabase-js";
//import { SupabaseProvider } from "./supabase";

export type RootContextType = {
  supabase: SupabaseClient;
};

export const loader = () => {
  return { msg: "nohoho" };
};

const Document = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) => {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        {title ? <title>{title}</title> : null}
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
};

export default function Index() {
  const supabase = useLoaderData<SupabaseClient>();
  return (
    <Document title="Auth&CRUD">
      <div>
        <p>------------------------------------------</p>
        <Outlet />
        <Scripts />
        <p>------------------------------------------</p>
      </div>
    </Document>
  );
}
