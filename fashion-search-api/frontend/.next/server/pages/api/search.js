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
exports.id = "pages/api/search";
exports.ids = ["pages/api/search"];
exports.modules = {

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

module.exports = require("axios");

/***/ }),

/***/ "(api)/./pages/api/search.js":
/*!*****************************!*\
  !*** ./pages/api/search.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ \"axios\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);\n\nasync function handler(req, res) {\n    if (req.method === \"POST\") {\n        try {\n            const sessionId = req.headers[\"x-session-id\"];\n            if (!sessionId) {\n                return res.status(401).json({\n                    message: \"Session ID required\",\n                    results: []\n                });\n            }\n            const response = await axios__WEBPACK_IMPORTED_MODULE_0___default().post(\"http://127.0.0.1:8000/search/search\", {\n                query: req.body.query\n            }, {\n                headers: {\n                    \"X-Session-ID\": sessionId\n                }\n            });\n            res.status(200).json(response.data);\n        } catch (error) {\n            console.error(\"API Error:\", error.message);\n            res.status(error.response?.status || 500).json({\n                message: error.message,\n                results: []\n            });\n        }\n    } else {\n        res.setHeader(\"Allow\", [\n            \"POST\"\n        ]);\n        res.status(405).end(`Method ${req.method} Not Allowed`);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvc2VhcmNoLmpzLmpzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUEwQjtBQUVYLGVBQWVDLE9BQU8sQ0FBQ0MsR0FBRyxFQUFFQyxHQUFHLEVBQUU7SUFDNUMsSUFBSUQsR0FBRyxDQUFDRSxNQUFNLEtBQUssTUFBTSxFQUFFO1FBQ3ZCLElBQUk7WUFDQSxNQUFNQyxTQUFTLEdBQUdILEdBQUcsQ0FBQ0ksT0FBTyxDQUFDLGNBQWMsQ0FBQztZQUM3QyxJQUFJLENBQUNELFNBQVMsRUFBRTtnQkFDWixPQUFPRixHQUFHLENBQUNJLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQ0MsSUFBSSxDQUFDO29CQUN4QkMsT0FBTyxFQUFFLHFCQUFxQjtvQkFDOUJDLE9BQU8sRUFBRSxFQUFFO2lCQUNkLENBQUMsQ0FBQztZQUNQLENBQUM7WUFFRCxNQUFNQyxRQUFRLEdBQUcsTUFBTVgsaURBQVUsQ0FBQyxxQ0FBcUMsRUFBRTtnQkFDckVhLEtBQUssRUFBRVgsR0FBRyxDQUFDWSxJQUFJLENBQUNELEtBQUs7YUFDeEIsRUFBRTtnQkFDQ1AsT0FBTyxFQUFFO29CQUNMLGNBQWMsRUFBRUQsU0FBUztpQkFDNUI7YUFDSixDQUFDO1lBQ0ZGLEdBQUcsQ0FBQ0ksTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDQyxJQUFJLENBQUNHLFFBQVEsQ0FBQ0ksSUFBSSxDQUFDLENBQUM7UUFDeEMsRUFBRSxPQUFPQyxLQUFLLEVBQUU7WUFDWkMsT0FBTyxDQUFDRCxLQUFLLENBQUMsWUFBWSxFQUFFQSxLQUFLLENBQUNQLE9BQU8sQ0FBQyxDQUFDO1lBQzNDTixHQUFHLENBQUNJLE1BQU0sQ0FBQ1MsS0FBSyxDQUFDTCxRQUFRLEVBQUVKLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQ0MsSUFBSSxDQUFDO2dCQUMzQ0MsT0FBTyxFQUFFTyxLQUFLLENBQUNQLE9BQU87Z0JBQ3RCQyxPQUFPLEVBQUUsRUFBRTthQUNkLENBQUMsQ0FBQztRQUNQLENBQUM7SUFDTCxPQUFPO1FBQ0hQLEdBQUcsQ0FBQ2UsU0FBUyxDQUFDLE9BQU8sRUFBRTtZQUFDLE1BQU07U0FBQyxDQUFDLENBQUM7UUFDakNmLEdBQUcsQ0FBQ0ksTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDWSxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUVqQixHQUFHLENBQUNFLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBQzVELENBQUM7QUFDTCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmFzaGlvbi1zZWFyY2gtZnJvbnRlbmQvLi9wYWdlcy9hcGkvc2VhcmNoLmpzPzVkM2EiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihyZXEsIHJlcykge1xuICAgIGlmIChyZXEubWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHNlc3Npb25JZCA9IHJlcS5oZWFkZXJzWyd4LXNlc3Npb24taWQnXTtcbiAgICAgICAgICAgIGlmICghc2Vzc2lvbklkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAxKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1Nlc3Npb24gSUQgcmVxdWlyZWQnLFxuICAgICAgICAgICAgICAgICAgICByZXN1bHRzOiBbXVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGF4aW9zLnBvc3QoJ2h0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zZWFyY2gvc2VhcmNoJywge1xuICAgICAgICAgICAgICAgIHF1ZXJ5OiByZXEuYm9keS5xdWVyeVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ1gtU2Vzc2lvbi1JRCc6IHNlc3Npb25JZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24ocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdBUEkgRXJyb3I6JywgZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICByZXMuc3RhdHVzKGVycm9yLnJlc3BvbnNlPy5zdGF0dXMgfHwgNTAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlcnJvci5tZXNzYWdlLFxuICAgICAgICAgICAgICAgIHJlc3VsdHM6IFtdXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcy5zZXRIZWFkZXIoJ0FsbG93JywgWydQT1NUJ10pO1xuICAgICAgICByZXMuc3RhdHVzKDQwNSkuZW5kKGBNZXRob2QgJHtyZXEubWV0aG9kfSBOb3QgQWxsb3dlZGApO1xuICAgIH1cbn0iXSwibmFtZXMiOlsiYXhpb3MiLCJoYW5kbGVyIiwicmVxIiwicmVzIiwibWV0aG9kIiwic2Vzc2lvbklkIiwiaGVhZGVycyIsInN0YXR1cyIsImpzb24iLCJtZXNzYWdlIiwicmVzdWx0cyIsInJlc3BvbnNlIiwicG9zdCIsInF1ZXJ5IiwiYm9keSIsImRhdGEiLCJlcnJvciIsImNvbnNvbGUiLCJzZXRIZWFkZXIiLCJlbmQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./pages/api/search.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/search.js"));
module.exports = __webpack_exports__;

})();