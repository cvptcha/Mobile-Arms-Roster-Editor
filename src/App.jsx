import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectContent, SelectTrigger } from "@/components/ui/select";

// Consolidated data objects
const FRAME_DATA = {
  "Heavy Frame": { tonnage: 4, energy: 15, hardpoints: 6, hullpoints: 9 },
  "Medium Frame": { tonnage: 3, energy: 12, hardpoints: 5, hullpoints: 7 },
  "Light Frame": { tonnage: 2, energy: 9, hardpoints: 4, hullpoints: 5 },
  "Quad Copter": { tonnage: 1, energy: 4, hardpoints: 1, hullpoints: 3 },
  "Scuttler": { tonnage: 1, energy: 4, hardpoints: 1, hullpoints: 3 }
};

const MOBILITY_DATA = {
  "Bipedal": { move: "M", strafe: "S", backpedal: "S", rotate: "90", energy: 0, hardpoints: 0, ability: "SURGE 2: Perform a free Core Mobility Action." },
  "Tracked": { move: "M", strafe: "-", backpedal: "-", rotate: "90", energy: 2, hardpoints: -1 },
  "Aeromobile": { move: "M", strafe: "M", backpedal: "M", rotate: "180", energy: 4, hardpoints: 1 },
  "Stealth-Op Locomotion": { move: "M", strafe: "S", backpedal: "S", rotate: "90", energy: 2, hardpoints: 0, ability: "PASSIVE: This frame has +1 armor while it is the target of a LOCK action." },
  "Quadruped": { move: "M", strafe: "S", backpedal: "S", rotate: "90", energy: 3, hardpoints: 0, ability: "ACTION: Flip this card to ENTRENCHED MODE."  },
  "Heelie Wheelies": { move: "M", strafe: "M", backpedal: "S", rotate: "90", energy: 0, hardpoints: 0, ability: "PASSIVE: Whenever this frame gains heat from a Mobility action during it's activation, flip this card to BOOST MODE."  },
  "All-Wheel Drive": { move: "M", strafe: "M", backpedal: "M", rotate: "0", energy: 0, hardpoints: -1 }
};

const WEAPON_OPTIONS = [
  "Free Hand",
  "Pilebunker",
  "Beam Saber",
  "Thermal Lance",
  "Howitzer",
  "Mortar Pods"
];

const PILOT_OPTIONS = ["Treadhead", "Surveyor", "Saboteur", "Duelist", "Drone Operator", "Engineer", "Gunner", "Sysop", "Crack-Shot", "Sapper", "Spotter"];

const PILOT_DATA = {
  "Treadhead": { ability: "PASSIVE: Add +1 surge result ro ranged attacks with the HEAVY ARTILLERY keyword." },
  "Surveyor": { ability: "SURGE 2: Remove 1 heat from another friendly frame within L of this one." },
  "Duelist": { ability: "PASSIVE: Add +1 surge result to melee attack rolls." },
  "Drone Operator": { ability: "You may include up to one Drone in your force, if you have the available tonnage." },
  "Engineer": { ability: "SURGE 3: Remove 1 damage from this frame." },
  "Gunner": { ability: "SURGE 2: Reroll 1 die in this roll. You must keep the new result." },
  "Sysop": { ability: "SURGE 3: Remove 1 heat token from this frame." },
  "Crack-Shot": { ability: "SURGE 5: If there are 2 or fewer strikes in this ranged attack roll, add +3 strikes." },
  "Sapper": { ability: "PASSIVE: Add +1 surge to attacks made while this frame has secured the ZoO or a PoI." },
  "Spotter": { ability: "PASSIVE: Add +2 strikes to locks performed by this frame." },
  "Saboteur": { ability: "PASSIVE: This frame has +1 armor while it is the target of a LOCK action." }
};

const WEAPON_DATA = {
  "Free Hand": { range: "Melee", damage: 1, energy: 2, heat: 4, dice: 4, hardpoints: 1, ability: "Counts as a light weapon for reactions." },
  "Pilebunker": { range: "Melee", damage: 4, energy: 3, heat: 3, dice: 3, hardpoints: 1, ability: "When this weapon disables an enemy frame, the pilot is immediately slain." },
  "Beam Saber": { range: "Melee", damage: 2, energy: 4, heat: 3, dice: 4, hardpoints: 1, ability: "SURGE: Automatically deal 1 damage to teh target." },
  "Thermal Lance": { range: "Long", damage: 5, energy: 2, heat: 3, dice: 3, hardpoints: 2, ability: "Penetrates armor. Causes overheating on hit." },
  "Howitzer": { range: "Long", damage: 4, energy: 4, heat: 3, dice: 4, hardpoints: 2, ability: "Area of effect. Deals splash damage." },
  "Mortar Pods": { range: "Long", damage: 2, energy: 3, heat: 2, dice: 3, hardpoints: 1, ability: "Indirect fire. Can arc over obstacles." }
};

const RANGE_ICONS = {
  "Melee": "🗡️",
  "Long": "🚀"
};

const UPGRADE_OPTIONS = [
  "Enhanced Scopes",
  "Drone Management Unit",
  "Auxiliary Generator",
  "Tungsten Rounds",
  "Reactive Shielding",
  "Snap-Boosters"
];

const UPGRADE_DATA = {
  "Enhanced Scopes": { bonus: "+1 Range Accuracy", energy: 2, hardpoints: 1, ability: "Improves accuracy at long range." },
  "Drone Management Unit": { bonus: "Control up to 2 drones", energy: 3, hardpoints: 1, ability: "Allows drone deployment." },
  "Auxiliary Generator": { bonus: "+2 Energy Capacity", energy: 3, hardpoints: 2, ability: "Adds energy to your mech." },
  "Tungsten Rounds": { bonus: "+1 Damage vs Armor", energy: 3, hardpoints: 1, ability: "Bypass light shielding." },
  "Reactive Shielding": { bonus: "Reduces incoming damage by 1", energy: 3, hardpoints: 1, ability: "Triggers on hit once per round." },
  "Snap-Boosters": { bonus: "Perform an additional move action.", energy: 3, hardpoints: 1, ability: "Movement triggers an additional move or strafe." }
};

// Embedded YouTube Video component
const GameplayVideo = () => {
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <div className="relative w-full aspect-video bg-black/80 border border-blue-700 rounded overflow-hidden">
        <iframe 
          className="absolute inset-0 w-full h-full"
          src="https://www.youtube.com/embed/BhZ0Ky9uqts"
          title="Mobile Arms: Endless Destiny Gameplay"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

// Helper functions
const calculateUsedEnergy = (weapons, upgrades, mobility) => {
  return [...weapons, ...upgrades].reduce((sum, item) => {
    const w = WEAPON_DATA[item];
    const u = UPGRADE_DATA[item];
    return sum + (w?.energy || 0) + (u?.energy || 0);
  }, MOBILITY_DATA[mobility]?.energy || 0);
};

const calculateUsedHardpoints = (weapons, upgrades, mobility) => {
  return [...weapons, ...upgrades].reduce((sum, item) => {
    const w = WEAPON_DATA[item];
    const u = UPGRADE_DATA[item];
    return sum + (w?.hardpoints || 0) + (u?.hardpoints || 0);
  }, MOBILITY_DATA[mobility]?.hardpoints || 0);
};

// Main component
export default function RosterEditor() {
  const [roster, setRoster] = useState([]);

  const saveRoster = () => {
    const blob = new Blob([JSON.stringify(roster, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mobile_arms_roster.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadRoster = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        setRoster(data);
      } catch (err) {
        alert("Invalid roster file format.");
      }
    };
    reader.readAsText(file);
  };

  const addMechFrame = () => {
    setRoster(prev => [...prev, {
      id: Date.now(),
      callsign: '',
      name: '',
      tonnage: 0,
      energy: 0,
      pilot: '',
      mobility: '',
      weapons: ['', '', ''],
      upgrades: ['', '', ''],
      hull: []
    }]);
  };

  const updateMech = (index, changes) => {
    setRoster(prev => prev.map((m, i) => i === index ? {...m, ...changes} : m));
  };

  const removeMech = (index) => {
    setRoster(prev => prev.filter((_, i) => i !== index));
  };

  const toggleHullPoint = (mechIndex, hpIdx) => {
    setRoster(prev => prev.map((m, i) => {
      if (i !== mechIndex) return m;
      const updated = m.hull?.includes(hpIdx)
        ? m.hull.filter(h => h !== hpIdx)
        : [...(m.hull || []), hpIdx];
      return { ...m, hull: updated };
    }));
  };

  return (
    <div className="p-4 text-blue-300 font-straczynski bg-gradient-to-b from-black via-[#0f1a3a] to-[#060a14] min-h-screen relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[repeating-linear-gradient(0deg,_rgba(255,255,255,0.03)_0px,_rgba(255,255,255,0.03)_1px,_transparent_1px,_transparent_4px)] before:pointer-events-none before:z-10">
      <h1 className="text-3xl font-bold border-b border-blue-500 mb-2 pb-1 bg-gradient-to-r from-blue-400 to-blue-700 bg-clip-text text-transparent shadow-[0_0_0.5px_red,0_0_1px_lime,0_0_1.5px_blue]">MOBILE ARMS: ENDLESS DESTINY - Roster Editor</h1>
      
      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left column - Roster editor */}
        <div className="w-full lg:w-2/3 space-y-4">
          <Input
            placeholder="Name Your Strike Force"
            className="text-lg font-bold border-blue-600 bg-black text-blue-300 placeholder-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 hover:brightness-125"
          />
          <p className="mb-4">Total Tonnage: {roster.reduce((sum, mech) => sum + (mech.tonnage || 0), 0)}</p>
          <div className="flex flex-wrap gap-2 items-center">
            <Button className="transition-transform hover:animate-glitch" onClick={addMechFrame}>Add Mech Frame</Button>
            <Button className="transition-transform hover:animate-glitch" onClick={saveRoster}>Save Roster</Button>
            <label className="text-blue-400 text-sm cursor-pointer border border-blue-500 px-3 py-1 rounded hover:bg-blue-500 hover:text-black transition">
              Load Roster
              <input type="file" accept=".json" onChange={loadRoster} className="hidden" />
            </label>
          </div>
          
          <div className="space-y-6">
            {roster.map((mech, index) => {
              const usedEnergy = calculateUsedEnergy(mech.weapons, mech.upgrades, mech.mobility);
              const usedHardpoints = calculateUsedHardpoints(mech.weapons, mech.upgrades, mech.mobility);
              const maxHardpoints = FRAME_DATA[mech.name]?.hardpoints || 0;
              const energyOverloaded = usedEnergy > mech.energy;
              const hardpointsOverloaded = usedHardpoints > maxHardpoints;
              
              return (
                <Card key={mech.id} className="bg-black/60 border border-blue-700 p-4">
                  <CardContent className="space-y-3">
                    {/* Hullpoints Tracker */}
                    {FRAME_DATA[mech.name] && (
                      <div>
                        <label className="text-sm text-blue-400 mb-1 block">Hullpoints</label>
                        <div className="flex flex-wrap gap-1 items-center">
                          {[...Array(FRAME_DATA[mech.name].hullpoints)].map((_, hpIdx) => (
                            <input
                              key={`hp-${mech.id}-${hpIdx}`}
                              type="checkbox"
                              className="accent-blue-500 w-4 h-4 rounded-sm bg-black border border-blue-600 transition duration-200"
                              checked={mech.hull?.includes(hpIdx)}
                              onChange={() => toggleHullPoint(index, hpIdx)}
                            />
                          ))}
                        </div>
                        {FRAME_DATA[mech.name] && mech.hull?.length >= FRAME_DATA[mech.name].hullpoints && (
                          <p className="text-red-500 text-xs mt-1 animate-pulse">STATUS: CRITICAL - FRAME DISABLED</p>
                        )}
                      </div>
                    )}
                    
                    {/* Callsign and Frame */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Callsign"
                        className="w-full border-blue-600 bg-black text-blue-300 placeholder-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 hover:brightness-125"
                        value={mech.callsign || ''}
                        onChange={(e) => updateMech(index, { callsign: e.target.value })}
                      />
                      <Select
                        value={mech.name || 'none'}
                        onValueChange={(val) => {
                          if (val === 'none') {
                            updateMech(index, { name: '', tonnage: 0, energy: 0 });
                          } else {
                            const frame = FRAME_DATA[val];
                            updateMech(index, { name: val, tonnage: frame.tonnage, energy: frame.energy });
                          }
                        }}
                      >
                        <SelectTrigger>{mech.name || 'Select Frame'}</SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">— None —</SelectItem>
                          {Object.keys(FRAME_DATA).map((frame, i) => (
                            <SelectItem key={i} value={frame}>{frame}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={() => removeMech(index)}>Remove</Button>
                    </div>
                    
                    {/* Stats Display */}
                    <p className="text-sm text-blue-400">Tonnage: {mech.tonnage}</p>
                    <p className="text-sm text-blue-400">
                      Power: {usedEnergy} / {mech.energy}
                    </p>
                    
                    {/* Energy Bar */}
                    <div className="w-full h-4 bg-black border border-blue-500 rounded overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          energyOverloaded ? 'bg-red-500 animate-pulse' : 'bg-blue-400'
                        }`}
                        style={{
                          width: `${Math.min(100, (usedEnergy / Math.max(1, mech.energy)) * 100)}%`
                        }}
                      />
                    </div>

                    {/* Hardpoints Display */}
                    <p className="text-sm text-blue-400">Hardpoints: {maxHardpoints} | Used: {usedHardpoints}</p>
                    
                    <div className="flex items-center gap-1">
                      {[...Array(maxHardpoints)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-4 h-4 rounded-full border ${
                            hardpointsOverloaded
                            ? 'border-red-500 bg-red-500 animate-pulse'
                            : i < usedHardpoints
                            ? 'border-blue-400 bg-blue-400 animate-pulse'
                            : 'border-blue-400'}`}
                        />
                      ))}
                    </div>

                    {/* Pilot and Mobility */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <Card className="bg-blue-950 border border-blue-700">
                        <CardContent className="space-y-2">
                          <label className="text-sm text-blue-300">Pilot</label>
                          <Select
                            value={mech.pilot || 'none'}
                            onValueChange={(val) => {
                              updateMech(index, { pilot: val === 'none' ? '' : val });
                            }}
                          >
                            <SelectTrigger>{mech.pilot || '— None —'}</SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">— None —</SelectItem>
                              {PILOT_OPTIONS.map((p, idx) => (
                                <SelectItem key={idx} value={p}>{p}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {mech.pilot && PILOT_DATA[mech.pilot] && (
                            <p title={PILOT_DATA[mech.pilot].ability} className="text-xs italic text-blue-400 truncate max-w-full cursor-help">
                              {PILOT_DATA[mech.pilot].ability}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-blue-950 border border-blue-700">
                        <CardContent className="space-y-2">
                          <label className="text-sm text-blue-300">Mobility</label>
                          <Select
                            value={mech.mobility || 'none'}
                            onValueChange={(val) => {
                              updateMech(index, { mobility: val === 'none' ? '' : val });
                            }}
                          >
                            <SelectTrigger>{mech.mobility || '— None —'}</SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">— None —</SelectItem>
                              {Object.keys(MOBILITY_DATA).map((mob, idx) => (
                                <SelectItem key={idx} value={mob}>{mob}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {mech.mobility && MOBILITY_DATA[mech.mobility]?.ability && (
                            <p title={MOBILITY_DATA[mech.mobility].ability} className="italic text-blue-400 text-xs whitespace-pre-wrap cursor-help">
                              {MOBILITY_DATA[mech.mobility].ability}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Weapons and Upgrades */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <Card className="bg-blue-950 border border-blue-700">
                        <CardContent className="space-y-2">
                          <label className="text-sm text-blue-300">Weapons</label>
                          {mech.weapons.map((weapon, i) => (
                            <div key={`weapon-${i}`}>
                              <Select
                                value={weapon || 'none'}
                                onValueChange={(val) => {
                                  const updated = [...mech.weapons];
                                  updated[i] = val === 'none' ? '' : val;
                                  updateMech(index, { weapons: updated });
                                }}
                              >
                                <SelectTrigger>{weapon || `Weapon ${i + 1}`}</SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">— None —</SelectItem>
                                  {WEAPON_OPTIONS.map((w, idx) => (
                                    <SelectItem key={idx} value={w}>{w}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {weapon && WEAPON_DATA[weapon] && (
                                <div className="text-xs text-blue-200 border-l-2 border-blue-400 pl-2 ml-1">
                                  <p><strong>{RANGE_ICONS[WEAPON_DATA[weapon].range]} — DICE {WEAPON_DATA[weapon].dice}, POW {WEAPON_DATA[weapon].damage}, Heat Threshold {WEAPON_DATA[weapon].heat}</strong></p>
                                  <p title={WEAPON_DATA[weapon].ability} className="italic text-blue-400 truncate max-w-full cursor-help">
                                    {WEAPON_DATA[weapon].ability}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      <Card className="bg-blue-950 border border-blue-700">
                        <CardContent className="space-y-2">
                          <label className="text-sm text-blue-300">Upgrades</label>
                          {mech.upgrades.map((upgrade, i) => (
                            <div key={`upgrade-${i}`}>
                              <Select
                                value={upgrade || 'none'}
                                onValueChange={(val) => {
                                  const updated = [...mech.upgrades];
                                  updated[i] = val === 'none' ? '' : val;
                                  updateMech(index, { upgrades: updated });
                                }}
                              >
                                <SelectTrigger>{upgrade || `Upgrade ${i + 1}`}</SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">— None —</SelectItem>
                                  {UPGRADE_OPTIONS.map((u, idx) => (
                                    <SelectItem key={idx} value={u}>{u}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {upgrade && UPGRADE_DATA[upgrade] && (
                                <div className="text-xs text-blue-200 border-l-2 border-blue-400 pl-2 ml-1">
                                  <p><strong>{UPGRADE_DATA[upgrade].bonus}, EN {UPGRADE_DATA[upgrade].energy}</strong></p>
                                  <p title={UPGRADE_DATA[upgrade].ability} className="italic text-blue-400 truncate max-w-full cursor-help">
                                    {UPGRADE_DATA[upgrade].ability}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
        
        {/* Right column - Video player */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-4">
            <Card className="bg-black/60 border border-blue-700 p-4">
              <CardContent>
                <GameplayVideo />
              </CardContent>
            </Card>
            
            {/* Game information panel */}
            <Card className="bg-black/60 border border-blue-700 p-4 mt-4">
              <CardContent>
                <h3 className="text-lg font-bold mb-2 text-blue-300">Mobile Arms: Info</h3>
                <p className="text-sm text-blue-300 mb-2">
                  Use this UNOFFICIAL roster editor to assemble your perfect mechanized strike force.
                </p>
                <div className="space-y-2 text-sm text-blue-400">
                  <p>• Choose frame types based on mission parameters</p>
                  <p>• Balance energy consumption and hardpoint usage</p>
                  <p>• Select compatible weapons and systems</p>
                  <p>• Assign specialized pilots to optimize performance</p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-blue-700">
                  <h4 className="text-sm font-bold mb-2 text-blue-300">Command Net Status</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400">ONLINE</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
