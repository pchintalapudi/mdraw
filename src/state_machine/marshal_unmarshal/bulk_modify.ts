

    // public copy() {
    //     const rgroupsSelected = this.selected.filter(r => r instanceof RGroup) as RGroup[];
    //     return serialize(rgroupsSelected, getValidBonds(rgroupsSelected),
    //         this.selected.filter(s => s instanceof StraightArrow) as StraightArrow[]);
    // }

    // public delete() {
    //     const removedRGroups = new Map<RGroup, number>();
    //     const removedStraightArrows = new Map<StraightArrow, number>();
    //     this.selected.forEach(r => r instanceof RGroup ?
    //         removedRGroups.set(r, -1) :
    //         r instanceof StraightArrow && removedStraightArrows.set(r, -1));
    //     for (let i = 0; i < this.rgroups.length; i++) {
    //         if (removedRGroups.has(this.rgroups[i])) {
    //             removedRGroups.set(this.rgroups[i], i);
    //         }
    //     }
    //     for (let i = 0; i < this.straightArrows.length; i++) {
    //         if (removedStraightArrows.has(this.straightArrows[i])) {
    //             removedStraightArrows.set(this.straightArrows[i], i);
    //         }
    //     }
    //     const removedBonds = new Map<Bond, number>();
    //     this.selected.filter(s => s instanceof RGroup).map(r => (r as RGroup).bonds)
    //         .forEach(bmap => bmap.forEach(b => removedBonds.set(b, -1)));
    //     for (let i = 0; i < this.bonds.length; i++) {
    //         if (removedBonds.has(this.bonds[i])) {
    //             removedBonds.set(this.bonds[i], i);
    //         }
    //     }
    //     const undo = (sm: StateMachine) => {
    //         const newRGroups: RGroup[] = [];
    //         const newBonds: Bond[] = [];
    //         const newStraightArrows: StraightArrow[] = [];
    //         newRGroups.length = sm.stateVariables.rgroups.length + removedRGroups.size;
    //         newBonds.length = sm.stateVariables.bonds.length + removedBonds.size;
    //         removedRGroups.forEach((i, r) => newRGroups[i] = r);
    //         removedBonds.forEach((i, b) => newBonds[i] = b);
    //         removedStraightArrows.forEach((i, s) => newStraightArrows[i] = s);
    //         let j = -1;
    //         for (const r of sm.stateVariables.rgroups) {
    //             while (newRGroups[++j]);
    //             newRGroups[j] = r;
    //         }
    //         j = -1;
    //         for (const b of sm.stateVariables.bonds) {
    //             while (newBonds[++j]);
    //             newBonds[j] = b;
    //         }
    //         j = -1;
    //         for (const s of sm.stateVariables.straightArrows) {
    //             while (newBonds[++j]);
    //             newStraightArrows[j] = s;
    //         }
    //         sm.stateVariables.rgroups = newRGroups;
    //         sm.stateVariables.bonds = newBonds;
    //         sm.stateVariables.straightArrows = newStraightArrows;
    //     };
    //     const redo = (sm: StateMachine) => {
    //         sm.stateVariables.rgroups = sm.stateVariables.rgroups.filter(r => !removedRGroups.has(r));
    //         sm.stateVariables.bonds = sm.stateVariables.bonds.filter(b => !removedBonds.has(b));
    //         sm.stateVariables.straightArrows =
    //             sm.stateVariables.straightArrows.filter(s => !removedStraightArrows.has(s));
    //     };
    //     this.log(undo, redo);
    //     this.rgroups = this.rgroups.filter(r => !removedRGroups.has(r));
    //     this.bonds = this.bonds.filter(b => !removedBonds.has(b));
    // }