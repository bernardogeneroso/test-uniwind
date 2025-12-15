// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require("uniwind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = withUniwindConfig(config, {
  cssEntryFile: "./app/global.css",
  dtsFile: "./uniwind-types.d.ts",
  debug: true,
});


// const { getDefaultConfig } = require("expo/metro-config");
// const { withUniwindConfig } = require("uniwind/metro");

// let config = getDefaultConfig(__dirname);

// // 1) Apply Uniwind FIRST (requires let)
// config = withUniwindConfig(config, {
//   cssEntryFile: "./app/global.css",
//   dtsFile: "./uniwind-types.d.ts",
//   debug: true,
// });

// // 2) wasm support
// config.resolver.assetExts = Array.from(
//   new Set([...(config.resolver.assetExts ?? []), "wasm"])
// );

// // 3) Wrap Uniwind resolver (DON’T bypass it)
// const uniwindResolveRequest = config.resolver.resolveRequest;

// config.resolver.resolveRequest = (context, moduleName, platform) => {
//   if (moduleName === "jotai") {
//     return uniwindResolveRequest(
//       { ...context, unstable_conditionNames: ["require", "default"] },
//       moduleName,
//       platform
//     );
//   }

//   return uniwindResolveRequest(context, moduleName, platform);
// };

// // 4) If you really need global condition names, include default
// config.resolver.unstable_conditionNames = [
//   "browser",
//   "react-native",
//   "require",
//   "default",
// ];

// // 5) COEP/COOP headers (preserve previous enhancer)
// const prevEnhance = config.server.enhanceMiddleware;
// config.server.enhanceMiddleware = (middleware) => {
//   const nextMiddleware = prevEnhance ? prevEnhance(middleware) : middleware;

//   return (req, res, next) => {
//     res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
//     res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
//     nextMiddleware(req, res, next);
//   };
// };

// module.exports = config;
