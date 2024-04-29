/* global window */
import { useSelector } from "react-redux";
import cn from "classnames";

import StepIcon from "./StepIcon";
import Energize from "../icons/Energize";
import Attack from "../icons/Attack";
import Power from "../icons/Power";
import Creature from "../icons/Creature";
import Draw from "../icons/Draw";
import {
  STEP_ENERGIZE,
  STEP_PRS_FIRST,
  STEP_ATTACK,
  STEP_CREATURES,
  STEP_PRS_SECOND,
  STEP_DRAW,
} from "../../const";
import { getCurrentStep, isOurTurn } from "../../selectors";

const OUR_TURN_ACTIVE = "#32bb32";
const NOT_OUR_TURN_ACTIVE = "#F8E71C";

function StepBoard() {
  const currentStep = useSelector(getCurrentStep);
  const ourTurn = useSelector(isOurTurn);

  const activeColor = ourTurn ? OUR_TURN_ACTIVE : NOT_OUR_TURN_ACTIVE;

  return (
    <div className={cn("StepBoard", { ourTurn: ourTurn })}>
      <StepIcon
        icon={<Energize fillColor="#ccc" />}
        active={currentStep === STEP_ENERGIZE}
        activeColor={activeColor}
      />
      <StepIcon
        icon={<Power fillColor="#ccc" />}
        active={currentStep === STEP_PRS_FIRST}
        activeColor={activeColor}
      />
      <StepIcon
        icon={<Attack fillColor="#ccc" />}
        active={currentStep === STEP_ATTACK}
        activeColor={activeColor}
      />
      <StepIcon
        icon={<Creature fillColor="#ccc" />}
        active={currentStep === STEP_CREATURES}
        activeColor={activeColor}
      />
      <StepIcon
        icon={<Power fillColor="#ccc" />}
        active={currentStep === STEP_PRS_SECOND}
        activeColor={activeColor}
      />
      <StepIcon
        icon={<Draw fillColor="#ccc" />}
        active={currentStep === STEP_DRAW}
        activeColor={activeColor}
      />
    </div>
  );
}

export default StepBoard;
