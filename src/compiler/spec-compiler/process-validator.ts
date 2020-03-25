import {HttpMethod} from "../../lib/common/headers";
import {CompiledSchemaInteraction, CompiledSchemaOperation} from "./compile-validator";
import {isEqual, cloneDeepWith} from "lodash";
import {JSONSchema4} from "json-schema";

const OBJECTIFIED_PREFIX = "a";
const ERROR_VAR = "validationErrors";
const SCHEMA_VAR = "schema";
const ErrorObjReg = /{[ ]*?keyword:[ ]*?'([\s\S]*?)'[ ]*?,[ ]*?dataPath:[ ]*?([\s\S]*?),[ ]*?schemaPath:[ ]*?'([\s\S]*?)'[ ]*?,[ ]*?params:[ ]*?([\s\S]*?),[ ]*?message:[ ]*?'([\s\S]*?)'[ ]*?}/g;

const NoopSchemas = [
    {},
    {
        "required": [
            "body"
        ],
        "properties": {
            "body": {
                "type": "null",
                "$schema": "http://json-schema.org/draft-04/schema#"
            }
        }
    }
];

export interface ProcessedCompiledSchemaOperation {
    path: string;
    method: HttpMethod;
    schemaInteractions: ProcessedCompiledSchemaInteraction[]
}

export interface ProcessedCompiledSchemaInteraction extends CompiledSchemaInteraction {
    processedValidatorSource: string;
}

export function processCompiledSchemaOperation(input: CompiledSchemaOperation, options: {prepackErrors: boolean}): ProcessedCompiledSchemaOperation {
    return {
        ...input,
        schemaInteractions: input.schemaInteractions.map(op => processCompiledSchemaInteraction(op, options))
    }
}

function processError(fullMatch: string, keyword: string, dataPath: string, schemaPath: string, params: string, message: string) {
    return `\`ValidationError[${keyword}]: request\${${dataPath}} ${message}\``
}

function objectifyArray<T>(arr: T[]): {[key: string]: T} {
    return arr.reduce((prev, curr, i) => {
        prev[OBJECTIFIED_PREFIX + i] = curr;
        return prev;
    }, {} as {[key: string]: T})
}

function objectifyUnions(input: JSONSchema4): unknown {
    return cloneDeepWith(input, (value, key) => {
        if (["oneOf","anyOf"].includes(key as string)) {
            return objectifyArray(value);
        }
    })
}

function processCompiledSchemaInteraction(input: CompiledSchemaInteraction, options: {prepackErrors: boolean}): ProcessedCompiledSchemaInteraction {
    if (NoopSchemas.some(schema => isEqual(schema, input.schema))) {
        return {
            ...input,
            processedValidatorSource: "noopBool;"
        }
    }

    let processedCode = input.validator.toString();

    // Prepack error messages
    if (options.prepackErrors) {
        processedCode = processedCode.replace(ErrorObjReg, processError);
    }

    // Objectify union access to prevent indirection
    processedCode = processedCode.replace(/anyOf\[(\d*?)\]/g, `anyOf.${OBJECTIFIED_PREFIX}$1`);
    processedCode = processedCode.replace(/oneOf\[(\d*?)\]/g, `oneOf.${OBJECTIFIED_PREFIX}$1`);

    // Protect data properties from mangling
    processedCode = processedCode.replace(/(data[A-Za-z_$0-9]*?)\.([A-Za-z_$0-9]+)/g, '$1["$2"]');
    processedCode = processedCode.replace(/ ([a-zA-Z]+):/g, ' "$1":');

    // Protect error property from being mangled
    processedCode = processedCode.replace(/validate.errors/g, "validate[\"errors\"]");
    processedCode = processedCode.replace(/validate.schema/g, "validateSchema");

    const functionHeader = processedCode.substring(0, processedCode.indexOf("{"));
    const functionBody = processedCode.substring(processedCode.indexOf("{") + 1, processedCode.lastIndexOf("}"));
    const objectfiedSchema = objectifyUnions(input.schema);

    const finalCode = `
        function() {
            const validateSchema = ${JSON.stringify(objectfiedSchema)};
            ${(input.validator.source as any).patterns.map((pattern: string, id: number) => {
                return `const pattern${id} = new RegExp(\`${pattern}\`);`
            }).join("\n")}
            const validate = ${functionHeader} {
                ${functionBody}
            };
            return validate;
        }()
    `;

    return {
        ...input,
        processedValidatorSource: finalCode
    }
}
