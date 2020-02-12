"use strict";
exports.__esModule = true;
var _ = require("lodash");
var ErrorMapper_1 = require("utils/ErrorMapper");
var SPAWN = "UNIX";
// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
exports.loop = ErrorMapper_1.ErrorMapper.wrapLoop(function () {
    var _a;
    console.log("Current game tick is " + Game.time);
    // Automatically delete memory of missing creeps
    for (var name_1 in Memory.creeps) {
        if (!(name_1 in Game.creeps)) {
            delete Memory.creeps[name_1];
        }
    }
    var harvesters = _.filter(Game.creeps, function (creep) { return creep.memory.role == "harvester"; });
    console.log("Harvesters active: " + harvesters.length);
    if (harvesters.length < 2) {
        var newName = "Harvester" + Game.time;
        console.log("Spawning new harvester: " + newName);
        Game.spawns[SPAWN].spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: "harvester" } });
    }
    if (Game.spawns[SPAWN].spawning) {
        var spawningCreep = Game.creeps[((_a = Game.spawns[SPAWN].spawning) === null || _a === void 0 ? void 0 : _a.name) || ""];
        Game.spawns[SPAWN].room.visual.text("S: " + spawningCreep.memory.role, Game.spawns[SPAWN].pos.x + 1, Game.spawns[SPAWN].pos.y, { align: "left", opacity: 0.8 });
    }
});
