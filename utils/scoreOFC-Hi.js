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
 * Helper function to get royalty points for middle hands 
 *
 * @cards {array} 5 card hand of ranks with suits to be evaluated
 * return {int} number of royalty points
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

/**
 * Helper function to get royalty points for bottom hands
 * 
 * @cards - 5 card hand of ranks with suits to be evaluated 
 * return {int} number of royalty points
 */

const getBottomRoyalties = (cards) => {
  const solved = solver.solve(cards);
  // straight flush and royal flush are both named 'Straight Flush' in solver library, need to access .descr property to distinguish
  if (solved.name === 'Straight Flush') {
    if (solved.descr === 'Royal Flush') {
      return bottomValueMap['Royal Flush'];
    } else {
      return bottomValueMap['Straight Flush'];
    }
  } else {
    if (bottomValueMap[solved.name]) {
      return bottomValueMap[solved.name];
    }
  }

  return 0;
}

/**
 * 
 * This is a utility function to determine if a final hand is valid or fouled 
 * 
 * @hand - an array of 3 sub-arrays of lengths 3,5,5
 * return true if hand is foul, false if valid
 * 
 */

const isFoul = (hand) => {
  const [top, middle, bottom] = [hand[0], hand[1], hand[2]];
  const [solvedTop, solvedMiddle, solvedBottom] = [
    solver.solve(top),
    solver.solve(middle),
    solver.solve(bottom)
  ];

  // compare bottom and middle, if middle wins, return false
  const bottomMiddleWinner = solver.winners([solvedMiddle, solvedBottom]);
  if (bottomMiddleWinner.length === 1 && bottomMiddleWinner[0] === solvedMiddle) {
    return true;
  }

  // compare middle and top, if top wins, return false
  const middleTopWinner = solver.winners([solvedTop, solvedMiddle]);
  if (middleTopWinner.length === 1 && middleTopWinner[0] === solvedTop) {
    return true;
  }

  return false;
}

/**
 * 
 * This is a utility function to score OFC hands against each other.
 * Currently only compatible with Pineapple Hi.
 * 
 * @hand1 - an OFC hand consisting of an array of 3 subarray, representing the top/middle/bottom rows of a hand
 * @hand2 - a second OFC hand
 * 
 * return array of objects of shape:
 *  {
 *    foul: boolean,
 *    result: int (number of points won/lost)
 *  }
 * 
 */

const scoreOFChi = (hand1, hand2) => {
  // total royalty points for each hand
  let hand1royalty = 0;
  let hand2royalty = 0;
  // total lines won for each hand
  let hand1lines = 0;
  let hand2lines = 0;

  // * TOP HAND EVALUATION
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
    // console.log(`${top1} wins top`);
    hand1lines++;
  // if hand 2 wins the top
  } else if (topWinner.length === 1 && topWinner[0] === solvedTop2) {
    // console.log(`${top2} wins top`);
    hand2lines++;
  // if the top is tied
  } else {
    // console.log('Top is tied');
  }

  // * MIDDLE HAND EVALUATION
  const [middle1, middle2] = [hand1[1], hand2[1]];
  // get royalties of each middle
  hand1royalty += getMiddleRoyalites(middle1);
  hand2royalty += getMiddleRoyalites(middle2);

  const solvedMid1 = solver.solve(middle1);
  const solvedMid2 = solver.solve(middle2);
  const middleWinner = solver.winners([solvedMid1, solvedMid2]);

  // if hand 1 wins middle
  if (middleWinner.length === 1 && middleWinner[0] === solvedMid1) {
    // console.log(`${middle1} wins middle`)
    hand1lines++;
  // if hand 2 wins middle
  } else if (middleWinner.length === 1 && middleWinner[0] === solvedMid2) {
    // console.log(`${middle2} wins middle`)
    hand2lines++;
  // if middle is tied
  } else {
    // console.log('Middle is tied');
  }
  
  // * BOTTOM HAND EVALUATION
  const [bottom1, bottom2] = [hand1[2], hand2[2]];
  // get royalties of each middle
  hand1royalty += getBottomRoyalties(bottom1);
  hand2royalty += getBottomRoyalties(bottom2);

  const solvedBottom1 = solver.solve(bottom1);
  const solvedBottom2 = solver.solve(bottom2);
  const bottomWinner = solver.winners([solvedBottom1, solvedBottom2]);

  // if hand 1 wins bottom
  if (bottomWinner.length === 1 && bottomWinner[0] === solvedBottom1) {
    // console.log(`${bottom1} wins bottom`)
    hand1lines++;
  // if hand 2 wins bottom
  } else if (bottomWinner.length === 1 && bottomWinner[0] === solvedBottom2) {
    // console.log(`${bottom2} wins bottom`)
    hand2lines++;
  // if bottom is tied
  } else {
    // console.log('Bottom is tied');
  }

  // ! FINAL SCORING LOGIC
  console.log(`Hand 1 Royalty: ${hand1royalty}, Hand 1 Lines Won: ${hand1lines}`);
  console.log(`Hand 2 Royalty: ${hand2royalty}, Hand 2 Lines Won: ${hand2lines}`);

  // add scoop bonus
  hand1lines = hand1lines === 3 ? 6 : hand1lines;
  hand2lines = hand2lines === 3 ? 6 : hand2lines;

  if (isFoul(hand1)) {
    if (isFoul(hand2)) {
      // both are fouled
      return [
        {
          foul: true,
          result: 0
        },
        {
          foul: true,
          result: 0
        }
      ];
    } else {
      // only hand1 is fouled
      return [
        {
          foul: true,
          result: -6 - hand2royalty
        },
        {
          foul: false,
          result: 6 + hand2royalty
        }
      ];
    }
  } else {
    if (isFoul(hand2)) {
      // only hand 2 is foulded
      return [
        {
          foul: false,
          result: 6 + hand1royalty
        },
        {
          foul: true,
          result: -6 - hand1royalty
        }
      ];
    } else {
      // neither hand fouls
      return [
        {
          foul: false,
          result: hand1lines + hand1royalty - hand2lines - hand2royalty
        },
        {
          foul: false,
          result: hand2lines + hand2royalty - hand1lines - hand1royalty
        }
      ];
    }
  }
}

const test1 = [['9d', '9c', '6s'], ['As', 'Ks', 'Js', 'Qs', 'Tc'], ['Ac', 'Kc', 'Qc', 'Jc', '9c']];
const test2 = [['Kd', 'Qs', '6h'], ['2s', '2h', '2c', '3d', '5s'], ['3c', '3d', '3h', '3s', '4c']];

console.log(scoreOFChi(test1, test2));

module.exports = { scoreOFChi, isFoul };