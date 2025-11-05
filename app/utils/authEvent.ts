type AuthCallback = () => void;

export const authEvents = {
  listeners: [] as AuthCallback[],

  subscribe(callback: AuthCallback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  },

  trigger() {
    for (const cb of this.listeners) cb();
  },
};
