const DB_NAME = 'workout-card-generator'
const STORE_NAME = 'background-images'
const DB_VERSION = 1

type StoredImageRecord = {
  id: string
  blob: Blob
  updatedAt: string
}

let dbPromise: Promise<IDBDatabase> | null = null
const runtimeImageUrls = new Map<string, string>()

function createImageId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `bg-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function openImageDatabase() {
  if (dbPromise) {
    return dbPromise
  }

  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available in this browser.'))
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const database = request.result

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('Failed to open the image database.'))
  })

  return dbPromise
}

async function withStore<T>(
  mode: IDBTransactionMode,
  handler: (store: IDBObjectStore, resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: unknown) => void) => void,
) {
  const database = await openImageDatabase()

  return new Promise<T>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode)
    const store = transaction.objectStore(STORE_NAME)

    transaction.onerror = () => reject(transaction.error ?? new Error('IndexedDB transaction failed.'))
    handler(store, resolve, reject)
  })
}

function setRuntimeImageUrl(imageId: string, nextUrl: string) {
  const previousUrl = runtimeImageUrls.get(imageId)

  if (previousUrl && previousUrl !== nextUrl) {
    URL.revokeObjectURL(previousUrl)
  }

  runtimeImageUrls.set(imageId, nextUrl)
  return nextUrl
}

export async function saveImageFile(file: Blob) {
  const imageId = createImageId()

  await withStore<void>('readwrite', (store, resolve, reject) => {
    const request = store.put({
      id: imageId,
      blob: file,
      updatedAt: new Date().toISOString(),
    } satisfies StoredImageRecord)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error ?? new Error('Failed to save image background.'))
  })

  return {
    imageId,
    previewUrl: setRuntimeImageUrl(imageId, URL.createObjectURL(file)),
  }
}

export async function getImageBlob(imageId: string) {
  return withStore<Blob | null>('readonly', (store, resolve, reject) => {
    const request = store.get(imageId)

    request.onsuccess = () => {
      const record = request.result as StoredImageRecord | undefined
      resolve(record?.blob ?? null)
    }
    request.onerror = () => reject(request.error ?? new Error('Failed to read image background.'))
  })
}

export async function ensureImagePreviewUrl(imageId: string) {
  const existingUrl = runtimeImageUrls.get(imageId)
  if (existingUrl) {
    return existingUrl
  }

  const blob = await getImageBlob(imageId)
  if (!blob) {
    return null
  }

  return setRuntimeImageUrl(imageId, URL.createObjectURL(blob))
}

export async function listStoredImageIds() {
  return withStore<string[]>('readonly', (store, resolve, reject) => {
    const request = store.getAllKeys()

    request.onsuccess = () => resolve(request.result.map((key) => String(key)))
    request.onerror = () => reject(request.error ?? new Error('Failed to list stored images.'))
  })
}

export async function deleteStoredImage(imageId: string) {
  await withStore<void>('readwrite', (store, resolve, reject) => {
    const request = store.delete(imageId)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error ?? new Error('Failed to delete image background.'))
  })

  const runtimeUrl = runtimeImageUrls.get(imageId)
  if (runtimeUrl) {
    URL.revokeObjectURL(runtimeUrl)
    runtimeImageUrls.delete(imageId)
  }
}

export function releaseUnusedImagePreviewUrls(usedImageIds: Iterable<string>) {
  const usedSet = new Set(usedImageIds)

  runtimeImageUrls.forEach((url, imageId) => {
    if (!usedSet.has(imageId)) {
      URL.revokeObjectURL(url)
      runtimeImageUrls.delete(imageId)
    }
  })
}

export async function pruneStoredImages(usedImageIds: Iterable<string>) {
  const usedSet = new Set(usedImageIds)
  const storedIds = await listStoredImageIds()

  await Promise.all(
    storedIds
      .filter((imageId) => !usedSet.has(imageId))
      .map((imageId) => deleteStoredImage(imageId)),
  )
}
