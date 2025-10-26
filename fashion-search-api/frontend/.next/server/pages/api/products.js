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
exports.id = "pages/api/products";
exports.ids = ["pages/api/products"];
exports.modules = {

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

module.exports = require("axios");

/***/ }),

/***/ "(api)/./pages/api/products.js":
/*!*******************************!*\
  !*** ./pages/api/products.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ \"axios\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);\n\nasync function handler(req, res) {\n    if (req.method === \"GET\") {\n        try {\n            const { page =1 , limit =20 , search  } = req.query;\n            const sessionId = req.headers[\"x-session-id\"];\n            // Build query parameters\n            const params = new URLSearchParams({\n                page: page.toString(),\n                limit: limit.toString()\n            });\n            if (search) {\n                params.append(\"search\", search);\n            }\n            const response = await axios__WEBPACK_IMPORTED_MODULE_0___default().get(`http://127.0.0.1:8000/products/products?${params}`, {\n                headers: {\n                    \"X-Session-ID\": sessionId\n                }\n            });\n            res.status(200).json(response.data);\n        } catch (error) {\n            console.error(\"Products API Error:\", error.message);\n            console.error(\"Error details:\", error.response?.data);\n            res.status(error.response?.status || 500).json({\n                products: [],\n                pagination: {\n                    page: parseInt(req.query.page) || 1,\n                    limit: parseInt(req.query.limit) || 20,\n                    total: 0,\n                    total_pages: 0,\n                    has_next: false,\n                    has_prev: false\n                },\n                search_query: req.query.search || null,\n                domain: null,\n                error: error.message\n            });\n        }\n    } else {\n        res.setHeader(\"Allow\", [\n            \"GET\"\n        ]);\n        res.status(405).end(`Method ${req.method} Not Allowed`);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvcHJvZHVjdHMuanMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQTBCO0FBRVgsZUFBZUMsT0FBTyxDQUFDQyxHQUFHLEVBQUVDLEdBQUcsRUFBRTtJQUM1QyxJQUFJRCxHQUFHLENBQUNFLE1BQU0sS0FBSyxLQUFLLEVBQUU7UUFDdEIsSUFBSTtZQUNBLE1BQU0sRUFBRUMsSUFBSSxFQUFHLENBQUMsR0FBRUMsS0FBSyxFQUFHLEVBQUUsR0FBRUMsTUFBTSxHQUFFLEdBQUdMLEdBQUcsQ0FBQ00sS0FBSztZQUNsRCxNQUFNQyxTQUFTLEdBQUdQLEdBQUcsQ0FBQ1EsT0FBTyxDQUFDLGNBQWMsQ0FBQztZQUU3Qyx5QkFBeUI7WUFDekIsTUFBTUMsTUFBTSxHQUFHLElBQUlDLGVBQWUsQ0FBQztnQkFDL0JQLElBQUksRUFBRUEsSUFBSSxDQUFDUSxRQUFRLEVBQUU7Z0JBQ3JCUCxLQUFLLEVBQUVBLEtBQUssQ0FBQ08sUUFBUSxFQUFFO2FBQzFCLENBQUM7WUFFRixJQUFJTixNQUFNLEVBQUU7Z0JBQ1JJLE1BQU0sQ0FBQ0csTUFBTSxDQUFDLFFBQVEsRUFBRVAsTUFBTSxDQUFDLENBQUM7WUFDcEMsQ0FBQztZQUVELE1BQU1RLFFBQVEsR0FBRyxNQUFNZixnREFBUyxDQUFDLENBQUMsd0NBQXdDLEVBQUVXLE1BQU0sQ0FBQyxDQUFDLEVBQUU7Z0JBQ2xGRCxPQUFPLEVBQUU7b0JBQ0wsY0FBYyxFQUFFRCxTQUFTO2lCQUM1QjthQUNKLENBQUM7WUFFRk4sR0FBRyxDQUFDYyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUNDLElBQUksQ0FBQ0gsUUFBUSxDQUFDSSxJQUFJLENBQUMsQ0FBQztRQUN4QyxFQUFFLE9BQU9DLEtBQUssRUFBRTtZQUNaQyxPQUFPLENBQUNELEtBQUssQ0FBQyxxQkFBcUIsRUFBRUEsS0FBSyxDQUFDRSxPQUFPLENBQUMsQ0FBQztZQUNwREQsT0FBTyxDQUFDRCxLQUFLLENBQUMsZ0JBQWdCLEVBQUVBLEtBQUssQ0FBQ0wsUUFBUSxFQUFFSSxJQUFJLENBQUMsQ0FBQztZQUV0RGhCLEdBQUcsQ0FBQ2MsTUFBTSxDQUFDRyxLQUFLLENBQUNMLFFBQVEsRUFBRUUsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDQyxJQUFJLENBQUM7Z0JBQzNDSyxRQUFRLEVBQUUsRUFBRTtnQkFDWkMsVUFBVSxFQUFFO29CQUNSbkIsSUFBSSxFQUFFb0IsUUFBUSxDQUFDdkIsR0FBRyxDQUFDTSxLQUFLLENBQUNILElBQUksQ0FBQyxJQUFJLENBQUM7b0JBQ25DQyxLQUFLLEVBQUVtQixRQUFRLENBQUN2QixHQUFHLENBQUNNLEtBQUssQ0FBQ0YsS0FBSyxDQUFDLElBQUksRUFBRTtvQkFDdENvQixLQUFLLEVBQUUsQ0FBQztvQkFDUkMsV0FBVyxFQUFFLENBQUM7b0JBQ2RDLFFBQVEsRUFBRSxLQUFLO29CQUNmQyxRQUFRLEVBQUUsS0FBSztpQkFDbEI7Z0JBQ0RDLFlBQVksRUFBRTVCLEdBQUcsQ0FBQ00sS0FBSyxDQUFDRCxNQUFNLElBQUksSUFBSTtnQkFDdEN3QixNQUFNLEVBQUUsSUFBSTtnQkFDWlgsS0FBSyxFQUFFQSxLQUFLLENBQUNFLE9BQU87YUFDdkIsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztJQUNMLE9BQU87UUFDSG5CLEdBQUcsQ0FBQzZCLFNBQVMsQ0FBQyxPQUFPLEVBQUU7WUFBQyxLQUFLO1NBQUMsQ0FBQyxDQUFDO1FBQ2hDN0IsR0FBRyxDQUFDYyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUNnQixHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUvQixHQUFHLENBQUNFLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBQzVELENBQUM7QUFDTCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmFzaGlvbi1zZWFyY2gtZnJvbnRlbmQvLi9wYWdlcy9hcGkvcHJvZHVjdHMuanM/NDljYiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgaWYgKHJlcS5tZXRob2QgPT09ICdHRVQnKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHBhZ2UgPSAxLCBsaW1pdCA9IDIwLCBzZWFyY2ggfSA9IHJlcS5xdWVyeTtcbiAgICAgICAgICAgIGNvbnN0IHNlc3Npb25JZCA9IHJlcS5oZWFkZXJzWyd4LXNlc3Npb24taWQnXTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gQnVpbGQgcXVlcnkgcGFyYW1ldGVyc1xuICAgICAgICAgICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh7XG4gICAgICAgICAgICAgICAgcGFnZTogcGFnZS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgIGxpbWl0OiBsaW1pdC50b1N0cmluZygpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHNlYXJjaCkge1xuICAgICAgICAgICAgICAgIHBhcmFtcy5hcHBlbmQoJ3NlYXJjaCcsIHNlYXJjaCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3MuZ2V0KGBodHRwOi8vMTI3LjAuMC4xOjgwMDAvcHJvZHVjdHMvcHJvZHVjdHM/JHtwYXJhbXN9YCwge1xuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ1gtU2Vzc2lvbi1JRCc6IHNlc3Npb25JZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbihyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1Byb2R1Y3RzIEFQSSBFcnJvcjonLCBlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGRldGFpbHM6JywgZXJyb3IucmVzcG9uc2U/LmRhdGEpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXMuc3RhdHVzKGVycm9yLnJlc3BvbnNlPy5zdGF0dXMgfHwgNTAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICBwcm9kdWN0czogW10sXG4gICAgICAgICAgICAgICAgcGFnaW5hdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICBwYWdlOiBwYXJzZUludChyZXEucXVlcnkucGFnZSkgfHwgMSxcbiAgICAgICAgICAgICAgICAgICAgbGltaXQ6IHBhcnNlSW50KHJlcS5xdWVyeS5saW1pdCkgfHwgMjAsXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsOiAwLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbF9wYWdlczogMCxcbiAgICAgICAgICAgICAgICAgICAgaGFzX25leHQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBoYXNfcHJldjogZmFsc2VcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNlYXJjaF9xdWVyeTogcmVxLnF1ZXJ5LnNlYXJjaCB8fCBudWxsLFxuICAgICAgICAgICAgICAgIGRvbWFpbjogbnVsbCxcbiAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3IubWVzc2FnZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICByZXMuc2V0SGVhZGVyKCdBbGxvdycsIFsnR0VUJ10pO1xuICAgICAgICByZXMuc3RhdHVzKDQwNSkuZW5kKGBNZXRob2QgJHtyZXEubWV0aG9kfSBOb3QgQWxsb3dlZGApO1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6WyJheGlvcyIsImhhbmRsZXIiLCJyZXEiLCJyZXMiLCJtZXRob2QiLCJwYWdlIiwibGltaXQiLCJzZWFyY2giLCJxdWVyeSIsInNlc3Npb25JZCIsImhlYWRlcnMiLCJwYXJhbXMiLCJVUkxTZWFyY2hQYXJhbXMiLCJ0b1N0cmluZyIsImFwcGVuZCIsInJlc3BvbnNlIiwiZ2V0Iiwic3RhdHVzIiwianNvbiIsImRhdGEiLCJlcnJvciIsImNvbnNvbGUiLCJtZXNzYWdlIiwicHJvZHVjdHMiLCJwYWdpbmF0aW9uIiwicGFyc2VJbnQiLCJ0b3RhbCIsInRvdGFsX3BhZ2VzIiwiaGFzX25leHQiLCJoYXNfcHJldiIsInNlYXJjaF9xdWVyeSIsImRvbWFpbiIsInNldEhlYWRlciIsImVuZCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./pages/api/products.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/products.js"));
module.exports = __webpack_exports__;

})();