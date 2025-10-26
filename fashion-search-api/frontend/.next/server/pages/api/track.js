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
exports.id = "pages/api/track";
exports.ids = ["pages/api/track"];
exports.modules = {

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

module.exports = require("axios");

/***/ }),

/***/ "(api)/./pages/api/track.js":
/*!****************************!*\
  !*** ./pages/api/track.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ \"axios\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);\n\nasync function handler(req, res) {\n    if (req.method === \"POST\") {\n        try {\n            const sessionId = req.headers[\"x-session-id\"];\n            if (!sessionId) {\n                return res.status(400).json({\n                    message: \"Session ID required\"\n                });\n            }\n            const { action , productId  } = req.body;\n            if (!action || !productId) {\n                return res.status(400).json({\n                    message: \"Action and productId required\"\n                });\n            }\n            const endpoint = action === \"view\" ? \"track/view\" : \"track/click\";\n            const response = await axios__WEBPACK_IMPORTED_MODULE_0___default().post(`http://127.0.0.1:8000/recommendations/${endpoint}`, {\n                product_id: productId\n            }, {\n                headers: {\n                    \"X-Session-ID\": sessionId,\n                    \"Authorization\": req.headers.authorization,\n                    \"Content-Type\": \"application/json\"\n                }\n            });\n            res.status(200).json(response.data);\n        } catch (error) {\n            console.error(\"Tracking API Error:\", error.message);\n            res.status(error.response?.status || 500).json({\n                message: error.message,\n                error: error.response?.data\n            });\n        }\n    } else {\n        res.setHeader(\"Allow\", [\n            \"POST\"\n        ]);\n        res.status(405).end(`Method ${req.method} Not Allowed`);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvdHJhY2suanMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQTBCO0FBRVgsZUFBZUMsT0FBTyxDQUFDQyxHQUFHLEVBQUVDLEdBQUcsRUFBRTtJQUM1QyxJQUFJRCxHQUFHLENBQUNFLE1BQU0sS0FBSyxNQUFNLEVBQUU7UUFDdkIsSUFBSTtZQUNBLE1BQU1DLFNBQVMsR0FBR0gsR0FBRyxDQUFDSSxPQUFPLENBQUMsY0FBYyxDQUFDO1lBQzdDLElBQUksQ0FBQ0QsU0FBUyxFQUFFO2dCQUNaLE9BQU9GLEdBQUcsQ0FBQ0ksTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDQyxJQUFJLENBQUM7b0JBQUVDLE9BQU8sRUFBRSxxQkFBcUI7aUJBQUUsQ0FBQyxDQUFDO1lBQ3BFLENBQUM7WUFFRCxNQUFNLEVBQUVDLE1BQU0sR0FBRUMsU0FBUyxHQUFFLEdBQUdULEdBQUcsQ0FBQ1UsSUFBSTtZQUN0QyxJQUFJLENBQUNGLE1BQU0sSUFBSSxDQUFDQyxTQUFTLEVBQUU7Z0JBQ3ZCLE9BQU9SLEdBQUcsQ0FBQ0ksTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDQyxJQUFJLENBQUM7b0JBQUVDLE9BQU8sRUFBRSwrQkFBK0I7aUJBQUUsQ0FBQyxDQUFDO1lBQzlFLENBQUM7WUFFRCxNQUFNSSxRQUFRLEdBQUdILE1BQU0sS0FBSyxNQUFNLEdBQUcsWUFBWSxHQUFHLGFBQWE7WUFFakUsTUFBTUksUUFBUSxHQUFHLE1BQU1kLGlEQUFVLENBQUMsQ0FBQyxzQ0FBc0MsRUFBRWEsUUFBUSxDQUFDLENBQUMsRUFBRTtnQkFDbkZHLFVBQVUsRUFBRUwsU0FBUzthQUN4QixFQUFFO2dCQUNDTCxPQUFPLEVBQUU7b0JBQ0wsY0FBYyxFQUFFRCxTQUFTO29CQUN6QixlQUFlLEVBQUVILEdBQUcsQ0FBQ0ksT0FBTyxDQUFDVyxhQUFhO29CQUMxQyxjQUFjLEVBQUUsa0JBQWtCO2lCQUNyQzthQUNKLENBQUM7WUFFRmQsR0FBRyxDQUFDSSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUNDLElBQUksQ0FBQ00sUUFBUSxDQUFDSSxJQUFJLENBQUMsQ0FBQztRQUN4QyxFQUFFLE9BQU9DLEtBQUssRUFBRTtZQUNaQyxPQUFPLENBQUNELEtBQUssQ0FBQyxxQkFBcUIsRUFBRUEsS0FBSyxDQUFDVixPQUFPLENBQUMsQ0FBQztZQUNwRE4sR0FBRyxDQUFDSSxNQUFNLENBQUNZLEtBQUssQ0FBQ0wsUUFBUSxFQUFFUCxNQUFNLElBQUksR0FBRyxDQUFDLENBQUNDLElBQUksQ0FBQztnQkFDM0NDLE9BQU8sRUFBRVUsS0FBSyxDQUFDVixPQUFPO2dCQUN0QlUsS0FBSyxFQUFFQSxLQUFLLENBQUNMLFFBQVEsRUFBRUksSUFBSTthQUM5QixDQUFDLENBQUM7UUFDUCxDQUFDO0lBQ0wsT0FBTztRQUNIZixHQUFHLENBQUNrQixTQUFTLENBQUMsT0FBTyxFQUFFO1lBQUMsTUFBTTtTQUFDLENBQUMsQ0FBQztRQUNqQ2xCLEdBQUcsQ0FBQ0ksTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDZSxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUVwQixHQUFHLENBQUNFLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBQzVELENBQUM7QUFDTCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmFzaGlvbi1zZWFyY2gtZnJvbnRlbmQvLi9wYWdlcy9hcGkvdHJhY2suanM/ZTc2NyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgaWYgKHJlcS5tZXRob2QgPT09ICdQT1NUJykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qgc2Vzc2lvbklkID0gcmVxLmhlYWRlcnNbJ3gtc2Vzc2lvbi1pZCddO1xuICAgICAgICAgICAgaWYgKCFzZXNzaW9uSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oeyBtZXNzYWdlOiAnU2Vzc2lvbiBJRCByZXF1aXJlZCcgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHsgYWN0aW9uLCBwcm9kdWN0SWQgfSA9IHJlcS5ib2R5O1xuICAgICAgICAgICAgaWYgKCFhY3Rpb24gfHwgIXByb2R1Y3RJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbih7IG1lc3NhZ2U6ICdBY3Rpb24gYW5kIHByb2R1Y3RJZCByZXF1aXJlZCcgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGVuZHBvaW50ID0gYWN0aW9uID09PSAndmlldycgPyAndHJhY2svdmlldycgOiAndHJhY2svY2xpY2snO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGF4aW9zLnBvc3QoYGh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9yZWNvbW1lbmRhdGlvbnMvJHtlbmRwb2ludH1gLCB7XG4gICAgICAgICAgICAgICAgcHJvZHVjdF9pZDogcHJvZHVjdElkXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAnWC1TZXNzaW9uLUlEJzogc2Vzc2lvbklkLFxuICAgICAgICAgICAgICAgICAgICAnQXV0aG9yaXphdGlvbic6IHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24sXG4gICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24ocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdUcmFja2luZyBBUEkgRXJyb3I6JywgZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICByZXMuc3RhdHVzKGVycm9yLnJlc3BvbnNlPy5zdGF0dXMgfHwgNTAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlcnJvci5tZXNzYWdlLFxuICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvci5yZXNwb25zZT8uZGF0YVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICByZXMuc2V0SGVhZGVyKCdBbGxvdycsIFsnUE9TVCddKTtcbiAgICAgICAgcmVzLnN0YXR1cyg0MDUpLmVuZChgTWV0aG9kICR7cmVxLm1ldGhvZH0gTm90IEFsbG93ZWRgKTtcbiAgICB9XG59XG4iXSwibmFtZXMiOlsiYXhpb3MiLCJoYW5kbGVyIiwicmVxIiwicmVzIiwibWV0aG9kIiwic2Vzc2lvbklkIiwiaGVhZGVycyIsInN0YXR1cyIsImpzb24iLCJtZXNzYWdlIiwiYWN0aW9uIiwicHJvZHVjdElkIiwiYm9keSIsImVuZHBvaW50IiwicmVzcG9uc2UiLCJwb3N0IiwicHJvZHVjdF9pZCIsImF1dGhvcml6YXRpb24iLCJkYXRhIiwiZXJyb3IiLCJjb25zb2xlIiwic2V0SGVhZGVyIiwiZW5kIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./pages/api/track.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/track.js"));
module.exports = __webpack_exports__;

})();