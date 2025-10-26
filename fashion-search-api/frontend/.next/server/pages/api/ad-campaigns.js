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
exports.id = "pages/api/ad-campaigns";
exports.ids = ["pages/api/ad-campaigns"];
exports.modules = {

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

module.exports = require("axios");

/***/ }),

/***/ "(api)/./pages/api/ad-campaigns.js":
/*!***********************************!*\
  !*** ./pages/api/ad-campaigns.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ \"axios\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);\n\nasync function handler(req, res) {\n    if (req.method === \"POST\") {\n        try {\n            const { query , domain , limit , ad_integration , ad_budget , user_segment  } = req.body;\n            const sessionId = req.headers[\"x-session-id\"];\n            const response = await axios__WEBPACK_IMPORTED_MODULE_0___default().post(\"http://127.0.0.1:8000/ads/ad-integration\", {\n                query,\n                domain,\n                limit,\n                ad_integration,\n                ad_budget,\n                user_segment\n            }, {\n                headers: {\n                    \"X-Session-ID\": sessionId,\n                    \"Content-Type\": \"application/json\"\n                }\n            });\n            res.status(200).json(response.data);\n        } catch (error) {\n            console.error(\"Ad Campaigns API Error:\", error.message);\n            console.error(\"Error details:\", error.response?.data);\n            res.status(error.response?.status || 500).json({\n                results: [],\n                ad_campaigns: [],\n                total_ads: 0,\n                total_organic: 0,\n                ad_revenue_estimate: 0,\n                query: req.body.query || \"\",\n                domain: req.body.domain || \"clothing\",\n                error: error.message\n            });\n        }\n    } else {\n        res.setHeader(\"Allow\", [\n            \"POST\"\n        ]);\n        res.status(405).end(`Method ${req.method} Not Allowed`);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvYWQtY2FtcGFpZ25zLmpzLmpzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUEwQjtBQUVYLGVBQWVDLE9BQU8sQ0FBQ0MsR0FBRyxFQUFFQyxHQUFHLEVBQUU7SUFDNUMsSUFBSUQsR0FBRyxDQUFDRSxNQUFNLEtBQUssTUFBTSxFQUFFO1FBQ3ZCLElBQUk7WUFDQSxNQUFNLEVBQUVDLEtBQUssR0FBRUMsTUFBTSxHQUFFQyxLQUFLLEdBQUVDLGNBQWMsR0FBRUMsU0FBUyxHQUFFQyxZQUFZLEdBQUUsR0FBR1IsR0FBRyxDQUFDUyxJQUFJO1lBQ2xGLE1BQU1DLFNBQVMsR0FBR1YsR0FBRyxDQUFDVyxPQUFPLENBQUMsY0FBYyxDQUFDO1lBRTdDLE1BQU1DLFFBQVEsR0FBRyxNQUFNZCxpREFBVSxDQUFDLDBDQUEwQyxFQUFFO2dCQUMxRUssS0FBSztnQkFDTEMsTUFBTTtnQkFDTkMsS0FBSztnQkFDTEMsY0FBYztnQkFDZEMsU0FBUztnQkFDVEMsWUFBWTthQUNmLEVBQUU7Z0JBQ0NHLE9BQU8sRUFBRTtvQkFDTCxjQUFjLEVBQUVELFNBQVM7b0JBQ3pCLGNBQWMsRUFBRSxrQkFBa0I7aUJBQ3JDO2FBQ0osQ0FBQztZQUVGVCxHQUFHLENBQUNhLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQ0MsSUFBSSxDQUFDSCxRQUFRLENBQUNJLElBQUksQ0FBQyxDQUFDO1FBQ3hDLEVBQUUsT0FBT0MsS0FBSyxFQUFFO1lBQ1pDLE9BQU8sQ0FBQ0QsS0FBSyxDQUFDLHlCQUF5QixFQUFFQSxLQUFLLENBQUNFLE9BQU8sQ0FBQyxDQUFDO1lBQ3hERCxPQUFPLENBQUNELEtBQUssQ0FBQyxnQkFBZ0IsRUFBRUEsS0FBSyxDQUFDTCxRQUFRLEVBQUVJLElBQUksQ0FBQyxDQUFDO1lBRXREZixHQUFHLENBQUNhLE1BQU0sQ0FBQ0csS0FBSyxDQUFDTCxRQUFRLEVBQUVFLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQ0MsSUFBSSxDQUFDO2dCQUMzQ0ssT0FBTyxFQUFFLEVBQUU7Z0JBQ1hDLFlBQVksRUFBRSxFQUFFO2dCQUNoQkMsU0FBUyxFQUFFLENBQUM7Z0JBQ1pDLGFBQWEsRUFBRSxDQUFDO2dCQUNoQkMsbUJBQW1CLEVBQUUsQ0FBQztnQkFDdEJyQixLQUFLLEVBQUVILEdBQUcsQ0FBQ1MsSUFBSSxDQUFDTixLQUFLLElBQUksRUFBRTtnQkFDM0JDLE1BQU0sRUFBRUosR0FBRyxDQUFDUyxJQUFJLENBQUNMLE1BQU0sSUFBSSxVQUFVO2dCQUNyQ2EsS0FBSyxFQUFFQSxLQUFLLENBQUNFLE9BQU87YUFDdkIsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztJQUNMLE9BQU87UUFDSGxCLEdBQUcsQ0FBQ3dCLFNBQVMsQ0FBQyxPQUFPLEVBQUU7WUFBQyxNQUFNO1NBQUMsQ0FBQyxDQUFDO1FBQ2pDeEIsR0FBRyxDQUFDYSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUNZLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRTFCLEdBQUcsQ0FBQ0UsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFDNUQsQ0FBQztBQUNMLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mYXNoaW9uLXNlYXJjaC1mcm9udGVuZC8uL3BhZ2VzL2FwaS9hZC1jYW1wYWlnbnMuanM/NGE2MSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgaWYgKHJlcS5tZXRob2QgPT09ICdQT1NUJykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBxdWVyeSwgZG9tYWluLCBsaW1pdCwgYWRfaW50ZWdyYXRpb24sIGFkX2J1ZGdldCwgdXNlcl9zZWdtZW50IH0gPSByZXEuYm9keTtcbiAgICAgICAgICAgIGNvbnN0IHNlc3Npb25JZCA9IHJlcS5oZWFkZXJzWyd4LXNlc3Npb24taWQnXTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5wb3N0KCdodHRwOi8vMTI3LjAuMC4xOjgwMDAvYWRzL2FkLWludGVncmF0aW9uJywge1xuICAgICAgICAgICAgICAgIHF1ZXJ5LFxuICAgICAgICAgICAgICAgIGRvbWFpbixcbiAgICAgICAgICAgICAgICBsaW1pdCxcbiAgICAgICAgICAgICAgICBhZF9pbnRlZ3JhdGlvbixcbiAgICAgICAgICAgICAgICBhZF9idWRnZXQsXG4gICAgICAgICAgICAgICAgdXNlcl9zZWdtZW50XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAnWC1TZXNzaW9uLUlEJzogc2Vzc2lvbklkLFxuICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignQWQgQ2FtcGFpZ25zIEFQSSBFcnJvcjonLCBlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGRldGFpbHM6JywgZXJyb3IucmVzcG9uc2U/LmRhdGEpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXMuc3RhdHVzKGVycm9yLnJlc3BvbnNlPy5zdGF0dXMgfHwgNTAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICByZXN1bHRzOiBbXSxcbiAgICAgICAgICAgICAgICBhZF9jYW1wYWlnbnM6IFtdLFxuICAgICAgICAgICAgICAgIHRvdGFsX2FkczogMCxcbiAgICAgICAgICAgICAgICB0b3RhbF9vcmdhbmljOiAwLFxuICAgICAgICAgICAgICAgIGFkX3JldmVudWVfZXN0aW1hdGU6IDAsXG4gICAgICAgICAgICAgICAgcXVlcnk6IHJlcS5ib2R5LnF1ZXJ5IHx8ICcnLFxuICAgICAgICAgICAgICAgIGRvbWFpbjogcmVxLmJvZHkuZG9tYWluIHx8ICdjbG90aGluZycsXG4gICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yLm1lc3NhZ2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmVzLnNldEhlYWRlcignQWxsb3cnLCBbJ1BPU1QnXSk7XG4gICAgICAgIHJlcy5zdGF0dXMoNDA1KS5lbmQoYE1ldGhvZCAke3JlcS5tZXRob2R9IE5vdCBBbGxvd2VkYCk7XG4gICAgfVxufVxuIl0sIm5hbWVzIjpbImF4aW9zIiwiaGFuZGxlciIsInJlcSIsInJlcyIsIm1ldGhvZCIsInF1ZXJ5IiwiZG9tYWluIiwibGltaXQiLCJhZF9pbnRlZ3JhdGlvbiIsImFkX2J1ZGdldCIsInVzZXJfc2VnbWVudCIsImJvZHkiLCJzZXNzaW9uSWQiLCJoZWFkZXJzIiwicmVzcG9uc2UiLCJwb3N0Iiwic3RhdHVzIiwianNvbiIsImRhdGEiLCJlcnJvciIsImNvbnNvbGUiLCJtZXNzYWdlIiwicmVzdWx0cyIsImFkX2NhbXBhaWducyIsInRvdGFsX2FkcyIsInRvdGFsX29yZ2FuaWMiLCJhZF9yZXZlbnVlX2VzdGltYXRlIiwic2V0SGVhZGVyIiwiZW5kIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./pages/api/ad-campaigns.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/ad-campaigns.js"));
module.exports = __webpack_exports__;

})();