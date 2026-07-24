import { File } from "expo-file-system";

import { supabase } from "@/lib/supabase";

const AVATARS_BUCKET = "avatars";

/** Uploads a locally-picked image (file:// uri) as a user's avatar and
 * returns its public URL. Each upload gets a unique path so the public URL
 * changes and clients never show a stale cached image. */
export async function uploadAvatar(userId: string, localUri: string): Promise<string> {
  const file = new File(localUri);
  const arrayBuffer = await file.arrayBuffer();
  const extension = file.extension?.replace(".", "") || "jpg";
  const contentType = file.type || "image/jpeg";
  const path = `${userId}/${Date.now()}.${extension}`;

  const { error } = await supabase.storage
    .from(AVATARS_BUCKET)
    .upload(path, arrayBuffer, { contentType, upsert: true });
  if (error) throw error;

  const { data } = supabase.storage.from(AVATARS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
