export default defineEventHandler((event: any) => {
  setCookie(event, "token", "", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return {
    success: true,
    message: "Logout successful",
  };
});
