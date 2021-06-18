interface PromiseQueue<T> {
  enqueue: (promiseFn: PromiseFn<T>) => Promise<T>
}

interface PromiseFn<T> {
  (...args: any): Promise<T>
}

export const createPromiseQueue = <T>(): PromiseQueue<T> => {
  const queue: Array<{ promiseFn: PromiseFn<T>, resolve: (value: any) => void, reject: (err: Error) => void }> = []
  let workingOnPromise = false
  const enqueue = (promiseFn: PromiseFn<T>) => {
    return new Promise<T>((resolve, reject) => {
      queue.push({
        promiseFn,
        resolve,
        reject
      })
      dequeue()
    })
  }
  const dequeue = () => {
    if (workingOnPromise) return
    const item = queue.shift()
    if (!item) return
    try {
      workingOnPromise = true
      item.promiseFn()
        .then((value) => {
          workingOnPromise = false
          item.resolve(value)
          dequeue()
        })
        .catch((err) => {
          workingOnPromise = false
          item.reject(err)
          dequeue()
        })
    } catch (err) {
      workingOnPromise = false
      item.reject(err)
      dequeue()
    }
  }
  return {
    enqueue
  }
}