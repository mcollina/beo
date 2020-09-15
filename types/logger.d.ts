import { FastifyError } from 'fastify-error'
import { RawServerBase, RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression } from './utils'
import { FastifyRequest, RequestGenericInterface } from './request'

/**
 * Standard Fastify logging function
 */
export interface FastifyLogFn {
  (msg: string, ...args: unknown[]): void;
  (obj: object, msg?: string, ...args: unknown[]): void;
}

export type LogLevel = 'info' | 'error' | 'debug' | 'fatal' | 'warn' | 'trace'

export type SerializerFn = (value: unknown) => unknown;

export interface Bindings {
  level?: LogLevel | string;
  serializers?: { [key: string]: SerializerFn };
  [key: string]: unknown;
}

export interface FastifyLoggerInstance {
  info: FastifyLogFn;
  warn: FastifyLogFn;
  error: FastifyLogFn;
  fatal: FastifyLogFn;
  trace: FastifyLogFn;
  debug: FastifyLogFn;
  child(bindings: Bindings): FastifyLoggerInstance;
}

export interface PrettyOptions {
  /**
   * Translate the epoch time value into a human readable date and time string.
   * This flag also can set the format string to apply when translating the date to human readable format.
   * The default format is yyyy-mm-dd HH:MM:ss.l o in UTC.
   * For a list of available pattern letters see the {@link https://www.npmjs.com/package/dateformat|dateformat documentation}.
   */
  translateTime?: boolean | string;
  /**
   * If set to true, it will print the name of the log level as the first field in the log line. Default: `false`.
   */
  levelFirst?: boolean;
  /**
   * The key in the JSON object to use as the highlighted message. Default: "msg".
   */
  messageKey?: string;
  /**
   * The key in the JSON object to use for timestamp display. Default: "time".
   */
  timestampKey?: string;
  /**
   * Format output of message, e.g. {level} - {pid} will output message: INFO - 1123 Default: `false`.
   */
  messageFormat?: false | string;
  /**
   * If set to true, will add color information to the formatted output message. Default: `false`.
   */
  colorize?: boolean;
  /**
   * Appends carriage return and line feed, instead of just a line feed, to the formatted log line.
   */
  crlf?: boolean;
  /**
   * Define the log keys that are associated with error like objects. Default: ["err", "error"]
   */
  errorLikeObjectKeys?: string[];
  /**
   *  When formatting an error object, display this list of properties.
   *  The list should be a comma separated list of properties. Default: ''
   */
  errorProps?: string;
  /**
   * Specify a search pattern according to {@link http://jmespath.org|jmespath}
   */
  search?: string;
  /**
   * Ignore one or several keys. Example: "time,hostname"
   */
  ignore?: string;
  /**
   * Suppress warning on first synchronous flushing.
   */
  suppressFlushSyncWarning?: boolean;
}

/**
 * Fastify Custom Logger options. To enable configuration of all Pino options,
 * refer to this example:
 * https://github.com/fastify/fastify/blob/2f56e10a24ecb70c2c7950bfffd60eda8f7782a6/docs/TypeScript.md#example-5-specifying-logger-types
 */
export interface FastifyLoggerOptions<
  RawServer extends RawServerBase = RawServerDefault,
  RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
  RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>
> {
  serializers?: {
    req: (req: RawRequest) => {
      method: string;
      url: string;
      version: string;
      hostname: string;
      remoteAddress: string;
      remotePort: number;
    };
    err: (err: FastifyError) => {
      type: string;
      message: string;
      stack: string;
      [key: string]: any;
    };
    res: (res: RawReply) => {
      statusCode: string | number;
    };
  };
  level?: string;
  genReqId?: <RequestGeneric extends RequestGenericInterface = RequestGenericInterface>(req: FastifyRequest<RequestGeneric, RawServer, RawRequest>) => string;
  prettyPrint?: boolean | PrettyOptions;
}
