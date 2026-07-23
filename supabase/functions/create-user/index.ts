import { createClient } from "npm:@supabase/supabase-js@2";

const ALLOWED_ROLES = ["student", "lecturer"];
const MIN_PASSWORD_LENGTH = 8;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return json({ error: "Missing Authorization header" }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // Scoped to the caller's own JWT — respects RLS. Used only to verify identity/role.
  const callerClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user: caller },
    error: callerError,
  } = await callerClient.auth.getUser();

  if (callerError || !caller) {
    return json({ error: "Invalid session" }, 401);
  }

  const { data: callerProfile, error: profileError } = await callerClient
    .from("profiles")
    .select("role")
    .eq("id", caller.id)
    .single();

  if (profileError || callerProfile?.role !== "admin") {
    return json({ error: "Only admins can create accounts" }, 403);
  }

  let body: { email?: string; password?: string; fullName?: string; role?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const { email, password, fullName, role } = body;

  if (!email || !password || !fullName || !role) {
    return json({ error: "email, password, fullName and role are required" }, 400);
  }

  if (!ALLOWED_ROLES.includes(role)) {
    return json({ error: `role must be one of: ${ALLOWED_ROLES.join(", ")}` }, 400);
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return json(
      { error: `password must be at least ${MIN_PASSWORD_LENGTH} characters` },
      400
    );
  }

  // Service-role client — bypasses RLS. Only ever used here, server-side.
  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  const { data: created, error: createError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role },
  });

  if (createError) {
    return json({ error: createError.message }, 400);
  }

  return json(
    {
      user: {
        id: created.user.id,
        email: created.user.email,
        fullName,
        role,
      },
    },
    200
  );
});
