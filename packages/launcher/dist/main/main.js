module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var filename = require("path").join(__dirname, "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		require("fs").readFile(filename, "utf-8", function(err, content) {
/******/ 			if (err) {
/******/ 				if (__webpack_require__.onError) return __webpack_require__.oe(err);
/******/ 				else throw err;
/******/ 			}
/******/ 			var chunk = {};
/******/ 			require("vm").runInThisContext(
/******/ 				"(function(exports) {" + content + "\n})",
/******/ 				{ filename: filename }
/******/ 			)(chunk);
/******/ 			hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		var filename = require("path").join(__dirname, "" + hotCurrentHash + ".hot-update.json");
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			require("fs").readFile(filename, "utf-8", function(err, content) {
/******/ 				if (err) return resolve();
/******/ 				try {
/******/ 					var update = JSON.parse(content);
/******/ 				} catch (e) {
/******/ 					return reject(e);
/******/ 				}
/******/ 				resolve(update);
/******/ 			});
/******/ 		});
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "4a60178299787549f8ff"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) me.children.push(request);
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (typeof dep === "undefined") hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (typeof dep === "undefined") hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle")
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			{
/******/ 				// eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js":
/*!*************************************************************************!*\
  !*** ./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n__webpack_require__(/*! source-map-support/source-map-support.js */ \"source-map-support/source-map-support.js\").install();\n\nconst socketPath = process.env.ELECTRON_HMR_SOCKET_PATH;\n\nif (socketPath == null) {\n  throw new Error(`[HMR] Env ELECTRON_HMR_SOCKET_PATH is not set`);\n} // module, but not relative path must be used (because this file is used as entry)\n\n\nconst HmrClient = __webpack_require__(/*! electron-webpack/out/electron-main-hmr/HmrClient */ \"electron-webpack/out/electron-main-hmr/HmrClient\").HmrClient; // tslint:disable:no-unused-expression\n\n\nnew HmrClient(socketPath, module.hot, () => {\n  return __webpack_require__.h();\n}); \n//# sourceMappingURL=main-hmr.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24td2VicGFjay9vdXQvZWxlY3Ryb24tbWFpbi1obXIvbWFpbi1obXIuanM/MWJkYyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7O0FBR0QsNEpBQXdGOzs7QUFHeEY7QUFDQTtBQUNBLENBQUMsRTtBQUNEIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL21haW4taG1yLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnJlcXVpcmUoXCJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzXCIpLmluc3RhbGwoKTtcblxuY29uc3Qgc29ja2V0UGF0aCA9IHByb2Nlc3MuZW52LkVMRUNUUk9OX0hNUl9TT0NLRVRfUEFUSDtcblxuaWYgKHNvY2tldFBhdGggPT0gbnVsbCkge1xuICB0aHJvdyBuZXcgRXJyb3IoYFtITVJdIEVudiBFTEVDVFJPTl9ITVJfU09DS0VUX1BBVEggaXMgbm90IHNldGApO1xufSAvLyBtb2R1bGUsIGJ1dCBub3QgcmVsYXRpdmUgcGF0aCBtdXN0IGJlIHVzZWQgKGJlY2F1c2UgdGhpcyBmaWxlIGlzIHVzZWQgYXMgZW50cnkpXG5cblxuY29uc3QgSG1yQ2xpZW50ID0gcmVxdWlyZShcImVsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudFwiKS5IbXJDbGllbnQ7IC8vIHRzbGludDpkaXNhYmxlOm5vLXVudXNlZC1leHByZXNzaW9uXG5cblxubmV3IEhtckNsaWVudChzb2NrZXRQYXRoLCBtb2R1bGUuaG90LCAoKSA9PiB7XG4gIHJldHVybiBfX3dlYnBhY2tfaGFzaF9fO1xufSk7IFxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFpbi1obXIuanMubWFwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js\n");

/***/ }),

/***/ "./src/main/index.js":
/*!***************************!*\
  !*** ./src/main/index.js ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ \"electron\");\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var querystring__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! querystring */ \"querystring\");\n/* harmony import */ var querystring__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(querystring__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! url */ \"url\");\n/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(url__WEBPACK_IMPORTED_MODULE_3__);\n// @flow\n\n\n\n\nlet mainWindow;\nconst appWindows = {};\nconst requestChannel = 'ipc-request-channel';\nconst responseChannel = 'ipc-response-channel';\nconst isDevelopment = \"development\" !== 'production';\n\nconst newWindow = params => {\n  const window = new electron__WEBPACK_IMPORTED_MODULE_0__[\"BrowserWindow\"]({\n    width: 800,\n    height: 600\n  });\n\n  if (isDevelopment) {\n    window.webContents.openDevTools();\n  }\n\n  const stringParams = querystring__WEBPACK_IMPORTED_MODULE_1___default.a.stringify(params);\n\n  if (isDevelopment) {\n    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}?${stringParams}`);\n  } else {\n    window.loadURL(url__WEBPACK_IMPORTED_MODULE_3___default.a.format({\n      pathname: path__WEBPACK_IMPORTED_MODULE_2___default.a.join(__dirname, `index.html?${params}`),\n      protocol: 'file:',\n      slashes: true\n    }));\n  }\n\n  return window;\n};\n\nconst createWindow = () => {\n  mainWindow = newWindow({\n    type: 'launcher'\n  }); // Emitted when the window is closed.\n\n  mainWindow.on('closed', () => {\n    // TODO: fix below to not error on close\n    // const keys = Object.keys(appWindows)\n    // Object.keys(appWindows).forEach(w => {\n    //   appWindows[w].close()\n    // })\n    mainWindow = null;\n  });\n};\n\nconst launchApp = appId => {\n  const appWindow = newWindow({\n    type: 'app',\n    appId\n  });\n  appWindows[appId] = appWindow;\n};\n\nelectron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].on('ready', createWindow); // Quit when all windows are closed.\n\nelectron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].on('window-all-closed', () => {\n  if (process.platform !== 'darwin') {\n    electron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].quit();\n  }\n});\nelectron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].on('activate', () => {\n  // On macOS it's common to re-create a window in the app when the\n  // dock icon is clicked and there are no other windows open.\n  if (mainWindow === null) {\n    createWindow();\n  }\n});\nelectron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].on('launchApp', (e, appId) => {\n  launchApp(appId);\n});\nconst simpleClient = {\n  getBalance: () => 1000,\n  getPublicKey: () => 'myKey'\n};\n\nconst handleRequest = request => {\n  if (request.data.method && simpleClient[request.data.method]) {\n    const args = request.data.args || [];\n\n    try {\n      const res = simpleClient[request.data.method](...args);\n      return {\n        id: request.id,\n        result: res\n      };\n    } catch (error) {\n      return {\n        error,\n        id: request.id\n      };\n    }\n  }\n\n  return {\n    error: {\n      message: 'Method not found',\n      code: 32601\n    },\n    id: request.id\n  };\n};\n\nelectron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].on(requestChannel, async (event, request) => {\n  const window = electron__WEBPACK_IMPORTED_MODULE_0__[\"BrowserWindow\"].fromWebContents(event.sender);\n\n  const send = (channel, response) => {\n    if (!(window && window.isDestroyed())) {\n      event.sender.send(channel, response);\n    }\n  };\n\n  const res = handleRequest(request, window);\n  send(responseChannel, res);\n});\n/* WEBPACK VAR INJECTION */}.call(this, \"src/main\"))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9pbmRleC5qcz9lNTlhIl0sIm5hbWVzIjpbIm1haW5XaW5kb3ciLCJhcHBXaW5kb3dzIiwicmVxdWVzdENoYW5uZWwiLCJyZXNwb25zZUNoYW5uZWwiLCJpc0RldmVsb3BtZW50IiwibmV3V2luZG93IiwicGFyYW1zIiwid2luZG93Iiwid2lkdGgiLCJoZWlnaHQiLCJ3ZWJDb250ZW50cyIsIm9wZW5EZXZUb29scyIsInN0cmluZ1BhcmFtcyIsInF1ZXJ5c3RyaW5nIiwic3RyaW5naWZ5IiwibG9hZFVSTCIsInByb2Nlc3MiLCJlbnYiLCJFTEVDVFJPTl9XRUJQQUNLX1dEU19QT1JUIiwidXJsIiwiZm9ybWF0IiwicGF0aG5hbWUiLCJwYXRoIiwiam9pbiIsIl9fZGlybmFtZSIsInByb3RvY29sIiwic2xhc2hlcyIsImNyZWF0ZVdpbmRvdyIsInR5cGUiLCJvbiIsImxhdW5jaEFwcCIsImFwcElkIiwiYXBwV2luZG93IiwiYXBwIiwicGxhdGZvcm0iLCJxdWl0IiwiaXBjTWFpbiIsImUiLCJzaW1wbGVDbGllbnQiLCJnZXRCYWxhbmNlIiwiZ2V0UHVibGljS2V5IiwiaGFuZGxlUmVxdWVzdCIsInJlcXVlc3QiLCJkYXRhIiwibWV0aG9kIiwiYXJncyIsInJlcyIsImlkIiwicmVzdWx0IiwiZXJyb3IiLCJtZXNzYWdlIiwiY29kZSIsImV2ZW50IiwiQnJvd3NlcldpbmRvdyIsImZyb21XZWJDb250ZW50cyIsInNlbmRlciIsInNlbmQiLCJjaGFubmVsIiwicmVzcG9uc2UiLCJpc0Rlc3Ryb3llZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBSUEsVUFBSjtBQUNBLE1BQU1DLGFBQWEsRUFBbkI7QUFFQSxNQUFNQyxpQkFBaUIscUJBQXZCO0FBQ0EsTUFBTUMsa0JBQWtCLHNCQUF4QjtBQUVBLE1BQU1DLGdCQUFnQixrQkFBeUIsWUFBL0M7O0FBRUEsTUFBTUMsWUFBYUMsTUFBRCxJQUFZO0FBQzVCLFFBQU1DLFNBQVMsSUFBSSxzREFBSixDQUFrQjtBQUFDQyxXQUFPLEdBQVI7QUFBYUMsWUFBUTtBQUFyQixHQUFsQixDQUFmOztBQUNBLE1BQUlMLGFBQUosRUFBbUI7QUFDakJHLFdBQU9HLFdBQVAsQ0FBbUJDLFlBQW5CO0FBQ0Q7O0FBQ0QsUUFBTUMsZUFBZSxrREFBQUMsQ0FBWUMsU0FBWixDQUFzQlIsTUFBdEIsQ0FBckI7O0FBRUEsTUFBSUYsYUFBSixFQUFtQjtBQUNqQkcsV0FBT1EsT0FBUCxDQUFnQixvQkFBbUJDLFFBQVFDLEdBQVIsQ0FBWUMseUJBQTBCLElBQUdOLFlBQWEsRUFBekY7QUFDRCxHQUZELE1BRU87QUFDTEwsV0FBT1EsT0FBUCxDQUFlLDBDQUFBSSxDQUFJQyxNQUFKLENBQVc7QUFDeEJDLGdCQUFVLDJDQUFBQyxDQUFLQyxJQUFMLENBQVVDLFNBQVYsRUFBc0IsY0FBYWxCLE1BQU8sRUFBMUMsQ0FEYztBQUV4Qm1CLGdCQUFVLE9BRmM7QUFHeEJDLGVBQVM7QUFIZSxLQUFYLENBQWY7QUFLRDs7QUFDRCxTQUFPbkIsTUFBUDtBQUNELENBakJEOztBQW1CQSxNQUFNb0IsZUFBZSxNQUFNO0FBRXpCM0IsZUFBYUssVUFBVTtBQUNyQnVCLFVBQU07QUFEZSxHQUFWLENBQWIsQ0FGeUIsQ0FNekI7O0FBQ0E1QixhQUFXNkIsRUFBWCxDQUFjLFFBQWQsRUFBd0IsTUFBTTtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E3QixpQkFBYSxJQUFiO0FBQ0QsR0FQRDtBQVFELENBZkQ7O0FBaUJBLE1BQU04QixZQUFhQyxLQUFELElBQVc7QUFDM0IsUUFBTUMsWUFBWTNCLFVBQVU7QUFDMUJ1QixVQUFNLEtBRG9CO0FBRTFCRztBQUYwQixHQUFWLENBQWxCO0FBSUE5QixhQUFXOEIsS0FBWCxJQUFvQkMsU0FBcEI7QUFDRCxDQU5EOztBQVFBLDRDQUFBQyxDQUFJSixFQUFKLENBQU8sT0FBUCxFQUFnQkYsWUFBaEIsRSxDQUVBOztBQUNBLDRDQUFBTSxDQUFJSixFQUFKLENBQU8sbUJBQVAsRUFBNEIsTUFBTTtBQUNoQyxNQUFJYixRQUFRa0IsUUFBUixLQUFxQixRQUF6QixFQUFtQztBQUNqQ0QsSUFBQSw0Q0FBQUEsQ0FBSUUsSUFBSjtBQUNEO0FBQ0YsQ0FKRDtBQU1BLDRDQUFBRixDQUFJSixFQUFKLENBQU8sVUFBUCxFQUFtQixNQUFNO0FBQ3ZCO0FBQ0E7QUFDQSxNQUFJN0IsZUFBZSxJQUFuQixFQUF5QjtBQUN2QjJCO0FBQ0Q7QUFDRixDQU5EO0FBUUEsZ0RBQUFTLENBQVFQLEVBQVIsQ0FBVyxXQUFYLEVBQXdCLENBQUNRLENBQUQsRUFBSU4sS0FBSixLQUFjO0FBQ3BDRCxZQUFVQyxLQUFWO0FBQ0QsQ0FGRDtBQUlBLE1BQU1PLGVBQWU7QUFDbkJDLGNBQVksTUFBTSxJQURDO0FBRW5CQyxnQkFBYyxNQUFNO0FBRkQsQ0FBckI7O0FBS0EsTUFBTUMsZ0JBQWlCQyxPQUFELElBQWE7QUFDakMsTUFBSUEsUUFBUUMsSUFBUixDQUFhQyxNQUFiLElBQXVCTixhQUFhSSxRQUFRQyxJQUFSLENBQWFDLE1BQTFCLENBQTNCLEVBQThEO0FBQzVELFVBQU1DLE9BQU9ILFFBQVFDLElBQVIsQ0FBYUUsSUFBYixJQUFxQixFQUFsQzs7QUFDQSxRQUFJO0FBQ0YsWUFBTUMsTUFBTVIsYUFBYUksUUFBUUMsSUFBUixDQUFhQyxNQUExQixFQUFrQyxHQUFHQyxJQUFyQyxDQUFaO0FBQ0EsYUFBTztBQUNMRSxZQUFJTCxRQUFRSyxFQURQO0FBRUxDLGdCQUFRRjtBQUZILE9BQVA7QUFJRCxLQU5ELENBTUUsT0FBT0csS0FBUCxFQUFjO0FBQ2QsYUFBTztBQUNMQSxhQURLO0FBRUxGLFlBQUlMLFFBQVFLO0FBRlAsT0FBUDtBQUlEO0FBQ0Y7O0FBQ0QsU0FBTztBQUNMRSxXQUFPO0FBQ0xDLGVBQVMsa0JBREo7QUFFTEMsWUFBTTtBQUZELEtBREY7QUFLTEosUUFBSUwsUUFBUUs7QUFMUCxHQUFQO0FBT0QsQ0F2QkQ7O0FBeUJBLGdEQUFBWCxDQUFRUCxFQUFSLENBQVczQixjQUFYLEVBQTJCLE9BQU9rRCxLQUFQLEVBQWNWLE9BQWQsS0FBMEI7QUFDbkQsUUFBTW5DLFNBQVMsc0RBQUE4QyxDQUFjQyxlQUFkLENBQThCRixNQUFNRyxNQUFwQyxDQUFmOztBQUNBLFFBQU1DLE9BQU8sQ0FBQ0MsT0FBRCxFQUFVQyxRQUFWLEtBQXVCO0FBQ2xDLFFBQUksRUFBRW5ELFVBQVVBLE9BQU9vRCxXQUFQLEVBQVosQ0FBSixFQUF1QztBQUNyQ1AsWUFBTUcsTUFBTixDQUFhQyxJQUFiLENBQWtCQyxPQUFsQixFQUEyQkMsUUFBM0I7QUFDRDtBQUNGLEdBSkQ7O0FBS0EsUUFBTVosTUFBTUwsY0FBY0MsT0FBZCxFQUF1Qm5DLE1BQXZCLENBQVo7QUFDQWlELE9BQUtyRCxlQUFMLEVBQXNCMkMsR0FBdEI7QUFDRCxDQVRELEUiLCJmaWxlIjoiLi9zcmMvbWFpbi9pbmRleC5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCB7IGFwcCwgQnJvd3NlcldpbmRvdywgaXBjTWFpbiB9IGZyb20gJ2VsZWN0cm9uJ1xuaW1wb3J0IHF1ZXJ5c3RyaW5nIGZyb20gJ3F1ZXJ5c3RyaW5nJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB1cmwgZnJvbSAndXJsJ1xuXG5sZXQgbWFpbldpbmRvd1xuY29uc3QgYXBwV2luZG93cyA9IHt9XG5cbmNvbnN0IHJlcXVlc3RDaGFubmVsID0gJ2lwYy1yZXF1ZXN0LWNoYW5uZWwnXG5jb25zdCByZXNwb25zZUNoYW5uZWwgPSAnaXBjLXJlc3BvbnNlLWNoYW5uZWwnXG5cbmNvbnN0IGlzRGV2ZWxvcG1lbnQgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nXG5cbmNvbnN0IG5ld1dpbmRvdyA9IChwYXJhbXMpID0+IHtcbiAgY29uc3Qgd2luZG93ID0gbmV3IEJyb3dzZXJXaW5kb3coe3dpZHRoOiA4MDAsIGhlaWdodDogNjAwfSlcbiAgaWYgKGlzRGV2ZWxvcG1lbnQpIHtcbiAgICB3aW5kb3cud2ViQ29udGVudHMub3BlbkRldlRvb2xzKClcbiAgfVxuICBjb25zdCBzdHJpbmdQYXJhbXMgPSBxdWVyeXN0cmluZy5zdHJpbmdpZnkocGFyYW1zKVxuXG4gIGlmIChpc0RldmVsb3BtZW50KSB7XG4gICAgd2luZG93LmxvYWRVUkwoYGh0dHA6Ly9sb2NhbGhvc3Q6JHtwcm9jZXNzLmVudi5FTEVDVFJPTl9XRUJQQUNLX1dEU19QT1JUfT8ke3N0cmluZ1BhcmFtc31gKVxuICB9IGVsc2Uge1xuICAgIHdpbmRvdy5sb2FkVVJMKHVybC5mb3JtYXQoe1xuICAgICAgcGF0aG5hbWU6IHBhdGguam9pbihfX2Rpcm5hbWUsIGBpbmRleC5odG1sPyR7cGFyYW1zfWApLFxuICAgICAgcHJvdG9jb2w6ICdmaWxlOicsXG4gICAgICBzbGFzaGVzOiB0cnVlXG4gICAgfSkpXG4gIH1cbiAgcmV0dXJuIHdpbmRvd1xufVxuXG5jb25zdCBjcmVhdGVXaW5kb3cgPSAoKSA9PiB7XG5cbiAgbWFpbldpbmRvdyA9IG5ld1dpbmRvdyh7XG4gICAgdHlwZTogJ2xhdW5jaGVyJyxcbiAgfSlcblxuICAvLyBFbWl0dGVkIHdoZW4gdGhlIHdpbmRvdyBpcyBjbG9zZWQuXG4gIG1haW5XaW5kb3cub24oJ2Nsb3NlZCcsICgpID0+IHtcbiAgICAvLyBUT0RPOiBmaXggYmVsb3cgdG8gbm90IGVycm9yIG9uIGNsb3NlXG4gICAgLy8gY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGFwcFdpbmRvd3MpXG4gICAgLy8gT2JqZWN0LmtleXMoYXBwV2luZG93cykuZm9yRWFjaCh3ID0+IHtcbiAgICAvLyAgIGFwcFdpbmRvd3Nbd10uY2xvc2UoKVxuICAgIC8vIH0pXG4gICAgbWFpbldpbmRvdyA9IG51bGxcbiAgfSlcbn1cblxuY29uc3QgbGF1bmNoQXBwID0gKGFwcElkKSA9PiB7XG4gIGNvbnN0IGFwcFdpbmRvdyA9IG5ld1dpbmRvdyh7XG4gICAgdHlwZTogJ2FwcCcsXG4gICAgYXBwSWQsXG4gIH0pXG4gIGFwcFdpbmRvd3NbYXBwSWRdID0gYXBwV2luZG93XG59XG5cbmFwcC5vbigncmVhZHknLCBjcmVhdGVXaW5kb3cpXG5cbi8vIFF1aXQgd2hlbiBhbGwgd2luZG93cyBhcmUgY2xvc2VkLlxuYXBwLm9uKCd3aW5kb3ctYWxsLWNsb3NlZCcsICgpID0+IHtcbiAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT09ICdkYXJ3aW4nKSB7XG4gICAgYXBwLnF1aXQoKVxuICB9XG59KVxuXG5hcHAub24oJ2FjdGl2YXRlJywgKCkgPT4ge1xuICAvLyBPbiBtYWNPUyBpdCdzIGNvbW1vbiB0byByZS1jcmVhdGUgYSB3aW5kb3cgaW4gdGhlIGFwcCB3aGVuIHRoZVxuICAvLyBkb2NrIGljb24gaXMgY2xpY2tlZCBhbmQgdGhlcmUgYXJlIG5vIG90aGVyIHdpbmRvd3Mgb3Blbi5cbiAgaWYgKG1haW5XaW5kb3cgPT09IG51bGwpIHtcbiAgICBjcmVhdGVXaW5kb3coKVxuICB9XG59KVxuXG5pcGNNYWluLm9uKCdsYXVuY2hBcHAnLCAoZSwgYXBwSWQpID0+IHtcbiAgbGF1bmNoQXBwKGFwcElkKVxufSlcblxuY29uc3Qgc2ltcGxlQ2xpZW50ID0ge1xuICBnZXRCYWxhbmNlOiAoKSA9PiAxMDAwLFxuICBnZXRQdWJsaWNLZXk6ICgpID0+ICdteUtleScsXG59XG5cbmNvbnN0IGhhbmRsZVJlcXVlc3QgPSAocmVxdWVzdCkgPT4ge1xuICBpZiAocmVxdWVzdC5kYXRhLm1ldGhvZCAmJiBzaW1wbGVDbGllbnRbcmVxdWVzdC5kYXRhLm1ldGhvZF0pIHtcbiAgICBjb25zdCBhcmdzID0gcmVxdWVzdC5kYXRhLmFyZ3MgfHwgW11cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzID0gc2ltcGxlQ2xpZW50W3JlcXVlc3QuZGF0YS5tZXRob2RdKC4uLmFyZ3MpXG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogcmVxdWVzdC5pZCxcbiAgICAgICAgcmVzdWx0OiByZXMsXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGVycm9yLFxuICAgICAgICBpZDogcmVxdWVzdC5pZCxcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBlcnJvcjoge1xuICAgICAgbWVzc2FnZTogJ01ldGhvZCBub3QgZm91bmQnLFxuICAgICAgY29kZTogMzI2MDEsXG4gICAgfSxcbiAgICBpZDogcmVxdWVzdC5pZCxcbiAgfVxufVxuXG5pcGNNYWluLm9uKHJlcXVlc3RDaGFubmVsLCBhc3luYyAoZXZlbnQsIHJlcXVlc3QpID0+IHtcbiAgY29uc3Qgd2luZG93ID0gQnJvd3NlcldpbmRvdy5mcm9tV2ViQ29udGVudHMoZXZlbnQuc2VuZGVyKVxuICBjb25zdCBzZW5kID0gKGNoYW5uZWwsIHJlc3BvbnNlKSA9PiB7XG4gICAgaWYgKCEod2luZG93ICYmIHdpbmRvdy5pc0Rlc3Ryb3llZCgpKSkge1xuICAgICAgZXZlbnQuc2VuZGVyLnNlbmQoY2hhbm5lbCwgcmVzcG9uc2UpXG4gICAgfVxuICB9XG4gIGNvbnN0IHJlcyA9IGhhbmRsZVJlcXVlc3QocmVxdWVzdCwgd2luZG93KVxuICBzZW5kKHJlc3BvbnNlQ2hhbm5lbCwgcmVzKVxufSlcbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/main/index.js\n");

/***/ }),

/***/ 0:
/*!************************************************************************************************!*\
  !*** multi ./node_modules/electron-webpack/out/electron-main-hmr/main-hmr ./src/main/index.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! /Users/adamclarke/apps/js-mainframe/packages/launcher/node_modules/electron-webpack/out/electron-main-hmr/main-hmr */"./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js");
module.exports = __webpack_require__(/*! /Users/adamclarke/apps/js-mainframe/packages/launcher/src/main/index.js */"./src/main/index.js");


/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvblwiPzA0ZjMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiZWxlY3Ryb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///electron\n");

/***/ }),

/***/ "electron-webpack/out/electron-main-hmr/HmrClient":
/*!*******************************************************************!*\
  !*** external "electron-webpack/out/electron-main-hmr/HmrClient" ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron-webpack/out/electron-main-hmr/HmrClient\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvbi13ZWJwYWNrL291dC9lbGVjdHJvbi1tYWluLWhtci9IbXJDbGllbnRcIj9kZTY3Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6ImVsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///electron-webpack/out/electron-main-hmr/HmrClient\n");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCI/NzRiYiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJwYXRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///path\n");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"querystring\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJxdWVyeXN0cmluZ1wiPzMwYzYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoicXVlcnlzdHJpbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJxdWVyeXN0cmluZ1wiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///querystring\n");

/***/ }),

/***/ "source-map-support/source-map-support.js":
/*!***********************************************************!*\
  !*** external "source-map-support/source-map-support.js" ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"source-map-support/source-map-support.js\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzXCI/OWM1ZiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic291cmNlLW1hcC1zdXBwb3J0L3NvdXJjZS1tYXAtc3VwcG9ydC5qc1wiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///source-map-support/source-map-support.js\n");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"url\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ1cmxcIj82MWU4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6InVybC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInVybFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///url\n");

/***/ })

/******/ });