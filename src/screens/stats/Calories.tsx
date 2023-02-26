import { useOutletContext } from "react-router-dom";

export default function Calories(props: any) {
  const { width, height } = useOutletContext<{
    width: number;
    height: number;
  }>();
  return <div>calories</div>;
}
