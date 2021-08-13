"use strict";
// https://choosealicense.com/licenses/lgpl-3.0/
// inspiration from https://github.com/ChainSafe/web3-context
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
exports.__esModule = true;
exports.useWeb3 = exports.Web3Store = void 0;
var React = require("react");
var react_1 = require("react");
var onboard_1 = require("@tracer-protocol/onboard");
var units_1 = require("@ethersproject/units");
var Web3Context_Config_1 = require("./Web3Context.Config");
var ApproveConnectionModal_1 = require("@components/Legal/ApproveConnectionModal");
var web3_1 = require("web3");
var universal_cookie_1 = require("universal-cookie");
var Web3Context = React.createContext(undefined);
var DEFAULT_RPC = process.env.NEXT_PUBLIC_DEFAULT_RPC;
/**
 * Handles connection through BlockNative Onboard library
 */
var Web3Store = function (_a) {
    var children = _a.children, onboardConfig = _a.onboardConfig, networkIds = _a.networkIds, _b = _a.cacheWalletSelection, cacheWalletSelection = _b === void 0 ? true : _b, _c = _a.checkNetwork, checkNetwork = _c === void 0 ? (networkIds && networkIds.length > 0) || false : _c;
    var _d = react_1.useState(undefined), account = _d[0], setAccount = _d[1];
    var _e = react_1.useState(DEFAULT_RPC ? new web3_1["default"](DEFAULT_RPC) : undefined), web3 = _e[0], setWeb3 = _e[1];
    var _f = react_1.useState(undefined), network = _f[0], setNetwork = _f[1];
    var _g = react_1.useState(undefined), ethBalance = _g[0], setEthBalance = _g[1];
    var _h = react_1.useState(undefined), wallet = _h[0], setWallet = _h[1];
    var _j = react_1.useState(undefined), onboard = _j[0], setOnboard = _j[1];
    var _k = react_1.useState(false), isReady = _k[0], setIsReady = _k[1];
    var _l = react_1.useState(Web3Context_Config_1.networkConfig[0]), config = _l[0], setConfig = _l[1];
    var _m = react_1.useState(false), showTerms = _m[0], setShowTerms = _m[1];
    var _o = react_1.useState(false), acceptedTerms = _o[0], acceptTerms = _o[1];
    // Initialize OnboardJS
    react_1.useEffect(function () {
        var initializeOnboard = function () { return __awaiter(void 0, void 0, void 0, function () {
            var checks, onboard_2, savedWallet;
            return __generator(this, function (_a) {
                checks = [{ checkName: 'accounts' }, { checkName: 'connect' }];
                if (networkIds && checkNetwork) {
                    checks.push({ checkName: 'network' });
                }
                try {
                    onboard_2 = onboard_1["default"](__assign(__assign({}, onboardConfig), { networkId: networkIds ? networkIds[0] : 42, walletCheck: checks, subscriptions: {
                            address: function (address) {
                                var _a, _b;
                                console.info("Changing address: " + address);
                                setAccount(address);
                                checkIsReady();
                                ((_a = onboardConfig === null || onboardConfig === void 0 ? void 0 : onboardConfig.subscriptions) === null || _a === void 0 ? void 0 : _a.address) && ((_b = onboardConfig === null || onboardConfig === void 0 ? void 0 : onboardConfig.subscriptions) === null || _b === void 0 ? void 0 : _b.address(address));
                            },
                            wallet: function (wallet) {
                                var _a;
                                if (wallet.provider) {
                                    wallet.name &&
                                        cacheWalletSelection &&
                                        localStorage.setItem('onboard.selectedWallet', wallet.name);
                                    setWallet(wallet);
                                    setWeb3(new web3_1["default"](wallet.provider));
                                }
                                else {
                                    setWallet(undefined);
                                }
                                ((_a = onboardConfig === null || onboardConfig === void 0 ? void 0 : onboardConfig.subscriptions) === null || _a === void 0 ? void 0 : _a.wallet) && onboardConfig.subscriptions.wallet(wallet);
                            },
                            network: function (network) {
                                var _a;
                                if (!networkIds || networkIds.includes(network)) {
                                    onboard_2.config({ networkId: network });
                                }
                                wallet && (wallet === null || wallet === void 0 ? void 0 : wallet.provider) && setWeb3(new web3_1["default"](wallet.provider));
                                setNetwork(network);
                                console.info("Changing network " + network);
                                setConfig(Web3Context_Config_1.networkConfig[network]);
                                checkIsReady();
                                ((_a = onboardConfig === null || onboardConfig === void 0 ? void 0 : onboardConfig.subscriptions) === null || _a === void 0 ? void 0 : _a.network) && onboardConfig.subscriptions.network(network);
                            },
                            balance: function (balance) {
                                var _a;
                                try {
                                    var bal = Number(units_1.formatEther(balance));
                                    !isNaN(bal) ? setEthBalance(bal) : setEthBalance(0);
                                }
                                catch (error) {
                                    setEthBalance(0);
                                }
                                ((_a = onboardConfig === null || onboardConfig === void 0 ? void 0 : onboardConfig.subscriptions) === null || _a === void 0 ? void 0 : _a.balance) && onboardConfig.subscriptions.balance(balance);
                            }
                        } }));
                    savedWallet = localStorage.getItem('onboard.selectedWallet');
                    cacheWalletSelection && savedWallet && onboard_2.walletSelect(savedWallet);
                    setOnboard(onboard_2);
                }
                catch (error) {
                    console.error('Error initializing onboard', error);
                }
                return [2 /*return*/];
            });
        }); };
        initializeOnboard();
    }, []);
    react_1.useEffect(function () {
        var cookies = new universal_cookie_1["default"]();
        if (acceptedTerms) {
            cookies.set('acceptedTerms', 'true', { path: '/' });
            handleConnect();
            setShowTerms(false);
        }
    }, [acceptedTerms]);
    var checkIsReady = function () { return __awaiter(void 0, void 0, void 0, function () {
        var isReady;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (onboard === null || onboard === void 0 ? void 0 : onboard.walletCheck())];
                case 1:
                    isReady = _a.sent();
                    setIsReady(!!isReady);
                    if (!isReady) {
                        setEthBalance(0);
                    }
                    return [2 /*return*/, !!isReady];
            }
        });
    }); };
    var resetOnboard = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    localStorage.setItem('onboard.selectedWallet', '');
                    setIsReady(false);
                    return [4 /*yield*/, (onboard === null || onboard === void 0 ? void 0 : onboard.walletReset())];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var acceptLegalTerms = function () {
        var cookies = new universal_cookie_1["default"]();
        if (cookies.get('acceptedTerms') !== 'true') {
            setShowTerms(true);
        }
        else {
            setShowTerms(false);
            acceptTerms(true);
        }
        return acceptedTerms;
    };
    var handleConnect = function () { return __awaiter(void 0, void 0, void 0, function () {
        var accepted, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!onboard) return [3 /*break*/, 6];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    accepted = acceptLegalTerms();
                    if (!accepted) return [3 /*break*/, 4];
                    return [4 /*yield*/, (onboard === null || onboard === void 0 ? void 0 : onboard.walletSelect())];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, checkIsReady()];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    console.error(err_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var onboardState = onboard === null || onboard === void 0 ? void 0 : onboard.getState();
    return (React.createElement(React.Fragment, null,
        React.createElement(Web3Context.Provider, { value: {
                account: account,
                network: network,
                ethBalance: ethBalance,
                web3: web3,
                wallet: wallet,
                onboard: onboard,
                isReady: isReady,
                checkIsReady: checkIsReady,
                resetOnboard: resetOnboard,
                handleConnect: handleConnect,
                config: config,
                isMobile: !!(onboardState === null || onboardState === void 0 ? void 0 : onboardState.mobileDevice)
            } }, children),
        React.createElement(ApproveConnectionModal_1["default"], { acceptedTerms: acceptedTerms, show: showTerms, setShow: setShowTerms, acceptTerms: acceptTerms })));
};
exports.Web3Store = Web3Store;
var useWeb3 = function () {
    var context = React.useContext(Web3Context);
    if (context === undefined) {
        throw new Error('useOnboard must be used within a OnboardProvider');
    }
    return context;
};
exports.useWeb3 = useWeb3;
