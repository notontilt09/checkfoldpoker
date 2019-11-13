
const solver = require('pokersolver').Hand;

// scores for top hands
const topValueMap = {
  '66': 1,
  '77': 2,
  '88': 3,
  '99': 4,
  'TT': 5,
  'JJ': 6,
  'QQ': 7,
  'KK': 8,
  'AA': 9,
  '222': 10,
  '333': 11,
  '444': 12,
  '555': 13,
  '666': 14,
  '777': 15,
  '888': 16,
  '999': 17,
  'TTT': 18,
  'JJJ': 19,
  'QQQ': 20,
  'KKK': 21,
  'AAA': 22
};

// scores for bottom hands by rank
const bottomValueMap = {
  'Straight': 2,
  'Flush': 4,
  'Full House': 6,
  'Four of a Kind': 10,
  'Straight Flush': 15,
  'Royal Flush': 25
};

//scores for middle hands
const middleValueMap = {
  'Three of a Kind': 2,
};

for (let rank in bottomValueMap) {
  middleValueMap[rank] = bottomValueMap[rank] * 2;
}

/**
 * 
 * @cards array of card ranks without suits
 * returns royalty value of a top hand
 */

const getTopRoyalties = (cards) => {
  // map of counts of each card
  const counts = {}
  
  cards.forEach(card => {
    if (counts[card]) {
      counts[card]++; 
    } else {
      counts[card] = 1
    }
  });
  
  // find string representation of hand for lookup in topValueMap
  let str;
  for (let card in counts) {
    if (counts[card] === 2) {
      str = `${card}${card}`
    } else if (counts[card] === 3) {
      str = `${card}${card}${card}`
    }
  }
  
  // return correct royalty points
  if (topValueMap[str]) {
    return topValueMap[str];
  } else {
    return 0;
  }
}

/**
 * 
 * @cards - 5 card hand of ranks with suits to be evaluated 
 */

const getMiddleRoyalites = (cards) => {
  const solved = solver.solve(cards);
  // straight flush and royal flush are both named 'Straight Flush' in solver library, need to access .descr property to distinguish
  if (solved.name === 'Straight Flush') {
    if (solved.descr === 'Royal Flush') {
      return middleValueMap['Royal Flush'];
    } else {
      return middleValueMap['Straight Flush'];
    }
  } else {
    if (middleValueMap[solved.name]) {
      return middleValueMap[solved.name];
    }
  }

  return 0;
}

// helper function to return hand information from top hand
const evaluateTop = (cards) => {
  
}

/**
 * 
 * This is a utility function to score OFC hands against each other.
 * Currently only compatible with Pineapple Hi.
 * 
 * @hand1 - an OFC hand consisting of an array of 3 subarray, representing the top/middle/bottom rows of a hand
 * @hand2 - a second OFC hand
 */

const scoreOFC = (hand1, hand2) => {
  // total royalty points for each hand
  let hand1royalty = 0;
  let hand2royalty = 0;
  // total lines won for each hand
  let hand1lines = 0;
  let hand2lines = 0;

  // parse top hands out of the hand arrays;
  let [top1, top2] = [hand1[0], hand2[0]];
  // strip the suits, since they are irrelevant for top scoring
  top1ranks = top1.map(card => card[0]);
  top2ranks = top2.map(card => card[0]);
  // add royalties of each top to total points
  hand1royalty += getTopRoyalties(top1ranks);
  hand2royalty += getTopRoyalties(top2ranks);
  // use solver to determine winner of top
  const solvedTop1 = solver.solve(top1);
  const solvedTop2 = solver.solve(top2);
  const topWinner = solver.winners([solvedTop1, solvedTop2]);
  // if hand 1 wins the top
  if (topWinner.length === 1 && topWinner[0] === solvedTop1) {
    console.log(`${top1} wins top`)
    hand1lines++;
  // if hand 2 wins the top
  } else if (topWinner.length === 1 && topWinner[0] === solvedTop2) {
    console.log(`${top2} wins top`)
    hand2lines++;
  // if the top is tied
  } else {
    console.log('Top is tied');
  }

  // TODO: evaluate middle hand and add royalites
  const [middle1, middle2] = [hand1[1], hand2[1]];
  // get royalties of each middle
  hand1royalty += getMiddleRoyalites(middle1);
  hand2royalty += getMiddleRoyalites(middle2);

  const solvedMid1 = solver.solve(middle1);
  const solvedMid2 = solver.solve(middle2);
  const middleWinner = solver.winners([solvedMid1, solvedMid2]);

  // if hand 1 wins middle
  if (middleWinner.length === 1 && middleWinner[0] === solvedMid1) {
    console.log(`${middle1} wins middle`)
    hand1lines++;
  // if hand 2 wins middle
  } else if (middleWinner.length === 1 && middleWinner[0] === solvedMid2) {
    console.log(`${middle2} wins middle`)
    hand2lines++;
  // if middle is tied
  } else {
    console.log('Middle is tied');
  }
  
  // TODO: evaluate back hand and add royalites

}

const test1 = [['Ad', 'Ac', 'As'], ['9s', '8s', '7s', '6s', '5h'], ['Ac', 'Kc', 'Qc', 'Jc', 'Tc']];
const test2 = [['6d', '6s', 'Jh'], ['2s', '2h', '2c', '2d', '5s'], ['3c', '3d', '3h', '3s', '4c']];

scoreOFC(test1, test2);

