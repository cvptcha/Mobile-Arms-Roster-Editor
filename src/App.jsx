// Mobile Arms: Endless Destiny Roster Editor

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectContent, SelectTrigger } from "@/components/ui/select";

const FRAME_DATA = {
  "Heavy Frame": { tonnage: 4, energy: 15, hardpoints: 6 },
  "Medium Frame": { tonnage: 3, energy: 12, hardpoints: 5 },
  "Light Frame": { tonnage: 2, energy: 9, hardpoints: 4 },
  "Quad Copter": { tonnage: 1, energy: 4, hardpoints: 1 },
  "Scuttler": { tonnage: 1, energy: 4, hardpoints: 1 }
};

const MOBILITY_DATA = {
  "Bipedal": { move: "M", strafe: "S", backpedal: "S", rotate: "90", energy: 0, hardpoints: 0 },
  "Tracked": { move: "M", strafe: "-", backpedal: "-", rotate: "90", energy: 2, hardpoints: -1 },
  "Aeromobile": { move: "M", strafe: "M", backpedal: "M", rotate: "180", energy: 4, hardpoints: 1 },
  "Stealth-Op Locomotion": { move: "M", strafe: "S", backpedal: "S", rotate: "90", energy: 2, hardpoints: 0 },
  "Quadruped": { move: "M", strafe: "S", backpedal: "S", rotate: "90", energy: 3, hardpoints: 0 },
  "Heelie Wheelies": { move: "M", strafe: "M", backpedal: "S", rotate: "90", energy: 0, hardpoints: 0 },
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

const PILOT_OPTIONS = ["Treadhead", "Surveyor", "Saboteur", "Duelist" ];

const PILOT_DATA = {
  "Treadhead": { ability: "Once per game, reroll all attack dice for a single volley." },
  "Surveyor": { ability: "Can detect stealth units at +1 sensor range." },
  "Duelist": { ability: "Add +1 surge result to melee attack rolls." },
  "Saboteur": { ability: "Ignores the first point of cover bonus when attacking." }
};

const WEAPON_DATA = {
  "Free Hand": { range: "Melee", damage: 1, energy: 2, hardpoints: 1, ability: "Counts as a light weapon for reactions." },
  "Pilebunker": { range: "Melee", damage: 4, energy: 3, hardpoints: 1, ability: "When this weapon disables an enemy frame, the pilot is immediately slain." },
  "Beam Saber": { range: "Melee", damage: 2, energy: 4, hardpoints: 1, ability: "SURGE: Automatically deal 1 damage to teh target." },
  "Thermal Lance": { range: "Long", damage: 5, energy: 2, hardpoints: 2, ability: "Penetrates armor. Causes overheating on hit." },
  "Howitzer": { range: "Long", damage: 4, energy: 4, hardpoints: 2, ability: "Area of effect. Deals splash damage." },
  "Mortar Pods": { range: "Long", damage: 2, energy: 3, hardpoints: 1, ability: "Indirect fire. Can arc over obstacles." }
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

export default function RosterEditor() {
  const [roster, setRoster] = useState([]);

  const saveRoster = () => {
    const blob = new Blob([JSON.stringify(roster, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'roster.json';
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
        alert("Invalid roster file.");
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
      upgrades: ['', '', '']
    }]);
  };

  return (
    <div className="p-4 text-blue-300 font-straczynski bg-gradient-to-b from-black via-[#0f1a3a] to-[#060a14] animate-bloom min-h-screen relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[url('/scanlines.svg')] before:bg-repeat before:opacity-20 before:pointer-events-none before:z-10 after:content-[''] after:absolute after:inset-0 after:pointer-events-none after:z-10 after:blur after:opacity-40 after:mix-blend-screen relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[repeating-linear-gradient(0deg,_rgba(255,255,255,0.03)_0px,_rgba(255,255,255,0.03)_1px,_transparent_1px,_transparent_4px)] before:pointer-events-none before:z-10">
      <h1 className="text-3xl font-bold border-b border-blue-500 mb-2 pb-1 bg-gradient-to-r from-blue-400 to-blue-700 bg-clip-text text-transparent shadow-[0_0_0.5px_red,0_0_1px_lime,0_0_1.5px_blue]">MOBILE ARMS: ENDLESS DESTINY - Roster Editor</h1>
      <p className="mb-4">Total Tonnage: {roster.reduce((sum, mech) => sum + (mech.tonnage || 0), 0)}</p>
      <div className="flex flex-wrap gap-2 items-center">
        <Button className="transition-transform hover:animate-glitch" onClick={addMechFrame}>Add Mech Frame</Button>
        <Button className="transition-transform hover:animate-glitch" onClick={saveRoster}>Save Roster</Button>
        <label className="text-blue-400 text-sm cursor-pointer border border-blue-500 px-3 py-1 rounded hover:bg-blue-500 hover:text-black transition">
          Load Roster
          <input type="file" accept=".json" onChange={loadRoster} className="hidden" />
        </label>
      </div>
      <div className="mt-4 space-y-6">
        {roster.map((mech, index) => (
          <Card key={mech.id} className="bg-black/60 border border-blue-700 p-4">
            <CardContent className="space-y-3">
              <div className="flex gap-2">
              <Input
                placeholder="Callsign"
                className="w-full border-blue-600 bg-black text-blue-300 placeholder-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 hover:brightness-125 hover:animate-glitch"
                value={mech.callsign || ''}
                onChange={(e) => setRoster(prev => prev.map((m, i) => i === index ? { ...m, callsign: e.target.value } : m))}
              />
                <Select
                  value={mech.name || 'none'}
                  onValueChange={(val) => {
                    const frame = FRAME_DATA[val];
                    if (frame) setRoster(prev => prev.map((m, i) => i === index ? { ...m, name: val, tonnage: frame.tonnage, energy: frame.energy } : m));
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
                <Button onClick={() => setRoster(prev => prev.filter((_, i) => i !== index))}>Remove</Button>
              </div>
              <p className="text-sm text-blue-400">Tonnage: {mech.tonnage}</p>
<p className="text-sm text-blue-400">
  Power: {
    [...mech.weapons, ...mech.upgrades].reduce((sum, item) => {
    const w = WEAPON_DATA[item];
    const u = UPGRADE_DATA[item];
    return sum + (w?.energy || 0) + (u?.energy || 0);
  }, MOBILITY_DATA[mech.mobility]?.energy || 0)
  } / {mech.energy}
</p>
<div className="w-full h-4 bg-black border border-blue-500 rounded overflow-hidden">
  <div
    className={`h-full transition-all duration-500 ${
      [...mech.weapons, ...mech.upgrades].reduce((sum, item) => {
  const w = WEAPON_DATA[item];
  const u = UPGRADE_DATA[item];
  return sum + (w?.energy || u?.energy || 0);
}, MOBILITY_DATA[mech.mobility]?.energy || 0) > mech.energy
        ? 'bg-red-500 animate-pulse'
        : 'bg-blue-400'
    }`}
    style={{
      width: `${Math.min(
        100,
        ([...mech.weapons, ...mech.upgrades].reduce((sum, item) => {
          const w = WEAPON_DATA[item];
          const u = UPGRADE_DATA[item];
          return sum + (w?.energy || u?.energy || 0);
        }, 0) / mech.energy) * 100
      )}%`
    }}
  />
</div>

<p className="text-sm text-blue-400">Hardpoints: {FRAME_DATA[mech.name]?.hardpoints || 0} | Used: {[...mech.weapons, ...mech.upgrades].reduce((sum, item) => {
    const w = WEAPON_DATA[item];
    const u = UPGRADE_DATA[item];
    return sum + (w?.hardpoints || u?.hardpoints || 0);
  }, MOBILITY_DATA[mech.mobility]?.hardpoints || 0)}</p>
<div className="flex items-center gap-1">
  {[...Array(FRAME_DATA[mech.name]?.hardpoints || 0)].map((_, i) => (
    <div
      key={i}
      className={`w-4 h-4 rounded-full border ${
  [...mech.weapons, ...mech.upgrades].reduce((sum, item) => {
    const w = WEAPON_DATA[item];
    const u = UPGRADE_DATA[item];
    return sum + (w?.hardpoints || u?.hardpoints || 0);
  }, MOBILITY_DATA[mech.mobility]?.hardpoints || 0) > FRAME_DATA[mech.name]?.hardpoints
    ? 'border-red-500 bg-red-500 animate-pulse'
    : i < [...mech.weapons, ...mech.upgrades].reduce((sum, item) => {
      const w = WEAPON_DATA[item];
      const u = UPGRADE_DATA[item];
      return sum + (w?.hardpoints || u?.hardpoints || 0);
    }, MOBILITY_DATA[mech.mobility]?.hardpoints || 0)
    ? 'border-blue-400 bg-blue-400 animate-pulse'
    : 'border-blue-400'}`}
    />
  ))}
</div>

              {/* Pilot Selection UI */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <Card className="bg-blue-950 border border-blue-700">
                  <CardContent className="space-y-2">
                    <label className="text-sm text-blue-300">Pilot</label>
<Select
  value={mech.pilot || 'none'}
  onValueChange={(val) => {
    setRoster(prev => prev.map((m, i) =>
      i === index ? { ...m, pilot: val === 'none' ? '' : val } : m
    ));
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
    Hover: {PILOT_DATA[mech.pilot].ability}
  </p>
)}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
              setRoster(prev => prev.map((m, idx) => idx === index ? { ...m, weapons: updated } : m));
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
              <p><strong>{RANGE_ICONS[WEAPON_DATA[weapon].range]} {weapon}</strong> — {WEAPON_DATA[weapon].range}, DMG {WEAPON_DATA[weapon].damage}, EN {WEAPON_DATA[weapon].energy}</p>
              <p title={WEAPON_DATA[weapon].ability} className="italic text-blue-400 truncate max-w-full cursor-help">
                Hover: {WEAPON_DATA[weapon].ability}
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
              setRoster(prev => prev.map((m, idx) => idx === index ? { ...m, upgrades: updated } : m));
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
              <p><strong>{upgrade}</strong> — {UPGRADE_DATA[upgrade].bonus}, EN {UPGRADE_DATA[upgrade].energy}</p>
              <p title={UPGRADE_DATA[upgrade].ability} className="italic text-blue-400 truncate max-w-full cursor-help">
                Hover: {UPGRADE_DATA[upgrade].ability}
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
              </div>

              {/* Mobility Selection UI */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <Card className="bg-blue-950 border border-blue-700">
                  <CardContent className="space-y-2">
                    <label className="text-sm text-blue-300">Mobility</label>
                    <Select
                      value={mech.mobility || 'none'}
                      onValueChange={(val) => {
                        setRoster(prev => prev.map((m, i) =>
                          i === index ? { ...m, mobility: val === 'none' ? '' : val } : m
                        ));
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
                    <p className="text-xs mt-2 text-blue-300">
                      Move: {MOBILITY_DATA[mech.mobility]?.move || '-'} | 
                      Strafe: {MOBILITY_DATA[mech.mobility]?.strafe || '-'} | 
                      Backpedal: {MOBILITY_DATA[mech.mobility]?.backpedal || '-'} | 
                      Rotate: {MOBILITY_DATA[mech.mobility]?.rotate || '-'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
