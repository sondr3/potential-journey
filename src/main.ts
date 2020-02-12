const _ = require("lodash");

import { harvesterRole } from "roles/harvester";
import { ErrorMapper } from "utils/ErrorMapper";
import { upgraderRole } from "roles/upgrader";
import { builderRole } from "roles/builder";

const SPAWN = "UNIX";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  const harvesters: [Creep] = _.filter(Game.creeps, (creep: Creep) => creep.memory.role == "harvester");
  console.log(`Harvesters active: ${harvesters.length}`);

  if (harvesters.length < 2) {
    const newName = `Harvester${Game.time}`;
    console.log(`Spawning new harvester: ${newName}`);
    Game.spawns[SPAWN].spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: "harvester" } });
  }

  const upgraders: [Creep] = _.filter(Game.creeps, (creep: Creep) => creep.memory.role == "upgrader");
  console.log(`Upgraders active: ${upgraders.length}`);

  if (upgraders.length < 1) {
    const newName = `Upgrader${Game.time}`;
    console.log(`Spawning new upgrader: ${newName}`);
    Game.spawns[SPAWN].spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: "upgrader", working: false } });
  }

  const builders: [Creep] = _.filter(Game.creeps, (creep: Creep) => creep.memory.role == "builder");
  console.log(`Builders active: ${builders.length}`);

  if (builders.length < 1) {
    const newName = `Builder${Game.time}`;
    console.log(`Spawning new builder: ${newName}`);
    Game.spawns[SPAWN].spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: "builder", working: false } });
  }

  if (Game.spawns[SPAWN].spawning) {
    Game.spawns[SPAWN].room.visual.text(`Spawning creep`, Game.spawns[SPAWN].pos.x + 1, Game.spawns[SPAWN].pos.y, {
      align: "left",
      opacity: 0.8
    });
  }

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.memory.role === "harvester") {
      harvesterRole.run(creep);
    }
    if (creep.memory.role === "upgrader") {
      upgraderRole.run(creep);
    }
    if (creep.memory.role === "builder") {
      builderRole.run(creep);
    }
  }
});
