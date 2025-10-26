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
exports.id = "pages/api/auth/session";
exports.ids = ["pages/api/auth/session"];
exports.modules = {

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

module.exports = require("axios");

/***/ }),

/***/ "(api)/./pages/api/auth/session.js":
/*!***********************************!*\
  !*** ./pages/api/auth/session.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ \"axios\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);\n\nasync function handler(req, res) {\n    if (req.method === \"POST\") {\n        try {\n            const response = await axios__WEBPACK_IMPORTED_MODULE_0___default().post(\"http://127.0.0.1:8000/auth/session\", {\n                session_id: req.body.session_id\n            });\n            res.status(200).json(response.data);\n        } catch (error) {\n            console.error(\"Session Error:\", error.message);\n            res.status(error.response?.status || 500).json({\n                message: error.message,\n                error: \"Session creation failed\"\n            });\n        }\n    } else {\n        res.setHeader(\"Allow\", [\n            \"POST\"\n        ]);\n        res.status(405).end(`Method ${req.method} Not Allowed`);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvYXV0aC9zZXNzaW9uLmpzLmpzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUEwQjtBQUVYLGVBQWVDLE9BQU8sQ0FBQ0MsR0FBRyxFQUFFQyxHQUFHLEVBQUU7SUFDNUMsSUFBSUQsR0FBRyxDQUFDRSxNQUFNLEtBQUssTUFBTSxFQUFFO1FBQ3ZCLElBQUk7WUFDQSxNQUFNQyxRQUFRLEdBQUcsTUFBTUwsaURBQVUsQ0FBQyxvQ0FBb0MsRUFBRTtnQkFDcEVPLFVBQVUsRUFBRUwsR0FBRyxDQUFDTSxJQUFJLENBQUNELFVBQVU7YUFDbEMsQ0FBQztZQUNGSixHQUFHLENBQUNNLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQ0MsSUFBSSxDQUFDTCxRQUFRLENBQUNNLElBQUksQ0FBQyxDQUFDO1FBQ3hDLEVBQUUsT0FBT0MsS0FBSyxFQUFFO1lBQ1pDLE9BQU8sQ0FBQ0QsS0FBSyxDQUFDLGdCQUFnQixFQUFFQSxLQUFLLENBQUNFLE9BQU8sQ0FBQyxDQUFDO1lBQy9DWCxHQUFHLENBQUNNLE1BQU0sQ0FBQ0csS0FBSyxDQUFDUCxRQUFRLEVBQUVJLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQ0MsSUFBSSxDQUFDO2dCQUMzQ0ksT0FBTyxFQUFFRixLQUFLLENBQUNFLE9BQU87Z0JBQ3RCRixLQUFLLEVBQUUseUJBQXlCO2FBQ25DLENBQUMsQ0FBQztRQUNQLENBQUM7SUFDTCxPQUFPO1FBQ0hULEdBQUcsQ0FBQ1ksU0FBUyxDQUFDLE9BQU8sRUFBRTtZQUFDLE1BQU07U0FBQyxDQUFDLENBQUM7UUFDakNaLEdBQUcsQ0FBQ00sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDTyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUVkLEdBQUcsQ0FBQ0UsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFDNUQsQ0FBQztBQUNMLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mYXNoaW9uLXNlYXJjaC1mcm9udGVuZC8uL3BhZ2VzL2FwaS9hdXRoL3Nlc3Npb24uanM/NjBhNiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgaWYgKHJlcS5tZXRob2QgPT09ICdQT1NUJykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5wb3N0KCdodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXV0aC9zZXNzaW9uJywge1xuICAgICAgICAgICAgICAgIHNlc3Npb25faWQ6IHJlcS5ib2R5LnNlc3Npb25faWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24ocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdTZXNzaW9uIEVycm9yOicsIGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgcmVzLnN0YXR1cyhlcnJvci5yZXNwb25zZT8uc3RhdHVzIHx8IDUwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZXJyb3IubWVzc2FnZSxcbiAgICAgICAgICAgICAgICBlcnJvcjogJ1Nlc3Npb24gY3JlYXRpb24gZmFpbGVkJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICByZXMuc2V0SGVhZGVyKCdBbGxvdycsIFsnUE9TVCddKTtcbiAgICAgICAgcmVzLnN0YXR1cyg0MDUpLmVuZChgTWV0aG9kICR7cmVxLm1ldGhvZH0gTm90IEFsbG93ZWRgKTtcbiAgICB9XG59XG4iXSwibmFtZXMiOlsiYXhpb3MiLCJoYW5kbGVyIiwicmVxIiwicmVzIiwibWV0aG9kIiwicmVzcG9uc2UiLCJwb3N0Iiwic2Vzc2lvbl9pZCIsImJvZHkiLCJzdGF0dXMiLCJqc29uIiwiZGF0YSIsImVycm9yIiwiY29uc29sZSIsIm1lc3NhZ2UiLCJzZXRIZWFkZXIiLCJlbmQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./pages/api/auth/session.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/auth/session.js"));
module.exports = __webpack_exports__;

})();