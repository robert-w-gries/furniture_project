export default interface ExpressError extends Error {
  status?: number;
  info?: string;
}
