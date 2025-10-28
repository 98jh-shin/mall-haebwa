const ACCESS_TOKEN_KEY = "swiftcart_access_token";
const USER_ID_KEY = "swiftcart_user_id";
const USER_EMAIL_KEY = "swiftcart_user_email";
const USER_ROLE_KEY = "swiftcart_user_role";

export const AUTH_EVENT = "swiftcart-auth-changed";

const hasWindow = () => typeof window !== "undefined";

const readValue = (storage, key) => {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
};

const writeValue = (storage, key, value) => {
  try {
    if (value === null || value === undefined) {
      storage.removeItem(key);
    } else {
      storage.setItem(key, value);
    }
  } catch {
    // Ignore quota or privacy mode failures.
  }
};

const getLocalStorage = () => (hasWindow() ? window.localStorage : null);
const getSessionStorage = () => (hasWindow() ? window.sessionStorage : null);

export const getAccessToken = () => {
  if (!hasWindow()) return null;
  return (
    readValue(getLocalStorage(), ACCESS_TOKEN_KEY) ??
    readValue(getSessionStorage(), ACCESS_TOKEN_KEY)
  );
};

export const getUserId = () => {
  if (!hasWindow()) return null;
  return (
    readValue(getLocalStorage(), USER_ID_KEY) ??
    readValue(getSessionStorage(), USER_ID_KEY)
  );
};

export const getUserEmail = () => {
  if (!hasWindow()) return null;
  return (
    readValue(getLocalStorage(), USER_EMAIL_KEY) ??
    readValue(getSessionStorage(), USER_EMAIL_KEY)
  );
};

export const getUserRole = () => {
  if (!hasWindow()) return null;
  return (
    readValue(getLocalStorage(), USER_ROLE_KEY) ??
    readValue(getSessionStorage(), USER_ROLE_KEY)
  );
};

export const setAuthSession = ({
  token,
  userId,
  remember,
  email = null,
  role = null,
}) => {
  if (!hasWindow()) return;
  const local = getLocalStorage();
  const session = getSessionStorage();
  const normalisedEmail =
    typeof email === "string" ? email.trim().toLowerCase() : null;
  const normalisedRole =
    typeof role === "string" ? role.trim().toLowerCase() : null;

  if (remember) {
    writeValue(local, ACCESS_TOKEN_KEY, token);
    writeValue(local, USER_ID_KEY, userId);
    writeValue(local, USER_EMAIL_KEY, normalisedEmail);
    writeValue(local, USER_ROLE_KEY, normalisedRole);
    writeValue(session, ACCESS_TOKEN_KEY, null);
    writeValue(session, USER_ID_KEY, null);
    writeValue(session, USER_EMAIL_KEY, null);
    writeValue(session, USER_ROLE_KEY, null);
  } else {
    writeValue(session, ACCESS_TOKEN_KEY, token);
    writeValue(session, USER_ID_KEY, userId);
    writeValue(session, USER_EMAIL_KEY, normalisedEmail);
    writeValue(session, USER_ROLE_KEY, normalisedRole);
    writeValue(local, ACCESS_TOKEN_KEY, null);
    writeValue(local, USER_ID_KEY, null);
    writeValue(local, USER_EMAIL_KEY, null);
    writeValue(local, USER_ROLE_KEY, null);
  }

  window.dispatchEvent(new Event(AUTH_EVENT));
};

export const clearAuthSession = () => {
  if (!hasWindow()) return;
  writeValue(getLocalStorage(), ACCESS_TOKEN_KEY, null);
  writeValue(getLocalStorage(), USER_ID_KEY, null);
  writeValue(getLocalStorage(), USER_EMAIL_KEY, null);
  writeValue(getLocalStorage(), USER_ROLE_KEY, null);
  writeValue(getSessionStorage(), ACCESS_TOKEN_KEY, null);
  writeValue(getSessionStorage(), USER_ID_KEY, null);
  writeValue(getSessionStorage(), USER_EMAIL_KEY, null);
  writeValue(getSessionStorage(), USER_ROLE_KEY, null);

  window.dispatchEvent(new Event(AUTH_EVENT));
};
