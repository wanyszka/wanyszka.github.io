/* ================================================================
   Fall 2026 · Midterm 1 — interactive walkthrough
   Conventions: LaTeX inline \( \), display \[ \]; macros \P \E \Var \Binom \Geom \Exp \ind \given
   Each step may carry `solution` (appended to "Your solution") and `figure` ({name, opts}).
   ================================================================ */
ORF309.exams.push({
  id: 'f2026',
  title: 'Fall 2026 · Midterm 1',
  short: 'F26',
  date: 'October 2026',
  blurb: 'Two coins and Bayes, the Dinky as a Bernoulli process, indicators and variance, a chain of dependent goals, and racing geometric clocks.',
  intro: R`Throughout, \(q = 1 - p\). Each problem opens with a short <em>setup</em> phase: before any computation you name the objects and decide what kind of answer is being asked for. That habit is worth more points than any formula.`,

  problems: [

    /* ============================================================ */
    {
      id: 'p1',
      title: 'Two coins',
      lead: 'A fair American coin, a biased Canadian coin, and what the first flip tells you about which one you hold.',
      tags: ['Law of total probability', 'Bayes', 'Independence vs. conditional independence'],
      statement: R`
        <p>You have two coins: an American coin and a Canadian coin. The American coin is fair. The Canadian coin is biased: it comes up heads with probability \(p > \tfrac12\). You choose one of the two coins, each with probability \(\tfrac12\), and then flip that chosen coin repeatedly. Once the coin is chosen, its flips are independent.</p>
        <ul class="parts">
          <li><b>(a)</b><span>What is the probability that the first flip is heads?</span></li>
          <li><b>(b)</b><span>Given that the first flip is heads, what is the probability that you chose the Canadian coin?</span></li>
          <li><b>(c)</b><span>Suppose \(p = 1\) (the Canadian coin always comes up heads). Are the events {first flip is heads} and {second flip is heads} independent? Justify why or why not.</span></li>
        </ul>`,
      parts: [
        {
          label: 'Setup', title: 'Before you compute',
          question: R`Read the whole problem once. Then name the random objects and translate every sentence of the story into a probability statement.`,
          steps: [
            {
              type: 'mcq', multi: true,
              prompt: R`Which objects should we name? Select everything that the three questions actually talk about.`,
              choices: [
                { text: R`The event \(C\) that the Canadian coin was chosen.`, correct: true },
                { text: R`A random variable \(X\) = number of heads in the first two flips.`, feedback: R`Nothing in (a)–(c) asks about a count. Naming objects you will not use costs time and clutters the solution.` },
                { text: R`The events \(H_1, H_2\) that the first and second flips are heads.`, correct: true },
                { text: R`The random variable \(T\) = time of the first head.`, feedback: R`No question asks when the first head arrives.` }
              ],
              feedback: R`Name exactly what the questions mention: <em>which coin</em> (an event \(C\)) and <em>whether each flip is heads</em> (events \(H_1, H_2\)). Events, not random variables, because every question is a yes/no question about these.`,
              why: R`Every sentence of a probability problem is either a definition of a random object or a numerical fact about it. Listing the objects first makes the second step, translating the facts, mechanical.`,
              solution: R`Let \(C\) be the event that the Canadian coin is chosen, and \(H_i\) the event that flip \(i\) is heads.`
            },
            {
              type: 'note', title: 'Translate the givens',
              html: R`
                <p>“Choose one of the two coins, each with probability \(\tfrac12\)”:</p>
                \[\P\{C\} = \P\{C^c\} = \tfrac12.\]
                <p>“The American coin is fair; the Canadian coin shows heads with probability \(p\)”:</p>
                \[\P\{H_i \given C\} = p, \qquad \P\{H_i \given C^c\} = \tfrac12 \qquad (i = 1, 2).\]
                <p>“Once the coin is chosen, its flips are independent”:</p>
                \[\P\{H_1 \cap H_2 \given C\} = p^2, \qquad \P\{H_1 \cap H_2 \given C^c\} = \tfrac14.\]`,
              why: R`Look at the <em>shape</em> of what you know: everything about the flips is conditional on the coin. That single observation predicts the whole problem. Part (a) asks you to remove the conditioning (law of total probability), part (b) to reverse it (Bayes), and part (c) to notice that “independent given the coin” is not the same as “independent”.`,
              solution: R`Given: \(\P\{C\} = \P\{C^c\} = \tfrac12\), \(\P\{H_i \given C\} = p\), \(\P\{H_i \given C^c\} = \tfrac12\), and the flips are independent given the coin.`
            }
          ]
        },
        {
          label: '(a)', title: 'Probability that the first flip is heads',
          question: R`What is \(\P\{H_1\}\)?`,
          steps: [
            {
              type: 'mcq',
              figure: { name: 'area', opts: { eventName: 'H_1', cases: [{ name: 'C', prob: 0.5, cond: 0.8, label: '\\tfrac12', condLabel: 'p' }, { name: 'C^c', prob: 0.5, cond: 0.5, label: '\\tfrac12', condLabel: '\\tfrac12' }], totalLabel: '\\tfrac{1+2p}{4}', slider: { label: '\\(p\\)', min: 0.5, max: 1, value: 0.8, sets: [[0, 'cond']] } } },
              prompt: R`We know \(\P\{H_1 \given C\}\) and \(\P\{H_1 \given C^c\}\), and we want \(\P\{H_1\}\). Which tool does that?`,
              choices: [
                { text: R`Bayes’ formula.`, feedback: R`Bayes reverses the direction of conditioning: it would give \(\P\{C \given H_1\}\). Here we want to <em>remove</em> the conditioning, not flip it.` },
                { text: R`Independence: \(\P\{H_1\} = \P\{H_1 \given C\}\) because the flips are independent.`, feedback: R`The flips are independent <em>of each other</em> once the coin is fixed. \(H_1\) is certainly not independent of \(C\): the Canadian coin makes heads more likely.` },
                { text: R`The law of total probability over the partition \(\{C, C^c\}\).`, correct: true, feedback: R`\(C\) and \(C^c\) partition the sample space, so \(\P\{H_1\} = \P\{H_1 \given C\}\P\{C\} + \P\{H_1 \given C^c\}\P\{C^c\}\).` },
                { text: R`Average the two: \(\P\{H_1\} = \tfrac12\big(\P\{H_1 \given C\} + \P\{H_1 \given C^c\}\big)\).`, feedback: R`This produces the right number here only because \(\P\{C\} = \tfrac12\). It is the law of total probability with the weights hidden, and it fails the moment the coins are not equally likely. Always write the weights.` }
              ],
              why: R`When a quantity is known <em>case by case</em> and you want it <em>overall</em>, you average over the cases, weighted by their probabilities. “Case by case” is the signal for the law of total probability. The figure shows it as areas: the shaded part of each column is \(\P\{H_1 \cap \text{case}\}\), and the total shaded area is \(\P\{H_1\}\).`,
              solution: R`By the law of total probability over \(\{C, C^c\}\),
                \[\P\{H_1\} = \P\{H_1 \given C\}\,\P\{C\} + \P\{H_1 \given C^c\}\,\P\{C^c\}.\]`
            },
            {
              type: 'mcq',
              prompt: R`Carry out the computation. \(\P\{H_1\} = \;?\)`,
              choices: [
                { text: R`\(\dfrac{p}{2}\)`, feedback: R`That is \(\P\{H_1 \cap C\}\): heads <em>and</em> the Canadian coin. You still have to add the fair-coin case.` },
                { text: R`\(p + \dfrac14\)`, feedback: R`You weighted the fair coin by \(\tfrac12\) but forgot to weight the Canadian coin by \(\tfrac12\) too.` },
                { text: R`\(\dfrac{1 + 2p}{4}\)`, correct: true, feedback: R`\(p\cdot\tfrac12 + \tfrac12\cdot\tfrac12 = \dfrac{2p + 1}{4}\).` },
                { text: R`\(\dfrac{1 + p}{2}\)`, feedback: R`This is the average of \(p\) and \(1\), not of \(p\) and \(\tfrac12\).` }
              ],
              why: R`Sanity-check a formula at the extremes. At \(p = \tfrac12\) both coins are fair and the formula returns \(\tfrac12\). At \(p = 1\) it returns \(\tfrac34\). If either check failed, you would know something was wrong before moving on.`,
              solution: R`\[\P\{H_1\} = p\cdot\tfrac12 + \tfrac12\cdot\tfrac12 = \frac{1 + 2p}{4}.\]`
            },
            {
              type: 'input',
              prompt: R`Sanity check, which we will reuse in (c): when \(p = 1\), what is \(\P\{H_1\}\)?`,
              placeholder: 'e.g. 3/4 or 0.75', numeric: 0.75, tol: 1e-6, display: '3/4',
              feedback: R`\(\dfrac{1 + 2\cdot 1}{4} = \dfrac34\). Half the time you hold a coin that always shows heads, half the time a coin that shows heads half the time.`,
              wrong: R`Plug \(p = 1\) into \((1 + 2p)/4\).`,
              solution: R`(Check: \(p = 1\) gives \(\P\{H_1\} = \tfrac34\); \(p = \tfrac12\) gives \(\tfrac12\).)`
            }
          ]
        },
        {
          label: '(b)', title: 'Which coin, given heads?',
          question: R`Given that the first flip is heads, what is the probability that you chose the Canadian coin, \(\P\{C \given H_1\}\)?`,
          steps: [
            {
              type: 'mcq',
              figure: { name: 'area', opts: { eventName: 'H_1', bayes: 0, cases: [{ name: 'C', prob: 0.5, cond: 0.8, label: '\\tfrac12', condLabel: 'p' }, { name: 'C^c', prob: 0.5, cond: 0.5, label: '\\tfrac12', condLabel: '\\tfrac12' }], totalLabel: '\\tfrac{1+2p}{4}', slider: { label: '\\(p\\)', min: 0.5, max: 1, value: 0.8, sets: [[0, 'cond']] } } },
              prompt: R`The direction has flipped: the data tells us \(\P\{H_1 \given C\}\), the question asks for \(\P\{C \given H_1\}\). What is the natural move?`,
              choices: [
                { text: R`They are equal: \(\P\{C \given H_1\} = \P\{H_1 \given C\} = p\).`, feedback: R`“Probability of heads given Canadian” and “probability of Canadian given heads” are different questions with different answers. Confusing them is the single most common conditional-probability error.` },
                { text: R`Bayes: \(\P\{C \given H_1\} = \dfrac{\P\{H_1 \given C\}\,\P\{C\}}{\P\{H_1\}}\).`, correct: true, feedback: R`And the denominator \(\P\{H_1\}\) is exactly what part (a) computed. That is usually why part (a) exists.` },
                { text: R`The law of total probability again.`, feedback: R`The law of total probability removes a conditioning; it cannot produce a probability <em>of</em> \(C\) <em>given</em> something.` },
                { text: R`\(\P\{C \given H_1\} = \P\{C\} = \tfrac12\), because the coin was chosen before any flip happened.`, feedback: R`Conditioning is about information, not time order. Seeing heads is evidence about which coin you hold.` }
              ],
              why: R`You do not need to memorize Bayes’ formula. It is the definition of conditional probability written twice: \(\P\{C \given H_1\} = \P\{C \cap H_1\}/\P\{H_1\}\) and \(\P\{C \cap H_1\} = \P\{H_1 \given C\}\P\{C\}\). In the figure: keep only the shaded area (we know \(H_1\) happened) and ask what fraction of it is the \(C\) column.`,
              solution: R`By Bayes (the definition of conditional probability, twice), using (a) for the denominator:
                \[\P\{C \given H_1\} = \frac{\P\{H_1 \given C\}\,\P\{C\}}{\P\{H_1\}}.\]`
            },
            {
              type: 'mcq',
              prompt: R`Compute \(\P\{C \given H_1\}\).`,
              choices: [
                { text: R`\(\dfrac{4p}{1 + 2p}\)`, feedback: R`You used \(\P\{H_1 \given C\} = p\) as the numerator and forgot to multiply by \(\P\{C\} = \tfrac12\).` },
                { text: R`\(\dfrac{p}{2}\)`, feedback: R`That is the joint probability \(\P\{C \cap H_1\}\). Divide by \(\P\{H_1\}\).` },
                { text: R`\(\dfrac{1 + 2p}{4p}\)`, feedback: R`Inverted. A conditional probability can never exceed 1; this one does for \(p > \tfrac12\).` },
                { text: R`\(\dfrac{2p}{1 + 2p}\)`, correct: true, feedback: R`\(\dfrac{p/2}{(1 + 2p)/4} = \dfrac{2p}{1 + 2p}\).` }
              ],
              solution: R`\[\P\{C \given H_1\} = \frac{p/2}{(1 + 2p)/4} = \frac{2p}{1 + 2p}.\]`
            },
            {
              type: 'input',
              prompt: R`Sanity check: when \(p = 1\), what is \(\P\{C \given H_1\}\)?`,
              placeholder: 'e.g. 2/3', numeric: 2 / 3, tol: 1e-4, display: '2/3',
              feedback: R`Among all first flips that land heads, two out of three come from the Canadian coin: it produces heads every time, the fair coin only half the time, a 2:1 ratio. Also note \(\P\{C \given H_1\} \to \tfrac12\) as \(p \to \tfrac12\): if the coins are identical, heads carries no information.`,
              wrong: R`Plug \(p = 1\) into \(2p/(1 + 2p)\).`,
              solution: R`(Check: \(p = 1\) gives \(\tfrac23\); \(p = \tfrac12\) gives \(\tfrac12\), as it should when the coins are identical.)`
            },
            {
              type: 'mcq',
              quote: R`“The coin was chosen before any flip, so the flip cannot change which coin I hold. Therefore \(\P\{C \given H_1\} = \P\{C\} = \tfrac12\).”`,
              prompt: R`What is wrong with this argument?`,
              choices: [
                { text: R`Nothing: later events cannot influence earlier ones.`, feedback: R`Influence is not the point. Conditioning updates <em>what we know</em>, and a later observation can tell us a lot about an earlier choice.` },
                { text: R`The argument would be right if \(p\) were 1.`, feedback: R`At \(p = 1\) the effect is strongest: \(\P\{C \given H_1\} = \tfrac23\).` },
                { text: R`Conditioning is about information, not causation: observing heads is evidence that we hold the biased coin, even though the choice happened first.`, correct: true, feedback: R`Exactly. Bayes’ formula is precisely the machinery for updating beliefs about causes (which coin) from effects (what the flip showed).` },
                { text: R`The only error is that \(\P\{C\}\) should be \(p\), not \(\tfrac12\).`, feedback: R`\(\P\{C\} = \tfrac12\) is correct; \(p\) is the heads probability of the Canadian coin.` }
              ]
            }
          ]
        },
        {
          label: '(c)', title: 'Are the two flips independent?',
          question: R`Take \(p = 1\). Are \(H_1\) and \(H_2\) independent? Justify.`,
          steps: [
            {
              type: 'mcq', multi: true,
              prompt: R`This is a yes/no question about independence. What exactly must we check? Select all valid checks.`,
              choices: [
                { text: R`Compute \(\P\{H_1 \cap H_2\}\) and compare it with \(\P\{H_1\}\,\P\{H_2\}\).`, correct: true },
                { text: R`Check whether \(H_1\) and \(H_2\) are disjoint.`, feedback: R`Disjoint is not independent. Two disjoint events with positive probability are <em>never</em> independent, because knowing one occurred tells you the other did not.` },
                { text: R`Compute \(\P\{H_2 \given H_1\}\) and compare it with \(\P\{H_2\}\).`, correct: true },
                { text: R`Note that the flips are independent by the problem’s assumption, so the answer is yes.`, feedback: R`The assumption is that flips are independent <em>once the coin is chosen</em>. Whether they are independent without that conditioning is exactly the question.` }
              ],
              feedback: R`Independence is a definition to be verified, not a feeling. Either \(\P\{H_1 \cap H_2\} = \P\{H_1\}\P\{H_2\}\) or \(\P\{H_2 \given H_1\} = \P\{H_2\}\) will do; the product form is usually quicker because it needs no division.`,
              why: R`Graders explicitly reward verifying independence from the definition. Arguments like “they feel unrelated” earn nothing.`,
              solution: R`Check the definition: compare \(\P\{H_1 \cap H_2\}\) with \(\P\{H_1\}\P\{H_2\}\). With \(p = 1\), part (a) gives \(\P\{H_1\} = \P\{H_2\} = \tfrac34\).`
            },
            {
              type: 'input',
              prompt: R`With \(p = 1\), compute \(\P\{H_1 \cap H_2\}\).`,
              hint: R`Condition on the coin, exactly as in (a). Given the coin, the two flips are independent, so \(\P\{H_1 \cap H_2 \given C\}\) and \(\P\{H_1 \cap H_2 \given C^c\}\) are immediate.`,
              placeholder: 'e.g. 5/8', numeric: 0.625, tol: 1e-6, display: '5/8',
              feedback: R`\(\P\{H_1 \cap H_2\} = \P\{H_1 \cap H_2 \given C\}\P\{C\} + \P\{H_1 \cap H_2 \given C^c\}\P\{C^c\} = 1^2\cdot\tfrac12 + \big(\tfrac12\big)^2\cdot\tfrac12 = \tfrac58.\)`,
              wrong: R`Use the law of total probability: \(1\cdot\tfrac12 + \tfrac14\cdot\tfrac12\).`,
              why: R`The same law of total probability as in (a), applied to the event \(H_1 \cap H_2\). Conditioning on the coin is what makes the joint probability computable, because the independence we were given lives <em>inside</em> each case.`,
              solution: R`By total probability, and since the flips are independent given the coin,
                \[\P\{H_1 \cap H_2\} = 1^2\cdot\tfrac12 + \big(\tfrac12\big)^2\cdot\tfrac12 = \tfrac58.\]`
            },
            {
              type: 'mcq',
              prompt: R`We have \(\P\{H_1 \cap H_2\} = \tfrac58 = \tfrac{10}{16}\) while \(\P\{H_1\}\P\{H_2\} = \tfrac34\cdot\tfrac34 = \tfrac{9}{16}\). Conclusion?`,
              choices: [
                { text: R`Independent: \(\tfrac{10}{16}\) and \(\tfrac{9}{16}\) are close enough.`, feedback: R`Close is not equal. Independence is an exact identity.` },
                { text: R`Not independent. Observing heads makes the Canadian coin more likely, which makes a second head more likely.`, correct: true, feedback: R`\(\P\{H_2 \given H_1\} = \tfrac{5/8}{3/4} = \tfrac56 > \tfrac34 = \P\{H_2\}\). Heads on flip 1 is good news for heads on flip 2.` },
                { text: R`We cannot decide without knowing \(\P\{H_2 \given H_1\}\).`, feedback: R`We can compute it: \(\P\{H_2 \given H_1\} = \tfrac{5/8}{3/4} = \tfrac56\). But the product check already settles the question.` },
                { text: R`Independent, because each flip is a separate physical event.`, feedback: R`Physical separation is irrelevant; the shared unknown coin couples the flips.` }
              ],
              solution: R`Since \(\tfrac58 = \tfrac{10}{16} \neq \tfrac{9}{16} = \P\{H_1\}\P\{H_2\}\), the events are <strong>not independent</strong>. Intuitively, a first head makes the Canadian coin more likely, which makes a second head more likely.`
            },
            {
              type: 'mcq',
              quote: R`“Once the coin is chosen, its flips are independent. Therefore \(H_1\) and \(H_2\) are independent.”`,
              prompt: R`Why does this argument fail?`,
              choices: [
                { text: R`The flips are actually not independent even given the coin.`, feedback: R`They are: that is the problem’s modelling assumption.` },
                { text: R`Conditional independence given \(C\) is not independence. Averaging over the unknown coin couples the flips: a head is evidence for the Canadian coin, which raises the chance of another head.`, correct: true, feedback: R`Right. In fact for general \(p\), \(\P\{H_1 \cap H_2\} - \P\{H_1\}\P\{H_2\} = \dfrac{(2p - 1)^2}{16}\), which is positive for every \(p \neq \tfrac12\). The flips are dependent whenever the coins differ.` },
                { text: R`The argument is fine for \(p < 1\) and only breaks at \(p = 1\).`, feedback: R`It breaks for every \(p \neq \tfrac12\); \(p = 1\) just makes the numbers clean.` },
                { text: R`It fails only because the coins are equally likely; with unequal probabilities it would be fine.`, feedback: R`Unequal coin probabilities would change the numbers, not the conclusion.` }
              ],
              watch: R`“Independent given \(X\)” and “independent” are different statements. Whenever a hidden variable (here: which coin) influences several observations, those observations are dependent even if they are independent given the hidden variable.`
            }
          ]
        }
      ],
      takeaways: [
        R`Every given fact was <em>conditional on the coin</em>. That shape tells you the toolkit in advance: the law of total probability removes conditioning, Bayes reverses it.`,
        R`Part (a) is almost always the denominator of part (b). Compute it cleanly and reuse it.`,
        R`Independence is verified by the definition, \(\P\{A \cap B\} = \P\{A\}\P\{B\}\). Never argue it from intuition alone.`,
        R`“Independent given the coin” does not imply “independent”. A shared unknown creates dependence.`,
        R`Plug in extreme parameter values (\(p = \tfrac12\), \(p = 1\)) to sanity-check every formula.`
      ]
    },

    /* ============================================================ */
    {
      id: 'p2',
      title: 'The Dinky',
      lead: 'Late days as a Bernoulli process: counts, first arrival, and why you may drop a conditioning.',
      tags: ['Bernoulli process', 'Binomial', 'Geometric', 'Independent increments'],
      statement: R`
        <p>Each day, the Dinky is late with probability \(p \in (0,1)\), independently of all other days. Let \(S_n\) denote the number of days among the first \(n\) days on which the Dinky is late, and let \(T_1\) be the first day on which the Dinky is late.</p>
        <ul class="parts">
          <li><b>(a)</b><span>What is the probability that the Dinky is on time on each of the first 10 days?</span></li>
          <li><b>(b)</b><span>Given that the Dinky is late for the first time on day 4, what is the probability that it is late at most 2 times during the first 10 days?</span></li>
          <li><b>(c)</b><span>Given that the Dinky is late for the first time on day 4, what is the expected number of days among the first 10 on which it is late?</span></li>
        </ul>`,
      parts: [
        {
          label: 'Setup', title: 'Recognize the model',
          question: R`What kind of random system is this, and which random variables live in it?`,
          steps: [
            {
              type: 'mcq',
              prompt: R`“Each day late with probability \(p\), independently of all other days.” Which model is this?`,
              choices: [
                { text: R`A Poisson process with rate \(p\).`, feedback: R`Days are discrete trials with a fixed success probability. A Poisson process lives in continuous time.` },
                { text: R`A Bernoulli process: independent trials \(X_1, X_2, \dots\) with \(\P\{X_k = 1\} = p\), where \(X_k = 1\) means “late on day \(k\)”.`, correct: true, feedback: R`And then \(S_n = X_1 + \dots + X_n\) is the count and \(T_1\) the first arrival time.` },
                { text: R`Just a single Binomial random variable.`, feedback: R`\(S_{10}\) is Binomial, but the problem also asks about <em>when</em> the first late day happens. The process view handles counts and times together.` },
                { text: R`A Markov chain on {late, on time}.`, feedback: R`With independent days there is no memory; this is the simplest case, a Bernoulli process.` }
              ],
              why: R`Naming the process unlocks a vocabulary: counts \(S_n \sim \Binom(n,p)\), arrival times \(T_k\), and the independent-increments property. Most Bernoulli-process problems are about translating between counts and times.`,
              solution: R`Model: a Bernoulli process \(X_k = \ind\{\text{late on day } k\}\), independent with \(\P\{X_k = 1\} = p\). Then \(S_n = \sum_{k=1}^n X_k \sim \Binom(n, p)\) and \(T_1 \sim \Geom(p)\).`
            },
            {
              type: 'note', title: 'Counts, times, and how they talk to each other',
              figure: { name: 'timeline', opts: { n: 10, p: 0.35 } },
              html: R`
                <p>The two are linked through events. For instance</p>
                \[\{T_1 = 4\} = \{X_1 = 0,\; X_2 = 0,\; X_3 = 0,\; X_4 = 1\},\]
                <p>so on the event \(\{T_1 = 4\}\) the first four days are completely determined: three on-time days, then one late day. In particular \(S_4 = 1\) there.</p>
                <p>Also: the increment \(S_{10} - S_4 = X_5 + \dots + X_{10}\) depends only on days 5–10, so it is independent of anything that depends only on days 1–4 (independent increments; lecture notes Example 2.1.6).</p>`,
              why: R`Write the translation between “time” statements and “count” statements <em>before</em> computing. Conditioning on \(\{T_1 = 4\}\) is really conditioning on the first four days, and that is the fact both (b) and (c) run on.`,
              solution: R`Note \(\{T_1 = 4\} = \{X_1 = X_2 = X_3 = 0,\, X_4 = 1\}\), and \(S_{10} - S_4 = X_5 + \dots + X_{10}\) depends only on days 5–10.`
            }
          ]
        },
        {
          label: '(a)', title: 'On time for ten days',
          question: R`Probability that the Dinky is on time on each of the first 10 days.`,
          steps: [
            {
              type: 'mcq',
              prompt: R`\(\P\{\text{on time on days } 1, \dots, 10\} = \;?\)`,
              choices: [
                { text: R`\(1 - p^{10}\)`, feedback: R`\(p^{10}\) is “late every day”; its complement is “not late every day”, a different event from “on time every day”.` },
                { text: R`\(10(1 - p)\)`, feedback: R`Probabilities of independent events multiply, they do not add. This expression exceeds 1 for small \(p\).` },
                { text: R`\((1 - p)^{10}\)`, correct: true, feedback: R`By independence of the days, \(\prod_{k=1}^{10}\P\{X_k = 0\} = q^{10}\). Equivalently \(\P\{S_{10} = 0\}\) with \(S_{10} \sim \Binom(10, p)\).` },
                { text: R`\(1 - 10p\)`, feedback: R`A first-order approximation of \((1-p)^{10}\) for tiny \(p\), not the exact value.` }
              ],
              why: R`Independence turns “and” into “times”. Write the event as an intersection of per-day events, then multiply.`,
              solution: R`By independence of the days, \[\P\{\text{on time on days } 1, \dots, 10\} = \prod_{k=1}^{10} \P\{X_k = 0\} = q^{10}.\]`
            }
          ]
        },
        {
          label: '(b)', title: 'At most two late days, given the first was day 4',
          question: R`Compute \(\P\{S_{10} \le 2 \given T_1 = 4\}\).`,
          steps: [
            {
              type: 'mcq',
              prompt: R`On the event \(\{T_1 = 4\}\), what do we know about the first four days?`,
              choices: [
                { text: R`Only that \(S_4 \ge 1\).`, feedback: R`We know much more: the first late day is day 4, so days 1–3 were on time and day 4 was late.` },
                { text: R`Nothing about \(S_4\); \(T_1\) and \(S_4\) are independent.`, feedback: R`Both are functions of the same first four days. They are strongly dependent: \(T_1 \le 4\) if and only if \(S_4 \ge 1\).` },
                { text: R`Everything: on time on days 1, 2, 3 and late on day 4. Hence \(S_4 = 1\) exactly.`, correct: true, feedback: R`So \(S_{10} = S_4 + (S_{10} - S_4) = 1 + (S_{10} - S_4)\) on this event.` },
                { text: R`That \(S_4 = 4\).`, feedback: R`That would mean late on all four days; then the first late day would be day 1.` }
              ],
              why: R`The first thing to do with a conditioning event is to ask: <em>what does it pin down, and what does it leave random?</em> Here it pins down days 1–4 and leaves days 5–10 untouched.`,
              solution: R`On \(\{T_1 = 4\}\) we have \(S_4 = 1\), so \(S_{10} = 1 + (S_{10} - S_4)\).`
            },
            {
              type: 'mcq',
              prompt: R`Rewrite the target. Given \(T_1 = 4\), the event \(\{S_{10} \le 2\}\) is the same as…`,
              choices: [
                { text: R`\(\{S_{10} - S_4 \le 2\}\): at most two late days among days 5–10.`, feedback: R`You forgot that day 4 already contributes one late day. Only one more is allowed.` },
                { text: R`\(\{S_6 \le 1\}\).`, feedback: R`Right count, wrong days. \(S_6\) counts days 1–6. We need the count over days 5–10, which is the increment \(S_{10} - S_4\). It has the <em>same distribution</em> as \(S_6\), but it is a different random variable, and the distinction matters when conditioning.` },
                { text: R`\(\{S_{10} - S_4 \le 1\}\): at most one late day among days 5–10.`, correct: true, feedback: R`Since \(S_{10} = 1 + (S_{10} - S_4)\) on \(\{T_1 = 4\}\), “\(S_{10} \le 2\)” means “\(S_{10} - S_4 \le 1\)”.` },
                { text: R`\(\{S_{10} \le 1\}\).`, feedback: R`That changes the question; the problem says at most 2.` }
              ],
              why: R`Split the count into “what the conditioning already determined” plus “what is still random”. This decomposition is the whole idea of parts (b) and (c).`,
              solution: R`Hence \(\P\{S_{10} \le 2 \given T_1 = 4\} = \P\{S_{10} - S_4 \le 1 \given T_1 = 4\}\).`
            },
            {
              type: 'mcq',
              prompt: R`Now we want \(\P\{S_{10} - S_4 \le 1 \given T_1 = 4\}\). Why is it legitimate to drop the conditioning and compute \(\P\{S_{10} - S_4 \le 1\}\)?`,
              choices: [
                { text: R`Because conditioning never changes a Binomial distribution.`, feedback: R`Conditioning changes distributions all the time; \(S_{10}\) given \(T_1 = 4\) is not \(\Binom(10,p)\).` },
                { text: R`Because \(T_1\) is independent of \(S_{10}\).`, feedback: R`False: \(T_1 \le 10\) exactly when \(S_{10} \ge 1\), so they are dependent.` },
                { text: R`We cannot; the conditioning changes the distribution of the increment.`, feedback: R`It does not, and the next option says why.` },
                { text: R`\(S_{10} - S_4\) depends only on days 5–10, while \(\{T_1 = 4\}\) depends only on days 1–4. Different days are independent, so the increment is independent of the conditioning event.`, correct: true, feedback: R`This is the independent-increments property of the Bernoulli process. It is the only reason we may remove the condition.` }
              ],
              why: R`“Find the independence” is the recurring trick with processes: rewrite the question so that the random pieces involved depend on <em>disjoint sets of trials</em>. Then independence of the trials lets you factor or drop conditions.`,
              solution: R`\(S_{10} - S_4\) depends only on days 5–10 and \(\{T_1 = 4\}\) only on days 1–4; by independence of the days (independent increments) the condition can be dropped: \[\P\{S_{10} \le 2 \given T_1 = 4\} = \P\{S_{10} - S_4 \le 1\}.\]`
            },
            {
              type: 'mcq',
              prompt: R`\(S_{10} - S_4\) counts late days among 6 independent days, so \(S_{10} - S_4 \sim \Binom(6, p)\). Then \(\P\{S_{10} - S_4 \le 1\} = \;?\)`,
              choices: [
                { text: R`\(q^6\)`, feedback: R`That is “no late day at all”; you also need “exactly one late day”.` },
                { text: R`\(q^6 + 6pq^5\)`, correct: true, feedback: R`\(\P\{\text{0 late}\} + \P\{\text{1 late}\} = q^6 + \binom61 p q^5\).` },
                { text: R`\(q^6 + pq^5\)`, feedback: R`There are \(\binom61 = 6\) choices for which of the six days is the late one.` },
                { text: R`\(1 - q^6\)`, feedback: R`That is “at least one late day”, the opposite tail.` }
              ],
              why: R`Notice how little arithmetic there was once the event was rewritten correctly. The thinking was in the rewriting.`,
              solution: R`Since \(S_{10} - S_4 \sim \Binom(6, p)\), \[\P\{S_{10} \le 2 \given T_1 = 4\} = q^6 + 6pq^5.\]`
            },
            {
              type: 'mcq',
              quote: R`“The days are independent, so conditioning on \(T_1 = 4\) does not matter: \(\P\{S_{10} \le 2 \given T_1 = 4\} = \P\{S_{10} \le 2\} = q^{10} + 10pq^9 + 45p^2q^8\).”`,
              prompt: R`What is wrong?`,
              choices: [
                { text: R`The Binomial probabilities are computed incorrectly.`, feedback: R`\(\P\{S_{10} \le 2\}\) is computed correctly. The problem is that it is the wrong quantity.` },
                { text: R`\(S_{10}\) includes days 1–4, and those are not independent of \(\{T_1 = 4\}\): the conditioning fixes them. Only the increment \(S_{10} - S_4\) is independent of the condition.`, correct: true, feedback: R`Exactly. Independence of days does <em>not</em> mean every statistic is independent of every event; you must check which days each object depends on.` },
                { text: R`It should be \(S_9\), since the condition removes one day.`, feedback: R`The condition fixes four days, not one, and it does not “remove” them: day 4 contributes a late day to the total.` },
                { text: R`Nothing is wrong.`, feedback: R`Compare the two answers at \(p = \tfrac12\): the correct one is \(7/64 \approx 0.11\), this one is \(56/1024 \approx 0.055\).` }
              ],
              watch: R`“Independent days” is a statement about the trials \(X_k\). Before dropping a condition, verify that the random variable you are left with and the conditioning event depend on <em>disjoint</em> sets of trials.`
            }
          ]
        },
        {
          label: '(c)', title: 'Expected late days, given the first was day 4',
          question: R`Compute \(\E[S_{10} \given T_1 = 4]\).`,
          steps: [
            {
              type: 'mcq',
              prompt: R`Use the same decomposition \(S_{10} = 1 + (S_{10} - S_4)\) on \(\{T_1 = 4\}\). Then \(\E[S_{10} \given T_1 = 4] = \;?\)`,
              choices: [
                { text: R`\(10p\)`, feedback: R`That ignores the conditioning entirely. We know for certain that day 4 was late and days 1–3 were not.` },
                { text: R`\(6p\)`, feedback: R`You dropped the late day on day 4, which is certain given \(T_1 = 4\).` },
                { text: R`\(1 + 6p\)`, correct: true, feedback: R`\(\E[S_{10} \given T_1 = 4] = 1 + \E[S_{10} - S_4 \given T_1 = 4] = 1 + \E[S_{10} - S_4] = 1 + 6p\), using independence of the increment from the condition.` },
                { text: R`\(1 + 10p\)`, feedback: R`The remaining random days are 5–10, six of them, not ten.` }
              ],
              why: R`Conditional expectation is linear, so the “determined” part contributes its known value and the “still random” part contributes its expectation. Independence of the increment from \(\{T_1 = 4\}\) is what lets us replace \(\E[\,\cdot \given T_1 = 4]\) by the unconditional \(\E[\,\cdot\,]\) for that part.`,
              solution: R`As in (b), \[\E[S_{10} \given T_1 = 4] = 1 + \E[S_{10} - S_4 \given T_1 = 4] = 1 + \E[S_{10} - S_4] = 1 + 6p.\]`
            },
            {
              type: 'mcq',
              prompt: R`Quick check of understanding. Which of these is <em>not</em> determined by the event \(\{T_1 = 4\}\)?`,
              choices: [
                { text: R`\(S_3\)`, feedback: R`\(S_3 = 0\) on this event.` },
                { text: R`\(S_4\)`, feedback: R`\(S_4 = 1\) on this event.` },
                { text: R`\(X_4\)`, feedback: R`\(X_4 = 1\): day 4 is the first late day.` },
                { text: R`\(S_5\)`, correct: true, feedback: R`\(S_5 = 1 + X_5\), and \(X_5\) is still random (and independent of the condition).` }
              ]
            }
          ]
        }
      ],
      takeaways: [
        R`A Bernoulli process has two natural families of random variables: counts \(S_n \sim \Binom(n,p)\) and arrival times \(T_k\). Most questions are about translating between them.`,
        R`Conditioning on an arrival-time event like \(\{T_1 = 4\}\) pins down the early trials completely. Split any count into “already determined” + “still random”.`,
        R`You may drop a condition only when the remaining random variable depends on trials <em>disjoint</em> from those the condition depends on: independent increments.`,
        R`“Same distribution” is not “same random variable”: \(S_{10} - S_4\) and \(S_6\) are both \(\Binom(6,p)\), but only the former is independent of \(\{T_1 = 4\}\).`
      ]
    },

    /* ============================================================ */
    {
      id: 'p3',
      title: 'Firestone or Tiger Inn',
      lead: 'Variance of a count, and expected number of long study sessions, via indicators.',
      tags: ['Indicators', 'Linearity of expectation', 'Variance of a sum', 'Exponential tail'],
      statement: R`
        <p>Each of the \(n\) days before the midterm, you go to Firestone to study with probability \(p\), or to Tiger Inn to relax with probability \(1 - p\), independently of all other days.</p>
        <ul class="parts">
          <li><b>(a)</b><span>Let \(X\) be the number of days that you go to Firestone. Compute \(\Var(X)\).</span></li>
          <li><b>(b)</b><span>Each day you go to Tiger Inn, you spend zero time studying. Each day you go to Firestone, you study for a random amount of time before you get bored; this study time (in hours) is exponentially distributed with rate \(\mu\), independently across days. What is the expected number of days on which you study for more than 3 hours?</span></li>
        </ul>`,
      parts: [
        {
          label: 'Setup', title: 'Name the count',
          question: R`\(X\) counts Firestone days. Before anything else: what is its distribution, and how would you build it from smaller pieces?`,
          steps: [
            {
              type: 'mcq',
              prompt: R`What is the distribution of \(X\)?`,
              choices: [
                { text: R`\(\Geom(p)\), since we wait for Firestone days.`, feedback: R`Geometric describes <em>when</em> the first success comes, not <em>how many</em> successes there are in \(n\) trials.` },
                { text: R`\(\Binom(n, p)\): \(n\) independent trials, success = Firestone with probability \(p\).`, correct: true, feedback: R`And it is useful to write \(X = \sum_{k=1}^n X_k\) with \(X_k = \ind\{\text{Firestone on day } k\}\), independent \(\text{Bernoulli}(p)\) indicators.` },
                { text: R`Poisson\((np)\).`, feedback: R`Only an approximation for large \(n\) and small \(p\); the exact distribution is Binomial.` },
                { text: R`Uniform on \(\{0, 1, \dots, n\}\).`, feedback: R`Not every count is equally likely; \(X = n\) has probability \(p^n\), for example.` }
              ],
              why: R`Writing a count as a sum of indicators is the most reliable move in the course. It makes expectations trivial and variances manageable, and it works even when the indicators are dependent (for expectations).`,
              solution: R`Write \(X = \sum_{k=1}^n X_k\) with \(X_k = \ind\{\text{Firestone on day } k\}\), independent \(\mathrm{Bernoulli}(p)\); so \(X \sim \Binom(n, p)\).`
            }
          ]
        },
        {
          label: '(a)', title: 'Variance of the number of Firestone days',
          question: R`Compute \(\Var(X)\).`,
          steps: [
            {
              type: 'mcq', multi: true,
              prompt: R`Two routes lead to \(\Var(X)\). Select every statement that is <em>correct</em>.`,
              choices: [
                { text: R`Quote the formula \(\Var(\Binom(n,p)) = np(1-p)\) from class.`, correct: true },
                { text: R`Write \(X = \sum_k X_k\) and add the variances, justified by linearity of expectation.`, feedback: R`Variance is not linear. Adding variances is justified by <em>independence</em> of the summands (more precisely: zero covariances), not by linearity.` },
                { text: R`Write \(X = \sum_k X_k\) with independent indicators and use \(\Var(X) = \sum_k \Var(X_k)\).`, correct: true },
                { text: R`Use \(\Var(X) = \E[X]^2 - \E[X^2]\).`, feedback: R`Sign flipped: \(\Var(X) = \E[X^2] - \E[X]^2\). As written this would be \(\le 0\).` }
              ],
              feedback: R`Both the formula and the indicator decomposition are fine on an exam. The decomposition is worth knowing because it still works (with covariance terms) when the indicators are dependent.`,
              why: R`Graders accept the memorized Binomial variance, but the indicator route shows <em>why</em> it is \(np(1-p)\) and protects you when the setup is not exactly Binomial.`,
              solution: R`Since \(X_1, \dots, X_n\) are independent, \(\Var(X) = \sum_{k=1}^n \Var(X_k)\).`
            },
            {
              type: 'input',
              prompt: R`For a single indicator \(X_k \sim \text{Bernoulli}(p)\), what is \(\Var(X_k)\)? Write it in terms of \(p\), for example like <code>p(1-p)</code>.`,
              placeholder: 'in terms of p',
              answers: ['p(1-p)', '(1-p)p', 'p-p^2', 'pq', 'qp', 'p*(1-p)', 'p·(1-p)', 'p-p*p', 'p - p^2', '(1-p)*p', 'p(q)', 'p*q'],
              display: 'p(1-p)',
              feedback: R`Because an indicator satisfies \(X_k^2 = X_k\), we get \(\E[X_k^2] = \E[X_k] = p\), hence \(\Var(X_k) = \E[X_k^2] - \E[X_k]^2 = p - p^2 = p(1-p)\).`,
              wrong: R`Use \(\Var(X_k) = \E[X_k^2] - \E[X_k]^2\) and the fact that \(X_k^2 = X_k\) for an indicator.`,
              why: R`The identity \(\ind_A^2 = \ind_A\) is tiny but it is the reason indicator computations are so clean: every moment of an indicator equals its probability.`,
              solution: R`For each indicator, \(X_k^2 = X_k\), so \(\Var(X_k) = \E[X_k^2] - \E[X_k]^2 = p - p^2 = p(1-p)\).`
            },
            {
              type: 'note', title: 'Assemble',
              html: R`
                <p>Since \(X_1, \dots, X_n\) are independent, the variance of their sum is the sum of their variances:</p>
                \[\Var(X) = \sum_{k=1}^n \Var(X_k) = np(1-p).\]`,
              why: R`Compare with expectations: \(\E[X] = \sum_k \E[X_k] = np\) needs <em>no</em> independence at all, while \(\Var(X) = \sum_k \Var(X_k)\) needs it. Keep that asymmetry in mind; part (b) exploits it.`,
              solution: R`\[\Var(X) = np(1-p).\]`
            }
          ]
        },
        {
          label: '(b)', title: 'Expected number of long study days',
          question: R`Tiger Inn days: zero study. Firestone days: study time \(\sim \Exp(\mu)\) hours, independent across days. What is the expected number of days on which you study for more than 3 hours?`,
          steps: [
            {
              type: 'mcq',
              figure: { name: 'indicators', opts: { n: 8, p: 0.55, q: 0.45, labelA: 'Firestone', labelB: 'studying more than 3 hours', pTex: 'p', qTex: 'e^{-3\\mu}', nTex: 'n' } },
              prompt: R`What is being asked, and what is the natural first move?`,
              choices: [
                { text: R`A probability: use the law of total probability over the number of Firestone days.`, feedback: R`The question asks for an <em>expected number</em>, not a probability. Conditioning on \(X\) can be made to work, but it is far longer than needed.` },
                { text: R`An expectation of a count: write the count as \(\sum_{k=1}^n I_k\) where \(I_k\) indicates “Firestone on day \(k\) and study time \(> 3\)”, and use linearity.`, correct: true, feedback: R`Then \(\E\big[\sum_k I_k\big] = \sum_k \P\{I_k = 1\}\), so everything reduces to one probability per day.` },
                { text: R`A distribution: find \(\P\{\text{count} = j\}\) for every \(j\).`, feedback: R`Not asked; you would then still have to sum \(j\,\P\{\text{count} = j\}\).` },
                { text: R`Multiply \(\E[X]\) by the expected study time \(1/\mu\).`, feedback: R`That would be an expected number of <em>hours</em>, not of days, and it ignores the “more than 3 hours” condition.` }
              ],
              why: R`“Expected number of days on which …” is a template: count = sum of indicators, expectation = sum of probabilities. Recognize the template and the problem reduces to computing one probability.`,
              solution: R`Let \(I_k = \ind\{\text{Firestone on day } k \text{ and study time} > 3\}\). The number of long-study days is \(\sum_{k=1}^n I_k\), and by linearity \(\E\big[\sum_k I_k\big] = \sum_k \P\{I_k = 1\}\).`
            },
            {
              type: 'mcq',
              prompt: R`If \(T \sim \Exp(\mu)\), what is \(\P\{T > 3\}\)?`,
              choices: [
                { text: R`\(1 - e^{-3\mu}\)`, feedback: R`That is \(\P\{T \le 3\}\), the CDF. We want the tail.` },
                { text: R`\(\mu e^{-3\mu}\)`, feedback: R`That is the density at 3, not a probability.` },
                { text: R`\(e^{-3/\mu}\)`, feedback: R`Rate and mean are confused: with rate \(\mu\) the mean is \(1/\mu\), and \(\P\{T > t\} = e^{-\mu t}\).` },
                { text: R`\(e^{-3\mu}\)`, correct: true, feedback: R`\(\P\{T > t\} = e^{-\mu t}\) for \(t \ge 0\).` }
              ],
              solution: R`For the study time \(T \sim \Exp(\mu)\) on a Firestone day, \(\P\{T > 3\} = e^{-3\mu}\).`
            },
            {
              type: 'mcq',
              prompt: R`Let \(I_k\) indicate “Firestone on day \(k\) and you study more than 3 hours”. \(\P\{I_k = 1\} = \;?\)`,
              choices: [
                { text: R`\(e^{-3\mu}\)`, feedback: R`You must first go to Firestone; on Tiger Inn days the study time is zero, so the event cannot happen.` },
                { text: R`\(p\,e^{-3\mu}\)`, correct: true, feedback: R`\(\P\{\text{Firestone}\}\,\P\{T > 3 \given \text{Firestone}\} = p\,e^{-3\mu}\). Tiger Inn days contribute nothing.` },
                { text: R`\(p\,(1 - e^{-3\mu})\)`, feedback: R`Wrong tail: \(1 - e^{-3\mu}\) is the probability of studying <em>at most</em> 3 hours.` },
                { text: R`\(p + e^{-3\mu}\)`, feedback: R`“And” means multiply (via conditioning), not add.` }
              ],
              why: R`Two things must happen on the same day: go to Firestone, then exceed 3 hours. Chain them with the definition of conditional probability, \(\P\{F \cap \{T > 3\}\} = \P\{F\}\,\P\{T > 3 \given F\}\).`,
              solution: R`\[\P\{I_k = 1\} = \P\{\text{Firestone on day } k\}\,\P\{T > 3 \given \text{Firestone}\} = p\,e^{-3\mu}.\]`
            },
            {
              type: 'note', title: 'Assemble',
              html: R`
                \[\E\Big[\sum_{k=1}^n I_k\Big] = \sum_{k=1}^n \P\{I_k = 1\} = n\,p\,e^{-3\mu}.\]
                <p>Bonus remark: the \(I_k\) are independent, so the count is \(\Binom(n, pe^{-3\mu})\). We did not need that fact; linearity of expectation never requires independence.</p>`,
              why: R`Graders have repeatedly noted that invoking a Binomial (which needs independence) when only linearity (which needs nothing) is required is an <em>incorrect justification</em>, even when the number comes out right. Say “linearity of expectation” and you are safe.`,
              solution: R`\[\E[\text{number of long-study days}] = \sum_{k=1}^n p\,e^{-3\mu} = n\,p\,e^{-3\mu}.\]`
            },
            {
              type: 'mcq',
              quote: R`“The expected number of Firestone days is \(np\). On each, the expected study time is \(1/\mu\). So the expected number of long-study days is \(np\cdot\P\{1/\mu > 3\}\), which equals \(np\) if \(\mu < \tfrac13\) and \(0\) otherwise.”`,
              prompt: R`What went wrong?`,
              choices: [
                { text: R`\(np\) is not the expected number of Firestone days.`, feedback: R`\(np\) is correct for that.` },
                { text: R`The exponential distribution has no mean.`, feedback: R`It does: \(1/\mu\).` },
                { text: R`It replaces the random study time \(T\) by its mean \(1/\mu\). A random variable exceeding 3 is not the same as its mean exceeding 3: \(\P\{T > 3\} = e^{-3\mu}\) is strictly between 0 and 1 for every \(\mu\).`, correct: true, feedback: R`Right. The correct answer \(npe^{-3\mu}\) varies smoothly with \(\mu\); the flawed one jumps from \(np\) to \(0\).` },
                { text: R`Nothing; the two answers agree.`, feedback: R`They do not: try \(\mu = 1\), where the correct answer is \(np e^{-3} \approx 0.05\,np\), not \(0\).` }
              ],
              watch: R`Never substitute \(\E[T]\) for \(T\) inside an event or a probability. Expectation commutes with sums, not with thresholds, products, or functions in general.`
            }
          ]
        }
      ],
      takeaways: [
        R`Counts are sums of indicators. Expectation of a count = sum of probabilities, with <em>no</em> independence needed.`,
        R`Variance of a sum needs independence (or covariance terms). State which one you are using.`,
        R`For an indicator, \(\ind_A^2 = \ind_A\), so \(\Var(\ind_A) = \P(A)(1 - \P(A))\).`,
        R`Chain “and” events through conditioning: \(\P\{F \cap G\} = \P\{F\}\,\P\{G \given F\}\).`,
        R`Never replace a random variable by its mean inside a probability.`
      ]
    },

    /* ============================================================ */
    {
      id: 'p4',
      title: "Chad's three goals",
      lead: 'Dependent events given as a chain of conditionals: the multiplication rule and a four-cell partition.',
      tags: ['Chain rule', 'Law of total probability', 'Partitions', 'Conditional probability'],
      statement: R`
        <p>Chad enters sophomore year with three goals: event \(A\), earn an A in ORF 309; event \(B\), bicker Tiger Inn successfully; event \(C\), become champion of the annual Princeton dodgeball tournament. Chad will be happy if and only if all three occur. The events are dependent. A fortune teller tells him:</p>
        <p>\(\P\{A\} = a\); &nbsp; \(\P\{B \given A\} = b\), \(\P\{B \given A^c\} = c\); &nbsp; \(\P\{C \given A \cap B\} = d\), \(\P\{C \given A \cap B^c\} = e\), \(\P\{C \given A^c \cap B\} = f\), \(\P\{C \given A^c \cap B^c\} = g\).</p>
        <ul class="parts">
          <li><b>(a)</b><span>What is the probability that Chad will be happy?</span></li>
          <li><b>(b)</b><span>Given that Chad becomes dodgeball champion, what is the probability that he will be happy?</span></li>
        </ul>`,
      parts: [
        {
          label: 'Setup', title: 'Read the structure of the data',
          question: R`Seven numbers are given. Before using any of them, notice how they are organized.`,
          steps: [
            {
              type: 'mcq',
              prompt: R`“Happy” means all three goals occur. Part (a) asks for which quantity?`,
              choices: [
                { text: R`\(\P\{A\}\,\P\{B\}\,\P\{C\}\)`, feedback: R`That equals \(\P\{A \cap B \cap C\}\) only under independence, which the problem explicitly rules out.` },
                { text: R`\(\P\{A \cap B \cap C\}\)`, correct: true, feedback: R`“All three occur” is the intersection.` },
                { text: R`\(\P\{A \cup B \cup C\}\)`, feedback: R`The union is “at least one goal”; Chad needs all three.` },
                { text: R`\(\P\{C \given A \cap B\}\)`, feedback: R`That is given, it is \(d\). It is the probability of the <em>last</em> goal given the first two, not of all three.` }
              ],
              solution: R`Chad is happy exactly on the event \(A \cap B \cap C\).`
            },
            {
              type: 'note', title: 'The data is a chain',
              figure: { name: 'tree', opts: {} },
              html: R`
                <p>Look at how the fortune teller speaks: first about \(A\) alone, then about \(B\) <em>given</em> what happened with \(A\), then about \(C\) <em>given</em> what happened with \(A\) and \(B\). That is exactly the shape of the multiplication (chain) rule,</p>
                \[\P\{A \cap B \cap C\} = \P\{C \given A \cap B\}\;\P\{B \given A\}\;\P\{A\},\]
                <p>which is nothing more than the definition of conditional probability applied twice.</p>`,
              why: R`When givens arrive as a sequence of conditionals, each conditioned on everything before it, the chain rule is the intended tool. You do not need independence; the conditionals <em>are</em> the dependence. The tree makes the structure visible: a path’s probability is the product of its edge labels.`,
              solution: R`By the definition of conditional probability applied twice (chain rule), \[\P\{A \cap B \cap C\} = \P\{C \given A \cap B\}\,\P\{B \given A\}\,\P\{A\}.\]`
            }
          ]
        },
        {
          label: '(a)', title: 'Probability that Chad is happy',
          question: R`Compute \(\P\{A \cap B \cap C\}\).`,
          steps: [
            {
              type: 'mcq',
              prompt: R`\(\P\{A \cap B \cap C\} = \;?\)`,
              choices: [
                { text: R`\(abc\)`, feedback: R`\(c = \P\{B \given A^c\}\) is irrelevant when \(A\) occurs. The letters are not interchangeable; check what each one conditions on.` },
                { text: R`\(a\,b\,d\)`, correct: true, feedback: R`\(\P\{C \given A \cap B\}\,\P\{B \given A\}\,\P\{A\} = d\cdot b\cdot a\).` },
                { text: R`\(ab\cdot\dfrac{d + e + f + g}{4}\)`, feedback: R`Averaging the four \(C\)-probabilities with equal weights has no justification; and once \(A \cap B\) has occurred, only \(d\) matters.` },
                { text: R`\(a(b + c)d\)`, feedback: R`\(b\) and \(c\) are conditional on different events (\(A\) and \(A^c\)); they cannot simply be added.` }
              ],
              why: R`Only three of the seven numbers are needed. The others are there for part (b), and, on an exam, as distraction. Use exactly the data your path through the chain touches.`,
              solution: R`\[\P\{\text{happy}\} = d\cdot b\cdot a = abd.\]`
            }
          ]
        },
        {
          label: '(b)', title: 'Happy, given dodgeball champion',
          question: R`Compute \(\P\{A \cap B \cap C \given C\}\).`,
          steps: [
            {
              type: 'note', title: 'Start from the definition',
              html: R`
                \[\P\{A \cap B \cap C \given C\} = \frac{\P\{A \cap B \cap C \cap C\}}{\P\{C\}} = \frac{\P\{A \cap B \cap C\}}{\P\{C\}} = \frac{abd}{\P\{C\}},\]
                <p>using \(A \cap B \cap C \subseteq C\) and part (a). Everything now hinges on \(\P\{C\}\).</p>`,
              why: R`Always write the conditional probability out by its definition first. It immediately shows that the only new work is the denominator, and reuses (a) for the numerator.`,
              solution: R`Since \(A \cap B \cap C \subseteq C\), \[\P\{\text{happy} \given C\} = \frac{\P\{A \cap B \cap C\}}{\P\{C\}} = \frac{abd}{\P\{C\}}.\]`
            },
            {
              type: 'mcq',
              prompt: R`We know \(\P\{C \given \cdot\}\) only on four specific events. Which partition of the sample space lets us compute \(\P\{C\}\) from the givens?`,
              choices: [
                { text: R`\(\{A, A^c\}\)`, feedback: R`We are not given \(\P\{C \given A\}\); we would first have to compute it, which is the same work in disguise.` },
                { text: R`\(\{B, B^c\}\)`, feedback: R`\(\P\{C \given B\}\) is not given either.` },
                { text: R`\(\{A \cap B,\; A \cap B^c,\; A^c \cap B,\; A^c \cap B^c\}\)`, correct: true, feedback: R`The four numbers \(d, e, f, g\) are exactly \(\P\{C \given \cdot\}\) on these four cells, and the cells are disjoint with union \(\Omega\).` },
                { text: R`\(\{C, C^c\}\)`, feedback: R`Circular: that partition would require \(\P\{C\}\) itself.` }
              ],
              why: R`Choose the partition that matches the conditionals you were handed. The data tells you which law of total probability to write.`,
              solution: R`The events \(A \cap B,\ A \cap B^c,\ A^c \cap B,\ A^c \cap B^c\) partition \(\Omega\), so by the third axiom \[\P\{C\} = \P\{C \cap A \cap B\} + \P\{C \cap A \cap B^c\} + \P\{C \cap A^c \cap B\} + \P\{C \cap A^c \cap B^c\}.\]`
            },
            {
              type: 'mcq',
              prompt: R`One cell at a time. \(\P\{C \cap A^c \cap B\} = \;?\)`,
              choices: [
                { text: R`\(a\,c\,f\)`, feedback: R`\(A^c\) has probability \(1 - a\), not \(a\).` },
                { text: R`\((1 - a)\,b\,f\)`, feedback: R`\(b = \P\{B \given A\}\). On \(A^c\) the relevant number is \(c = \P\{B \given A^c\}\).` },
                { text: R`\((1 - a)\,c\,f\)`, correct: true, feedback: R`\(\P\{C \given A^c \cap B\}\,\P\{B \given A^c\}\,\P\{A^c\} = f\cdot c\cdot(1 - a)\).` },
                { text: R`\((1 - a)(1 - c)\,f\)`, feedback: R`\(1 - c = \P\{B^c \given A^c\}\) belongs to the cell \(A^c \cap B^c\), which pairs with \(g\), not \(f\).` }
              ],
              why: R`Same chain rule as in (a), applied to each cell. A small table with the four cells and their three factors is the fastest way to avoid mixing up \(b, c\) and the complements.`,
              solution: R`Each term by the chain rule, e.g. \(\P\{C \cap A^c \cap B\} = \P\{C \given A^c \cap B\}\,\P\{B \given A^c\}\,\P\{A^c\} = (1-a)\,c\,f\).`
            },
            {
              type: 'reveal',
              prompt: R`Write out all four terms of \(\P\{C\}\) and the final answer, then reveal to compare.`,
              html: R`
                \[\begin{aligned}
                  \P\{C \cap A \cap B\} &= d\,b\,a, \\
                  \P\{C \cap A \cap B^c\} &= e\,(1 - b)\,a, \\
                  \P\{C \cap A^c \cap B\} &= f\,c\,(1 - a), \\
                  \P\{C \cap A^c \cap B^c\} &= g\,(1 - c)\,(1 - a).
                \end{aligned}\]
                <p>By the third axiom (the four cells are disjoint), \(\P\{C\}\) is their sum, and</p>
                \[\P\{\text{happy} \given C\} = \frac{abd}{abd + a(1 - b)e + (1 - a)cf + (1 - a)(1 - c)g}.\]`,
              why: R`Notice the final answer has the form “one cell over the sum of all cells”. That is the signature of Bayes-type reasoning: among all the ways \(C\) can happen, what fraction is the way we care about?`,
              solution: R`Altogether \(\P\{C\} = abd + a(1-b)e + (1-a)cf + (1-a)(1-c)g\), hence \[\P\{\text{happy} \given C\} = \frac{abd}{abd + a(1-b)e + (1-a)cf + (1-a)(1-c)g}.\]`
            },
            {
              type: 'mcq',
              quote: R`“\(\P\{C\} = \P\{C \given A \cap B\} + \P\{C \given A \cap B^c\} + \P\{C \given A^c \cap B\} + \P\{C \given A^c \cap B^c\} = d + e + f + g\).”`,
              prompt: R`What is wrong?`,
              choices: [
                { text: R`The partition is wrong.`, feedback: R`The partition is the right one.` },
                { text: R`The conditional probabilities must be weighted by the probabilities of the cells they condition on. Unweighted, the sum has no meaning and can exceed 1.`, correct: true, feedback: R`Correct. \(\P\{C\} = \sum_i \P\{C \given E_i\}\,\P\{E_i\}\). Forgetting the weights is the most common law-of-total-probability error in the grading comments.` },
                { text: R`It should be a product, not a sum.`, feedback: R`Across the cells of a partition you add (disjoint union). The product appears <em>inside</em> each term.` },
                { text: R`Nothing is wrong.`, feedback: R`Take \(d = e = f = g = 0.9\): the formula gives \(3.6\).` }
              ],
              watch: R`\(\P\{C\} = \sum_i \P\{C \cap E_i\} = \sum_i \P\{C \given E_i\}\P\{E_i\}\). Intersections add across a partition; conditionals do not.`
            },
            {
              type: 'mcq',
              prompt: R`Sanity check. Suppose \(d = e = f = g\), so that dodgeball success does not depend on \(A\) or \(B\) at all. What should \(\P\{\text{happy} \given C\}\) reduce to?`,
              choices: [
                { text: R`\(d\)`, feedback: R`If \(C\) carries no information about \(A, B\), conditioning on it should return the unconditional probability of \(A \cap B\).` },
                { text: R`\(abd\)`, feedback: R`That is the unconditional probability of being happy; conditioning on \(C\) should remove the factor \(d\).` },
                { text: R`\(ab\)`, correct: true, feedback: R`The denominator becomes \(d\,[ab + a(1-b) + (1-a)c + (1-a)(1-c)] = d\,[a + (1 - a)] = d\), so the ratio is \(abd/d = ab = \P\{A \cap B\}\). When \(C\) is independent of \((A, B)\), conditioning on it changes nothing.` },
                { text: R`\(1\)`, feedback: R`Being champion does not guarantee the other two goals.` }
              ],
              why: R`A formula with many letters is easy to get subtly wrong. Testing a special case where you <em>know</em> the answer (here: independence) is cheap insurance.`,
              solution: R`(Check: if \(d = e = f = g\) the answer reduces to \(ab = \P\{A \cap B\}\), as it must when \(C\) is independent of \(A, B\).)`
            }
          ]
        }
      ],
      takeaways: [
        R`When data arrives as a chain of conditionals, the chain rule \(\P\{A \cap B \cap C\} = \P\{C \given A \cap B\}\P\{B \given A\}\P\{A\}\) is the intended tool.`,
        R`Pick the partition that matches the conditionals you were given; then the law of total probability writes itself.`,
        R`Across a partition, add <em>intersections</em> (or weighted conditionals), never bare conditionals.`,
        R`Sanity-check multi-letter formulas with a special case whose answer you know.`
      ]
    },

    /* ============================================================ */
    {
      id: 'p5',
      title: 'Internship offers',
      lead: 'Two independent geometric clocks: the distribution of the minimum, and who gets an offer first.',
      tags: ['Geometric', 'Minimum via tails', 'Disjoint union', 'Geometric series', 'Symmetry'],
      statement: R`
        <p>Each day, you and your roommate each receive an internship offer with probability \(p \in (0,1)\), independently of each other and of other days. Let \(N\) be the day of your first offer, and let \(M\) be the day of your roommate’s first offer.</p>
        <ul class="parts">
          <li><b>(a)</b><span>Define \(R = \min\{N, M\}\), the first day that either of you receives an offer. What is the distribution of \(R\)? That is, compute \(\P\{R = k\}\) for all possible values of \(k\).</span></li>
          <li><b>(b)</b><span>What is the probability that you receive your first offer on a strictly earlier day than your roommate receives theirs? (Simplify fully.)</span></li>
        </ul>`,
      parts: [
        {
          label: 'Setup', title: 'Two independent geometric clocks',
          question: R`Pin down the distributions of \(N\) and \(M\) and the facts about them you will need.`,
          steps: [
            {
              type: 'mcq',
              prompt: R`\(N\) is the day of your first offer. Its distribution?`,
              choices: [
                { text: R`\(\Binom(n, p)\)`, feedback: R`Binomial counts offers in a fixed number of days; \(N\) is a <em>time</em>.` },
                { text: R`\(\Exp(p)\)`, feedback: R`Exponential is the continuous-time analogue. Days are discrete.` },
                { text: R`\(\Geom(p)\) on \(\{0, 1, 2, \dots\}\): the number of days with no offer.`, feedback: R`In this course \(\Geom(p)\) is the trial of the first success, taking values \(1, 2, 3, \dots\), and “the day of your first offer” is at least 1.` },
                { text: R`\(\Geom(p)\) on \(\{1, 2, 3, \dots\}\): \(\P\{N = k\} = q^{k-1}p\).`, correct: true, feedback: R`\(k - 1\) days without an offer, then an offer on day \(k\). Likewise for \(M\), and \(N \perp\!\!\!\perp M\) because the two of you are independent.` }
              ],
              solution: R`\(N\) and \(M\) are independent \(\Geom(p)\): \(\P\{N = k\} = q^{k-1}p\) for \(k \ge 1\).`
            },
            {
              type: 'note', title: 'The tail is simpler than the pmf',
              html: R`
                <p>For a geometric clock, “no offer during the first \(k\) days” is the event \(\{N > k\}\), and by independence of the days</p>
                \[\P\{N > k\} = q^k, \qquad k = 0, 1, 2, \dots\]
                <p>Compare with \(\P\{N = k\} = q^{k-1}p\). Tails of geometric variables are single powers; keep this at hand.</p>`,
              why: R`Minima and “who comes first” questions are about tails: \(\{\min > k\}\) and \(\{M > k\}\) are tail events. Recognizing this before computing saves a page of algebra.`,
              solution: R`Also \(\P\{N > k\} = q^k\) (no offer during the first \(k\) days), and likewise for \(M\).`
            }
          ]
        },
        {
          label: '(a)', title: 'Distribution of the first offer to anyone',
          question: R`Compute \(\P\{R = k\}\) for \(R = \min\{N, M\}\).`,
          steps: [
            {
              type: 'mcq',
              prompt: R`To find the distribution of a minimum, which object should you compute first?`,
              choices: [
                { text: R`\(\P\{R = k\}\) directly, splitting into the cases \(N = k < M\), \(M = k < N\), and \(N = M = k\).`, feedback: R`Valid, but three disjoint cases and more algebra for the same answer. Keep it as a check, not as the main route.` },
                { text: R`\(\E[R]\), using \(\E[\min\{N, M\}] = \min\{\E[N], \E[M]\}\).`, feedback: R`That identity is false in general, and the question asks for the distribution, not the mean.` },
                { text: R`The tail \(\P\{R > k\}\), because \(\{\min\{N, M\} > k\} = \{N > k\} \cap \{M > k\}\) factorizes by independence.`, correct: true, feedback: R`“The earlier of two clocks is still waiting” means “both clocks are still waiting”, an intersection of independent events.` },
                { text: R`The CDF of \(N + M\).`, feedback: R`The sum has nothing to do with the minimum.` }
              ],
              why: R`A minimum exceeds \(k\) exactly when <em>every</em> variable exceeds \(k\). For independent variables that is a product of tails. (Dually, a maximum is at most \(k\) when every variable is at most \(k\).)`,
              solution: R`For \(k \ge 0\), \(\{R > k\} = \{N > k\} \cap \{M > k\}\).`
            },
            {
              type: 'input',
              prompt: R`Compute \(\P\{R > k\}\). Write it as a power of \(q\), e.g. <code>q^3</code> or <code>q^{3k}</code>.`,
              placeholder: 'power of q',
              answers: ['q^{2k}', 'q^2k', 'q^(2k)', '(q^2)^k', '(q^k)^2', 'q^k*q^k', 'q^kq^k', '(1-p)^{2k}', '(1-p)^2k', '(1-p)^(2k)'],
              display: 'q^{2k}',
              feedback: R`\(\P\{R > k\} = \P\{N > k,\, M > k\} = \P\{N > k\}\,\P\{M > k\} = q^k\cdot q^k = q^{2k}\), for \(k = 0, 1, 2, \dots\)`,
              wrong: R`Use \(\{R > k\} = \{N > k\} \cap \{M > k\}\), independence, and \(\P\{N > k\} = q^k\).`,
              solution: R`By independence, \[\P\{R > k\} = \P\{N > k\}\,\P\{M > k\} = q^k \cdot q^k = q^{2k}.\]`
            },
            {
              type: 'mcq',
              prompt: R`From the tail to the pmf: \(\P\{R = k\} = \P\{R > k - 1\} - \P\{R > k\} = q^{2(k-1)} - q^{2k} = (q^2)^{k-1}(1 - q^2)\). Which distribution is this?`,
              choices: [
                { text: R`\(\Geom(2p)\)`, feedback: R`\(1 - q^2 = 2p - p^2\), not \(2p\). “You or your roommate gets an offer” double-counts the day you both do.` },
                { text: R`\(\Geom(1 - q^2)\)`, correct: true, feedback: R`\(\P\{R = k\} = (1 - r)^{k-1} r\) with \(r = 1 - q^2\): geometric with success probability “at least one offer today”.` },
                { text: R`\(\Geom(p^2)\)`, feedback: R`\(p^2\) is the chance that <em>both</em> of you get an offer on a given day; the minimum needs only one.` },
                { text: R`\(\Geom(q^2)\)`, feedback: R`The parameter of a geometric is a success probability. \(q^2\) is the chance that neither of you gets an offer.` }
              ],
              why: R`Read the algebra probabilistically: each day, “at least one offer arrives” happens with probability \(1 - q^2\), independently across days, and \(R\) is the first such day. The minimum of two geometric clocks is itself a geometric clock. That interpretation is also a complete alternative solution.`,
              solution: R`Hence for \(k = 1, 2, \dots\), \[\P\{R = k\} = \P\{R > k-1\} - \P\{R > k\} = (q^2)^{k-1}(1 - q^2),\] i.e. \(R \sim \Geom(1 - q^2)\): each day at least one offer arrives with probability \(1 - q^2\).`
            },
            {
              type: 'mcq',
              quote: R`“Each day, either of us gets an offer with probability \(p + p = 2p\), so \(R \sim \Geom(2p)\).”`,
              prompt: R`Diagnose the error.`,
              choices: [
                { text: R`It should be \(p^2\), the chance both get offers.`, feedback: R`The minimum needs at least one offer, not both.` },
                { text: R`Adding the two probabilities double-counts the day on which both of you get an offer. \(\P\{\text{at least one}\} = 1 - (1 - p)^2 = 2p - p^2\), which is also never above 1, unlike \(2p\).`, correct: true, feedback: R`Right. \(\P\{A \cup B\} = \P\{A\} + \P\{B\} - \P\{A \cap B\}\); the correction term is \(p^2\).` },
                { text: R`The geometric distribution does not apply to minima.`, feedback: R`It does here; the parameter is simply \(1 - q^2\).` },
                { text: R`Nothing is wrong.`, feedback: R`At \(p = 0.6\) the claimed parameter is \(1.2\).` }
              ],
              watch: R`\(\P\{A \cup B\} = \P\{A\} + \P\{B\}\) only for <em>disjoint</em> events. Independent events with positive probability are never disjoint.`
            }
          ]
        },
        {
          label: '(b)', title: 'Who gets an offer first?',
          question: R`Compute \(\P\{N < M\}\) and simplify fully.`,
          steps: [
            {
              type: 'mcq', multi: true,
              figure: { name: 'race', opts: { p: 0.5, n: 12, reps: 24 } },
              prompt: R`Which approaches to \(\P\{N < M\}\) are valid? Select all.`,
              choices: [
                { text: R`Condition on your day: \(\P\{N < M\} = \sum_{k \ge 1}\P\{N = k,\; M > k\}\).`, correct: true },
                { text: R`By symmetry between you and your roommate, \(\P\{N < M\} = \tfrac12\).`, feedback: R`Symmetry gives \(\P\{N < M\} = \P\{M < N\}\), but ties \(N = M\) have positive probability, so the two do not add up to 1.` },
                { text: R`Symmetry plus ties: \(\P\{N < M\} = \tfrac12\big(1 - \P\{N = M\}\big)\).`, correct: true },
                { text: R`Compare the means: \(\E[N] = \E[M]\), hence \(\P\{N < M\} = \tfrac12\).`, feedback: R`Equal means say nothing about which variable is smaller in a given realization.` }
              ],
              feedback: R`Both the direct sum and the symmetry-with-ties route work; both end with a geometric series in \(q^2\).`,
              why: R`“Strictly earlier” problems decompose along the value of one variable: the events \(\{N = k\}\) are disjoint and exhaust everything, so \(\P\{N < M\} = \sum_k \P\{N = k, M > k\}\). This is the third axiom at work, not independence. The simulation shows why ties matter.`,
              solution: R`The events \(\{N = k\}\), \(k \ge 1\), are disjoint with total probability one, so \[\P\{N < M\} = \sum_{k=1}^\infty \P\{N = k,\; M > k\}.\]`
            },
            {
              type: 'mcq',
              prompt: R`For a fixed \(k\), \(\P\{N = k,\; M > k\} = \;?\)`,
              choices: [
                { text: R`\(q^{k-1}p \cdot q^{k-1}p\)`, feedback: R`That is \(\P\{N = k, M = k\}\), a tie.` },
                { text: R`\(q^{k-1}p \cdot q^{k-1}\)`, feedback: R`\(M > k\) means no offer in the first \(k\) days, probability \(q^k\), not \(q^{k-1}\). Off-by-one errors here change the final answer.` },
                { text: R`\(q^{k-1}p \cdot q^{k} = pq\,(q^2)^{k-1}\)`, correct: true, feedback: R`Independence of \(N\) and \(M\) gives \(\P\{N = k\}\P\{M > k\} = q^{k-1}p\cdot q^k\).` },
                { text: R`\(q^{k-1} \cdot q^{k}\)`, feedback: R`\(N = k\) requires an actual offer on day \(k\); you dropped the factor \(p\).` }
              ],
              why: R`Within each term we use independence of \(N\) and \(M\) (a product). Across terms we use disjointness (a sum). Keep the two justifications separate; graders check both.`,
              solution: R`By independence, \(\P\{N = k, M > k\} = \P\{N = k\}\,\P\{M > k\} = q^{k-1}p\cdot q^k = pq\,(q^2)^{k-1}\).`
            },
            {
              type: 'input',
              prompt: R`Sum the series: \(\P\{N < M\} = pq\sum_{k \ge 1}(q^2)^{k-1} = \dfrac{pq}{1 - q^2}\). Simplify, then evaluate at \(p = \tfrac12\). Enter the numeric value at \(p = \tfrac12\).`,
              placeholder: 'e.g. 1/3', numeric: 1 / 3, tol: 1e-4, display: '1/3',
              feedback: R`\(\dfrac{pq}{1 - q^2} = \dfrac{pq}{(1 - q)(1 + q)} = \dfrac{q}{1 + q} = \dfrac{1 - p}{2 - p}\). At \(p = \tfrac12\) this is \(\tfrac13\). Pleasingly, the tie probability is \(\P\{N = M\} = \dfrac{p}{2 - p} = \tfrac13\) as well, so at \(p = \tfrac12\) “you first”, “roommate first” and “same day” are equally likely.`,
              wrong: R`\(1 - q^2 = (1 - q)(1 + q) = p(1 + q)\). Cancel \(p\), then substitute \(q = \tfrac12\).`,
              why: R`A geometric series with ratio \(q^2 \in (0,1)\) is guaranteed to converge; always note the ratio is below 1. The factor \(1 - q^2 = p(1+q)\) is the same quantity that appeared in (a), which is no coincidence: it is the per-day probability that the race ends.`,
              solution: R`Summing the geometric series (ratio \(q^2 < 1\)), \[\P\{N < M\} = pq\sum_{k=1}^\infty (q^2)^{k-1} = \frac{pq}{1 - q^2} = \frac{q}{1 + q} = \frac{1 - p}{2 - p}.\]`
            },
            {
              type: 'mcq',
              prompt: R`Check \(\dfrac{1 - p}{2 - p}\) at the extremes.`,
              choices: [
                { text: R`As \(p \to 1\) it tends to \(\tfrac12\).`, feedback: R`It tends to \(0\): with \(p = 1\) both of you get offers on day 1, a certain tie.` },
                { text: R`As \(p \to 0\) it tends to \(0\).`, feedback: R`It tends to \(\tfrac12\): offers are rare, so ties are rare and symmetry takes over.` },
                { text: R`As \(p \to 1\) it tends to \(0\) (certain tie on day 1); as \(p \to 0\) it tends to \(\tfrac12\) (ties become negligible).`, correct: true, feedback: R`Both limits match the story. The formula is always strictly below \(\tfrac12\), the gap being half the tie probability.` },
                { text: R`For small \(p\) it exceeds \(\tfrac12\).`, feedback: R`\(\dfrac{1 - p}{2 - p} < \tfrac12\) for every \(p \in (0, 1)\), because of ties.` }
              ],
              solution: R`(Check: \(0\) as \(p \to 1\), a certain tie on day 1; \(\tfrac12\) as \(p \to 0\).)`
            },
            {
              type: 'mcq',
              quote: R`“By symmetry between me and my roommate, \(\P\{N < M\} = \tfrac12\).”`,
              prompt: R`What is wrong?`,
              choices: [
                { text: R`\(N\) and \(M\) are not identically distributed.`, feedback: R`They are: both \(\Geom(p)\).` },
                { text: R`Symmetry would require independence, which fails here.`, feedback: R`\(N\) and \(M\) are independent; and symmetry does not require it anyway.` },
                { text: R`Symmetry correctly gives \(\P\{N < M\} = \P\{M < N\}\), but with discrete days a tie \(N = M\) has positive probability \(\dfrac{p}{2 - p}\), so each strict inequality has probability \(\tfrac12\big(1 - \tfrac{p}{2 - p}\big) < \tfrac12\).`, correct: true, feedback: R`Right. For <em>continuous</em> clocks (two independent exponentials, say) ties have probability 0 and the symmetry answer \(\tfrac12\) would be correct. Discreteness is what breaks it.` },
                { text: R`Nothing is wrong.`, feedback: R`At \(p = \tfrac12\) the true answer is \(\tfrac13\).` }
              ],
              watch: R`Symmetry is a powerful shortcut, but always ask what happens on the “neither” event. For discrete variables, ties are not negligible.`
            }
          ]
        }
      ],
      takeaways: [
        R`Minima go through tails: \(\P\{\min > k\} = \prod_i \P\{X_i > k\}\) for independent \(X_i\). Maxima go through CDFs.`,
        R`Geometric tails are single powers, \(\P\{N > k\} = q^k\). Convert tail to pmf by differencing.`,
        R`Read algebra probabilistically: \(\Geom(1 - q^2)\) is the clock for “at least one offer today”. The interpretation is also a proof.`,
        R`“Who is first” = disjoint union over the value of one variable (third axiom) and a product inside each term (independence). Cite both.`,
        R`Symmetry gives \(\P\{N < M\} = \P\{M < N\}\), but discrete ties have positive probability. Account for them.`
      ]
    }
  ]
});
