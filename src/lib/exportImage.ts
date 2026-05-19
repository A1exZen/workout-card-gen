import { toJpeg, toPng } from 'html-to-image'

type ExportOptions = {
  fileName: string
  format: 'png' | 'jpg'
  scale?: number
}

function downloadDataUrl(dataUrl: string, fileName: string) {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = fileName
  link.click()
}

export async function exportElementAsImage(
  element: HTMLElement,
  { fileName, format, scale = 2 }: ExportOptions,
) {
  if ('fonts' in document) {
    await document.fonts.ready
  }

  const options = {
    cacheBust: true,
    pixelRatio: scale,
    backgroundColor: format === 'jpg' ? '#ffffff' : undefined,
  }

  const dataUrl =
    format === 'jpg'
      ? await toJpeg(element, { ...options, quality: 0.96 })
      : await toPng(element, options)

  downloadDataUrl(dataUrl, `${fileName}.${format}`)
}
