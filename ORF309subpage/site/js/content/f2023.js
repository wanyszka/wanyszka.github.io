/* ================================================================
   Fall 2023 · Midterm 1 — interactive walkthrough
   ================================================================ */
ORF309.exams.push({
  id: 'f2023',
  title: 'Fall 2023 · Midterm 1',
  short: 'F23',
  date: 'October 2023',
  blurb: 'Building a probability measure from scratch, a gambler’s expected winnings, and ripening avocados with indicators and a conditioning trick.',
  intro: R`This exam is short on formulas and long on <em>modelling</em>: writing a sample space, defining random variables precisely, and reading an event correctly. The grading comments for it were detailed, and the spot-the-error checkpoints below quote the actual mistakes.`,

  problems: [

    /* ============================================================ */
    {
      id: 'p1',
      title: 'Zzzzzz',
      lead: 'Coffee, tea or juice, then awake or asleep: build the sample space and the measure, then apply Bayes.',
      tags: ['Sample space', 'Probability measure', 'Conditional probability', 'Bayes'],
      statement: R`
        <p>Every Monday, Wednesday, and Friday morning you wake up early so you can make it in time to your ORF 309 lecture. As soon as you wake up, you make yourself a cup of coffee, tea, or orange juice with probability 0.5, 0.4, or 0.1, respectively. If you had coffee, tea, or orange juice, then you fall asleep during the lecture with probability 0.1, 0.2, or 0.8, respectively.</p>
        <ul class="parts">
          <li><b>(a)</b><span>Think of your beverage choice/waking status during the lecture on a given class day as the outcome of a random experiment. What is a good sample space for this experiment? Construct the probability measure for this experiment explicitly.</span></li>
          <li><b>(b)</b><span>On a given Wednesday, you fall asleep in class. What is the probability that you had orange juice that morning?</span></li>
        </ul>`,
      parts: [
        {
          label: '(a)', title: 'Sample space and probability measure',
          question: R`What is a good sample space, and how do we construct the probability measure explicitly?`,
          steps: [
            {
              type: 'mcq',
              prompt: R`The outcome is “beverage choice <em>and</em> waking status”. Which sample space is appropriate?`,
              choices: [
                { text: R`\(\Omega = \{C, T, J\}\)`, feedback: R`That only records the beverage. The question also asks whether you fall asleep, and (b) needs both.` },
                { text: R`\(\Omega = \{C, T, J\} \times \{S, W\} = \{CS, CW, TS, TW, JS, JW\}\)`, correct: true, feedback: R`One outcome per combination of beverage (\(C, T, J\)) and status (\(S\) = asleep, \(W\) = awake). Six outcomes.` },
                { text: R`Two separate sample spaces, \(\{C, T, J\}\) for the drink and \(\{S, W\}\) for the lecture.`, feedback: R`A grading comment singles this out: the experiment is the <em>joint</em> one. Separate spaces cannot express “juice <em>and</em> asleep”, which is exactly what (b) is about.` },
                { text: R`\(\Omega = \{\text{Mon}, \text{Wed}, \text{Fri}\} \times \{C, T, J\} \times \{S, W\}\)`, feedback: R`Nothing in the problem depends on the day; adding it triples the bookkeeping for no benefit. (Also mentioned in the grading comments.)` }
              ],
              why: R`A sample space must list every outcome of the <em>whole</em> experiment, with enough detail to express every event the questions ask about, and no more.`,
              solution: R`Sample space: \(\Omega = \{CS, CW, TS, TW, JS, JW\}\), where the first letter is the beverage (\(C, T, J\)) and the second whether you fall asleep (\(S\)) or stay awake (\(W\)).`
            },
            {
              type: 'mcq',
              prompt: R`On a finite sample space, what is the minimal thing you must specify to define a probability measure?`,
              choices: [
                { text: R`The probability of every one of the \(2^6 = 64\) events.`, feedback: R`Unnecessary: the third axiom determines all of them from the singletons.` },
                { text: R`Only \(\P(C), \P(T), \P(J)\).`, feedback: R`That is the distribution of the beverage, not of the full outcome.` },
                { text: R`A nonnegative number for each of the six outcomes, summing to 1; then \(\P(A) = \sum_{\omega \in A}\P\{\omega\}\) by the third axiom.`, correct: true, feedback: R`As shown in class for finite sample spaces, this defines a measure: axiom 1 is immediate, axiom 3 is the definition, and axiom 2 is the check that the six numbers sum to 1.` },
                { text: R`Only the conditional probabilities \(\P(S \given C)\), etc.`, feedback: R`Those are ingredients, not the measure. You must combine them with the beverage probabilities.` }
              ],
              why: R`“Construct the probability measure explicitly” means: give the number for each outcome and say why that is enough. Graders noted that forgetting to say why the singletons suffice lost points.`,
              solution: R`It suffices to assign a probability to each outcome (nonnegative, summing to 1); then \(\P(A) = \sum_{\omega \in A}\P\{\omega\}\) defines a measure by axiom 3.`
            },
            {
              type: 'mcq',
              figure: { name: 'area', opts: { eventName: 'S', cases: [{ name: 'C', prob: 0.5, cond: 0.1, label: '0.5', condLabel: '0.1' }, { name: 'T', prob: 0.4, cond: 0.2, label: '0.4', condLabel: '0.2' }, { name: 'J', prob: 0.1, cond: 0.8, label: '0.1', condLabel: '0.8' }], cap1: 'Columns are the beverages, with widths 0.5, 0.4, 0.1.', cap2: 'Within each column, shade the fraction that falls asleep: 0.1, 0.2, 0.8. Each shaded block is one outcome of the sample space, e.g. the \\(C\\) block is \\(\\P\\{CS\\}\\); the unshaded part is \\(\\P\\{CW\\}\\).', cap3: '\\(\\P(S)\\) is the total shaded area: the three sleepy outcomes added up (axiom 3).' } },
              prompt: R`Compute \(\P\{CS\}\), the probability of coffee and falling asleep.`,
              choices: [
                { text: R`\(0.5 + 0.1 = 0.6\)`, feedback: R`“And” is not addition.` },
                { text: R`\(0.1\)`, feedback: R`That is \(\P(S \given C)\), a conditional probability. You still have to multiply by \(\P(C)\).` },
                { text: R`\(0.5 \times 0.1 = 0.05\)`, correct: true, feedback: R`\(\P(C \cap S) = \P(S \given C)\,\P(C) = 0.1 \times 0.5\).` },
                { text: R`\(0.5 \times 0.9 = 0.45\)`, feedback: R`That is \(\P\{CW\}\): coffee and staying awake.` }
              ],
              why: R`The problem hands you conditional probabilities (“if you had coffee, you fall asleep with probability 0.1”). The definition of conditional probability, \(\P(A \cap B) = \P(A \given B)\P(B)\), turns them into probabilities of outcomes. In the figure, each outcome is a rectangle: width = beverage probability, height = conditional probability.`,
              solution: R`By the definition of conditional probability, \(\P\{CS\} = \P(S \given C)\,\P(C) = 0.1 \times 0.5 = 0.05\).`
            },
            {
              type: 'input',
              prompt: R`Compute \(\P\{JW\}\), juice and staying awake.`,
              placeholder: 'e.g. 0.02', numeric: 0.02, tol: 1e-6, display: '0.02',
              feedback: R`\(\P(W \given J)\,\P(J) = (1 - 0.8)\times 0.1 = 0.02\).`,
              wrong: R`\(\P(W \given J) = 1 - \P(S \given J)\). Multiply by \(\P(J)\).`,
              solution: R`Similarly \(\P\{JW\} = \P(W \given J)\,\P(J) = 0.2 \times 0.1 = 0.02\).`
            },
            {
              type: 'reveal',
              prompt: R`Fill in all six numbers and check that they sum to 1. Then reveal.`,
              html: R`
                \[\begin{array}{c|cc}
                   & S \text{ (asleep)} & W \text{ (awake)} \\ \hline
                  C & 0.05 & 0.45 \\
                  T & 0.08 & 0.32 \\
                  J & 0.08 & 0.02
                \end{array}\]
                <p>Sum: \(0.05 + 0.45 + 0.08 + 0.32 + 0.08 + 0.02 = 1\). ✓ With nonnegative numbers summing to one, \(\P(A) = \sum_{\omega \in A}\P\{\omega\}\) is a probability measure.</p>`,
              why: R`The check that the numbers sum to 1 is not decoration: it is axiom 2, and it catches arithmetic slips before they propagate into part (b).`,
              solution: R`The full measure: \(\P\{CS\} = 0.05,\ \P\{CW\} = 0.45,\ \P\{TS\} = 0.08,\ \P\{TW\} = 0.32,\ \P\{JS\} = 0.08,\ \P\{JW\} = 0.02\). These sum to \(1\) (axiom 2), so \(\P\) is a probability measure.`
            }
          ]
        },
        {
          label: '(b)', title: 'Juice, given that you fell asleep',
          question: R`Compute \(\P(J \given S)\).`,
          steps: [
            {
              type: 'mcq',
              figure: { name: 'area', opts: { eventName: 'S', bayes: 2, cases: [{ name: 'C', prob: 0.5, cond: 0.1, label: '0.5', condLabel: '0.1' }, { name: 'T', prob: 0.4, cond: 0.2, label: '0.4', condLabel: '0.2' }, { name: 'J', prob: 0.1, cond: 0.8, label: '0.1', condLabel: '0.8' }], cap4: 'Given that you fell asleep, only the shaded area remains. \\(\\P(J\\given S)\\) is the share of it that is the juice block: \\(0.08 / 0.21\\).' } },
              prompt: R`Which is the right approach?`,
              choices: [
                { text: R`\(\P(J \given S) = \P(S \given J) = 0.8\).`, feedback: R`Direction confusion: “asleep given juice” is 0.8; “juice given asleep” is the question.` },
                { text: R`\(\P(J \given S) = \P\{JS\} = 0.08\).`, feedback: R`That is the joint probability. You still need to divide by \(\P(S)\).` },
                { text: R`\(\P(J \given S) = \dfrac{\P(S \given J)\,\P(J)}{\P(S)}\), with \(\P(S) = \P\{CS\} + \P\{TS\} + \P\{JS\}\).`, correct: true, feedback: R`Bayes, with the denominator obtained from the measure built in (a): \(S = \{CS, TS, JS\}\), so axiom 3 gives \(\P(S)\) as a sum of three numbers.` },
                { text: R`\(\P(J \given S) = \P(J) = 0.1\), because the drink is chosen before the lecture.`, feedback: R`Conditioning is about information, not chronology. Falling asleep is strong evidence for juice.` }
              ],
              why: R`Having an explicit measure makes Bayes almost mechanical: the numerator is one outcome, the denominator is the sum of the outcomes in \(S\).`,
              solution: R`By Bayes, \[\P(J \given S) = \frac{\P(S \given J)\,\P(J)}{\P(S)}, \qquad \P(S) = \P\{CS\} + \P\{TS\} + \P\{JS\}.\]`
            },
            {
              type: 'input',
              prompt: R`Compute \(\P(S)\).`,
              placeholder: 'e.g. 0.21', numeric: 0.21, tol: 1e-6, display: '0.21',
              feedback: R`\(\P(S) = 0.05 + 0.08 + 0.08 = 0.21\).`,
              wrong: R`\(S = \{CS, TS, JS\}\); add the three numbers from the table.`,
              solution: R`\(\P(S) = 0.05 + 0.08 + 0.08 = 0.21\).`
            },
            {
              type: 'input',
              prompt: R`Now \(\P(J \given S) = \;?\) (a fraction or a decimal)`,
              placeholder: 'e.g. 8/21', numeric: 8 / 21, tol: 2e-3, display: '8/21',
              feedback: R`\(\dfrac{0.08}{0.21} = \dfrac{8}{21} \approx 0.38\). Juice is only 10% of mornings, but it causes 80% of its lectures to be sleepy, so it accounts for 38% of all sleepy lectures.`,
              wrong: R`\(\P\{JS\}/\P(S) = 0.08/0.21\).`,
              solution: R`\[\P(J \given S) = \frac{0.08}{0.21} = \frac{8}{21} \approx 0.38.\]`
            },
            {
              type: 'mcq',
              quote: R`“\(\P(S \given J^c) = \P(S \given C) + \P(S \given T) = 0.1 + 0.2 = 0.3\).”`,
              prompt: R`This appeared in several exams. What is wrong?`,
              choices: [
                { text: R`It should be a product: \(0.1 \times 0.2\).`, feedback: R`No: \(C\) and \(T\) are alternatives, not events that both happen.` },
                { text: R`Nothing; conditional probabilities given disjoint events add.`, feedback: R`They do not. What adds across disjoint events are <em>intersections</em>: \(\P(S \cap J^c) = \P(S \cap C) + \P(S \cap T)\).` },
                { text: R`Conditioning on different events cannot be added. Compute from the definition: \(\P(S \given J^c) = \dfrac{\P(S \cap J^c)}{\P(J^c)} = \dfrac{0.05 + 0.08}{0.9} = \dfrac{13}{90}\).`, correct: true, feedback: R`Equivalently, a weighted average: \(\P(S \given C)\,\tfrac{0.5}{0.9} + \P(S \given T)\,\tfrac{0.4}{0.9} = \tfrac{13}{90} \approx 0.144\), not 0.3.` },
                { text: R`It should be the plain average \((0.1 + 0.2)/2 = 0.15\).`, feedback: R`Close to the right number by accident, but coffee and tea are not equally likely: the weights are \(5/9\) and \(4/9\), not \(1/2\) each.` }
              ],
              watch: R`Conditional probabilities given different events are on different scales. To combine them, go back to intersections (or use weights \(\P(E_i)/\P(\cup E_i)\)).`
            }
          ]
        }
      ],
      takeaways: [
        R`A sample space lists outcomes of the <em>joint</em> experiment, with just enough detail to express every event in the questions.`,
        R`On a finite space, a measure is defined by the singleton probabilities (nonnegative, summing to 1) plus the third axiom. Say so.`,
        R`Given conditionals turn into outcome probabilities via \(\P(A \cap B) = \P(A \given B)\P(B)\).`,
        R`Bayes’ denominator is just the sum of the outcomes in the conditioning event.`,
        R`Conditionals given different events never add. Intersections do.`
      ]
    },

    /* ============================================================ */
    {
      id: 'p2',
      title: "The Chevalier's new game",
      lead: 'A die game with signed winnings: expectation of a function of a random variable, then a Binomial count.',
      tags: ['Expectation (LOTUS)', 'Binomial', 'Conditional expectation'],
      statement: R`
        <p>The Chevalier de Méré throws a fair six-sided die; if the number \(k\) on the die is odd, he wins \(k\) dollars; if \(k\) is even, he loses \(k\) dollars (losing \(k\) dollars is winning \(-k\) dollars).</p>
        <ul class="parts">
          <li><b>(a)</b><span>What is the expected number of dollars the Chevalier wins in one game?</span></li>
          <li><b>(b)</b><span>The Chevalier plays 5 games in a row (each game is independent). What is the probability that he loses money in exactly 3 out of the 5 games?</span></li>
        </ul>`,
      parts: [
        {
          label: '(a)', title: 'Expected winnings in one game',
          question: R`Let \(K\) be the die outcome and \(X\) the winnings. Compute \(\E[X]\).`,
          steps: [
            {
              type: 'mcq',
              prompt: R`\(X = \varphi(K)\) for a deterministic function \(\varphi\). Which one?`,
              choices: [
                { text: R`\(\varphi(k) = k\)`, feedback: R`That ignores the losses on even throws.` },
                { text: R`\(\varphi(k) = (-1)^k k\)`, feedback: R`Sign reversed: this gives \(-1\) for \(k = 1\), but an odd throw is a win.` },
                { text: R`\(\varphi(k) = k\) if \(k\) is odd, \(\varphi(k) = -k\) if \(k\) is even.`, correct: true, feedback: R`So \(X\) takes the values \(1, -2, 3, -4, 5, -6\), each with probability \(\tfrac16\).` },
                { text: R`\(\varphi(k) = |k|\)`, feedback: R`Absolute value makes every outcome a win.` }
              ],
              why: R`Graders noted that some students’ \(\varphi\) “was not deterministic and still involved random variables”. Pin down the function first: once \(\varphi\) is explicit, the expectation is a six-term sum and nothing can go wrong.`,
              solution: R`Let \(K\) be the die outcome, uniform on \(\{1, \dots, 6\}\), and \(X = \varphi(K)\) with \(\varphi(k) = k\) for odd \(k\) and \(\varphi(k) = -k\) for even \(k\).`
            },
            {
              type: 'input',
              prompt: R`\(\E[X] = \sum_{k=1}^6 \varphi(k)\,\P\{K = k\} = \;?\)`,
              placeholder: 'e.g. -0.5', numeric: -0.5, tol: 1e-6, display: '-1/2',
              feedback: R`\(\dfrac{1 - 2 + 3 - 4 + 5 - 6}{6} = \dfrac{-3}{6} = -\tfrac12\). The game loses half a dollar per round on average.`,
              wrong: R`Sum the six values \(1, -2, 3, -4, 5, -6\) and divide by 6.`,
              why: R`This is the definition of expectation for a discrete random variable (Definition 1.8.1 in the notes, or LOTUS): \(\E[\varphi(K)] = \sum_k \varphi(k)\P\{K = k\}\). No cleverness required; just apply the definition.`,
              solution: R`\[\E[X] = \sum_{k=1}^6 \varphi(k)\,\tfrac16 = \frac{1 - 2 + 3 - 4 + 5 - 6}{6} = -\tfrac12.\]`
            },
            {
              type: 'mcq',
              quote: R`“By the law of total expectation, \(\E[X] = \E[X \given K \text{ odd}]\,\P(\text{odd}) + \E[X \given K \text{ even}]\,\P(\text{even}) = 3.5\cdot\tfrac12 - 3.5\cdot\tfrac12 = 0\).”`,
              prompt: R`The law of total expectation is valid here, but the answer is wrong. Where is the slip?`,
              choices: [
                { text: R`\(\P(\text{odd}) \neq \tfrac12\).`, feedback: R`\(\P(\text{odd}) = \tfrac36 = \tfrac12\) is fine.` },
                { text: R`The law of total expectation does not apply to functions of \(K\).`, feedback: R`It applies to any random variable.` },
                { text: R`The conditional means are wrong: given odd, \(K\) is uniform on \(\{1, 3, 5\}\) with mean 3; given even, uniform on \(\{2, 4, 6\}\) with mean 4. So \(\E[X] = 3\cdot\tfrac12 - 4\cdot\tfrac12 = -\tfrac12\).`, correct: true, feedback: R`Conditioning changes the distribution of \(K\); you cannot reuse the unconditional mean 3.5 inside a conditional expectation.` },
                { text: R`Nothing; the answer 0 is correct.`, feedback: R`The direct computation gives \(-\tfrac12\).` }
              ],
              watch: R`When you condition, recompute every expectation under the conditional distribution. \(\E[K \given K \text{ odd}]\) is not \(\E[K]\).`
            }
          ]
        },
        {
          label: '(b)', title: 'Losing exactly 3 of 5 games',
          question: R`Probability that he loses money in exactly 3 of the 5 independent games.`,
          steps: [
            {
              type: 'mcq',
              prompt: R`First, one game: \(\P\{X < 0\} = \;?\)`,
              choices: [
                { text: R`\(\tfrac13\)`, feedback: R`Count the even faces: 2, 4, 6.` },
                { text: R`\(\tfrac12\)`, correct: true, feedback: R`Three even faces out of six.` },
                { text: R`\(\tfrac16\)`, feedback: R`That is one face; three faces lose.` },
                { text: R`\(\tfrac23\)`, feedback: R`Three of six faces lose, not four.` }
              ],
              solution: R`In one game, \(\P\{X < 0\} = \P\{K \text{ even}\} = \tfrac12\).`
            },
            {
              type: 'mcq',
              prompt: R`Let \(N\) be the number of losing games among the 5. What is its distribution, and what justifies it?`,
              choices: [
                { text: R`\(\Geom(\tfrac12)\): we wait for a loss.`, feedback: R`Geometric is for the time of the first loss, not the number of losses in 5 games.` },
                { text: R`\(\Binom(5, \tfrac16)\).`, feedback: R`The per-game loss probability is \(\tfrac12\), not \(\tfrac16\).` },
                { text: R`\(\Binom(5, \tfrac12)\): five independent games, each lost with probability \(\tfrac12\).`, correct: true, feedback: R`Independent trials with the same success probability is exactly the Binomial setup.` },
                { text: R`Uniform on \(\{0, 1, \dots, 5\}\).`, feedback: R`Counts near the middle are more likely than 0 or 5.` }
              ],
              why: R`Naming the distribution <em>and</em> saying why (independent trials, same probability) is what graders look for. The number alone earns little.`,
              solution: R`The number \(N\) of losing games counts successes in 5 independent trials with success probability \(\tfrac12\), so \(N \sim \Binom(5, \tfrac12)\).`
            },
            {
              type: 'input',
              prompt: R`\(\P\{N = 3\} = \;?\) Give the fully evaluated value.`,
              placeholder: 'e.g. 5/16', numeric: 5 / 16, tol: 1e-6, display: '5/16',
              feedback: R`\(\binom53\big(\tfrac12\big)^3\big(\tfrac12\big)^2 = 10\cdot\tfrac1{32} = \tfrac5{16}\).`,
              wrong: R`\(\binom53 = 10\) and \(\big(\tfrac12\big)^5 = \tfrac1{32}\).`,
              why: R`The grading comments say a point was deducted when \(\binom53\) was left unevaluated. “No calculators” is not “no arithmetic”: finish the computation when it is feasible.`,
              solution: R`\[\P\{N = 3\} = \binom53 \Big(\tfrac12\Big)^3\Big(\tfrac12\Big)^2 = \frac{10}{32} = \frac{5}{16}.\]`
            }
          ]
        }
      ],
      takeaways: [
        R`Write the winnings as an explicit deterministic function \(\varphi\) of the die, then apply the definition \(\E[\varphi(K)] = \sum_k \varphi(k)\P\{K = k\}\).`,
        R`Inside a conditional expectation, use the conditional distribution; \(\E[K \given K \text{ odd}] \neq \E[K]\).`,
        R`To justify a Binomial, state the trials, their independence, and the common success probability.`,
        R`Evaluate binomial coefficients and simple powers; graders deduct for leaving them symbolic.`
      ]
    },

    /* ============================================================ */
    {
      id: 'p3',
      title: 'Guacamole',
      lead: 'Avocados that ripen geometrically, a count by indicators, and a probability of equality that collapses to 1/6.',
      tags: ['Geometric', 'Indicators', 'Linearity of expectation', 'Law of total probability', 'Reading the event'],
      statement: R`
        <p>Avocados are temperamental. When you purchase an avocado, it is hard and inedible. Each day, each avocado ripens independently with probability 0.1 (different avocados and different days are all independent). An avocado can only be eaten on the day that it ripens; by the next day it is brown and icky. For the super bowl you would like to make guacamole. In the morning 2 days before the super bowl, you purchase 5 avocados. (The super bowl is in the evening.)</p>
        <ul class="parts">
          <li><b>(a)</b><span>What is the expected number of days it takes for one avocado to ripen?</span></li>
          <li><b>(b)</b><span>What is the expected number of avocados that are ripe during the super bowl? (Assume they have had 3 full days to ripen by the time the super bowl starts.)</span></li>
          <li><b>(c)</b><span>You invite 5 friends, but the number who actually show up is equally likely to be any number between 0 and 5. Each friend who shows up desires one avocado. What is the probability that exactly the same number of avocados are ripe as the number of friends who show up? (Friends and avocados are independent.)</span></li>
        </ul>`,
      parts: [
        {
          label: '(a)', title: 'Expected ripening time',
          question: R`Let \(N\) be the day on which a given avocado ripens. What is \(\E[N]\)?`,
          steps: [
            {
              type: 'mcq',
              prompt: R`What is the distribution of \(N\)?`,
              choices: [
                { text: R`\(\Binom(3, 0.1)\)`, feedback: R`Binomial counts successes in a fixed number of trials; \(N\) is a <em>time</em>.` },
                { text: R`\(\Geom(0.1)\) on \(\{1, 2, \dots\}\): each day is an independent trial with success probability 0.1, and \(N\) is the first success.`, correct: true, feedback: R`\(\P\{N = n\} = 0.9^{\,n-1}\cdot 0.1\).` },
                { text: R`\(\Exp(0.1)\)`, feedback: R`Days are discrete trials; exponential is the continuous-time analogue.` },
                { text: R`Poisson\((0.1)\)`, feedback: R`Poisson counts events; it is not a waiting time.` }
              ],
              why: R`“Each day, independently, with the same probability” is the Bernoulli-process signal. First-success times in a Bernoulli process are geometric.`,
              solution: R`Each day is an independent trial with success (ripening) probability \(0.1\), so the ripening day \(N \sim \Geom(0.1)\), \(\P\{N = n\} = 0.9^{n-1}\cdot 0.1\).`
            },
            {
              type: 'input',
              prompt: R`\(\E[N] = \;?\)`,
              placeholder: 'e.g. 10', numeric: 10, tol: 1e-6, display: '10',
              feedback: R`\(\E[\Geom(p)] = 1/p = 10\) days.`,
              wrong: R`The mean of \(\Geom(p)\) is \(1/p\).`,
              solution: R`\(\E[N] = 1/0.1 = 10\) days.`
            }
          ]
        },
        {
          label: '(b)', title: 'Expected number of ripe avocados at the super bowl',
          question: R`Five avocados, three full days. Expected number ripe <em>during</em> the super bowl?`,
          steps: [
            {
              type: 'mcq',
              figure: { name: 'indicators', opts: { n: 5, p: 0.3, q: null, labelA: 'ripe exactly on day 3', pTex: '0.081', nTex: '5', cap1: 'Five avocados. Blue ones ripen exactly on day 3 (probability 0.081 each; exaggerated here so you can see some).', cap3: 'Let \\(X_i = 1\\) if avocado \\(i\\) is ripe at the super bowl. The number of ripe avocados is \\(\\sum_i X_i\\).', cap4: 'Expectation is linear: replace each indicator by its probability, \\(5 \\times 0.081 = 0.405\\).' } },
              prompt: R`“Expected number of avocados that …” Which is the quickest valid route?`,
              choices: [
                { text: R`Find \(\P\{X = k\}\) for every \(k\), then sum \(k\,\P\{X = k\}\).`, feedback: R`Valid but slower; and once you notice \(X\) is Binomial you are back to indicators anyway.` },
                { text: R`Indicators: \(X = \sum_{i=1}^5 X_i\) with \(X_i = \ind\{\text{avocado } i \text{ ripe at the super bowl}\}\), so \(\E[X] = 5\,\P\{X_i = 1\}\).`, correct: true, feedback: R`Linearity of expectation, plus the avocados being identically distributed.` },
                { text: R`Track the day-by-day counts \(Z_1, Z_2, Z_3\) and condition repeatedly.`, feedback: R`This is the official <em>alternative</em> solution and it is correct, but it fills a page with double sums. Indicators do it in two lines.` },
                { text: R`\(\E[X] = 5\,\E[N]\).`, feedback: R`That multiplies a count by a number of days; the units do not even match.` }
              ],
              why: R`The phrase “expected number of … that …” is the indicator template. Reach for it before anything else.`,
              solution: R`Let \(X_i = \ind\{\text{avocado } i \text{ is ripe at the super bowl}\}\) and \(X = \sum_{i=1}^5 X_i\). By linearity, \(\E[X] = \sum_{i=1}^5 \P\{X_i = 1\}\).`
            },
            {
              type: 'mcq',
              prompt: R`Avocado \(i\) is ripe <em>during</em> the super bowl if and only if…`,
              choices: [
                { text: R`\(N_i \le 3\): it has ripened by day 3.`, feedback: R`The most common mistake on this exam. An avocado ripened on day 1 or 2 is brown by day 3. It must ripen exactly on day 3.` },
                { text: R`\(N_i \ge 3\).`, feedback: R`An avocado that ripens on day 7 is still hard at the super bowl.` },
                { text: R`\(N_i = 3\): it ripens exactly on the third day.`, correct: true, feedback: R`“Can only be eaten on the day it ripens” plus “3 full days” pins the event down to a single day.` },
                { text: R`\(N_i = 2\).`, feedback: R`The problem says to assume three full days of ripening.` }
              ],
              why: R`Translating the story into the exact event is where this problem is won or lost. Re-read the sentence about “brown and icky” before writing any formula.`,
              solution: R`Avocado \(i\) is ripe at the super bowl exactly when it ripens on the third day: \(\{X_i = 1\} = \{N_i = 3\}\).`
            },
            {
              type: 'input',
              prompt: R`\(\P\{N_i = 3\} = \;?\)`,
              placeholder: 'e.g. 0.081', numeric: 0.081, tol: 1e-6, display: '0.081',
              feedback: R`\(0.9^2\times 0.1 = 0.081\): not ripe on days 1 and 2, ripe on day 3.`,
              wrong: R`Two failures then one success: \((1 - 0.1)^2 \times 0.1\).`,
              solution: R`\(\P\{X_i = 1\} = \P\{N_i = 3\} = 0.9^2 \times 0.1 = 0.081\).`
            },
            {
              type: 'input',
              prompt: R`\(\E[X] = \;?\)`,
              placeholder: 'e.g. 0.405', numeric: 0.405, tol: 1e-6, display: '0.405',
              feedback: R`\(\E[X] = \sum_{i=1}^5 \P\{X_i = 1\} = 5\times 0.081 = 0.405\). (Since the \(X_i\) are independent, \(X \sim \Binom(5, 0.081)\) as well, but linearity alone suffices.)`,
              wrong: R`Five identical indicators, each with success probability 0.081.`,
              solution: R`\[\E[X] = 5 \times 0.081 = 0.405.\]`
            },
            {
              type: 'mcq',
              quote: R`“Let \(Z_1\) be the number ripening on day 1, so \(Z_1 \sim \Binom(5, 0.1)\). Afterwards \(5 - \E[Z_1] = 4.5\) avocados remain, so \(Z_2 \sim \Binom(4.5, 0.1)\).”`,
              prompt: R`Several students wrote this. What is wrong?`,
              choices: [
                { text: R`\(Z_1\) is not Binomial.`, feedback: R`\(Z_1 \sim \Binom(5, 0.1)\) is correct.` },
                { text: R`A Binomial needs a whole number of trials. The number remaining is <em>random</em>, \(5 - Z_1\), so one must work with the conditional distribution of \(Z_2\) given \(Z_1\), namely \(\Binom(5 - Z_1, 0.1)\), and then average, rather than plug in a mean.`, correct: true, feedback: R`Right. Replacing a random count by its expectation inside a distribution is a category error, even if the final number sometimes comes out close.` },
                { text: R`The probability should be 0.9, not 0.1.`, feedback: R`0.1 is the ripening probability; that part is fine.` },
                { text: R`Nothing; \(\Binom(4.5, 0.1)\) is a legitimate approximation.`, feedback: R`It is not defined. Distributions with integer parameters need integers.` }
              ],
              watch: R`Never substitute \(\E[Z]\) for \(Z\) inside another distribution or event. If a quantity is random, condition on it, then use the law of total probability or expectation.`
            }
          ]
        },
        {
          label: '(c)', title: 'As many ripe avocados as friends',
          question: R`\(Y\) = number of friends who show up, independent of the avocados. Compute \(\P\{X = Y\}\).`,
          steps: [
            {
              type: 'mcq',
              prompt: R`“Equally likely to be any number between 0 and 5.” What is the distribution of \(Y\)?`,
              choices: [
                { text: R`Uniform on \(\{1, 2, 3, 4, 5\}\), probability \(\tfrac15\) each.`, feedback: R`A common mistake on this exam: zero friends can show up. There are six equally likely values.` },
                { text: R`Uniform on \(\{0, 1, \dots, 5\}\), probability \(\tfrac16\) each.`, correct: true, feedback: R`Six values, each with probability \(\tfrac16\).` },
                { text: R`\(\Binom(5, \tfrac12)\).`, feedback: R`That would make 2 or 3 friends more likely than 0 or 5; the problem says equally likely.` },
                { text: R`Uniform on \(\{0, \dots, 5\}\) but with \(\P\{Y = 5\} = 0\).`, feedback: R`All six values, including 5, are equally likely.` }
              ],
              solution: R`\(Y\) is uniform on \(\{0, 1, \dots, 5\}\): \(\P\{Y = n\} = \tfrac16\), independent of \(X\).`
            },
            {
              type: 'mcq',
              prompt: R`\(X\) and \(Y\) are independent. What is the natural way to compute \(\P\{X = Y\}\)?`,
              choices: [
                { text: R`Symmetry: \(\P\{X = Y\} = \tfrac12\).`, feedback: R`There is no symmetry between \(X\) and \(Y\), and equality is not a “half” event.` },
                { text: R`\(\P\{X = Y\} = \P\{X = \E[Y]\} = \P\{X = 2.5\} = 0\).`, feedback: R`Replacing \(Y\) by its mean inside an event is meaningless.` },
                { text: R`Condition on \(Y\): \(\P\{X = Y\} = \sum_{n=0}^5 \P\{X = n \given Y = n\}\,\P\{Y = n\} = \tfrac16\sum_{n=0}^5 \P\{X = n\}\), using independence in the last step.`, correct: true, feedback: R`The events \(\{Y = n\}\) partition the sample space; on each, “\(X = Y\)” means “\(X = n\)”, and independence removes the conditioning.` },
                { text: R`\(\P\{X = Y\} = \P\{X\}\,\P\{Y\}\).`, feedback: R`\(\P\{X\}\) is not a meaningful expression: \(X\) is a random variable, not an event.` }
              ],
              why: R`“Equal to another random variable” is always handled by conditioning on one of them: it turns a comparison between two random things into a family of questions about one.`,
              solution: R`By the law of total probability over \(Y\), then independence, \[\P\{X = Y\} = \sum_{n=0}^5 \P\{X = n \given Y = n\}\,\P\{Y = n\} = \tfrac16 \sum_{n=0}^5 \P\{X = n\}.\]`
            },
            {
              type: 'mcq',
              prompt: R`Finish: \(\tfrac16\sum_{n=0}^5 \P\{X = n\} = \;?\)`,
              choices: [
                { text: R`\(\tfrac16 \times 5 \times 0.081\)`, feedback: R`That would be \(\tfrac16\E[X]\); we are summing probabilities, not \(n\) times probabilities.` },
                { text: R`\(\tfrac16\), because \(X\) takes values only in \(\{0, 1, \dots, 5\}\), so the probabilities sum to 1.`, correct: true, feedback: R`\(\P\{X = Y\} = \tfrac16\). No Binomial arithmetic needed.` },
                { text: R`It requires evaluating all six Binomial terms.`, feedback: R`You could, and they would sum to 1, which is the point.` },
                { text: R`\(0.405\)`, feedback: R`That is \(\E[X]\), a different quantity.` }
              ],
              why: R`A sum of probabilities over the <em>entire</em> range of a random variable is 1. When a problem is designed so that this happens, recognizing it is the whole solution.`,
              solution: R`Since \(X\) takes values in \(\{0, \dots, 5\}\), the probabilities sum to 1, and \[\P\{X = Y\} = \tfrac16.\]`
            }
          ]
        }
      ],
      takeaways: [
        R`“Each day independently with the same probability” means a Bernoulli process; first-success times are \(\Geom(p)\) with mean \(1/p\).`,
        R`“Expected number of … that …” is the indicator template: \(\E[X] = \sum_i \P\{X_i = 1\}\).`,
        R`Read the event precisely. “Ripe on the day of the super bowl” is \(\{N_i = 3\}\), not \(\{N_i \le 3\}\).`,
        R`A random count stays random: condition on it; never plug its mean into another distribution.`,
        R`To compute \(\P\{X = Y\}\) for independent \(X, Y\), condition on one of them and watch for a sum of probabilities that equals 1.`
      ]
    }
  ]
});
