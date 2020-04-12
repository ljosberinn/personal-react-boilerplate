/**
 * The HTTP `100 Continue` informational status response code indicates that
 * everything so far is OK and that the client should continue with the request
 * or ignore it if it is already finished.
 */
export const CONTINUE = 100;
/**
 * The HTTP `101 Switching Protocols` response code indicates the protocol the
 * server is switching to as requested by a client which sent the message
 * including the Upgrade request header.
 */
export const SWITCHING_PROTOCOLS = 101;
export const PROCESSING = 102;

/**
 * The HTTP `200 OK` success status response code indicates that the request has
 * succeeded. A 200 response is cacheable by default.
 *
 * The meaning of a success depends on the HTTP request method:
 *
 * `GET`: The resource has been fetched and is transmitted in the message body.
 *
 * `HEAD`: The entity headers are in the message body.
 *
 * `POST`: The resource describing the result of the action is transmitted in
 * the message body.
 *
 * `TRACE`: The message body contains the request message as received by the
 * server.
 *
 * The successful result of a `PUT` or a `DELETE` is often not a `200 OK` but a
 * `204 No Content` (or a `201 Created` when the resource is uploaded for the
 * first time).
 */
export const OK = 200;
/**
 * The HTTP `201 Created` success status response code indicates that the
 * request has succeeded and has led to the creation of a resource. The new
 * resource is effectively created before this response is sent back and the new
 * resource is returned in the body of the message, its location being either
 * the URL of the request, or the content of the `Location` header.
 *
 * The common use case of this status code is as the result of a `POST` request.
 */
export const CREATED = 201;
/**
 * The HTTP `202 Accepted` response status code indicates that the request has
 * been received but not yet acted upon. It is non-committal, meaning that there
 * is no way for the HTTP to later send an asynchronous response indicating the
 * outcome of processing the request. It is intended for cases where another
 * process or server handles the request, or for batch processing.
 */
export const ACCEPTED = 202;
/**
 * The HTTP `203 Non-Authoritative Information` response status indicates that
 * the request was successful but the enclosed payload has been modified by a
 * transforming proxy from that of the origin server's 200 (OK) response.
 *
 * The `203` response is similar to the value `214`, meaning
 * `Transformation Applied`, of the Warning header code, which has the
 * additional advantage of being applicable to responses with any status code.
 */
export const NON_AUTHORITATIVE_INFORMATION = 203;
/**
 * The HTTP `204 No Content` success status response code indicates that the
 * request has succeeded, but that the client doesn't need to go away from its
 * current page. A `204` response is cacheable by default. An `ETag` header is
 * included in such a response.
 *
 * The common use case is to return `204` as a result of a `PUT` request,
 * updating a resource, without changing the current content of the page
 * displayed to the user. If the resource is created, `201 Created` is returned
 * instead. If the page should be changed to the newly updated page, the `200`
 * should be used instead.
 */
export const NO_CONTENT = 204;
/**
 * The HTTP `205 Reset Content` response status tells the client to reset the
 * document view, so for example to clear the content of a form, reset a canvas
 * state, or to refresh the UI.
 */
export const RESET_CONTENT = 205;
/**
 * The HTTP `206 Partial Content` success status response code indicates that
 * the request has succeeded and has the body contains the requested ranges of
 * data, as described in the `Range` header of the request.
 *
 * If there is only one range, the `Content-Type` of the whole response is set
 * to the type of the document, and a `Content-Range` is provided.
 *
 * If several ranges are sent back, the `Content-Type` is set to
 * `multipart/byteranges` and each fragment covers one range, with
 * `Content-Range` and `Content-Type` describing it.
 */
export const PARTIAL_CONTENT = 206;
export const MULTI_STATUS = 207;
export const ALREADY_REPORTED = 208;
export const IM_USED = 226;

/**
 * The HTTP `300 Multiple Choices` redirect status response code indicates that
 * the request has more than one possible responses. The user-agent or the user
 * should choose one of them. As there is no standardized way of choosing one of
 * the responses, this response code is very rarely used.
 *
 * If the server has a preferred choice, it should generate a Location header.
 */
export const MULTIPLE_CHOICES = 300;
/**
 * The HTTP `301 Moved Permanently` redirect status response code indicates that
 * the resource requested has been definitively moved to the URL given by the
 * `Location` headers. A browser redirects to this page and search engines
 * update their links to the resource (in 'SEO-speak', it is said that the
 * 'link-juice' is sent to the new URL).
 *
 * Even if the specification requires the method (and the body) not to be
 * altered when the redirection is performed, not all user-agents align with
 * it - you can still find this type of bugged software out there. It is
 * therefore recommended to use the `301` code only as a response for `GET` or
 * `HEAD` methods and to use the `308 Permanent Redirect` for `POST` methods
 * instead, as the method change is explicitly prohibited with this status.
 */
export const MOVED_PERMANENTLY = 301;
/**
 * The HTTP `302 Found` redirect status response code indicates that the
 * resource requested has been temporarily moved to the URL given by the
 * `Location` header. A browser redirects to this page but search engines don't
 * update their links to the resource (in 'SEO-speak', it is said that the
 * 'link-juice' is not sent to the new URL).
 *
 * Even if the specification requires the method (and the body) not to be
 * altered when the redirection is performed, not all user-agents conform here -
 * you can still find this type of bugged software out there. It is therefore
 * recommended to set the `302` code only as a response for GET or HEAD methods
 * and to use `307 Temporary Redirect` instead, as the method change is explicitly
 * prohibited in that case.
 *
 * In the cases where you want the method used to be changed to GET, use
 * `303 See Other` instead. This is useful when you want to give a response to
 * a PUT method that is not the uploaded resource but a confirmation message
 * such as: 'you successfully uploaded XYZ'.
 */
export const FOUND_MOVED_TEMPORARILY = 302;
/**
 * The HTTP `303 See Other` redirect status response code indicates that the
 * redirects don't link to the newly uploaded resources, but to another page
 * (such as a confirmation page or an upload progress page). This response code
 * is usually sent back as a result of `PUT` or `POST`. The method used to
 * display this redirected page is always `GET`.
 */
export const SEE_OTHER = 303;
/**
 * The HTTP `304 Not Modified` client redirection response code indicates that
 * there is no need to retransmit the requested resources. It is an implicit
 * redirection to a cached resource. This happens when the request method is
 * safe, like a `GET` or a `HEAD` request, or when the request is conditional
 * and uses a `If-None-Match` or a `If-Modified-Since` header.
 *
 * The equivalent `200 OK` response would have included the headers
 * `Cache-Control`, `Content-Location`, `Date`, `ETag`, `Expires`, and `Vary`.
 */
export const NOT_MODIFIED = 304;
export const USE_PROXY = 305;
/**
 * HTTP `307 Temporary Redirect` redirect status response code indicates that
 * the resource requested has been temporarily moved to the URL given by the
 * Location headers.
 *
 * The method and the body of the original request are reused to perform the
 * redirected request. In the cases where you want the method used to be changed
 * to `GET`, use `303 See Other` instead. This is useful when you want to give
 * an answer to a `PUT` method that is not the uploaded resources, but a
 * confirmation message (like "You successfully uploaded XYZ").
 *
 * The only difference between `307` and `302` is that `307` guarantees that the
 * method and the body will not be changed when the redirected request is made.
 * With `302`, some old clients were incorrectly changing the method to `GET`:
 * the behavior with non-`GET` methods and `302` is then unpredictable on the
 * Web, whereas the behavior with `307` is predictable. For `GET` requests,
 *their behavior is identical.
 */
export const TEMPORARY_REDIRECT = 307;
/**
 * The HTTP `308 Permanent Redirect` redirect status response code indicates
 * that the resource requested has been definitively moved to the URL given by
 * the `Location` headers. A browser redirects to this page and search engines
 * update their links to the resource (in 'SEO-speak', it is said that the
 * 'link-juice' is sent to the new URL).
 *
 * The request method and the body will not be altered, whereas `301` may
 * incorrectly sometimes be changed to a `GET` method.
 */
export const PERMANENT_REDIRECT = 308;

/**
 * The HTTP `400 Bad Request` response status code indicates that the server
 * cannot or will not process the request due to something that is perceived to
 * be a client error (e.g., malformed request syntax, invalid request message
 * framing, or deceptive request routing).
 */
export const BAD_REQUEST = 400;
/**
 * The HTTP `401 Unauthorized` client error status response code indicates that
 * the request has not been applied because it lacks valid authentication
 * credentials for the target resource.
 *
 * This status is sent with a `WWW-Authenticate` header that contains
 * information on how to authorize correctly.
 *
 * This status is similar to `403`, but in this case, authentication is possible.
 */
export const UNAUTHORIZED = 401;
/**
 * The HTTP `402 Payment Required` is a nonstandard client error status response
 * code that is reserved for future use.
 *
 * Sometimes, this code indicates that the request can not be processed until
 * the client makes a payment. Originally it was created to enable digital cash
 * or (micro) payment systems and would indicate that the requested content is
 * not available until the client makes a payment. However, no standard use
 * convention exists and different entities use it in different contexts.
 */
export const PAYMENT_REQUIRED = 402;
/**
 * The HTTP `403 Forbidden` client error status response code indicates that the
 * server understood the request but refuses to authorize it.
 *
 * This status is similar to `401`, but in this case, re-authenticating will
 * make no difference. The access is permanently forbidden and tied to the
 * application logic, such as insufficient rights to a resource.
 */
export const FORBIDDEN = 403;
/**
 * The HTTP `404 Not Found` client error response code indicates that the server
 * can't find the requested resource. Links which lead to a `404` page are often
 * called broken or dead links, and can be subject to link rot.
 *
 * A `404` status code does not indicate whether the resource is temporarily or
 * permanently missing. But if a resource is permanently removed, a `410` (Gone)
 * should be used instead of a `404` status.
 */
export const NOT_FOUND = 404;
/**
 * The HTTP `405 Method Not Allowed` response status code indicates that the
 * request method is known by the server but is not supported by the target
 * resource.
 *
 * The server MUST generate an `Allow` header field in a 405 response containing
 * a list of the target resource's currently supported methods.
 */
export const METHOD_NOT_ALLOWED = 405;
/**
 * The HTTP `406 Not Acceptable` client error response code indicates that the
 * server cannot produce a response matching the list of acceptable values
 * defined in the request's proactive content negotiation headers, and that the
 * server is unwilling to supply a default representation.
 *
 * Proactive content negotiation headers include:
 *
 * `Accept`
 * `Accept-Charset`
 * `Accept-Encoding`
 * `Accept-Language`
 *
 * In practice, this error is very rarely used. Instead of responding using this
 * error code, which would be cryptic for the end user and difficult to fix,
 * servers ignore the relevant header and serve an actual page to the user. It
 * is assumed that even if the user won't be completely happy, they will prefer
 * this to an error code.
 *
 * If a server returns such an error status, the body of the message should
 * contain the list of the available representations of the resources, allowing
 * the user to choose among them.
 */
export const NOT_ACCEPTABLE = 406;
/**
 * The HTTP `407 Proxy Authentication Required` client error status response
 * code indicates that the request has not been applied because it lacks valid
 * authentication credentials for a proxy server that is between the browser and
 * the server that can access the requested resource.
 *
 * This status is sent with a `Proxy-Authenticate` header that contains
 * information on how to authorize correctly.
 */
export const PROXY_AUTHENTICATION_REQUIRED = 407;
/**
 * The HTTP `408 Request Timeout` response status code means that the server
 * would like to shut down this unused connection. It is sent on an idle
 * connection by some servers, even without any previous request by the client.
 *
 * A server should send the "close" `Connection` header field in the response,
 * since `408` implies that the server has decided to close the connection
 * rather than continue waiting.
 *
 * This response is used much more since some browsers, like Chrome,
 * Firefox 27+, and IE9, use HTTP pre-connection mechanisms to speed up surfing.
 */
export const REQUEST_TIMEOUT = 408;
/**
 * The HTTP `409 Conflict` response status code indicates a request conflict
 * with current state of the server.
 *
 * Conflicts are most likely to occur in response to a `PUT` request. For
 * example, you may get a `409` response when uploading a file which is older
 * than the one already on the server resulting in a version control conflict.
 */
export const CONFLICT = 409;
/**
 * The HTTP `410 Gone` client error response code indicates that access to the
 * target resource is no longer available at the origin server and that this
 * condition is likely to be permanent.
 *
 * If you don't know whether this condition is temporary or permanent, a `404`
 * status code should be used instead.
 */
export const GONE = 410;
/**
 * The HTTP `411 Length Required` client error response code indicates that the
 * server refuses to accept the request without a defined `Content-Length` header.
 */
export const LENGTH_REQUIRED = 411;
/**
 * The HTTP `412 Precondition Failed` client error response code indicates that
 * access to the target resource has been denied. This happens with conditional
 * requests on methods other than `GET` or `HEAD` when the condition defined by
 * the `If-Unmodified-Since` or `If-None-Match` headers is not fulfilled. In
 * that case, the request, usually an upload or a modification of a resource,
 * cannot be made and this error response is sent back.
 */
export const PRECONDITION_FAILED = 412;
/**
 * The HTTP `413 Payload Too Large` response status code indicates that the
 * request entity is larger than limits defined by server; the server might
 * close the connection or return a `Retry-After` header field.
 */
export const REQUEST_ENTITY_TOO_LARGE = 413;
/**
 * The HTTP `414 URI Too Long` response status code indicates that the URL
 * requested by the client is longer than the server is willing to interpret.
 *
 * There are a few conditions when this might occur:
 *
 * - A client has improperly converted a `POST` request to a `GET` request with
 * more than ≈2 kB of submitted data.
 *
 * - A client has descended into a loop of redirection (for example, a
 * redirected URL prefix that points to a suffix of itself, or mishandled
 * relative URLs),
 *
 * - The server is under attack by a client attempting to exploit potential
 * security holes.
 */
export const URI_TOO_LONG = 414;
/**
 * The HTTP `415 Unsupported Media Type` client error response code indicates
 * that the server refuses to accept the request because the payload format is
 * in an unsupported format.
 *
 * The format problem might be due to the request's indicated `Content-Type` or
 * `Content-Encoding`, or as a result of inspecting the data directly.
 */
export const UNSUPPORTED_MEDIA_TYPE = 415;
/**
 * The HTTP `416 Range Not Satisfiable` error response code indicates that a
 * server cannot serve the requested ranges. The most likely reason is that the
 * document doesn't contain such ranges, or that the `Range` header value,
 * though syntactically correct, doesn't make sense.
 *
 * The `416` response message contains a `Content-Range` indicating an
 * unsatisfied range (that is a '*') followed by a '/' and the current length of
 * the resource. E.g. `Content-Range: bytes *\/12777`
 *
 * Faced with this error, browsers usually either abort the operation (for
 * example, a download will be considered as non-resumable) or ask for the whole
 * document again.
 */
export const REQUESTED_RANGE_NOT_SATISFIABLE = 416;
/**
 * The HTTP `417 Expectation Failed` client error response code indicates that
 * the expectation given in the request's `Expect` header could not be met.
 *
 * See the `Expect` header for more details.
 */
export const EXPECTATION_FAILED = 417;
/**
 * The HTTP `418 I'm a teapot` client error response code indicates that the
 * server refuses to brew coffee because it is, permanently, a teapot. A
 * combined coffee/tea pot that is temporarily out of coffee should instead
 * return `503`. This error is a reference to Hyper Text Coffee Pot Control
 * Protocol defined in April Fools' jokes in 1998 and 2014.
 */
export const IM_A_TEAPOT = 418;
export const POLICY_NOT_FULFILLED = 420;
export const MISDIRECTED_REQUEST = 421;
/**
 * The HTTP `422 Unprocessable Entity` response status code indicates that the
 * server understands the content type of the request entity, and the syntax of
 * the request entity is correct, but it was unable to process the contained
 * instructions.
 */
export const UNPROCESSABLE_ENTITY = 422;
export const LOCKED = 423;
export const FAILED_DEPENDENCY = 424;
/**
 * The HTTP `425 Too Early` response status code indicates that the server is
 * unwilling to risk processing a request that might be replayed, which creates
 * the potential for a replay attack.
 */
export const TOO_EARLY = 425;
/**
 * The HTTP `426 Upgrade Required` client error response code indicates that the
 * server refuses to perform the request using the current protocol but might be
 * willing to do so after the client upgrades to a different protocol.
 *
 * The server sends an `Upgrade` header with this response to indicate the
 * required protocol(s).
 */
export const UPGRADE_REQUIRED = 426;
/**
 * The HTTP `428 Precondition Required` response status code indicates that the
 * server requires the request to be conditional.
 *
 * Typically, this means that a required precondition header, such as
 * `If-Match`, is missing.
 *
 * When a precondition header is not matching the server side state, the
 * response should be `412 Precondition Failed`.
 */
export const PRECONDITION_REQUIRED = 428;
/**
 * The HTTP `429 Too Many Requests` response status code indicates the user has
 * sent too many requests in a given amount of time ("rate limiting").
 *
 * A `Retry-After` header might be included to this response indicating how long
 * to wait before making a new request.
 */
export const TOO_MANY_REQUESTS = 429;
/**
 * The HTTP `431 Request Header Fields Too Large` response status code indicates
 * that the server refuses to process the request because the request’s HTTP
 * headers are too long. The request may be resubmitted after reducing the size
 * of the request headers.
 *
 * `431` can be used when the total size of request headers is too large, or
 * when a single header field is too large. To help those running into this
 * error, indicate which of the two is the problem in the response body —
 * ideally, also include which headers are too large. This lets users attempt to
 * fix the problem, such as by clearing their cookies.
 *
 * Servers will often produce this status if:
 *
 * - The Referer URL is too long
 * - There are too many Cookies sent in the request
 */
export const REQUEST_HEADER_FIELDS_TOO_LARGE = 431;
/**
 * The HTTP `451 Unavailable For Legal Reasons` client error response code
 * indicates that the user requested a resource that is not available due to
 * legal reasons, such as a web page for which a legal action has been issued.
 */
export const UNAVAILABLE_FOR_LEGAL_REASONS = 451;

/**
 * The HTTP `500 Internal Server Error` server error response code indicates
 * that the server encountered an unexpected condition that prevented it from
 * fulfilling the request.
 *
 * This error response is a generic "catch-all" response. Usually, this
 * indicates the server cannot find a better 5xx error code to response.
 * Sometimes, server administrators log error responses like the `500` status
 * code with more details about the request to prevent the error from happening
 * again in the future.
 */
export const INTERNAL_SERVER_ERROR = 500;
/**
 * The HTTP `501 Not Implemented` server error response code means that the
 * server does not support the functionality required to fulfill the request.
 *
 * This status can also send a `Retry-After` header, telling the requester when
 * to check back to see if the functionality is supported by then.
 *
 * `501` is the appropriate response when the server does not recognize the
 * request method and is incapable of supporting it for any resource. The only
 * methods that servers are required to support (and therefore that must not
 * return `501`) are `GET` and `HEAD`.
 *
 * If the server does recognize the method, but intentionally does not support
 * it, the appropriate response is `405 Method Not Allowed`.
 */
export const NOT_IMPLEMENTED = 501;
/**
 * The HTTP `502 Bad Gateway` server error response code indicates that the
 * server, while acting as a gateway or proxy, received an invalid response from
 * the upstream server.
 */
export const BAD_GATEWAY = 502;
/**
 * The HTTP `503 Service Unavailable` server error response code indicates that
 * the server is not ready to handle the request.
 *
 * Common causes are a server that is down for maintenance or that is
 * overloaded. This response should be used for temporary conditions and the
 * `Retry-After` HTTP header should, if possible, contain the estimated time for
 * the recovery of the service.
 *
 * Caching-related headers that are sent along with this response should be
 * taken care of, as a 503 status is often a temporary condition and responses
 * shouldn't usually be cached.
 */
export const SERVICE_UNAVAILABLE = 503;
/**
 * The HTTP `504 Gateway Timeout` server error response code indicates that the
 * server, while acting as a gateway or proxy, did not get a response in time
 * from the upstream server that it needed in order to complete the request.
 */
export const GATEWAY_TIMEOUT = 504;
/**
 * The HTTP `505 HTTP Version Not Supported` response status code indicates that
 * the HTTP version used in the request is not supported by the server.
 */
export const HTTP_VERSION_NOT_SUPPORTED = 505;
export const VARIANT_ALSO_NEGOTIATES = 506;
export const INSUFFICIENT_STORAGE = 507;
export const LOOP_DETECTED = 508;
export const BANDWIDTH_LIMIT_EXCEEDED = 509;
export const NOT_EXTENDED = 510;
/**
 * The HTTP `511 Network Authentication Required` response status code indicates
 * that the client needs to authenticate to gain network access.
 *
 * This status is not generated by origin servers, but by intercepting proxies
 * that control access to the network.
 *
 * Network operators sometimes require some authentication, acceptance of terms,
 * or other user interaction before granting access (for example in an internet
 * café or at an airport). They often identify clients who have not done so
 * using their Media Access Control (MAC) addresses.
 */
export const NETWORK_AUTHENTICATION_REQUIRED = 511;
