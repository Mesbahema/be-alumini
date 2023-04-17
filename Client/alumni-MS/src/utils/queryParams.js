export function setQueryParam(key, value) {
    // @ts-ignore
    return window.history.replaceState(null, null, `?${key}=${value}`);
}
export function getQueryParam(key) {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        // @ts-ignore
        get: (searchParams, prop) => searchParams.get(prop),
      });
      // @ts-ignore
    return params[key] || null
}
