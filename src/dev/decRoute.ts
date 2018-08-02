import {
	ApiRequest,
	Body,
	Header,
	Post,
	Route,
	Request,
	Controller,
	Logger,
	Middleware,
	ApiMiddleware,
	Valory, ApiError, Hidden, Query, PostMiddleware, Get, Path,
} from "../main";
import * as P from "pino";
import {register} from "ts-node";

type Logger = P.Logger;

export interface TestResponse<T> {
	status_code: number;
	/** @default test */
	response_data: T;
}

export class Burn {
	/** @minLength 3 */
	public name: string = "steven";
	public content: string;
	public powerlevel?: number;
	// public tuple: TupleAlias;
	public array: ArrayAlias;
	public string: StringAlias;
	public alias: AliasAlias;
	public object: ObjectAlias;
	public literalEnum: LiteralEnum;
	public literal: LiteralAlias;
	public literalNum: LiteralNum;
}

export type ArrayAlias = number[];
// export type TupleAlias = [number, number];
/**
 * alias to a string
 * @example "a string"
 * @minLength 3
 */
export type StringAlias = string;
export type AliasAlias = StringAlias;
export type LiteralAlias = "test";
export type LiteralEnum = "thing" | "otherthing";
export type LiteralNum = 2;

export interface TestObj {
	thing: string;
	otherThing: number;
}

export type ObjectAlias = TestObj;

const TestMiddleware: ApiMiddleware = {
	tag: {
		name: "GTFO",
		description: "Access denied on this resource",
	},
	name: "TestMiddleware",
	handler: (req, logger, done) => {
		done({statusCode: 333, headers: {}, body: req.getAttachment(Valory.ResponseKey)});
	},
};

@Route("burn")
export class BurnRoutes extends Controller {
	/**
	 *
	 * @param {Burn} burn
	 * @param {ApiRequest} req
	 * @param {StringAlias} testHeader override description
	 * @maxLength testHeader 5
	 */
	// @PostMiddleware(TestMiddleware)
	// @Hidden()
	@Post()
	public submit(@Body() burn: Burn, @Request() req: ApiRequest,
				  @Header() testHeader: StringAlias, @Query() testQuery: StringAlias): TestResponse<Burn[]> {
		this.logger.info("yay");
		return this.buildError("AccessDenied");
		// return "thing";
	}

	@Get("{thing}")
	public test(@Path() thing: StringAlias) {
		return "yay";
	}
}

type func = (test: string) => number;
