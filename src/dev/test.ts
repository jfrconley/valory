import {Valory} from "../server/valory"
import {DefaultAdaptor} from "../lib/default-adaptor";

import "./testRoutes"
import "./generated";
import {Body, Post, Route} from "../server/decorators";

const app = Valory.createInstance({
   adaptor: new DefaultAdaptor(8080),
   openapi: {
       info: {
           title: "Test Api",
           version: "1"
       }
   }
});

// app.endpoint("/test", "GET", {
//     requestBody: {
//         required: true,
//         content: {
//             "application/json": {
//                 schema: {
//                     type: "string",
//                     pattern: "^a.+$"
//                 }
//             }
//         }
//     },
//     responses: {
//         "200": {
//             description: "A response",
//         }
//     }
// })
//     .addMiddleware({
//         name: "Primary handler",
//         handler(ctx) {
//             ctx.response.body = {
//                 thing: 3
//             }
//         },
//     }, 50)
//     .done();

app.start();
