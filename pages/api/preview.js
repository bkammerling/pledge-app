export default async function preview(req, res) {
  const { slug = "" } = req.query;
  // get the storyblok params for the bridge to work
  const params = req.url.split("?");
  const previewSecret = process.env.STORYBLOK_PREVIEW_SECRET;

  const sanitizeSlug = (value) => {
    if (typeof value !== "string") return "";
    const trimmed = value.trim().replace(/^\/+/, "");
    if (!trimmed) return "";
    if (trimmed.includes("..")) return "";
    if (!/^[a-zA-Z0-9/_-]+$/.test(trimmed)) return "";
    return trimmed;
  };

  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (!previewSecret || req.query.secret !== previewSecret) {
    return res.status(401).json({ message: "Invalid token" });
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({});

  // Set cookie to None, so it can be read in the Storyblok iframe
  const cookies = res.getHeader("Set-Cookie");
  res.setHeader(
    "Set-Cookie",
    cookies.map((cookie) =>
      cookie.replace("SameSite=Lax", "SameSite=None;Secure")
    )
  );

  // Redirect to the path from entry
  const safeSlug = sanitizeSlug(slug);
  const previewPath = safeSlug ? `/${safeSlug}` : "/";
  const queryString = params[1] ? `?${params[1]}` : "";
  res.redirect(`${previewPath}${queryString}`);
}
