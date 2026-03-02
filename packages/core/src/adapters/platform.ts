export interface IPlatformAdapter {
  setPageTitle: (title: string) => void
  setFavicon: (iconUrl: string) => void
  requestFullscreen: () => void
  getViewportSize: () => { width: number, height: number }
  navigateTo: (url: string) => void
  observeElementResize: (elementId: string, callback: () => void) => { disconnect: () => void }
  createThumbnail: (
    imageSource: HTMLImageElement | ImageBitmap,
    width: number,
    height: number,
    format?: string,
    quality?: number,
  ) => Promise<string>
}

export class BrowserPlatformAdapter implements IPlatformAdapter {
  setPageTitle(title: string): void {
    document.title = title
  }

  setFavicon(iconUrl: string): void {
    const link: HTMLLinkElement
      = document.querySelector('link[rel*="icon"]') || document.createElement('link')
    link.type = 'image/x-icon'
    link.rel = 'shortcut icon'
    link.href = iconUrl
    document.getElementsByTagName('head')[0].appendChild(link)
  }

  requestFullscreen(): void {
    document.documentElement.requestFullscreen?.()
  }

  getViewportSize(): { width: number, height: number } {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }

  navigateTo(url: string): void {
    window.location.href = url
  }

  observeElementResize(
    elementId: string,
    callback: () => void,
  ): { disconnect: () => void } {
    const el = document.getElementById(elementId)
    if (!el) {
      console.warn(`[OpenAVG] Element #${elementId} not found`)
      return { disconnect: () => {} }
    }
    const observer = new ResizeObserver(callback)
    observer.observe(el)
    return { disconnect: () => observer.disconnect() }
  }

  async createThumbnail(
    imageSource: HTMLImageElement | ImageBitmap,
    width: number,
    height: number,
    format = 'image/webp',
    quality = 0.5,
  ): Promise<string> {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    canvas.width = width
    canvas.height = height
    ctx.drawImage(imageSource, 0, 0, width, height)
    return canvas.toDataURL(format, quality)
  }
}
