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
exports.id = "pages/api/ranking-demo";
exports.ids = ["pages/api/ranking-demo"];
exports.modules = {

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

module.exports = require("axios");

/***/ }),

/***/ "(api)/./pages/api/ranking-demo.js":
/*!***********************************!*\
  !*** ./pages/api/ranking-demo.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ \"axios\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);\n\nasync function handler(req, res) {\n    if (req.method === \"POST\") {\n        try {\n            const { query , domain , limit , ranking_weights , retrieval_weights  } = req.body;\n            const sessionId = req.headers[\"x-session-id\"];\n            const response = await axios__WEBPACK_IMPORTED_MODULE_0___default().post(\"http://127.0.0.1:8000/ranking-demo/ranking-demo\", {\n                query,\n                domain,\n                limit,\n                ranking_weights,\n                retrieval_weights\n            }, {\n                headers: {\n                    \"X-Session-ID\": sessionId,\n                    \"Content-Type\": \"application/json\"\n                }\n            });\n            res.status(200).json(response.data);\n        } catch (error) {\n            console.error(\"Ranking Demo API Error:\", error.message);\n            console.error(\"Error details:\", error.response?.data);\n            res.status(error.response?.status || 500).json({\n                results: [],\n                ranking_config: {},\n                domain: req.body.domain || \"clothing\",\n                query: req.body.query || \"\",\n                total_results: 0,\n                error: error.message\n            });\n        }\n    } else {\n        res.setHeader(\"Allow\", [\n            \"POST\"\n        ]);\n        res.status(405).end(`Method ${req.method} Not Allowed`);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvcmFua2luZy1kZW1vLmpzLmpzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUEwQjtBQUVYLGVBQWVDLE9BQU8sQ0FBQ0MsR0FBRyxFQUFFQyxHQUFHLEVBQUU7SUFDNUMsSUFBSUQsR0FBRyxDQUFDRSxNQUFNLEtBQUssTUFBTSxFQUFFO1FBQ3ZCLElBQUk7WUFDQSxNQUFNLEVBQUVDLEtBQUssR0FBRUMsTUFBTSxHQUFFQyxLQUFLLEdBQUVDLGVBQWUsR0FBRUMsaUJBQWlCLEdBQUUsR0FBR1AsR0FBRyxDQUFDUSxJQUFJO1lBQzdFLE1BQU1DLFNBQVMsR0FBR1QsR0FBRyxDQUFDVSxPQUFPLENBQUMsY0FBYyxDQUFDO1lBRTdDLE1BQU1DLFFBQVEsR0FBRyxNQUFNYixpREFBVSxDQUFDLGlEQUFpRCxFQUFFO2dCQUNqRkssS0FBSztnQkFDTEMsTUFBTTtnQkFDTkMsS0FBSztnQkFDTEMsZUFBZTtnQkFDZkMsaUJBQWlCO2FBQ3BCLEVBQUU7Z0JBQ0NHLE9BQU8sRUFBRTtvQkFDTCxjQUFjLEVBQUVELFNBQVM7b0JBQ3pCLGNBQWMsRUFBRSxrQkFBa0I7aUJBQ3JDO2FBQ0osQ0FBQztZQUVGUixHQUFHLENBQUNZLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQ0MsSUFBSSxDQUFDSCxRQUFRLENBQUNJLElBQUksQ0FBQyxDQUFDO1FBQ3hDLEVBQUUsT0FBT0MsS0FBSyxFQUFFO1lBQ1pDLE9BQU8sQ0FBQ0QsS0FBSyxDQUFDLHlCQUF5QixFQUFFQSxLQUFLLENBQUNFLE9BQU8sQ0FBQyxDQUFDO1lBQ3hERCxPQUFPLENBQUNELEtBQUssQ0FBQyxnQkFBZ0IsRUFBRUEsS0FBSyxDQUFDTCxRQUFRLEVBQUVJLElBQUksQ0FBQyxDQUFDO1lBRXREZCxHQUFHLENBQUNZLE1BQU0sQ0FBQ0csS0FBSyxDQUFDTCxRQUFRLEVBQUVFLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQ0MsSUFBSSxDQUFDO2dCQUMzQ0ssT0FBTyxFQUFFLEVBQUU7Z0JBQ1hDLGNBQWMsRUFBRSxFQUFFO2dCQUNsQmhCLE1BQU0sRUFBRUosR0FBRyxDQUFDUSxJQUFJLENBQUNKLE1BQU0sSUFBSSxVQUFVO2dCQUNyQ0QsS0FBSyxFQUFFSCxHQUFHLENBQUNRLElBQUksQ0FBQ0wsS0FBSyxJQUFJLEVBQUU7Z0JBQzNCa0IsYUFBYSxFQUFFLENBQUM7Z0JBQ2hCTCxLQUFLLEVBQUVBLEtBQUssQ0FBQ0UsT0FBTzthQUN2QixDQUFDLENBQUM7UUFDUCxDQUFDO0lBQ0wsT0FBTztRQUNIakIsR0FBRyxDQUFDcUIsU0FBUyxDQUFDLE9BQU8sRUFBRTtZQUFDLE1BQU07U0FBQyxDQUFDLENBQUM7UUFDakNyQixHQUFHLENBQUNZLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQ1UsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFdkIsR0FBRyxDQUFDRSxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUM1RCxDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2Zhc2hpb24tc2VhcmNoLWZyb250ZW5kLy4vcGFnZXMvYXBpL3JhbmtpbmctZGVtby5qcz83ODRmIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBheGlvcyBmcm9tICdheGlvcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICBpZiAocmVxLm1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHF1ZXJ5LCBkb21haW4sIGxpbWl0LCByYW5raW5nX3dlaWdodHMsIHJldHJpZXZhbF93ZWlnaHRzIH0gPSByZXEuYm9keTtcbiAgICAgICAgICAgIGNvbnN0IHNlc3Npb25JZCA9IHJlcS5oZWFkZXJzWyd4LXNlc3Npb24taWQnXTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5wb3N0KCdodHRwOi8vMTI3LjAuMC4xOjgwMDAvcmFua2luZy1kZW1vL3JhbmtpbmctZGVtbycsIHtcbiAgICAgICAgICAgICAgICBxdWVyeSxcbiAgICAgICAgICAgICAgICBkb21haW4sXG4gICAgICAgICAgICAgICAgbGltaXQsXG4gICAgICAgICAgICAgICAgcmFua2luZ193ZWlnaHRzLFxuICAgICAgICAgICAgICAgIHJldHJpZXZhbF93ZWlnaHRzXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAnWC1TZXNzaW9uLUlEJzogc2Vzc2lvbklkLFxuICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignUmFua2luZyBEZW1vIEFQSSBFcnJvcjonLCBlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGRldGFpbHM6JywgZXJyb3IucmVzcG9uc2U/LmRhdGEpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXMuc3RhdHVzKGVycm9yLnJlc3BvbnNlPy5zdGF0dXMgfHwgNTAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICByZXN1bHRzOiBbXSxcbiAgICAgICAgICAgICAgICByYW5raW5nX2NvbmZpZzoge30sXG4gICAgICAgICAgICAgICAgZG9tYWluOiByZXEuYm9keS5kb21haW4gfHwgJ2Nsb3RoaW5nJyxcbiAgICAgICAgICAgICAgICBxdWVyeTogcmVxLmJvZHkucXVlcnkgfHwgJycsXG4gICAgICAgICAgICAgICAgdG90YWxfcmVzdWx0czogMCxcbiAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3IubWVzc2FnZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICByZXMuc2V0SGVhZGVyKCdBbGxvdycsIFsnUE9TVCddKTtcbiAgICAgICAgcmVzLnN0YXR1cyg0MDUpLmVuZChgTWV0aG9kICR7cmVxLm1ldGhvZH0gTm90IEFsbG93ZWRgKTtcbiAgICB9XG59XG4iXSwibmFtZXMiOlsiYXhpb3MiLCJoYW5kbGVyIiwicmVxIiwicmVzIiwibWV0aG9kIiwicXVlcnkiLCJkb21haW4iLCJsaW1pdCIsInJhbmtpbmdfd2VpZ2h0cyIsInJldHJpZXZhbF93ZWlnaHRzIiwiYm9keSIsInNlc3Npb25JZCIsImhlYWRlcnMiLCJyZXNwb25zZSIsInBvc3QiLCJzdGF0dXMiLCJqc29uIiwiZGF0YSIsImVycm9yIiwiY29uc29sZSIsIm1lc3NhZ2UiLCJyZXN1bHRzIiwicmFua2luZ19jb25maWciLCJ0b3RhbF9yZXN1bHRzIiwic2V0SGVhZGVyIiwiZW5kIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./pages/api/ranking-demo.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/ranking-demo.js"));
module.exports = __webpack_exports__;

})();