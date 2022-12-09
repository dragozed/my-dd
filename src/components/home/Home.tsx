import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectTeamSelection, setDepth } from "../dungeon/dungeonSlice";
import { teamGenerator } from "../logic";

export const Home = () => {
  const dispatch = useAppDispatch();

  const teamSelection = useAppSelector(selectTeamSelection);
  useEffect(() => {
    teamGenerator(
      dispatch,
      teamSelection[0],
      teamSelection[1],
      teamSelection[2]
    );
    dispatch(setDepth(0));
  }, []);

  return <>HOMEPAGE</>;
};
