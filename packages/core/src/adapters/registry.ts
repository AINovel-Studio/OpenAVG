import type { IPlatformAdapter } from './platform'
import type { IStorageAdapter } from './storage'
import { BrowserPlatformAdapter } from './platform'

class AdapterRegistry {
  private _platform: IPlatformAdapter = new BrowserPlatformAdapter()
  private _storage: IStorageAdapter | null = null

  get platform(): IPlatformAdapter {
    return this._platform
  }

  set platform(adapter: IPlatformAdapter) {
    this._platform = adapter
  }

  get storage(): IStorageAdapter {
    if (!this._storage) {
      throw new Error('[OpenAVG] Storage adapter not initialized. Call openAVGCore.init() first.')
    }
    return this._storage
  }

  set storage(adapter: IStorageAdapter) {
    this._storage = adapter
  }
}

export const adapterRegistry = new AdapterRegistry()
