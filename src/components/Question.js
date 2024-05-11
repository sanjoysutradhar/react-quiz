import { useContext } from "react";
import Options from "./Options";
import { useQuiz } from "../contexts/QuizContext";
function Question() {
  const { questions, index, dispatch, answer } = useQuiz();
  const question = questions[index];
  console.log(question);
  return (
    <div>
      <h4>{question.question}</h4>
      <Options question={question} dispatch={dispatch} answer={answer} />
    </div>
  );
}

export default Question;
