import { useAtom } from "jotai";
import { Canvas } from "@/sections/Canvas";
import { computed, files } from "@/state";

const Results = () => {
  const [getFiles] = useAtom(files);
  const [getComputed] = useAtom(computed);

  return (
    <div>
      {getFiles.map((_, index) => (
        <Canvas
          key={index}
          image={getComputed.data?.[index]?.image}
          width={200}
          height={200}
          originalWidth={200}
          originalHeight={200}
          fit={"cover"}
          margin={10}
          transparent={true}
          background={"red"}
        />
      ))}
    </div>
  );
};

export default Results;
