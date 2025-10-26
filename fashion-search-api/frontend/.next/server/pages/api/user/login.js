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
exports.id = "pages/api/user/login";
exports.ids = ["pages/api/user/login"];
exports.modules = {

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

module.exports = require("axios");

/***/ }),

/***/ "(api)/./pages/api/user/login.js":
/*!*********************************!*\
  !*** ./pages/api/user/login.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ \"axios\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);\n\nasync function handler(req, res) {\n    if (req.method === \"POST\") {\n        try {\n            const { email , password  } = req.body;\n            if (!email || !password) {\n                return res.status(400).json({\n                    success: false,\n                    message: \"Email and password are required\"\n                });\n            }\n            const response = await axios__WEBPACK_IMPORTED_MODULE_0___default().post(\"http://127.0.0.1:8000/user/login\", {\n                email,\n                password\n            });\n            res.status(200).json(response.data);\n        } catch (error) {\n            console.error(\"Login API Error:\", error.message);\n            res.status(error.response?.status || 500).json({\n                success: false,\n                message: error.response?.data?.detail || \"Login failed\"\n            });\n        }\n    } else {\n        res.setHeader(\"Allow\", [\n            \"POST\"\n        ]);\n        res.status(405).end(`Method ${req.method} Not Allowed`);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvdXNlci9sb2dpbi5qcy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBMEI7QUFFWCxlQUFlQyxPQUFPLENBQUNDLEdBQUcsRUFBRUMsR0FBRyxFQUFFO0lBQzVDLElBQUlELEdBQUcsQ0FBQ0UsTUFBTSxLQUFLLE1BQU0sRUFBRTtRQUN2QixJQUFJO1lBQ0EsTUFBTSxFQUFFQyxLQUFLLEdBQUVDLFFBQVEsR0FBRSxHQUFHSixHQUFHLENBQUNLLElBQUk7WUFFcEMsSUFBSSxDQUFDRixLQUFLLElBQUksQ0FBQ0MsUUFBUSxFQUFFO2dCQUNyQixPQUFPSCxHQUFHLENBQUNLLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQ0MsSUFBSSxDQUFDO29CQUN4QkMsT0FBTyxFQUFFLEtBQUs7b0JBQ2RDLE9BQU8sRUFBRSxpQ0FBaUM7aUJBQzdDLENBQUMsQ0FBQztZQUNQLENBQUM7WUFFRCxNQUFNQyxRQUFRLEdBQUcsTUFBTVosaURBQVUsQ0FBQyxrQ0FBa0MsRUFBRTtnQkFDbEVLLEtBQUs7Z0JBQ0xDLFFBQVE7YUFDWCxDQUFDO1lBRUZILEdBQUcsQ0FBQ0ssTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDQyxJQUFJLENBQUNHLFFBQVEsQ0FBQ0UsSUFBSSxDQUFDLENBQUM7UUFDeEMsRUFBRSxPQUFPQyxLQUFLLEVBQUU7WUFDWkMsT0FBTyxDQUFDRCxLQUFLLENBQUMsa0JBQWtCLEVBQUVBLEtBQUssQ0FBQ0osT0FBTyxDQUFDLENBQUM7WUFDakRSLEdBQUcsQ0FBQ0ssTUFBTSxDQUFDTyxLQUFLLENBQUNILFFBQVEsRUFBRUosTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDQyxJQUFJLENBQUM7Z0JBQzNDQyxPQUFPLEVBQUUsS0FBSztnQkFDZEMsT0FBTyxFQUFFSSxLQUFLLENBQUNILFFBQVEsRUFBRUUsSUFBSSxFQUFFRyxNQUFNLElBQUksY0FBYzthQUMxRCxDQUFDLENBQUM7UUFDUCxDQUFDO0lBQ0wsT0FBTztRQUNIZCxHQUFHLENBQUNlLFNBQVMsQ0FBQyxPQUFPLEVBQUU7WUFBQyxNQUFNO1NBQUMsQ0FBQyxDQUFDO1FBQ2pDZixHQUFHLENBQUNLLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQ1csR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFakIsR0FBRyxDQUFDRSxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUM1RCxDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2Zhc2hpb24tc2VhcmNoLWZyb250ZW5kLy4vcGFnZXMvYXBpL3VzZXIvbG9naW4uanM/ZThhNyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgaWYgKHJlcS5tZXRob2QgPT09ICdQT1NUJykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBlbWFpbCwgcGFzc3dvcmQgfSA9IHJlcS5ib2R5O1xuXG4gICAgICAgICAgICBpZiAoIWVtYWlsIHx8ICFwYXNzd29yZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbih7IFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSwgXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdFbWFpbCBhbmQgcGFzc3dvcmQgYXJlIHJlcXVpcmVkJyBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5wb3N0KCdodHRwOi8vMTI3LjAuMC4xOjgwMDAvdXNlci9sb2dpbicsIHtcbiAgICAgICAgICAgICAgICBlbWFpbCxcbiAgICAgICAgICAgICAgICBwYXNzd29yZFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignTG9naW4gQVBJIEVycm9yOicsIGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgcmVzLnN0YXR1cyhlcnJvci5yZXNwb25zZT8uc3RhdHVzIHx8IDUwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZXJyb3IucmVzcG9uc2U/LmRhdGE/LmRldGFpbCB8fCAnTG9naW4gZmFpbGVkJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICByZXMuc2V0SGVhZGVyKCdBbGxvdycsIFsnUE9TVCddKTtcbiAgICAgICAgcmVzLnN0YXR1cyg0MDUpLmVuZChgTWV0aG9kICR7cmVxLm1ldGhvZH0gTm90IEFsbG93ZWRgKTtcbiAgICB9XG59XG4iXSwibmFtZXMiOlsiYXhpb3MiLCJoYW5kbGVyIiwicmVxIiwicmVzIiwibWV0aG9kIiwiZW1haWwiLCJwYXNzd29yZCIsImJvZHkiLCJzdGF0dXMiLCJqc29uIiwic3VjY2VzcyIsIm1lc3NhZ2UiLCJyZXNwb25zZSIsInBvc3QiLCJkYXRhIiwiZXJyb3IiLCJjb25zb2xlIiwiZGV0YWlsIiwic2V0SGVhZGVyIiwiZW5kIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./pages/api/user/login.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/user/login.js"));
module.exports = __webpack_exports__;

})();