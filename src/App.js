import React from "react"
import Die from "./components/Die"
import "./App.css"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"
export default function App() {

  const [dice, setDice] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false);
  const [yourScore, setYourScore] = React.useState(0);
  const [bestScore, setBestScore] = React.useState(JSON.parse(localStorage.getItem("key")) || 1000);


  React.useEffect(() => {
    const allheld = dice.every(die => die.isHeld);
    const firstVal = dice[0].value;
    const allValue = dice.every(die => die.value === firstVal);
    if (allheld && allValue) {
      setTenzies(true);
      console.log("You Won!")
    }
  }, [dice])
  React.useEffect(() => {
    localStorage.setItem("key", JSON.stringify(JSON.parse(bestScore)));

  })

  function allNewDice() {
    const newDice = []
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDic())
    }
    return newDice;
  }
  function generateNewDic() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    }
  }

  function holdDice(id) {
    setDice((oldDice) => oldDice.map(die => {
      return die.id === id ?
        { ...die, isHeld: !die.isHeld } :
        die
    }))
  }


  const diceElements = dice.map(di => (
    < Die
      key={di.id}
      value={di.value}
      isHeld={di.isHeld}
      diceClick={() => holdDice(di.id)}
    />
  ))

  function rollDice() {
    setYourScore(prev => prev + 1)

    if (tenzies === true) {
      setTenzies(false);
      setDice(allNewDice());
      if (yourScore < bestScore) {
        setBestScore(yourScore);
      }
      setYourScore(0);
    }
    else {
      setDice(oldDice => oldDice.map(die => {
        return die.isHeld ?
          die :
          generateNewDic()
      }));
    }
  }


  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <p className="yourScore">Your Score:{yourScore}</p>
      <p className="bestScore">Best Score:{localStorage.getItem("key")}</p>
      <div className="dice-container">
        {diceElements}
      </div>
      <button
        className="roll-dice"
        onClick={rollDice}
      >{tenzies ? "New Game" : "Roll"}</button>
    </main>
  )
}