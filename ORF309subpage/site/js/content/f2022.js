/* ================================================================
   Fall 2022 · Midterm 1 — interactive walkthrough
   ================================================================ */
ORF309.exams.push({
  id: 'f2022',
  title: 'Fall 2022 · Midterm 1',
  short: 'F22',
  date: 'October 2022',
  blurb: 'Conditional expectation of an ice-cream price, a petition whose consequence is a second moment, and two cupcakes with geometric sprinkles.',
  intro: R`Part (b) of the organic-chemistry problem was completed by very few students, not because it is hard but because they did not recognize \(\E[X^2]\) when it appeared. This walkthrough makes a point of training that recognition.`,

  problems: [

    /* ============================================================ */
    {
      id: 'p1',
      title: 'Ice cream',
      lead: 'Three flavors, each sold out with probability 1/2: a conditional expectation computed by restricting to an event.',
      tags: ['Sample space', 'Conditional expectation given an event', 'Indicators', 'Conditional probability'],
      statement: R`
        <p>Thomas Sweet sells three flavors of ice cream: vanilla ($1 per cone), chocolate ($2 per cone), and strawberry ($4 per cone). By the time you arrive some flavors may have sold out. Each flavor is sold out independently with probability \(\tfrac12\).</p>
        <ul class="parts">
          <li><b>(a)</b><span>What is the probability that all flavors are sold out?</span></li>
          <li><b>(b)</b><span>If the store still has some ice cream when you get there, you buy one cone of the cheapest flavor available. What is the expectation of the cost of your cone, given that not all flavors are sold out?</span></li>
          <li><b>(c)</b><span>You are allergic to strawberries, so you buy ice cream only if vanilla or chocolate is available. Given that you do not buy a cone, what is the probability that all ice cream was sold out?</span></li>
        </ul>`,
      parts: [
        {
          label: 'Setup', title: 'Encode the outcomes',
          question: R`Three flavors, each available or not. Describe the sample space and the probability of each outcome.`,
          steps: [
            {
              type: 'mcq',
              prompt: R`Which description of the sample space is correct?`,
              choices: [
                { text: R`Three outcomes: vanilla, chocolate, strawberry.`, feedback: R`The outcome is <em>which flavors are available</em>, a pattern, not a single flavor.` },
                { text: R`Four outcomes: none, one, two or three flavors available.`, feedback: R`These are events, not outcomes, and they are not equally likely: “exactly one available” has probability \(\tfrac38\).` },
                { text: R`Eight outcomes, one per triple \(vcs \in \{0,1\}^3\) (\(v = 1\) if vanilla is available, etc.), each with probability \(\big(\tfrac12\big)^3 = \tfrac18\) by independence.`, correct: true, feedback: R`Write \(A_{vcs}\) for the event that the availability pattern is \(vcs\). For instance \(A_{001}\) means only strawberry is available.` },
                { text: R`Six outcomes: the orderings of the three flavors.`, feedback: R`Order plays no role here.` }
              ],
              why: R`With eight equally likely outcomes, every question becomes counting outcomes and weighting by \(\tfrac18\). Set up the encoding once and all three parts are bookkeeping.`,
              solution: R`Encode availability as a triple \(vcs \in \{0,1\}^3\) (\(v = 1\) if vanilla is available, etc.) and let \(A_{vcs}\) be the corresponding event. By independence, \(\P(A_{vcs}) = \tfrac18\) for every pattern.`
            }
          ]
        },
        {
          label: '(a)', title: 'All sold out',
          question: R`\(\P(A_{000}) = \;?\)`,
          steps: [
            {
              type: 'input',
              prompt: R`Probability that all three flavors are sold out.`,
              placeholder: 'e.g. 1/8', numeric: 0.125, tol: 1e-6, display: '1/8',
              feedback: R`By independence, \(\P(A_{000}) = \big(\tfrac12\big)^3 = \tfrac18\).`,
              wrong: R`Three independent events, each of probability \(\tfrac12\).`,
              solution: R`\(\P(A_{000}) = \big(\tfrac12\big)^3 = \tfrac18\).`
            }
          ]
        },
        {
          label: '(b)', title: 'Expected price, given something is left',
          question: R`Let \(P\) be the price of the cheapest available cone. Compute \(\E[P \given A_{000}^c]\).`,
          steps: [
            {
              type: 'mcq',
              figure: { name: 'renormalize', opts: { outcomes: [{ label: '000', w: 1, removed: true }, { label: '001', w: 1, value: 4 }, { label: '010', w: 1, value: 2 }, { label: '011', w: 1, value: 2 }, { label: '100', w: 1, value: 1 }, { label: '101', w: 1, value: 1 }, { label: '110', w: 1, value: 1 }, { label: '111', w: 1, value: 1 }], meanTex: '\\(\\E[P \\given A_{000}^c] = \\tfrac17(4 + 2 + 2 + 1 + 1 + 1 + 1) = \\tfrac{12}{7}\\)' } },
              prompt: R`What kind of object is asked for, and how is it defined?`,
              choices: [
                { text: R`The unconditional expectation \(\E[P]\).`, feedback: R`The question says “given that not all flavors are sold out”. Besides, \(P\) is not even defined on \(A_{000}\).` },
                { text: R`A conditional expectation given an event: \(\E[P \given A_{000}^c] = \dfrac{\E[P\,\ind\{A_{000}^c\}]}{\P(A_{000}^c)}\).`, correct: true, feedback: R`Equivalently: use the conditional probabilities \(\P(A_{vcs} \given A_{000}^c)\) as weights. Both views give the same number.` },
                { text: R`\(\E[P]\cdot\P(A_{000}^c)\).`, feedback: R`Multiplying by the probability goes the wrong way; conditioning <em>divides</em> by it.` },
                { text: R`\(\P(A_{000}^c)\) itself.`, feedback: R`That is a probability, not an expected price.` }
              ],
              why: R`Conditioning on an event means restricting the experiment to that event and renormalizing. The “divide by \(\P(\text{event})\)” is the renormalization, and forgetting it was the most common error on this part. The figure shows the renormalization: remove the excluded outcome, stretch the survivors to total length 1.`,
              solution: R`By definition, \[\E[P \given A_{000}^c] = \frac{\E\big[P\,\ind\{A_{000}^c\}\big]}{\P(A_{000}^c)}, \qquad \P(A_{000}^c) = 1 - \tfrac18 = \tfrac78.\]`
            },
            {
              type: 'mcq', multi: true,
              prompt: R`In which of these availability patterns is the cheapest cone priced $1? Select all.`,
              choices: [
                { text: R`\(A_{100}\): only vanilla available.`, correct: true },
                { text: R`\(A_{011}\): chocolate and strawberry available.`, feedback: R`Vanilla is sold out, so the cheapest is chocolate at $2.` },
                { text: R`\(A_{111}\): everything available.`, correct: true },
                { text: R`\(A_{010}\): only chocolate.`, feedback: R`Price $2.` }
              ],
              feedback: R`Price $1 whenever vanilla is available (\(v = 1\)): four patterns. Price $2 when vanilla is out but chocolate is in: \(A_{010}, A_{011}\). Price $4 only for \(A_{001}\).`,
              why: R`A small table of “pattern → price” is the whole content of the problem. Make it before writing any expectation.`,
              solution: R`The price is $1 on \(A_{100}, A_{101}, A_{110}, A_{111}\); $2 on \(A_{010}, A_{011}\); $4 on \(A_{001}\).`
            },
            {
              type: 'input',
              prompt: R`Compute \(\E[P\,\ind\{A_{000}^c\}] = \sum_{vcs \neq 000} (\text{price})\cdot\P(A_{vcs})\).`,
              hint: R`Four patterns at $1, two at $2, one at $4, each with probability \(\tfrac18\).`,
              placeholder: 'e.g. 1.5', numeric: 1.5, tol: 1e-6, display: '12/8',
              feedback: R`\(\dfrac{4\cdot 1 + 2\cdot 2 + 1\cdot 4}{8} = \dfrac{12}{8}\).`,
              wrong: R`\((4\times 1 + 2\times 2 + 1\times 4)/8\).`,
              solution: R`\[\E\big[P\,\ind\{A_{000}^c\}\big] = \frac{4\cdot 1 + 2\cdot 2 + 1\cdot 4}{8} = \frac{12}{8}.\]`
            },
            {
              type: 'input',
              prompt: R`Now divide by \(\P(A_{000}^c)\). \(\E[P \given A_{000}^c] = \;?\)`,
              placeholder: 'e.g. 12/7', numeric: 12 / 7, tol: 2e-3, display: '12/7',
              feedback: R`\(\dfrac{12/8}{7/8} = \dfrac{12}{7} \approx 1.71\).`,
              wrong: R`\(\P(A_{000}^c) = 1 - \tfrac18 = \tfrac78\).`,
              why: R`Interpretation: among the seven equally likely surviving patterns, four cost $1, two cost $2 and one costs $4; the conditional mean is \((4 + 4 + 4)/7 = 12/7\). Each surviving pattern has conditional probability \(\tfrac17\), not \(\tfrac18\).`,
              solution: R`\[\E[P \given A_{000}^c] = \frac{12/8}{7/8} = \frac{12}{7}.\]`
            },
            {
              type: 'mcq',
              quote: R`“Given that not everything is sold out, if vanilla and chocolate are unavailable then strawberry must be available. So \(\P(A_{001})\) becomes \(\tfrac14\), while the other patterns keep probability \(\tfrac18\).”`,
              prompt: R`What is wrong with this way of conditioning?`,
              choices: [
                { text: R`Conditioning rescales <em>every</em> surviving outcome by the same factor: \(\P(A_{vcs} \given A_{000}^c) = \dfrac{1/8}{7/8} = \dfrac17\) for all seven patterns. Singling out one pattern for special treatment is inconsistent.`, correct: true, feedback: R`Right. Conditional probability is a uniform renormalization: \(\P(B \given A) = \P(B)/\P(A)\) for every \(B \subseteq A\).` },
                { text: R`\(A_{001}\) should have conditional probability \(\tfrac18\).`, feedback: R`\(\tfrac18\) is the unconditional value; conditioning changes it to \(\tfrac17\).` },
                { text: R`Strawberry cannot be the only flavor left.`, feedback: R`It can; \(A_{001}\) is a perfectly possible pattern.` },
                { text: R`Nothing is wrong.`, feedback: R`The reasoning breaks the rule that conditioning is division by \(\P(A)\) across the board.` }
              ],
              watch: R`“Given \(A\)” never changes the relative weights of outcomes inside \(A\). It only removes the outcomes outside \(A\) and rescales the rest by \(1/\P(A)\).`
            },
            {
              type: 'mcq',
              quote: R`“\(\E[P \given A_{000}^c] = 4\,\P(A_{001}) + 2\,\P(A_{010}) + 2\,\P(A_{011}) + 1\,\P(A_{100}) + \dots + 1\,\P(A_{111}) = \tfrac{12}{8} = 1.5\).”`,
              prompt: R`The grading comments call this “a very common mistake”. Diagnose it.`,
              choices: [
                { text: R`The prices are wrong.`, feedback: R`The prices are right.` },
                { text: R`This computes \(\E[P\,\ind\{A_{000}^c\}]\), not the conditional expectation. It must be divided by \(\P(A_{000}^c) = \tfrac78\).`, correct: true, feedback: R`\(1.5 < 12/7\): omitting the division underestimates the price because it silently counts the sold-out outcome as a $0 cone.` },
                { text: R`\(A_{000}\) should be included with price 0.`, feedback: R`Including it with price 0 gives the same \(\tfrac{12}{8}\); the issue is the missing normalization.` },
                { text: R`Nothing is wrong.`, feedback: R`Check: four of seven surviving outcomes cost $1 and the rest more, so the conditional mean must exceed 1.5; indeed \(12/7 \approx 1.71\).` }
              ]
            }
          ]
        },
        {
          label: '(c)', title: 'Everything sold out, given you bought nothing',
          question: R`You buy only if vanilla or chocolate is available. Given you do not buy, what is \(\P(A_{000} \given \text{no purchase})\)?`,
          steps: [
            {
              type: 'mcq',
              prompt: R`Express the event “you do not buy a cone” in terms of the patterns.`,
              choices: [
                { text: R`\(A_{000}\)`, feedback: R`You also skip buying when only strawberry is left.` },
                { text: R`\(A_{000} \cup A_{001}\): neither vanilla nor chocolate is available.`, correct: true, feedback: R`Two outcomes, total probability \(\tfrac28\).` },
                { text: R`\(A_{001}\)`, feedback: R`That is only the “strawberry only” case; “all sold out” also leads to no purchase.` },
                { text: R`\(A_{111}^c\)`, feedback: R`That is “at least one flavor sold out”, which includes many patterns where you do buy.` }
              ],
              why: R`Translate the rule for your behaviour into a set of outcomes <em>before</em> computing anything. Most errors in this part came from conditioning on the wrong event.`,
              solution: R`“No purchase” is the event \(A_{000} \cup A_{001}\) (neither vanilla nor chocolate available).`
            },
            {
              type: 'input',
              prompt: R`\(\P(A_{000} \given A_{000} \cup A_{001}) = \;?\)`,
              placeholder: 'e.g. 1/2', numeric: 0.5, tol: 1e-6, display: '1/2',
              feedback: R`By the definition of conditional probability, and since \(A_{000} \subseteq A_{000} \cup A_{001}\), \(\dfrac{\P(A_{000})}{\P(A_{000}) + \P(A_{001})} = \dfrac{1/8}{2/8} = \dfrac12\).`,
              wrong: R`Numerator \(\P(A_{000}) = \tfrac18\); denominator \(\P(A_{000}) + \P(A_{001}) = \tfrac28\).`,
              why: R`The definition of conditional probability is enough; Bayes’ formula is overkill when the event you condition on is a union containing the event you ask about. Graders noted students who used Bayes here and then plugged a wrong number into one of the extra factors.`,
              solution: R`By the definition of conditional probability, \[\P(A_{000} \given A_{000} \cup A_{001}) = \frac{\P(A_{000})}{\P(A_{000}) + \P(A_{001})} = \frac{1/8}{2/8} = \frac12.\]`
            }
          ]
        }
      ],
      takeaways: [
        R`Encode outcomes explicitly (here: triples in \(\{0,1\}^3\), each with probability \(\tfrac18\)). Then every part is a short count.`,
        R`\(\E[X \given A] = \E[X\,\ind_A]/\P(A)\). The division is the renormalization; forgetting it is the classic error.`,
        R`Conditioning on \(A\) rescales <em>all</em> outcomes in \(A\) by the same factor \(1/\P(A)\).`,
        R`Write the conditioning event as a set of outcomes before computing. The rest is the definition of conditional probability.`
      ]
    },

    /* ============================================================ */
    {
      id: 'p2',
      title: 'Organic chemistry',
      lead: 'A Binomial petition, and a firing probability that is secretly a second moment.',
      tags: ['Binomial', 'Law of total probability', 'LOTUS', 'Second moment', 'Variance'],
      statement: R`
        <p>100 students take organic chemistry. Over the semester, each student gets disgruntled independently with probability 1%. Disgruntled students sign a petition.</p>
        <ul class="parts">
          <li><b>(a)</b><span>What is the probability that exactly \(\tfrac14\) of the class signs the petition?</span></li>
          <li><b>(b)</b><span>The probability that the university decides to fire the professor is precisely the square of the fraction of students that sign the petition (if half the students sign, the professor is fired with probability \(\tfrac14\)). What is the probability that the professor is fired?</span></li>
        </ul>`,
      parts: [
        {
          label: '(a)', title: 'Exactly a quarter sign',
          question: R`Let \(X\) be the number of students who sign. Compute \(\P\{\text{exactly a quarter sign}\}\).`,
          steps: [
            {
              type: 'mcq',
              prompt: R`Distribution of \(X\)?`,
              choices: [
                { text: R`\(\Binom(100, 0.01)\): 100 independent students, each signing with probability 0.01.`, correct: true },
                { text: R`\(\Geom(0.01)\)`, feedback: R`There is no waiting time in this story; \(X\) counts signatures.` },
                { text: R`Poisson\((1)\)`, feedback: R`A fine approximation (mean \(np = 1\)), but the exact distribution is Binomial and the problem wants an exact answer.` },
                { text: R`Uniform on \(\{0, \dots, 100\}\)`, feedback: R`With a 1% rate, large counts are astronomically unlikely.` }
              ],
              solution: R`Let \(X\) be the number of students who sign: \(X \sim \Binom(100, 0.01)\) (independent students, same probability).`
            },
            {
              type: 'mcq',
              prompt: R`“Exactly \(\tfrac14\) of the class signs” is the event…`,
              choices: [
                { text: R`\(\{X \le 25\}\)`, feedback: R`“Exactly”, not “at most”.` },
                { text: R`\(\{X = 25\}\)`, correct: true, feedback: R`So \(\P\{X = 25\} = \binom{100}{25}\,0.01^{25}\,0.99^{75}\). No calculators: leave it in this form.` },
                { text: R`\(\{X = 0.25\}\)`, feedback: R`\(X\) counts students; it cannot equal 0.25. The <em>fraction</em> is \(X/100\).` },
                { text: R`\(\{X = 4\}\)`, feedback: R`A quarter of 100 is 25.` }
              ],
              why: R`Distinguish the count \(X\) from the fraction \(X/100\). Part (b) hinges on this distinction.`,
              solution: R`\[\P\{X = 25\} = \binom{100}{25}\,(0.01)^{25}\,(0.99)^{75}.\]`
            }
          ]
        },
        {
          label: '(b)', title: 'Probability the professor is fired',
          question: R`\(\P(F \given X = k) = (k/100)^2\). Compute \(\P(F)\).`,
          steps: [
            {
              type: 'mcq',
              prompt: R`The firing probability is given <em>for each value of \(X\)</em>. Which tool produces \(\P(F)\)?`,
              choices: [
                { text: R`Bayes’ formula.`, feedback: R`There is no reversed conditioning to compute; we want an unconditional probability.` },
                { text: R`The law of total probability over the values of \(X\): \(\P(F) = \sum_{k=0}^{100}\P(F \given X = k)\,\P\{X = k\}\).`, correct: true, feedback: R`The events \(\{X = k\}\), \(k = 0, \dots, 100\), partition the sample space.` },
                { text: R`Plug in the mean: \(\P(F) = (\E[X]/100)^2 = 10^{-4}\).`, feedback: R`Replacing \(X\) by \(\E[X]\) inside a nonlinear function is wrong. This gives \((\E[X])^2\) where \(\E[X^2]\) is needed.` },
                { text: R`Independence: \(\P(F) = \P(F \given X = 100)\,\P\{X = 100\}\).`, feedback: R`That is one term of the sum, and not the dominant one.` }
              ],
              why: R`“Known for each value of a random variable” is the signal for conditioning on that variable and summing. Treating the random \(X\) as a fixed number is the error graders penalize most heavily in such problems.`,
              solution: R`The events \(\{X = k\}\) partition \(\Omega\), so by the law of total probability \[\P(F) = \sum_{k=0}^{100} \P(F \given X = k)\,\P\{X = k\} = \sum_{k=0}^{100} \Big(\frac{k}{100}\Big)^2 \P\{X = k\}.\]`
            },
            {
              type: 'note', title: 'Write the sum',
              html: R`
                \[\P(F) = \sum_{k=0}^{100}\Big(\frac{k}{100}\Big)^2\,\P\{X = k\} = \frac{1}{100^2}\sum_{k=0}^{100} k^2\,\P\{X = k\}.\]
                <p>Most students reached this line and stopped. The next checkpoint is the one that very few passed.</p>`,
              why: R`Pulling constants out of a sum is cheap; do it, because it exposes the structure of what remains.`,
              solution: R`\[\P(F) = \frac{1}{100^2}\sum_{k=0}^{100} k^2\,\P\{X = k\}.\]`
            },
            {
              type: 'mcq',
              figure: { name: 'jensen', opts: {} },
              prompt: R`Recognize \(\displaystyle\sum_{k} k^2\,\P\{X = k\}\).`,
              choices: [
                { text: R`\((\E[X])^2\)`, feedback: R`“A lot of students mistook \(\E[X^2]\) for \((\E[X])^2\)”, say the grading comments. The sum has \(k^2\) inside; the square is applied before averaging.` },
                { text: R`\(\Var(X)\)`, feedback: R`\(\Var(X) = \E[X^2] - (\E[X])^2\) is close, but the sum is the raw second moment.` },
                { text: R`\(\E[X^2]\)`, correct: true, feedback: R`By the definition of expectation (LOTUS) with \(\varphi(k) = k^2\).` },
                { text: R`\(\E[X]\)`, feedback: R`That would have \(k\), not \(k^2\).` }
              ],
              why: R`Train your eye: \(\sum_k \varphi(k)\P\{X = k\}\) is \(\E[\varphi(X)]\), whatever \(\varphi\) is. A sum with \(k^2\) is a second moment. The figure (for a small toy distribution) shows why \(\E[X^2]\) and \((\E[X])^2\) differ: the gap is the variance.`,
              solution: R`The sum is the second moment: \(\sum_k k^2\,\P\{X = k\} = \E[X^2]\).`
            },
            {
              type: 'mcq',
              prompt: R`\(\E[X^2] = \;?\) for \(X \sim \Binom(100, 0.01)\).`,
              choices: [
                { text: R`\((np)^2 = 1\)`, feedback: R`That is \((\E[X])^2\).` },
                { text: R`\(np(1 - p) = 0.99\)`, feedback: R`That is \(\Var(X)\) alone; you need to add \((\E[X])^2\).` },
                { text: R`\(\Var(X) + (\E[X])^2 = 100\cdot 0.01\cdot 0.99 + 1^2 = 1.99\)`, correct: true, feedback: R`Rearranging \(\Var(X) = \E[X^2] - (\E[X])^2\).` },
                { text: R`\(np + (np)^2 = 2\)`, feedback: R`The variance of a Binomial is \(np(1-p)\), not \(np\); that would be the Poisson value.` }
              ],
              why: R`You know \(\E[X]\) and \(\Var(X)\) for every named distribution; \(\E[X^2]\) comes for free from \(\Var(X) + (\E[X])^2\). This identity is the standard way to get second moments without summing anything.`,
              solution: R`\[\E[X^2] = \Var(X) + (\E[X])^2 = 100\cdot 0.01\cdot 0.99 + (100\cdot 0.01)^2 = 0.99 + 1 = 1.99.\]`
            },
            {
              type: 'input',
              prompt: R`\(\P(F) = \E[X^2]/100^2 = \;?\)`,
              placeholder: 'e.g. 1.99e-4', numeric: 1.99e-4, tol: 1e-7, display: '1.99e-4',
              answers: ['1.99*10^-4', '1.99×10^-4', '1.99·10^-4', '1.99x10^-4', '1.99/10^4', '1.99/10000'],
              feedback: R`\(\P(F) = \dfrac{1.99}{10^4} = 1.99\times 10^{-4}\).`,
              wrong: R`\(1.99 / 10000\).`,
              solution: R`\[\P(F) = \frac{1.99}{100^2} = 1.99 \times 10^{-4}.\]`
            },
            {
              type: 'mcq',
              quote: R`“\(\P(F) = \Big(\sum_k \tfrac{k}{100}\,\P\{X = k\}\Big)^2 = \big(\E[X]/100\big)^2 = 10^{-4}\).”`,
              prompt: R`Diagnose.`,
              choices: [
                { text: R`The square was applied to the sum instead of inside it: \(\P(F \given X = k)\) is \((k/100)^2\) term by term, so the sum is \(\E[(X/100)^2]\), not \((\E[X/100])^2\). The two differ by \(\Var(X)/100^2\).`, correct: true, feedback: R`Right. And since \(\E[X^2] \ge (\E[X])^2\) always (variance is nonnegative), the flawed answer is too small: \(10^{-4}\) versus \(1.99\times 10^{-4}\).` },
                { text: R`The law of total probability was misapplied.`, feedback: R`The law of total probability is fine; the algebra after it is not.` },
                { text: R`\(\E[X] \neq 1\).`, feedback: R`\(\E[X] = np = 1\) is correct.` },
                { text: R`Nothing is wrong.`, feedback: R`The two expressions differ exactly by \(\Var(X)/10^4\).` }
              ],
              watch: R`\(\E[\varphi(X)] \neq \varphi(\E[X])\) for nonlinear \(\varphi\). For \(\varphi(x) = x^2\) the gap is exactly the variance.`
            }
          ]
        }
      ],
      takeaways: [
        R`A probability given “for each value of \(X\)” is a law-of-total-probability sum over \(X\). Never treat the random \(X\) as a fixed number.`,
        R`Recognize \(\sum_k \varphi(k)\P\{X = k\}\) as \(\E[\varphi(X)]\). With \(k^2\) it is the second moment.`,
        R`\(\E[X^2] = \Var(X) + (\E[X])^2\): second moments of named distributions come for free.`,
        R`\(\E[X^2] \ge (\E[X])^2\). If you confuse them, your answer is biased in a predictable direction; use that as a check.`
      ]
    },

    /* ============================================================ */
    {
      id: 'p3',
      title: 'Cupcakes',
      lead: 'Two independent geometric sprinkle counts: probability they match, and the distribution of their sum, by disjoint unions.',
      tags: ['Geometric', 'Disjoint union', 'Geometric series', 'Distribution of a sum', 'Range of a random variable'],
      statement: R`
        <p>You get two cupcakes. The number of sprinkles on each cupcake is independent and geometrically distributed with parameter \(p\).</p>
        <ul class="parts">
          <li><b>(a)</b><span>What is the probability that both cupcakes have exactly the same number of sprinkles?</span></li>
          <li><b>(b)</b><span>You scrape the sprinkles off both cupcakes onto a plate and count them. What is the distribution of the total number of sprinkles?</span></li>
        </ul>`,
      parts: [
        {
          label: 'Setup', title: 'Fix the notation',
          question: R`Let \(S_1, S_2\) be the sprinkle counts.`,
          steps: [
            {
              type: 'note', title: 'What we know',
              figure: { name: 'lattice', opts: { p: 0.4, n: 8, k: 5 } },
              html: R`
                <p>\(S_1\) and \(S_2\) are independent with \(\P\{S_i = n\} = p(1 - p)^{n-1}\) for \(n = 1, 2, 3, \dots\) In this course a geometric random variable takes values starting at 1: each cupcake has at least one sprinkle.</p>
                <p>The figure shows the joint distribution as a grid: the cell \((n, m)\) has probability \(\P\{S_1 = n\}\P\{S_2 = m\}\). Part (a) is the diagonal of this grid; part (b) is an anti-diagonal.</p>`,
              why: R`Writing the pmf with its range (\(n \ge 1\)) is not pedantry: the lower limit of every sum below comes from it, and the grading comments list “summation index starting at 0” as a recurring error.`,
              solution: R`\(S_1, S_2\) are independent with \(\P\{S_i = n\} = p(1-p)^{n-1}\), \(n = 1, 2, \dots\)`
            }
          ]
        },
        {
          label: '(a)', title: 'Same number of sprinkles',
          question: R`Compute \(\P\{S_1 = S_2\}\).`,
          steps: [
            {
              type: 'mcq',
              prompt: R`Write the event \(\{S_1 = S_2\}\) in a form you can compute.`,
              choices: [
                { text: R`\(\{S_1 = S_2 = n\}\) for some particular \(n\).`, feedback: R`A grading comment flags exactly this: the event is “equal to <em>some</em> common value”, which is a union over all \(n\), not a single \(n\).` },
                { text: R`\(\{S_1 = n\} \cup \{S_2 = n\}\).`, feedback: R`A union of two events with a fixed \(n\) says one of them equals \(n\), which is unrelated to equality of the two.` },
                { text: R`\(\displaystyle\bigcup_{n=1}^\infty \{S_1 = n\} \cap \{S_2 = n\}\), a union of <em>disjoint</em> events.`, correct: true, feedback: R`Disjoint because \(S_1\) cannot equal two different values. So by the third axiom, \(\P\{S_1 = S_2\} = \sum_{n \ge 1}\P\{S_1 = n, S_2 = n\}\).` },
                { text: R`\(\displaystyle\bigcup_{n=0}^\infty \{S_1 = n, S_2 = n\}\) and sum \(p^2(1-p)^{2(n-1)}\) from \(n = 0\).`, feedback: R`The \(n = 0\) term does not exist: geometric variables start at 1. Plugging \(n = 0\) into the pmf formula produces the nonsense value \(p(1-p)^{-1}\).` }
              ],
              why: R`“Decompose the event into disjoint pieces indexed by the value of one variable” is the universal first move for comparisons between random variables. Then the third axiom turns the probability into a sum.`,
              solution: R`\(\{S_1 = S_2\} = \bigcup_{n \ge 1}\{S_1 = n\} \cap \{S_2 = n\}\), a disjoint union, so by the third axiom \[\P\{S_1 = S_2\} = \sum_{n=1}^\infty \P\{S_1 = n,\, S_2 = n\}.\]`
            },
            {
              type: 'mcq',
              prompt: R`\(\P\{S_1 = n,\; S_2 = n\} = \;?\)`,
              choices: [
                { text: R`\(p(1-p)^{n-1}\)`, feedback: R`That is the probability for one cupcake; both must equal \(n\).` },
                { text: R`\(p^2(1-p)^{2(n-1)}\)`, correct: true, feedback: R`By independence, \(\P\{S_1 = n\}\P\{S_2 = n\} = \big(p(1-p)^{n-1}\big)^2\).` },
                { text: R`\(p^2(1-p)^{n-1}\)`, feedback: R`Both factors carry \((1-p)^{n-1}\); squaring doubles the exponent.` },
                { text: R`\(2p(1-p)^{n-1}\)`, feedback: R`“Both” is a product, not a sum.` }
              ],
              why: R`Within each piece, independence turns “and” into a product. Across pieces, disjointness turns “or” into a sum. Say which one you are using at each step; graders check both.`,
              solution: R`By independence, \(\P\{S_1 = n, S_2 = n\} = p(1-p)^{n-1}\cdot p(1-p)^{n-1} = p^2\big((1-p)^2\big)^{n-1}\).`
            },
            {
              type: 'input',
              prompt: R`Sum the series: \(\P\{S_1 = S_2\} = p^2\sum_{n \ge 1}\big((1-p)^2\big)^{n-1} = \dfrac{p^2}{1 - (1-p)^2}\). Simplify, then evaluate at \(p = \tfrac12\). Enter the value at \(p = \tfrac12\).`,
              placeholder: 'e.g. 1/3', numeric: 1 / 3, tol: 1e-4, display: '1/3',
              feedback: R`\(1 - (1-p)^2 = p(2 - p)\), so \(\P\{S_1 = S_2\} = \dfrac{p}{2 - p}\); at \(p = \tfrac12\) this is \(\tfrac13\).`,
              wrong: R`\(1 - (1-p)^2 = (1 - (1-p))(1 + (1-p)) = p(2-p)\). Cancel one \(p\).`,
              why: R`The ratio \((1-p)^2\) is in \((0,1)\), so the geometric series converges; note that explicitly. Simplifying to \(\frac{p}{2-p}\) makes the sanity checks visible: \(\to 1\) as \(p \to 1\) (both cupcakes always have exactly one sprinkle), \(\to 0\) as \(p \to 0\).`,
              solution: R`Summing the geometric series (ratio \((1-p)^2 < 1\)), \[\P\{S_1 = S_2\} = \frac{p^2}{1 - (1-p)^2} = \frac{p^2}{p(2-p)} = \frac{p}{2 - p}.\]`
            }
          ]
        },
        {
          label: '(b)', title: 'Distribution of the total',
          question: R`Find \(\P\{S_1 + S_2 = k\}\) for every possible \(k\).`,
          steps: [
            {
              type: 'mcq',
              prompt: R`Before any formula: what is the range of \(S_1 + S_2\)?`,
              choices: [
                { text: R`\(\{0, 1, 2, \dots\}\)`, feedback: R`Each cupcake has at least one sprinkle.` },
                { text: R`\(\{1, 2, 3, \dots\}\)`, feedback: R`\(S_1 \ge 1\) and \(S_2 \ge 1\) give \(S_1 + S_2 \ge 2\).` },
                { text: R`\(\{2, 3, 4, \dots\}\)`, correct: true, feedback: R`A grading comment: “not pointing out that the range is \(k \ge 2\) is a very important constraint” that cost points.` },
                { text: R`\(\{2, 4, 6, \dots\}\)`, feedback: R`The two counts need not be equal; odd totals are possible.` }
              ],
              why: R`“What is the distribution” means the pmf <em>together with</em> the set of values. State the range first; it also tells you the limits of the sums you are about to write.`,
              solution: R`Since \(S_1, S_2 \ge 1\), the total takes values in \(\{2, 3, 4, \dots\}\).`
            },
            {
              type: 'mcq',
              prompt: R`For \(k \ge 2\), write \(\{S_1 + S_2 = k\}\) as a disjoint union.`,
              choices: [
                { text: R`\(\displaystyle\bigcup_{n=1}^{k}\{S_1 = n, S_2 = k - n\}\)`, feedback: R`The term \(n = k\) would need \(S_2 = 0\), impossible. The index must stop at \(k - 1\).` },
                { text: R`\(\displaystyle\bigcup_{n=1}^{k-1}\{S_1 = n, S_2 = k - n\}\)`, correct: true, feedback: R`Both \(n \ge 1\) and \(k - n \ge 1\), hence \(1 \le n \le k - 1\). The pieces are disjoint because they fix different values of \(S_1\).` },
                { text: R`\(\displaystyle\bigcup_{n=0}^{k}\{S_1 = n, S_2 = k - n\}\)`, feedback: R`Neither \(S_1 = 0\) nor \(S_2 = 0\) can occur.` },
                { text: R`\(\{S_1 = k/2, S_2 = k/2\}\)`, feedback: R`That is one way to total \(k\) (and only for even \(k\)); there are \(k - 1\) ways.` }
              ],
              why: R`Same move as in (a): index the disjoint pieces by the value of \(S_1\). The limits are dictated by the ranges of \(S_1\) and \(S_2\).`,
              solution: R`For \(k \ge 2\), \(\{S_1 + S_2 = k\} = \bigcup_{n=1}^{k-1}\{S_1 = n,\, S_2 = k - n\}\), a disjoint union, so \[\P\{S_1 + S_2 = k\} = \sum_{n=1}^{k-1}\P\{S_1 = n\}\,\P\{S_2 = k - n\}.\]`
            },
            {
              type: 'input',
              prompt: R`Each piece has probability \(\P\{S_1 = n\}\P\{S_2 = k-n\} = p(1-p)^{n-1}\cdot p(1-p)^{k-n-1} = p^2(1-p)^{k-2}\), the same for every \(n\). How many pieces are there, as a function of \(k\)?`,
              placeholder: 'in terms of k', answers: ['k-1', '(k-1)', 'k - 1'], display: 'k-1',
              feedback: R`\(n\) runs from 1 to \(k-1\): \(k - 1\) pieces, so \(\P\{S_1 + S_2 = k\} = (k-1)\,p^2(1-p)^{k-2}\) for \(k = 2, 3, \dots\)`,
              wrong: R`Count the integers \(n\) with \(1 \le n \le k - 1\).`,
              why: R`The exponent \((n-1) + (k-n-1) = k - 2\) does not depend on \(n\), which is why the sum collapses to a count. Noticing “the summand is constant” saves a page.`,
              solution: R`Each term equals \(p(1-p)^{n-1}\cdot p(1-p)^{k-n-1} = p^2(1-p)^{k-2}\), independent of \(n\), and there are \(k - 1\) terms.`
            },
            {
              type: 'note', title: 'Name it, after proving it',
              html: R`
                \[\P\{S_1 + S_2 = k\} = (k-1)\,p^2\,(1-p)^{k-2}, \qquad k = 2, 3, 4, \dots\]
                <p>This is the negative binomial distribution with parameters \(2\) and \(p\): in a Bernoulli process, \(S_1 + S_2\) is the time of the second success (lecture notes, Section 2.2). The combinatorial factor \(k - 1 = \binom{k-1}{1}\) counts where the first success can sit among the first \(k-1\) trials.</p>`,
              why: R`The grading comments explicitly penalized “directly using the conclusion that a sum of two geometrics is negative binomial without any proof”. Recognizing the name is good for checking; deriving it is what earns the points.`,
              solution: R`\[\P\{S_1 + S_2 = k\} = (k-1)\,p^2(1-p)^{k-2}, \qquad k = 2, 3, \dots\] (the negative binomial distribution: time of the second success).`
            },
            {
              type: 'mcq',
              prompt: R`Sanity check: does \(\sum_{k \ge 2}(k-1)p^2(1-p)^{k-2}\) equal 1?`,
              choices: [
                { text: R`No, it sums to \(p\).`, feedback: R`Try the substitution \(m = k - 1\).` },
                { text: R`Yes: with \(m = k-1\) and \(x = 1-p\), it is \(p^2\sum_{m \ge 1} m\,x^{m-1} = p^2\cdot\dfrac{1}{(1-x)^2} = 1\).`, correct: true, feedback: R`The series \(\sum_{m \ge 1} m x^{m-1} = \frac{d}{dx}\sum_{m \ge 0} x^m = \frac{1}{(1-x)^2}\) is the same calculus trick used in the notes to compute \(\E[\Geom(p)] = 1/p\).` },
                { text: R`It cannot be checked without more information.`, feedback: R`It is a plain power series with ratio \(1 - p < 1\).` },
                { text: R`No, it sums to \(1/p\).`, feedback: R`A pmf must sum to 1; if your sum gives \(1/p\), a factor \(p\) was lost.` }
              ],
              why: R`A distribution you derived should sum to 1. If it does not, you know there is an error before the grader does. The check costs one line.`,
              solution: R`(Check: \(\sum_{k\ge2}(k-1)p^2(1-p)^{k-2} = p^2\sum_{m\ge1} m(1-p)^{m-1} = p^2/p^2 = 1\).)`
            }
          ]
        }
      ],
      takeaways: [
        R`Comparisons and sums of random variables are handled by a disjoint union indexed by the value of one variable, then the third axiom (sum) and independence (product inside each term).`,
        R`Geometric variables start at 1 in this course. Sum limits and ranges follow from that.`,
        R`“Find the distribution” means pmf <em>and</em> range. State \(k \ge 2\).`,
        R`Derive named distributions when asked for a distribution; quote them only as a check.`,
        R`Check that your pmf sums to 1, using \(\sum_{m \ge 1} m x^{m-1} = (1-x)^{-2}\) when a linear factor appears.`
      ]
    }
  ]
});
