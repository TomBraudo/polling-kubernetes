// Business layer for users: coordinates user service

export function createUserBusiness({ userService }) {
  async function login(username) {
    return await userService.loginOrCreate(username);
  }

  async function loginFromHttp({ bodyRaw }) {
    let body;
    try {
      body = bodyRaw ? JSON.parse(bodyRaw) : {};
    } catch {
      throw new Error("Invalid JSON");
    }
    const { username } = body || {};
    return await login(username);
  }

  return { login, loginFromHttp };
}

export default { createUserBusiness };

