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
exports.id = "pages/api/user/recommendations";
exports.ids = ["pages/api/user/recommendations"];
exports.modules = {

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

module.exports = require("axios");

/***/ }),

/***/ "(api)/./pages/api/user/recommendations.js":
/*!*******************************************!*\
  !*** ./pages/api/user/recommendations.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ \"axios\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);\n\nasync function handler(req, res) {\n    if (req.method === \"GET\") {\n        try {\n            const token = req.headers.authorization;\n            if (!token) {\n                return res.status(401).json({\n                    success: false,\n                    message: \"Authorization token required\"\n                });\n            }\n            const { limit =20  } = req.query;\n            const response = await axios__WEBPACK_IMPORTED_MODULE_0___default().get(`http://127.0.0.1:8000/user/recommendations?limit=${limit}`, {\n                headers: {\n                    \"Authorization\": token\n                }\n            });\n            res.status(200).json(response.data);\n        } catch (error) {\n            console.error(\"User Recommendations API Error:\", error.message);\n            res.status(error.response?.status || 500).json({\n                success: false,\n                message: error.response?.data?.detail || \"Failed to fetch recommendations\"\n            });\n        }\n    } else {\n        res.setHeader(\"Allow\", [\n            \"GET\"\n        ]);\n        res.status(405).end(`Method ${req.method} Not Allowed`);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvdXNlci9yZWNvbW1lbmRhdGlvbnMuanMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQTBCO0FBRVgsZUFBZUMsT0FBTyxDQUFDQyxHQUFHLEVBQUVDLEdBQUcsRUFBRTtJQUM1QyxJQUFJRCxHQUFHLENBQUNFLE1BQU0sS0FBSyxLQUFLLEVBQUU7UUFDdEIsSUFBSTtZQUNBLE1BQU1DLEtBQUssR0FBR0gsR0FBRyxDQUFDSSxPQUFPLENBQUNDLGFBQWE7WUFDdkMsSUFBSSxDQUFDRixLQUFLLEVBQUU7Z0JBQ1IsT0FBT0YsR0FBRyxDQUFDSyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUNDLElBQUksQ0FBQztvQkFDeEJDLE9BQU8sRUFBRSxLQUFLO29CQUNkQyxPQUFPLEVBQUUsOEJBQThCO2lCQUMxQyxDQUFDLENBQUM7WUFDUCxDQUFDO1lBRUQsTUFBTSxFQUFFQyxLQUFLLEVBQUcsRUFBRSxHQUFFLEdBQUdWLEdBQUcsQ0FBQ1csS0FBSztZQUVoQyxNQUFNQyxRQUFRLEdBQUcsTUFBTWQsZ0RBQVMsQ0FBQyxDQUFDLGlEQUFpRCxFQUFFWSxLQUFLLENBQUMsQ0FBQyxFQUFFO2dCQUMxRk4sT0FBTyxFQUFFO29CQUNMLGVBQWUsRUFBRUQsS0FBSztpQkFDekI7YUFDSixDQUFDO1lBRUZGLEdBQUcsQ0FBQ0ssTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDQyxJQUFJLENBQUNLLFFBQVEsQ0FBQ0UsSUFBSSxDQUFDLENBQUM7UUFDeEMsRUFBRSxPQUFPQyxLQUFLLEVBQUU7WUFDWkMsT0FBTyxDQUFDRCxLQUFLLENBQUMsaUNBQWlDLEVBQUVBLEtBQUssQ0FBQ04sT0FBTyxDQUFDLENBQUM7WUFDaEVSLEdBQUcsQ0FBQ0ssTUFBTSxDQUFDUyxLQUFLLENBQUNILFFBQVEsRUFBRU4sTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDQyxJQUFJLENBQUM7Z0JBQzNDQyxPQUFPLEVBQUUsS0FBSztnQkFDZEMsT0FBTyxFQUFFTSxLQUFLLENBQUNILFFBQVEsRUFBRUUsSUFBSSxFQUFFRyxNQUFNLElBQUksaUNBQWlDO2FBQzdFLENBQUMsQ0FBQztRQUNQLENBQUM7SUFDTCxPQUFPO1FBQ0hoQixHQUFHLENBQUNpQixTQUFTLENBQUMsT0FBTyxFQUFFO1lBQUMsS0FBSztTQUFDLENBQUMsQ0FBQztRQUNoQ2pCLEdBQUcsQ0FBQ0ssTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDYSxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUVuQixHQUFHLENBQUNFLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBQzVELENBQUM7QUFDTCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmFzaGlvbi1zZWFyY2gtZnJvbnRlbmQvLi9wYWdlcy9hcGkvdXNlci9yZWNvbW1lbmRhdGlvbnMuanM/YmU0NSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgaWYgKHJlcS5tZXRob2QgPT09ICdHRVQnKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB0b2tlbiA9IHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb247XG4gICAgICAgICAgICBpZiAoIXRva2VuKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAxKS5qc29uKHsgXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLCBcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ0F1dGhvcml6YXRpb24gdG9rZW4gcmVxdWlyZWQnIFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB7IGxpbWl0ID0gMjAgfSA9IHJlcS5xdWVyeTtcblxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5nZXQoYGh0dHA6Ly8xMjcuMC4wLjE6ODAwMC91c2VyL3JlY29tbWVuZGF0aW9ucz9saW1pdD0ke2xpbWl0fWAsIHtcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICdBdXRob3JpemF0aW9uJzogdG9rZW5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24ocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdVc2VyIFJlY29tbWVuZGF0aW9ucyBBUEkgRXJyb3I6JywgZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICByZXMuc3RhdHVzKGVycm9yLnJlc3BvbnNlPy5zdGF0dXMgfHwgNTAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlcnJvci5yZXNwb25zZT8uZGF0YT8uZGV0YWlsIHx8ICdGYWlsZWQgdG8gZmV0Y2ggcmVjb21tZW5kYXRpb25zJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICByZXMuc2V0SGVhZGVyKCdBbGxvdycsIFsnR0VUJ10pO1xuICAgICAgICByZXMuc3RhdHVzKDQwNSkuZW5kKGBNZXRob2QgJHtyZXEubWV0aG9kfSBOb3QgQWxsb3dlZGApO1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6WyJheGlvcyIsImhhbmRsZXIiLCJyZXEiLCJyZXMiLCJtZXRob2QiLCJ0b2tlbiIsImhlYWRlcnMiLCJhdXRob3JpemF0aW9uIiwic3RhdHVzIiwianNvbiIsInN1Y2Nlc3MiLCJtZXNzYWdlIiwibGltaXQiLCJxdWVyeSIsInJlc3BvbnNlIiwiZ2V0IiwiZGF0YSIsImVycm9yIiwiY29uc29sZSIsImRldGFpbCIsInNldEhlYWRlciIsImVuZCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./pages/api/user/recommendations.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/user/recommendations.js"));
module.exports = __webpack_exports__;

})();