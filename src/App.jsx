// Mobile Arms: Endless Destiny Roster Editor - Fixed totalPower scope error and animation glitch

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectContent, SelectTrigger } from "@/components/ui/select";

const WEAPON_OPTIONS = [
  "",
  "Free Hand",
  "Thermal Lance",
  "Howitzer",
  "Mortar Pods"
];

const UPGRADE_OPTIONS = [
  "",
  "Enhanced Scopes",
  "Drone Management Unit",
  "Auxiliary Generator",
  "Tungsten Rounds",
  "Reactive Shielding"
];

const PILOT_DATA = {
  "Treadhead": { skill: "Armor Boost", trait: "Steady Aim" },
  "Surveyor": { skill: "Sensor Sweep", trait: "Terrain Mapping" },
  "Saboteur": { skill: "EMP Strike", trait: "Cloaking" }
};

const PILOT_OPTIONS = ["", ...Object.keys(PILOT_DATA)];

const MOBILITY_DATA = {
  "Bipedal": { move: "M", strafe: "S", backpedal: "S" },
  "Tracked": { move: "S", strafe: "-", backpedal: "-" },
  "Aeromobile": { move: "L", strafe: "M", backpedal: "M" },
  "Stealth-Op Locomotion": { move: "S", strafe: "S", backpedal: "S" },
  "Quadruped": { move: "M", strafe: "S", backpedal: "S" },
  "Heelie Wheelies": { move: "M", strafe: "M", backpedal: "S" },
  "All-Wheel Drive": { move: "M", strafe: "M", backpedal: "M" }
};

const MOBILITY_OPTIONS = ["", ...Object.keys(MOBILITY_DATA)];

const FRAME_DATA = {
  "Heavy Frame": { tonnage: 4, energy: 15, hardpoints: 6 },
  "Medium Frame": { tonnage: 3, energy: 12, hardpoints: 5 },
  "Light Frame": { tonnage: 2, energy: 9, hardpoints: 4 },
  "Quad Copter": { tonnage: 1, energy: 4, hardpoints: 1 },
  "Scuttler": { tonnage: 1, energy: 4, hardpoints: 1 }
};

const FRAME_OPTIONS = Object.keys(FRAME_DATA);

const POWER_USAGE = {
  "Free Hand": 2,
  "Thermal Lance": 5,
  "Howitzer": 4,
  "Mortar Pods": 3,
  "Enhanced Scopes": 1,
  "Drone Management Unit": 2,
  "Auxiliary Generator": 3,
  "Tungsten Rounds": 1,
  "Reactive Shielding": 2,
  "Bipedal": 2,
  "Tracked": 3,
  "Aeromobile": 4,
  "Stealth-Op Locomotion": 3,
  "Quadruped": 3,
  "Heelie Wheelies": 2,
  "All-Wheel Drive": 4
};

const HARDPOINT_USAGE = {
  "Free Hand": 1,
  "Thermal Lance": 2,
  "Howitzer": 2,
  "Mortar Pods": 1,
  "Enhanced Scopes": 1,
  "Drone Management Unit": 1,
  "Auxiliary Generator": 1,
  "Tungsten Rounds": 1,
  "Reactive Shielding": 1
};

export default function RosterEditor() {
  const [roster, setRoster] = useState([]);

  function addMechFrame() {
    setRoster([...roster, {
      id: Date.now(),
      name: '',
      tonnage: 0,
      energy: 0,
      hardpoints: [],
      pilot: null,
      mobility: null,
      weapons: [],
      upgrades: []
    }]);
  }

  function updateMech(index, updatedMech) {
    const newRoster = [...roster];
    newRoster[index] = updatedMech;
    setRoster(newRoster);
  }

  function removeMech(id) {
    setRoster(roster.filter(mech => mech.id !== id));
  }

  function handleFieldChange(index, field, value) {
    const mech = roster[index];
    updateMech(index, { ...mech, [field]: value });
  }

  function handleWeaponChange(index, slot, value) {
    const mech = roster[index];
    const newWeapons = [...mech.weapons];
    newWeapons[slot] = value;
    updateMech(index, { ...mech, weapons: newWeapons });
  }

  return (
    <div className="relative p-4 bg-black text-blue-300 font-straczynski min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle,_#0f172a,_#000)] opacity-30 pointer-events-none z-0"></div>
      <div className="absolute inset-0 bg-[url('/scanlines.svg')] mix-blend-overlay opacity-10 pointer-events-none z-10"></div>
      <h1 className="text-3xl mb-4 border-b border-blue-400 pb-2 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)] animate-fade-in">MOBILE ARMS: Endless Destiny</h1>
      <Button onClick={addMechFrame}>Add Mech Frame</Button>
      <div className="mt-6 grid gap-4">
        {roster.map((mech, index) => {
          const weaponPower = (mech.weapons || []).reduce((sum, w) => sum + (POWER_USAGE[w] || 0), 0);
          const upgradePower = (mech.upgrades || []).reduce((sum, u) => sum + (POWER_USAGE[u] || 0), 0);
          const mobilityPower = POWER_USAGE[mech.mobility] || 0;
          const totalPower = weaponPower + upgradePower + mobilityPower;

          const powerRatio = mech.energy > 0 ? Math.min(totalPower / mech.energy, 1) : 0;

          const weaponHardpoints = (mech.weapons || []).reduce((sum, w) => sum + (HARDPOINT_USAGE[w] || 0), 0);
          const upgradeHardpoints = (mech.upgrades || []).reduce((sum, u) => sum + (HARDPOINT_USAGE[u] || 0), 0);
          const totalHardpoints = weaponHardpoints + upgradeHardpoints;

          const powerExceeded = totalPower > mech.energy;
          const hardpointsExceeded = totalHardpoints > mech.tonnage;
          const missingPilot = !mech.pilot;
          const missingMobility = !mech.mobility;

          const invalid = powerExceeded || hardpointsExceeded || missingPilot || missingMobility;

          mech.__validation = { invalid, powerExceeded, hardpointsExceeded, missingPilot, missingMobility };

          return (
            <Card key={mech.id} className={`bg-gray-900 border ${invalid ? 'border-red-500' : 'border-green-400'}`}>
              <CardContent className="space-y-4">
                <div className="flex justify-between gap-2">
                  <Select
                    onValueChange={(value) => {
                      const frame = FRAME_DATA[value];
                      if (frame) {
                        updateMech(index, {
                          ...mech,
                          name: value,
                          tonnage: frame.tonnage,
                          energy: frame.energy
                        });
                      }
                    }}
                    value={FRAME_OPTIONS.includes(mech.name) ? mech.name : 'placeholder'}
                  >
                    <SelectTrigger>{mech.name || 'Select Frame'}</SelectTrigger>
                    <SelectContent>
                      <SelectItem disabled value="placeholder">Select Frame</SelectItem>
                      {FRAME_OPTIONS.map((frame, idx) => (
                        <SelectItem key={idx} value={frame}>{frame}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={() => removeMech(mech.id)}>Remove</Button>
                </div>

                <div className="mt-4 space-y-2">
                  <label className="text-sm text-blue-300">Power Usage</label>
                  <div className="relative w-full h-6 bg-blue-900 border border-green-400 rounded-full overflow-hidden">
                    <div
                      className={`absolute left-0 top-0 h-full transition-all duration-700 ${totalPower > mech.energy ? 'bg-red-500' : 'bg-blue-400'}`}
                      style={{ width: `${powerRatio * 100}%` }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                      {totalPower} / {mech.energy}
                    </div>
                  </div>

                  <label className="text-sm text-green-300">Hardpoint Usage</label>
                  <div className="flex gap-1">
                    {Array.from({ length: FRAME_DATA[mech.name]?.hardpoints || 0 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 rounded-full border transition duration-500 ease-in-out shadow-md ${i < totalHardpoints ? 'bg-blue-400 border-blue-300 shadow-blue-500/50 animate-pulse' : 'border-blue-700'}`}
                      ></div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
