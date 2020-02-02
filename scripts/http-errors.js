/** https://github.com/jshttp/http-errors#readme
400	BadRequest
401	Unauthorized
402	PaymentRequired
403	Forbidden
404	NotFound
405	MethodNotAllowed
406	NotAcceptable
407	ProxyAuthenticationRequired
408	RequestTimeout
409	Conflict
410	Gone
411	LengthRequired
412	PreconditionFailed
413	PayloadTooLarge
414	URITooLong
415	UnsupportedMediaType
416	RangeNotSatisfiable
417	ExpectationFailed
418	ImATeapot
421	MisdirectedRequest
422	UnprocessableEntity
423	Locked
424	FailedDependency
425	UnorderedCollection
426	UpgradeRequired
428	PreconditionRequired
429	TooManyRequests
431	RequestHeaderFieldsTooLarge
451	UnavailableForLegalReasons
500	InternalServerError
501	NotImplemented
502	BadGateway
503	ServiceUnavailable
504	GatewayTimeout
505	HTTPVersionNotSupported
506	VariantAlsoNegotiates
507	InsufficientStorage
508	LoopDetected
509	BandwidthLimitExceeded
510	NotExtended
511	NetworkAuthenticationRequired
 */

/** Possible HTTP Error Status */
const HTTPStatus = {
    400: {
        name: "BadRequest",
        message: ""
    },
    401: {
        name: "Unauthorized",
        message: ""
    },
    402: {
        name: "PaymentRequired",
        message: ""
    },
    403: {
        name: "Forbidden",
        message: ""
    },
    404: {
        name: "NotFound",
        message: ""
    },
    405: {
        name: "MethodNotAllowed",
        message: ""
    },
    406: {
        name: "NotAcceptable",
        message: ""
    },
    407: {
        name: "ProxyAuthenticationRequired",
        message: ""
    },
    408: {
        name: "RequestTimeout",
        message: ""
    },
    409: {
        name: "Conflict",
        message: ""
    },
    410: {
        name: "Gone",
        message: ""
    },
    411: {
        name: "LengthRequired",
        message: ""
    },
    412: {
        name: "PreconditionFailed",
        message: ""
    },
    413: {
        name: "PayloadTooLarge",
        message: ""
    },
    414: {
        name: "URITooLong",
        message: ""
    },
    415: {
        name: "UnsupportedMediaType",
        message: ""
    },
    416: {
        name: "RangeNotSatisfiable",
        message: ""
    },
    417: {
        name: "ExpectationFailed",
        message: ""
    },
    418: {
        name: "ImATeapot",
        message: ""
    },
    421: {
        name: "MisdirectedRequest",
        message: ""
    },
    422: {
        name: "UnprocessableEntity",
        message: ""
    },
    423: {
        name: "Locked",
        message: ""
    },
    424: {
        name: "FailedDependency",
        message: ""
    },
    425: {
        name: "UnorderedCollection",
        message: ""
    },
    426: {
        name: "UpgradeRequired",
        message: ""
    },
    428: {
        name: "PreconditionRequired",
        message: ""
    },
    429: {
        name: "TooManyRequests",
        message: ""
    },
    431: {
        name: "RequestHeaderFieldsTooLarge",
        message: ""
    },
    451: {
        name: "UnavailableForLegalReasons",
        message: ""
    },
    500: {
        name: "InternalServerError",
        message: ""
    },
    501: {
        name: "NotImplemented",
        message: ""
    },
    502: {
        name: "BadGateway",
        message: ""
    },
    503: {
        name: "ServiceUnavailable",
        message: ""
    },
    504: {
        name: "GatewayTimeout",
        message: ""
    },
    505: {
        name: "HTTPVersionNotSupported",
        message: ""
    },
    506: {
        name: "VariantAlsoNegotiates",
        message: ""
    },
    507: {
        name: "InsufficientStorage",
        message: ""
    },
    508: {
        name: "LoopDetected",
        message: ""
    },
    509: {
        name: "BandwidthLimitExceeded",
        message: ""
    },
    510: {
        name: "NotExtended",
        message: ""
    },
    511: {
        name: "NetworkAuthenticationRequired",
        message: ""
    },
}

class HTTPError extends Error {
    constructor(statusCode, message="") {
        const status = HTTPStatus[statusCode];
        super(message || status.message);
        this.name = status.name;
    }
}