/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Singleton Server-Side Pattern.
 */
export function singleton<Value>(name: string, value: () => Value): Value {
    const globalStore = global as any
  
    globalStore.__singletons ??= {}
    globalStore.__singletons[name] ??= value()
  
    return globalStore.__singletons[name]
  }