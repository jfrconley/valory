import {ApiMiddleware} from "../../lib/common/middleware";
import {HttpMethod} from "../../lib/common/headers";
import {ErrorObject, ValidateFunction, ValidationError} from "ajv";
import {Valory} from "../valory";
import {ApiContext} from "../../lib/common/context";
import {AttachmentRegistry} from "../../lib/common/attachment-registry";

export class RequestValidator implements ApiMiddleware {
    public static ValidationErrorsKey = AttachmentRegistry.createKey<ErrorObject[]>();

    public readonly name = "RequestValidator";
    private readonly validator: ValidateFunction;

    constructor(valory: Valory, path: string, method: HttpMethod) {
        this.validator = valory.globalData.validation?.validators[path][method]["-1"]
    }

    public handler(ctx: ApiContext) {
        const result = this.validator(ctx.request);
        if (!result) {
            ctx.attachments.putAttachment(RequestValidator.ValidationErrorsKey, this.validator.errors);
            ctx.response = {
                statusCode: 422,
                body: this.validator.errors.map(RequestValidator.renderError),
                headers: {"Content-Type": "application/json"},
            }
        }
    }

    public static renderError(error: ErrorObject) {
        return `ValidationError[${error.keyword}]: request${error.dataPath} ${error.message}`
    }
}
