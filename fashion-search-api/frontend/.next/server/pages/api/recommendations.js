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
exports.id = "pages/api/recommendations";
exports.ids = ["pages/api/recommendations"];
exports.modules = {

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

module.exports = require("axios");

/***/ }),

/***/ "(api)/./pages/api/recommendations.js":
/*!**************************************!*\
  !*** ./pages/api/recommendations.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ \"axios\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);\n\nasync function handler(req, res) {\n    if (req.method === \"GET\") {\n        try {\n            const sessionId = req.headers[\"x-session-id\"];\n            if (!sessionId) {\n                return res.status(400).json({\n                    message: \"Session ID required\"\n                });\n            }\n            const { limit =20  } = req.query;\n            const response = await axios__WEBPACK_IMPORTED_MODULE_0___default().get(`http://127.0.0.1:8000/recommendations/recommendations?limit=${limit}`, {\n                headers: {\n                    \"X-Session-ID\": sessionId,\n                    \"Authorization\": req.headers.authorization\n                }\n            });\n            res.status(200).json(response.data);\n        } catch (error) {\n            console.error(\"Recommendations API Error:\", error.message);\n            res.status(error.response?.status || 500).json({\n                message: error.message,\n                error: error.response?.data\n            });\n        }\n    } else {\n        res.setHeader(\"Allow\", [\n            \"GET\"\n        ]);\n        res.status(405).end(`Method ${req.method} Not Allowed`);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvcmVjb21tZW5kYXRpb25zLmpzLmpzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUEwQjtBQUVYLGVBQWVDLE9BQU8sQ0FBQ0MsR0FBRyxFQUFFQyxHQUFHLEVBQUU7SUFDNUMsSUFBSUQsR0FBRyxDQUFDRSxNQUFNLEtBQUssS0FBSyxFQUFFO1FBQ3RCLElBQUk7WUFDQSxNQUFNQyxTQUFTLEdBQUdILEdBQUcsQ0FBQ0ksT0FBTyxDQUFDLGNBQWMsQ0FBQztZQUM3QyxJQUFJLENBQUNELFNBQVMsRUFBRTtnQkFDWixPQUFPRixHQUFHLENBQUNJLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQ0MsSUFBSSxDQUFDO29CQUFFQyxPQUFPLEVBQUUscUJBQXFCO2lCQUFFLENBQUMsQ0FBQztZQUNwRSxDQUFDO1lBRUQsTUFBTSxFQUFFQyxLQUFLLEVBQUcsRUFBRSxHQUFFLEdBQUdSLEdBQUcsQ0FBQ1MsS0FBSztZQUVoQyxNQUFNQyxRQUFRLEdBQUcsTUFBTVosZ0RBQVMsQ0FBQyxDQUFDLDREQUE0RCxFQUFFVSxLQUFLLENBQUMsQ0FBQyxFQUFFO2dCQUNyR0osT0FBTyxFQUFFO29CQUNMLGNBQWMsRUFBRUQsU0FBUztvQkFDekIsZUFBZSxFQUFFSCxHQUFHLENBQUNJLE9BQU8sQ0FBQ1EsYUFBYTtpQkFDN0M7YUFDSixDQUFDO1lBRUZYLEdBQUcsQ0FBQ0ksTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDQyxJQUFJLENBQUNJLFFBQVEsQ0FBQ0csSUFBSSxDQUFDLENBQUM7UUFDeEMsRUFBRSxPQUFPQyxLQUFLLEVBQUU7WUFDWkMsT0FBTyxDQUFDRCxLQUFLLENBQUMsNEJBQTRCLEVBQUVBLEtBQUssQ0FBQ1AsT0FBTyxDQUFDLENBQUM7WUFDM0ROLEdBQUcsQ0FBQ0ksTUFBTSxDQUFDUyxLQUFLLENBQUNKLFFBQVEsRUFBRUwsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDQyxJQUFJLENBQUM7Z0JBQzNDQyxPQUFPLEVBQUVPLEtBQUssQ0FBQ1AsT0FBTztnQkFDdEJPLEtBQUssRUFBRUEsS0FBSyxDQUFDSixRQUFRLEVBQUVHLElBQUk7YUFDOUIsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztJQUNMLE9BQU87UUFDSFosR0FBRyxDQUFDZSxTQUFTLENBQUMsT0FBTyxFQUFFO1lBQUMsS0FBSztTQUFDLENBQUMsQ0FBQztRQUNoQ2YsR0FBRyxDQUFDSSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUNZLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRWpCLEdBQUcsQ0FBQ0UsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFDNUQsQ0FBQztBQUNMLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mYXNoaW9uLXNlYXJjaC1mcm9udGVuZC8uL3BhZ2VzL2FwaS9yZWNvbW1lbmRhdGlvbnMuanM/OGMzMiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgaWYgKHJlcS5tZXRob2QgPT09ICdHRVQnKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBzZXNzaW9uSWQgPSByZXEuaGVhZGVyc1sneC1zZXNzaW9uLWlkJ107XG4gICAgICAgICAgICBpZiAoIXNlc3Npb25JZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbih7IG1lc3NhZ2U6ICdTZXNzaW9uIElEIHJlcXVpcmVkJyB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgeyBsaW1pdCA9IDIwIH0gPSByZXEucXVlcnk7XG5cbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3MuZ2V0KGBodHRwOi8vMTI3LjAuMC4xOjgwMDAvcmVjb21tZW5kYXRpb25zL3JlY29tbWVuZGF0aW9ucz9saW1pdD0ke2xpbWl0fWAsIHtcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICdYLVNlc3Npb24tSUQnOiBzZXNzaW9uSWQsXG4gICAgICAgICAgICAgICAgICAgICdBdXRob3JpemF0aW9uJzogcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbihyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1JlY29tbWVuZGF0aW9ucyBBUEkgRXJyb3I6JywgZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICByZXMuc3RhdHVzKGVycm9yLnJlc3BvbnNlPy5zdGF0dXMgfHwgNTAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlcnJvci5tZXNzYWdlLFxuICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvci5yZXNwb25zZT8uZGF0YVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICByZXMuc2V0SGVhZGVyKCdBbGxvdycsIFsnR0VUJ10pO1xuICAgICAgICByZXMuc3RhdHVzKDQwNSkuZW5kKGBNZXRob2QgJHtyZXEubWV0aG9kfSBOb3QgQWxsb3dlZGApO1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6WyJheGlvcyIsImhhbmRsZXIiLCJyZXEiLCJyZXMiLCJtZXRob2QiLCJzZXNzaW9uSWQiLCJoZWFkZXJzIiwic3RhdHVzIiwianNvbiIsIm1lc3NhZ2UiLCJsaW1pdCIsInF1ZXJ5IiwicmVzcG9uc2UiLCJnZXQiLCJhdXRob3JpemF0aW9uIiwiZGF0YSIsImVycm9yIiwiY29uc29sZSIsInNldEhlYWRlciIsImVuZCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./pages/api/recommendations.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/recommendations.js"));
module.exports = __webpack_exports__;

})();