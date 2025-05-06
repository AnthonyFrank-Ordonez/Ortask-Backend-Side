"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = exports.Priority = void 0;
var Priority;
(function (Priority) {
    Priority["Medium"] = "Medium";
    Priority["Highest"] = "Highest";
    Priority["Critical"] = "Critical";
})(Priority || (exports.Priority = Priority = {}));
var Status;
(function (Status) {
    Status["ToDo"] = "To Do";
    Status["InProgress"] = "In Progress";
    Status["Completed"] = "Completed";
})(Status || (exports.Status = Status = {}));
