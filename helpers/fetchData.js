export default async function (url, options, extraHeaders) {
  try {
    const token = window.sessionStorage.getItem("auth-token");
    const config = {
      ...options,
      headers: {
        ...extraHeaders,
        authorization: `Bearer ${token}`,
      },
    };
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DEV_SERVER}/api/v1${url}`,
      config
    );
    if (!res.ok && res.status == 429) {
      // if too many requests send him to new page with error response and logout later
      window.location.replace("/ratelimitpage");
      return;
    }
    if (res.status === 403 || res.statusText === "Token expired") {
      // window.sessionStorage.clear();
      // alert("You are being logged out due to token expiration");
      // window.location.replace('/')
      // sending req to server for new access token
      const refreshToken = window.sessionStorage.getItem("refresh-token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DEV_SERVER}/api/v1/refresh-login`,
        {
          method: "POST",
          body: JSON.stringify({
            jwt: refreshToken,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (res.status === 406) {
        // logout user if refresh token is expired too
        window.sessionStorage.clear();
        window.location.replace("/");
      }
      if (!data.isError || res.status === 200) {
        window.sessionStorage.setItem("auth-token", data.token);
      }
    } else {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    // window.location.assign('/errorpage')
    console.log(err);
    return err;
  }
}
