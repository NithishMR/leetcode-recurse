type ExtractedProblemDetails = {
  platform: "leetcode.com";
  titleSlug: string;
};

export default function extractDetailsfromURl(
  url: string
): ExtractedProblemDetails | null {
  try {
    const parsedUrl = new URL(url);

    // Normalize hostname (handles www.)
    const hostname = parsedUrl.hostname.replace("www.", "");

    // ---- LeetCode ----
    if (hostname === "leetcode.com") {
      // Expected format: /problems/two-sum/
      const match = parsedUrl.pathname.match(/^\/problems\/([^/]+)\/?$/);

      if (!match) return null;

      const titleSlug = match[1];

      return {
        platform: "leetcode.com",
        titleSlug,
      };
    }

    // Unsupported platform (for now)
    return null;
  } catch {
    // Invalid URL
    return null;
  }
}
