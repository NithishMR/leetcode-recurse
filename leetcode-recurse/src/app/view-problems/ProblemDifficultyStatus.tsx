interface problemDifficultyProps {
  difficulty: string;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "easy":
      return "bg-green-100 text-green-700";
    case "medium":
      return "bg-yellow-100 text-yellow-700";
    case "hard":
      return "bg-red-100 text-red-700";
  }
};

function ProblemDifficultyStatus({ difficulty }: problemDifficultyProps) {
  const color = getDifficultyColor(difficulty);
  return (
    <div className="">
      <span
        className={`px-3 py-1 rounded-full text-sm font-semibold text-center ${color}`}
      >
        {difficulty}
      </span>
    </div>
  );
}
export default ProblemDifficultyStatus;
