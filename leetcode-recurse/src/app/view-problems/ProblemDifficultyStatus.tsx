interface ProblemDifficultyProps {
  difficulty: string;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "easy":
      return `
        bg-green-100 text-green-700
        dark:bg-green-900/30 dark:text-green-300
      `;
    case "medium":
      return `
        bg-yellow-100 text-yellow-700
        dark:bg-yellow-900/30 dark:text-yellow-300
      `;
    case "hard":
      return `
        bg-red-100 text-red-700
        dark:bg-red-900/30 dark:text-red-300
      `;
    default:
      return `
        bg-gray-100 text-gray-700
        dark:bg-gray-800 dark:text-gray-300
      `;
  }
};

function ProblemDifficultyStatus({ difficulty }: ProblemDifficultyProps) {
  const color = getDifficultyColor(difficulty.toLowerCase());

  return (
    <span
      className={`
        inline-flex items-center justify-center
        px-3 py-1 rounded-full text-sm font-semibold
        ${color}
      `}
    >
      {difficulty}
    </span>
  );
}

export default ProblemDifficultyStatus;
