export interface Connection<T> {
  edges: Array<ConnectionNode<T>>
}

interface ConnectionNode<T> {
  node: T
}