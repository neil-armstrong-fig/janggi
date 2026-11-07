/** Opens a WebSocket to an address; a test hands in its own. */
export type SocketFactory = (url: string) => WebSocket;
