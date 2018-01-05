import {cloneDeep} from "lodash";
import {validate} from "swagger-parser";
import {Spec} from "swagger-schema-official";
import {compileMethodSchema} from "../compiler/method";
import {swaggerPreproccess} from "../compiler/preprocessor";
import {compile} from "../compiler/compiler";
import {ExtendedSchema} from "../compiler/compilerheaders";

const swagger = require("../../testswagger.json") as Spec;

async function runTest() {
	const out = await compile(swagger, {debug: false});
	console.log(out.module);
}

runTest();