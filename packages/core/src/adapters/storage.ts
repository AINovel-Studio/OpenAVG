import localforage from 'localforage'

export interface IStorageAdapter {
  getItem: <T>(key: string) => Promise<T | null>
  setItem: <T>(key: string, value: T) => Promise<void>
  removeItem: (key: string) => Promise<void>
  clear: () => Promise<void>
}

export class LocalForageStorageAdapter implements IStorageAdapter {
  async getItem<T>(key: string): Promise<T | null> {
    return localforage.getItem<T>(key)
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    await localforage.setItem(key, value)
  }

  async removeItem(key: string): Promise<void> {
    await localforage.removeItem(key)
  }

  async clear(): Promise<void> {
    await localforage.clear()
  }
}
