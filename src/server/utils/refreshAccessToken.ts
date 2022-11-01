import { env } from "../../env/server.mjs";

export async function refreshAccessToken(refreshToken: string) {
  // console.log("refreshing token", refreshToken);
  try {
    const body = JSON.stringify({
      client_id: env.GITHUB_APP_CLIENT_ID,
      client_secret: env.GITHUB_APP_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });
    // console.log("body", body);
    const response = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/vnd.github+json",
          // Bearer: accessToken,
        },
        method: "POST",
        body,
      }
    );

    // console.log("response", response);
    const refreshedToken = await response.json();

    console.log("refreshedToken", refreshedToken);

    if (!response.ok) {
      throw refreshedToken;
    }

    return {
      accessToken: refreshedToken.access_token,
      accessTokenExpiresIn: refreshedToken.expires_in,
      refreshToken: refreshedToken.refresh_token ?? refreshToken,
      refreshTokenExpiresIn: refreshedToken.refresh_token_expires_in,
    };
  } catch (error) {
    console.log(error);

    return {
      error: "RefreshAccessTokenError",
    };
  }
}
