
////////////////////////////////////////////////////////
// ___   ___    _  _  ___ _____   ___ ___ ___ _____   //
// |   \ / _ \  | \| |/ _ \_   _| | __|   \_ _|_   _| //
// | |) | (_) | | .` | (_) || |   | _|| |) | |  | |   //
// |___/ \___/  |_|\_|\___/ |_|   |___|___/___| |_|   //
//                                                    //
// This file was generated by valory and should not   //
// be directly edited.                                //
////////////////////////////////////////////////////////


        
// @ts-nocheck
/* tslint:disable */

function isController(object) {
    return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object
}

const name = "PrimaryHandler";

        import {Endpoint, RequestValidator} from "../../main";
        const handlerEscapeKeys = [RequestValidator.ValidationErrorsKey, Endpoint.ExceptionKey];
        import {TestController} from "./../testRoutes";
        const TestControllerController = new TestController();
        const TestControllerControllerExtendsController = isController(TestControllerController);
        
        module.exports = {
            routesVersion: 2,
            register(app) {
                
        app.endpoint("/","POST")
            .aML(TestControllerController.middleware)
            .aML(TestControllerController.test.middleware)
            .aM({
                name,
                async handler(ctx) {
                    if (ctx.attachments.hasAnyAttachments(handlerEscapeKeys)) {
                        return;
                    }
                    if (TestControllerControllerExtendsController) {
                        TestControllerController.ctx = ctx;
                        TestControllerController.logger = ctx.attachments.getAttachment(Endpoint.HandlerLoggerKey);
                        TestControllerController.headers = ctx.response.headers || {};
                    }
                    
                    const response = await TestControllerController.test(
                        ctx.request.headers["test-type"]
                    );
                    ctx.response.body = response;
                    ctx.response.statusCode = TestControllerController.test.statusCode || 200;
                    if (TestControllerControllerExtendsController) {
                        if (TestControllerController.statusSet) {
                            ctx.response.statusCode = TestControllerController.getStatus();                        
                        }
                        ctx.response.headers = TestControllerController.getHeaders();
                        TestControllerController.clearStatus();
                        TestControllerController.clearHeaders();
                    }
                }
            })
            .aML(TestControllerController.test.postMiddleware)
            .aML(TestControllerController.postMiddleware)
            .done();
        
            }
        };
        