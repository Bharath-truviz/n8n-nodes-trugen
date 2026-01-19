"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrugenApi = void 0;
var TrugenApi = /** @class */ (function () {
    function TrugenApi() {
        this.name = 'trugenApi';
        this.displayName = 'TruGen.AI API';
        this.documentationUrl = 'https://docs.trugen.ai';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: { password: true },
                default: '',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    'x-api-key': '={{$credentials.apiKey}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: 'https://api.trugen.ai/v1',
                url: 'ext/avatars',
            },
        };
    }
    return TrugenApi;
}());
exports.TrugenApi = TrugenApi;
