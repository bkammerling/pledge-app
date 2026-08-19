export default async function exit(req, res) {
  const { slug = "" } = req.query;
  const sanitizeSlug = (value) => {
    if (typeof value !== "string") return "";
    const trimmed = value.trim().replace(/^\/+/, "");
    if (!trimmed) return "";
    if (trimmed.includes("..")) return "";
    if (!/^[a-zA-Z0-9/_-]+$/.test(trimmed)) return "";
    return trimmed;
  };
  // Exit the current user from "Preview Mode". This function accepts no args.
  res.clearPreviewData();

  // set the cookies to None
  const cookies = res.getHeader("Set-Cookie");
  res.setHeader(
    "Set-Cookie",
    cookies.map((cookie) =>
      cookie.replace("SameSite=Lax", "SameSite=None;Secure")
    )
  );

  // Redirect the user back to the index page.
  const safeSlug = sanitizeSlug(slug);
  const path = safeSlug ? `/${safeSlug}` : "/";
  res.redirect(path);
}
