"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/unified-search";
exports.ids = ["pages/api/unified-search"];
exports.modules = {

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

module.exports = require("axios");

/***/ }),

/***/ "(api)/./pages/api/unified-search.js":
/*!*************************************!*\
  !*** ./pages/api/unified-search.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ \"axios\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);\n\nasync function handler(req, res) {\n    if (req.method === \"POST\") {\n        try {\n            const { query , domain , limit , ranking_weights , retrieval_weights , ad_integration , ad_budget , user_segment , search_algorithm , boost_factors  } = req.body;\n            const sessionId = req.headers[\"x-session-id\"];\n            const response = await axios__WEBPACK_IMPORTED_MODULE_0___default().post(\"http://127.0.0.1:8000/unified/unified-search\", {\n                query,\n                domain,\n                limit,\n                ranking_weights,\n                retrieval_weights,\n                ad_integration,\n                ad_budget,\n                user_segment,\n                search_algorithm,\n                boost_factors\n            }, {\n                headers: {\n                    \"X-Session-ID\": sessionId,\n                    \"Content-Type\": \"application/json\"\n                }\n            });\n            res.status(200).json(response.data);\n        } catch (error) {\n            console.error(\"Unified Search API Error:\", error.message);\n            console.error(\"Error details:\", error.response?.data);\n            res.status(error.response?.status || 500).json({\n                results: [],\n                search_metadata: {},\n                ranking_breakdown: {},\n                ad_breakdown: {},\n                algorithm_performance: {},\n                error: error.message\n            });\n        }\n    } else {\n        res.setHeader(\"Allow\", [\n            \"POST\"\n        ]);\n        res.status(405).end(`Method ${req.method} Not Allowed`);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvdW5pZmllZC1zZWFyY2guanMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQTBCO0FBRVgsZUFBZUMsT0FBTyxDQUFDQyxHQUFHLEVBQUVDLEdBQUcsRUFBRTtJQUM1QyxJQUFJRCxHQUFHLENBQUNFLE1BQU0sS0FBSyxNQUFNLEVBQUU7UUFDdkIsSUFBSTtZQUNBLE1BQU0sRUFDRkMsS0FBSyxHQUNMQyxNQUFNLEdBQ05DLEtBQUssR0FDTEMsZUFBZSxHQUNmQyxpQkFBaUIsR0FDakJDLGNBQWMsR0FDZEMsU0FBUyxHQUNUQyxZQUFZLEdBQ1pDLGdCQUFnQixHQUNoQkMsYUFBYSxHQUNoQixHQUFHWixHQUFHLENBQUNhLElBQUk7WUFDWixNQUFNQyxTQUFTLEdBQUdkLEdBQUcsQ0FBQ2UsT0FBTyxDQUFDLGNBQWMsQ0FBQztZQUU3QyxNQUFNQyxRQUFRLEdBQUcsTUFBTWxCLGlEQUFVLENBQUMsOENBQThDLEVBQUU7Z0JBQzlFSyxLQUFLO2dCQUNMQyxNQUFNO2dCQUNOQyxLQUFLO2dCQUNMQyxlQUFlO2dCQUNmQyxpQkFBaUI7Z0JBQ2pCQyxjQUFjO2dCQUNkQyxTQUFTO2dCQUNUQyxZQUFZO2dCQUNaQyxnQkFBZ0I7Z0JBQ2hCQyxhQUFhO2FBQ2hCLEVBQUU7Z0JBQ0NHLE9BQU8sRUFBRTtvQkFDTCxjQUFjLEVBQUVELFNBQVM7b0JBQ3pCLGNBQWMsRUFBRSxrQkFBa0I7aUJBQ3JDO2FBQ0osQ0FBQztZQUVGYixHQUFHLENBQUNpQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUNDLElBQUksQ0FBQ0gsUUFBUSxDQUFDSSxJQUFJLENBQUMsQ0FBQztRQUN4QyxFQUFFLE9BQU9DLEtBQUssRUFBRTtZQUNaQyxPQUFPLENBQUNELEtBQUssQ0FBQywyQkFBMkIsRUFBRUEsS0FBSyxDQUFDRSxPQUFPLENBQUMsQ0FBQztZQUMxREQsT0FBTyxDQUFDRCxLQUFLLENBQUMsZ0JBQWdCLEVBQUVBLEtBQUssQ0FBQ0wsUUFBUSxFQUFFSSxJQUFJLENBQUMsQ0FBQztZQUV0RG5CLEdBQUcsQ0FBQ2lCLE1BQU0sQ0FBQ0csS0FBSyxDQUFDTCxRQUFRLEVBQUVFLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQ0MsSUFBSSxDQUFDO2dCQUMzQ0ssT0FBTyxFQUFFLEVBQUU7Z0JBQ1hDLGVBQWUsRUFBRSxFQUFFO2dCQUNuQkMsaUJBQWlCLEVBQUUsRUFBRTtnQkFDckJDLFlBQVksRUFBRSxFQUFFO2dCQUNoQkMscUJBQXFCLEVBQUUsRUFBRTtnQkFDekJQLEtBQUssRUFBRUEsS0FBSyxDQUFDRSxPQUFPO2FBQ3ZCLENBQUMsQ0FBQztRQUNQLENBQUM7SUFDTCxPQUFPO1FBQ0h0QixHQUFHLENBQUM0QixTQUFTLENBQUMsT0FBTyxFQUFFO1lBQUMsTUFBTTtTQUFDLENBQUMsQ0FBQztRQUNqQzVCLEdBQUcsQ0FBQ2lCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQ1ksR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFOUIsR0FBRyxDQUFDRSxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUM1RCxDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2Zhc2hpb24tc2VhcmNoLWZyb250ZW5kLy4vcGFnZXMvYXBpL3VuaWZpZWQtc2VhcmNoLmpzP2VkZjgiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihyZXEsIHJlcykge1xuICAgIGlmIChyZXEubWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgXG4gICAgICAgICAgICAgICAgcXVlcnksIFxuICAgICAgICAgICAgICAgIGRvbWFpbiwgXG4gICAgICAgICAgICAgICAgbGltaXQsIFxuICAgICAgICAgICAgICAgIHJhbmtpbmdfd2VpZ2h0cywgXG4gICAgICAgICAgICAgICAgcmV0cmlldmFsX3dlaWdodHMsXG4gICAgICAgICAgICAgICAgYWRfaW50ZWdyYXRpb24sXG4gICAgICAgICAgICAgICAgYWRfYnVkZ2V0LFxuICAgICAgICAgICAgICAgIHVzZXJfc2VnbWVudCxcbiAgICAgICAgICAgICAgICBzZWFyY2hfYWxnb3JpdGhtLFxuICAgICAgICAgICAgICAgIGJvb3N0X2ZhY3RvcnNcbiAgICAgICAgICAgIH0gPSByZXEuYm9keTtcbiAgICAgICAgICAgIGNvbnN0IHNlc3Npb25JZCA9IHJlcS5oZWFkZXJzWyd4LXNlc3Npb24taWQnXTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5wb3N0KCdodHRwOi8vMTI3LjAuMC4xOjgwMDAvdW5pZmllZC91bmlmaWVkLXNlYXJjaCcsIHtcbiAgICAgICAgICAgICAgICBxdWVyeSxcbiAgICAgICAgICAgICAgICBkb21haW4sXG4gICAgICAgICAgICAgICAgbGltaXQsXG4gICAgICAgICAgICAgICAgcmFua2luZ193ZWlnaHRzLFxuICAgICAgICAgICAgICAgIHJldHJpZXZhbF93ZWlnaHRzLFxuICAgICAgICAgICAgICAgIGFkX2ludGVncmF0aW9uLFxuICAgICAgICAgICAgICAgIGFkX2J1ZGdldCxcbiAgICAgICAgICAgICAgICB1c2VyX3NlZ21lbnQsXG4gICAgICAgICAgICAgICAgc2VhcmNoX2FsZ29yaXRobSxcbiAgICAgICAgICAgICAgICBib29zdF9mYWN0b3JzXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAnWC1TZXNzaW9uLUlEJzogc2Vzc2lvbklkLFxuICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignVW5pZmllZCBTZWFyY2ggQVBJIEVycm9yOicsIGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZGV0YWlsczonLCBlcnJvci5yZXNwb25zZT8uZGF0YSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoZXJyb3IucmVzcG9uc2U/LnN0YXR1cyB8fCA1MDApLmpzb24oe1xuICAgICAgICAgICAgICAgIHJlc3VsdHM6IFtdLFxuICAgICAgICAgICAgICAgIHNlYXJjaF9tZXRhZGF0YToge30sXG4gICAgICAgICAgICAgICAgcmFua2luZ19icmVha2Rvd246IHt9LFxuICAgICAgICAgICAgICAgIGFkX2JyZWFrZG93bjoge30sXG4gICAgICAgICAgICAgICAgYWxnb3JpdGhtX3BlcmZvcm1hbmNlOiB7fSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3IubWVzc2FnZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICByZXMuc2V0SGVhZGVyKCdBbGxvdycsIFsnUE9TVCddKTtcbiAgICAgICAgcmVzLnN0YXR1cyg0MDUpLmVuZChgTWV0aG9kICR7cmVxLm1ldGhvZH0gTm90IEFsbG93ZWRgKTtcbiAgICB9XG59XG4iXSwibmFtZXMiOlsiYXhpb3MiLCJoYW5kbGVyIiwicmVxIiwicmVzIiwibWV0aG9kIiwicXVlcnkiLCJkb21haW4iLCJsaW1pdCIsInJhbmtpbmdfd2VpZ2h0cyIsInJldHJpZXZhbF93ZWlnaHRzIiwiYWRfaW50ZWdyYXRpb24iLCJhZF9idWRnZXQiLCJ1c2VyX3NlZ21lbnQiLCJzZWFyY2hfYWxnb3JpdGhtIiwiYm9vc3RfZmFjdG9ycyIsImJvZHkiLCJzZXNzaW9uSWQiLCJoZWFkZXJzIiwicmVzcG9uc2UiLCJwb3N0Iiwic3RhdHVzIiwianNvbiIsImRhdGEiLCJlcnJvciIsImNvbnNvbGUiLCJtZXNzYWdlIiwicmVzdWx0cyIsInNlYXJjaF9tZXRhZGF0YSIsInJhbmtpbmdfYnJlYWtkb3duIiwiYWRfYnJlYWtkb3duIiwiYWxnb3JpdGhtX3BlcmZvcm1hbmNlIiwic2V0SGVhZGVyIiwiZW5kIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./pages/api/unified-search.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/unified-search.js"));
module.exports = __webpack_exports__;

})();