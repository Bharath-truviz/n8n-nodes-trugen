"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trugen = void 0;
var trugenHelpers = {
    formatResponse: function (responseData) {
        var formatted = responseData;
        if (typeof formatted === 'string') {
            try {
                formatted = JSON.parse(formatted);
            }
            catch (_a) {
                return { data: formatted };
            }
        }
        if (!formatted || typeof formatted !== 'object') {
            return { data: formatted };
        }
        if (Array.isArray(formatted)) {
            return { data: formatted };
        }
        if ('id' in formatted) {
            var typed = formatted;
            return __assign(__assign({}, formatted), { call_link: "https://app.trugen.ai/agent/".concat(typed.id), embed_code: "<iframe src=\"https://app.trugen.ai/embed?agentId=".concat(typed.id, "\" width=\"100%\" height=\"600\" frameborder=\"0\" allow=\"camera; microphone; autoplay\"></iframe>") });
        }
        return formatted;
    },
};
var Trugen = /** @class */ (function () {
    function Trugen() {
        this.description = {
            displayName: 'Trugen',
            name: 'trugen',
            icon: { light: 'file:trugen.svg', dark: 'file:trugen.dark.svg' },
            group: ['transform'],
            version: 1,
            usableAsTool: true,
            description: 'Create agents, list avatars, and fetch conversations from Trugen',
            defaults: { name: 'TruGen' },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [{ name: 'trugenApi', required: true }],
            properties: [
                {
                    displayName: 'Action',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        { name: 'Create Agent', value: 'createAgent' },
                        { name: 'Get Stock Avatars', value: 'getAvatars' },
                        { name: 'Get Conversation', value: 'getConversation' },
                    ],
                    default: 'createAgent',
                },
                {
                    displayName: 'Agent Name',
                    name: 'name',
                    type: 'string',
                    required: true,
                    default: '',
                    displayOptions: { show: { operation: ['createAgent'] } },
                },
                {
                    displayName: 'System Prompt',
                    name: 'system_prompt',
                    type: 'string',
                    required: true,
                    default: 'You are a helpful assistant.',
                    displayOptions: { show: { operation: ['createAgent'] } },
                },
                {
                    displayName: 'Avatar Source',
                    name: 'avatarSource',
                    type: 'options',
                    options: [
                        { name: 'Stock Avatar', value: 'stock' },
                        { name: 'Manual Avatar ID', value: 'manual' },
                    ],
                    default: 'stock',
                    displayOptions: { show: { operation: ['createAgent'] } },
                },
                {
                    displayName: 'Stock Avatar ID',
                    name: 'avatarStockId',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: { operation: ['createAgent'], avatarSource: ['stock'] },
                    },
                },
                {
                    displayName: 'Avatar ID',
                    name: 'avatarId',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: { operation: ['createAgent'], avatarSource: ['manual'] },
                    },
                },
                {
                    displayName: 'Greeting',
                    name: 'greeting',
                    type: 'string',
                    default: 'Hello! How can I help you today?',
                    displayOptions: { show: { operation: ['createAgent'] } },
                },
                {
                    displayName: 'Max Session Length (Minutes)',
                    name: 'maxSessionLengthMinutes',
                    type: 'number',
                    default: 30,
                    displayOptions: { show: { operation: ['createAgent'] } },
                },
                {
                    displayName: 'LLM Provider',
                    name: 'llmProvider',
                    type: 'options',
                    options: [
                        { name: 'Google', value: 'google' },
                        { name: 'Groq', value: 'groq' },
                        { name: 'OpenAI', value: 'openai' },
                    ],
                    default: 'openai',
                    displayOptions: {
                        show: {
                            operation: ['createAgent'],
                        },
                    },
                    description: 'Provider for the Large Language Model',
                },
                {
                    displayName: 'LLM Model (OpenAI)',
                    name: 'llmModel_openai',
                    type: 'options',
                    options: [
                        { name: 'GPT-4.1-Mini', value: 'gpt-4.1-mini' },
                        { name: 'GPT-4.1-Nano', value: 'gpt-4.1-nano' },
                        { name: 'GPT-4.1', value: 'gpt-4.1' },
                    ],
                    default: 'gpt-4.1-mini',
                    displayOptions: {
                        show: {
                            operation: ['createAgent'],
                            llmProvider: ['openai'],
                        },
                    },
                    description: 'Model ID for OpenAI LLM',
                },
                {
                    displayName: 'LLM Model (Groq)',
                    name: 'llmModel_groq',
                    type: 'options',
                    options: [
                        {
                            name: 'Llama-4 Maverick',
                            value: 'meta-llama/llama-4-maverick-17b-128e-instruct',
                        },
                        {
                            name: 'Llama-4 Scout',
                            value: 'meta-llama/llama-4-scout-17b-16e-instruct',
                        },
                        { name: 'GPT OSS 20b', value: 'openai/gpt-oss-20b' },
                        { name: 'GPT OSS 120b', value: 'openai/gpt-oss-120b' },
                    ],
                    default: 'meta-llama/llama-4-maverick-17b-128e-instruct',
                    displayOptions: {
                        show: {
                            operation: ['createAgent'],
                            llmProvider: ['groq'],
                        },
                    },
                    description: 'Model ID for Groq LLM',
                },
                {
                    displayName: 'LLM Model (Google)',
                    name: 'llmModel_google',
                    type: 'options',
                    options: [
                        { name: 'Gemini 2.5 Flash', value: 'gemini-2.5-flash' },
                        { name: 'Gemini 2.5 Flash Lite', value: 'gemini-2.5-flash-lite' },
                        { name: 'Gemini 2.5 Pro', value: 'gemini-2.5-pro' },
                        { name: 'Gemini 3 Flash Preview', value: 'gemini-3-flash-preview' },
                        { name: 'Gemini 3 Pro Preview', value: 'gemini-3-pro-preview' },
                    ],
                    default: 'gemini-2.5-flash',
                    displayOptions: {
                        show: {
                            operation: ['createAgent'],
                            llmProvider: ['google'],
                        },
                    },
                    description: 'Model ID for Google LLM',
                },
                {
                    displayName: 'TTS Provider',
                    name: 'ttsProvider',
                    type: 'options',
                    options: [{ name: 'ElevenLabs', value: 'elevenlabs' }],
                    default: 'elevenlabs',
                    description: 'Text-to-Speech provider',
                    displayOptions: { show: { operation: ['createAgent'] } },
                },
                {
                    displayName: 'TTS Model',
                    name: 'ttsModel',
                    type: 'options',
                    options: [
                        { name: 'Turbo 2.5', value: 'eleven_turbo_v2_5' },
                        { name: 'Turbo 2', value: 'eleven_turbo_v2' },
                    ],
                    default: 'eleven_turbo_v2_5',
                    description: 'Model ID for ElevenLabs TTS',
                    displayOptions: { show: { operation: ['createAgent'] } },
                },
                {
                    displayName: 'TTS Voice ID',
                    name: 'ttsVoiceId',
                    type: 'options',
                    options: [
                        { name: 'Alex', value: 'iP95p4xoKVk53GoZ742B' },
                        { name: 'Aman', value: 'rFzjTA9NFWPsUdx39OwG' },
                        { name: 'Chloe', value: '21m00Tcm4TlvDq8ikWAM' },
                        { name: 'Jack', value: 'bIHbv24MWmeRgasZH58o' },
                        { name: 'Lisa', value: 'FGY2WhTYpPnrIDTdsKH5' },
                        { name: 'Priya', value: 'ZUrEGyu8GFMwnHbvLhv2' },
                        { name: 'Sameer', value: 'SV61h9yhBg4i91KIBwdz' },
                    ],
                    default: 'ZUrEGyu8GFMwnHbvLhv2',
                    description: 'Voice ID for TTS',
                    displayOptions: { show: { operation: ['createAgent'] } },
                },
                {
                    displayName: 'STT Provider',
                    name: 'sttProvider',
                    type: 'options',
                    options: [
                        { name: 'Deepgram', value: 'deepgram' },
                        { name: 'Deepgram V2', value: 'deepgram-v2' },
                    ],
                    default: 'deepgram',
                    displayOptions: { show: { operation: ['createAgent'] } },
                },
                {
                    displayName: 'STT Model',
                    name: 'sttModel',
                    type: 'options',
                    options: [
                        { name: 'Nova 3', value: 'nova-3' },
                        { name: 'Nova 2', value: 'nova-2' },
                        { name: 'Flux General English', value: 'flux-general-en' },
                    ],
                    default: 'nova-3',
                    displayOptions: { show: { operation: ['createAgent'] } },
                },
                {
                    displayName: 'STT Language',
                    name: 'sttLanguage',
                    type: 'options',
                    options: [
                        { name: 'Bulgarian', value: 'bg' },
                        { name: 'Catalan', value: 'ca' },
                        { name: 'Czech', value: 'cs' },
                        { name: 'Danish', value: 'da' },
                        { name: 'Danish (Denmark)', value: 'da-DK' },
                        { name: 'Dutch', value: 'nl' },
                        { name: 'English', value: 'en' },
                        { name: 'English (Australia)', value: 'en-AU' },
                        { name: 'English (India)', value: 'en-IN' },
                        { name: 'English (New Zealand)', value: 'en-NZ' },
                        { name: 'English (United Kingdom)', value: 'en-GB' },
                        { name: 'English (United States)', value: 'en-US' },
                        { name: 'Estonian', value: 'et' },
                        { name: 'Finnish', value: 'fi' },
                        { name: 'Flemish', value: 'nl-BE' },
                        { name: 'French', value: 'fr' },
                        { name: 'French (Canada)', value: 'fr-CA' },
                        { name: 'German', value: 'de' },
                        { name: 'German (Switzerland)', value: 'de-CH' },
                        { name: 'Greek', value: 'el' },
                        { name: 'Hindi', value: 'hi' },
                        { name: 'Hungarian', value: 'hu' },
                        { name: 'Indonesian', value: 'id' },
                        { name: 'Italian', value: 'it' },
                        { name: 'Japanese', value: 'ja' },
                        { name: 'Korean', value: 'ko' },
                        { name: 'Korean (South Korea)', value: 'ko-KR' },
                        { name: 'Latvian', value: 'lv' },
                        { name: 'Lithuanian', value: 'lt' },
                        { name: 'Malay', value: 'ms' },
                        { name: 'Multilingual (Multi)', value: 'multi' },
                        { name: 'Norwegian', value: 'no' },
                        { name: 'Polish', value: 'pl' },
                        { name: 'Portuguese', value: 'pt' },
                        { name: 'Portuguese (Brazil)', value: 'pt-BR' },
                        { name: 'Portuguese (Portugal)', value: 'pt-PT' },
                        { name: 'Romanian', value: 'ro' },
                        { name: 'Russian', value: 'ru' },
                        { name: 'Slovak', value: 'sk' },
                        { name: 'Spanish', value: 'es' },
                        { name: 'Spanish (Latin America)', value: 'es-419' },
                        { name: 'Swedish', value: 'sv' },
                        { name: 'Swedish (Sweden)', value: 'sv-SE' },
                        { name: 'Turkish', value: 'tr' },
                        { name: 'Ukrainian', value: 'uk' },
                        { name: 'Vietnamese', value: 'vi' },
                    ],
                    default: 'en',
                    displayOptions: { show: { operation: ['createAgent'] } },
                },
                {
                    displayName: 'Record Calls',
                    name: 'record',
                    type: 'boolean',
                    default: true,
                    displayOptions: { show: { operation: ['createAgent'] } },
                },
                {
                    displayName: 'Callback Events',
                    name: 'callback_events',
                    type: 'multiOptions',
                    options: [
                        { name: 'Agent Interrupted', value: 'agent.interrupted' },
                        { name: 'Agent Started Speaking', value: 'agent.started_speaking' },
                        { name: 'Agent Stopped Speaking', value: 'agent.stopped_speaking' },
                        { name: 'Call Ended', value: 'call_ended' },
                        { name: 'Max Call Duration Timeout', value: 'max_call_duration_timeout' },
                        { name: 'Participant Left', value: 'participant_left' },
                        { name: 'User Started Speaking', value: 'user.started_speaking' },
                        { name: 'User Stopped Speaking', value: 'user.stopped_speaking' },
                        { name: 'Utterance Committed', value: 'utterance_committed' },
                    ],
                    default: [],
                    displayOptions: { show: { operation: ['createAgent'] } },
                },
                {
                    displayName: 'Callback URL',
                    name: 'callback_url',
                    type: 'string',
                    default: '',
                    displayOptions: { show: { operation: ['createAgent'] } },
                },
                {
                    displayName: 'Conversation ID',
                    name: 'conversation_id',
                    type: 'string',
                    required: true,
                    default: '',
                    displayOptions: { show: { operation: ['getConversation'] } },
                },
                {
                    displayName: 'Wait for Completion',
                    name: 'wait_for_completion',
                    type: 'boolean',
                    default: false,
                    displayOptions: { show: { operation: ['getConversation'] } },
                },
            ],
        };
    }
    Trugen.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items, operation, credentials, results, _loop_1, this_1, i;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        items = this.getInputData();
                        operation = this.getNodeParameter('operation', 0);
                        return [4 /*yield*/, this.getCredentials('trugenApi')];
                    case 1:
                        credentials = _a.sent();
                        results = [];
                        _loop_1 = function (i) {
                            var response, avatarSource, avatarId, llmModel, body, conversationId_1, wait, fetch_1, retries;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        response = void 0;
                                        if (!(operation === 'createAgent')) return [3 /*break*/, 2];
                                        avatarSource = this_1.getNodeParameter('avatarSource', i);
                                        avatarId = avatarSource === 'stock'
                                            ? this_1.getNodeParameter('avatarStockId', i)
                                            : this_1.getNodeParameter('avatarId', i);
                                        llmModel = '';
                                        if (this_1.getNodeParameter('llmProvider', i) === 'openai') {
                                            llmModel = this_1.getNodeParameter('llmModel_openai', i);
                                        }
                                        else if (this_1.getNodeParameter('llmProvider', i) === 'groq') {
                                            llmModel = this_1.getNodeParameter('llmModel_groq', i);
                                        }
                                        else if (this_1.getNodeParameter('llmProvider', i) === 'google') {
                                            llmModel = this_1.getNodeParameter('llmModel_google', i);
                                        }
                                        body = {
                                            agent_name: this_1.getNodeParameter('name', i),
                                            agent_system_prompt: this_1.getNodeParameter('system_prompt', i),
                                            record: this_1.getNodeParameter('record', i),
                                            callback_url: this_1.getNodeParameter('callback_url', i),
                                            callback_events: this_1.getNodeParameter('callback_events', i),
                                            avatars: [
                                                {
                                                    avatar_key_id: avatarId,
                                                    persona_name: this_1.getNodeParameter('name', i),
                                                    persona_prompt: this_1.getNodeParameter('system_prompt', i),
                                                    welcome_message: {
                                                        wait_time: 2,
                                                        messages: [this_1.getNodeParameter('greeting', i)],
                                                    },
                                                    config: {
                                                        llm: {
                                                            provider: this_1.getNodeParameter('llmProvider', i),
                                                            model: llmModel,
                                                        },
                                                        stt: {
                                                            provider: this_1.getNodeParameter('sttProvider', i),
                                                            model: this_1.getNodeParameter('sttModel', i),
                                                            language: this_1.getNodeParameter('sttLanguage', i),
                                                        },
                                                        tts: {
                                                            provider: this_1.getNodeParameter('ttsProvider', i),
                                                            model_id: this_1.getNodeParameter('ttsModel', i),
                                                            voice_id: this_1.getNodeParameter('ttsVoiceId', i),
                                                        },
                                                    },
                                                },
                                            ],
                                            config: {
                                                timeout: this_1.getNodeParameter('maxSessionLengthMinutes', i) * 60,
                                            },
                                        };
                                        return [4 /*yield*/, this_1.helpers.httpRequest({
                                                method: 'POST',
                                                url: 'https://api.trugen.ai/v1/ext/agent',
                                                headers: { 'x-api-key': credentials.apiKey },
                                                body: body,
                                                json: true,
                                            })];
                                    case 1:
                                        response = _b.sent();
                                        _b.label = 2;
                                    case 2:
                                        if (!(operation === 'getAvatars')) return [3 /*break*/, 4];
                                        return [4 /*yield*/, this_1.helpers.httpRequest({
                                                method: 'GET',
                                                url: 'https://api.trugen.ai/v1/ext/avatars',
                                                headers: { 'x-api-key': credentials.apiKey },
                                                json: true,
                                            })];
                                    case 3:
                                        response = _b.sent();
                                        _b.label = 4;
                                    case 4:
                                        if (!(operation === 'getConversation')) return [3 /*break*/, 9];
                                        conversationId_1 = this_1.getNodeParameter('conversation_id', i);
                                        wait = this_1.getNodeParameter('wait_for_completion', i, false);
                                        fetch_1 = function () { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                return [2 /*return*/, this.helpers.httpRequest({
                                                        method: 'GET',
                                                        url: "https://api.trugen.ai/v1/ext/conversation/".concat(conversationId_1),
                                                        headers: { 'x-api-key': credentials.apiKey },
                                                        json: true,
                                                    })];
                                            });
                                        }); };
                                        return [4 /*yield*/, fetch_1()];
                                    case 5:
                                        response = _b.sent();
                                        if (!wait) return [3 /*break*/, 9];
                                        retries = 0;
                                        _b.label = 6;
                                    case 6:
                                        if (!(response.status !== 'Completed' && retries < 5)) return [3 /*break*/, 9];
                                        return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 2000); })];
                                    case 7:
                                        _b.sent();
                                        return [4 /*yield*/, fetch_1()];
                                    case 8:
                                        response = _b.sent();
                                        retries++;
                                        return [3 /*break*/, 6];
                                    case 9:
                                        results.push({
                                            json: trugenHelpers.formatResponse(response),
                                            pairedItem: { item: i },
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < items.length)) return [3 /*break*/, 5];
                        return [5 /*yield**/, _loop_1(i)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, this.prepareOutputData(results)];
                }
            });
        });
    };
    return Trugen;
}());
exports.Trugen = Trugen;
