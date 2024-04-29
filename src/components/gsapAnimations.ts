import { gsap } from "gsap";

export function attackAnimation() {
  const attacker = document.querySelector(".attackSource");
  const target = document.querySelector(".attackTarget");
  if (attacker && target) {
    const targetBox = target.getBoundingClientRect();
    const attackerBox = attacker.getBoundingClientRect();
    const offsetX = targetBox.left - attackerBox.left;
    const offsetY = targetBox.top - attackerBox.top;

    const tl = gsap.timeline({});
    tl.to(attacker, { x: offsetX, y: offsetY, duration: 0.3 });
    tl.to(attacker, { x: 0, y: 0, duration: 0.4 });

    tl.play();
    const additionalAttacker = document.querySelector(".additionalAttacker");
    if (additionalAttacker) {
      const addAttackerBox = additionalAttacker.getBoundingClientRect();
      const addOffsetX = targetBox.left - addAttackerBox.left;
      const addOffsetY = targetBox.top - addAttackerBox.top;
      const tl2 = gsap.timeline({});
      tl2.to(additionalAttacker, {
        x: addOffsetX,
        y: addOffsetY,
        duration: 0.3,
      });
      tl2.to(additionalAttacker, { x: 0, y: 0, duration: 0.4 });

      tl2.play();
      return () => {
        tl.clear();
        tl2.clear();
      };
    }
    return () => tl.clear();
  }
};
