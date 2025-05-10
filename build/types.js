"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = exports.Status = exports.Priority = void 0;
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
var Roles;
(function (Roles) {
    Roles["Employee"] = "Employee";
    Roles["Lead"] = "Lead";
    Roles["Manager"] = "Manager";
    Roles["Admin"] = "Admin";
})(Roles || (exports.Roles = Roles = {}));
